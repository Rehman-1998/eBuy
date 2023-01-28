const express = require("express");
const router = express.Router();
const multer = require("multer");
const Mongoose = require("mongoose");

// Bring in Models & Utils
const Cart = require("../../models/cart");
const Bid = require("../../models/bid");
const Order = require("../../models/order");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");
const checkAuth = require("../../utils/auth");
const { s3Upload } = require("../../utils/storage");
const {
  getStoreProductsQuery,
  getStoreProductsWishListQuery,
} = require("../../utils/queries");
const { orderConfirmationEmail } = require("../../config/template");

const storage = multer.memoryStorage();
const upload = multer({ storage });
const sgMail = require("@sendgrid/mail");

// Set Bid
router.post("/add", async (req, res) => {
  try {
    const {
      merchant,
      product,
      user,
      actualPrice,
      bidQuantity,
      bidPrice,
      status,
    } = req.body;
    const addBid = await Bid.create({
      merchant,
      product,
      user,
      actualPrice,
      bidQuantity,
      bidPrice,
      status,
    });
    if (addBid) {
      res.status(200).json({
        message: "Your Request is in pending !",
        data: addBid,
        success: true,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const getBidsforSeller = await Bid.find({
      merchant: req.params.id,
    }).populate("product merchant user");
    if (getBidsforSeller) {
      res.status(200).json({
        message: "Your Request is in pending !",
        data: getBidsforSeller,
        success: true,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.delete(
  "/delete/:id",
  auth,
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  async (req, res) => {
    try {
      const bidData = await Bid.findById(req.params.id);
      await bidData.remove();
      res.status(200).json({
        success: true,
        message: `Bid Request has been deleted successfully!`,
      });
    } catch (error) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
);

router.put(
  "/update",
  auth,
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  async (req, res) => {
    try {
      console.log("IN API =====>", req.body);
      const { item, status } = req.body;
      console.log("req body---", item, status, req.body);
      if (status === "Approved") {
        const products = [
          {
            product: item.product._id,
            quantity: item.bidQuantity,
            purchasePrice: item.bidPrice,
            totalPrice: item.product.price,
          },
        ];
        const newCart = await Cart.create({
          products,
          user: item.user._id,
        });
        console.log("New Cart =====>", newCart);
        if (newCart) {
          const newOrder = await Order.create({
            cart: newCart._id,
            user: item.user._id,
            total: item.bidPrice,
          });
          console.log("New Order =====>", newOrder);
          if (newOrder) {
            sgMail
              .send(
                orderConfirmationEmail({
                  email: "abdulrehmanazmat007@gmail.com",
                  name: "abdul rehman",
                  _id: newOrder._id,
                  products: products,
                })
              )
              .then(
                (success) => {
                  console.log("success====>", success);
                },
                (error) => {
                  console.error("Error======>", error);

                  if (error.response) {
                    console.error(error.response.body);
                  }
                }
              );

            const updateData = await Bid.findOneAndUpdate(
              { _id: req.body.item._id },
              { $set: { status: status } },
              {
                new: true,
              }
            );

            if (updateData) {
              res.status(200).json({
                success: true,
                message: "Bid Request has been updated successfully!",
                data: updateData,
              });
            }
          }
        }
      } else {
        console.log("IN ELSE Condition", item);
        const updateData = await Bid.findOneAndUpdate(
          { _id: item._id },
          { $set: { status: status } },
          {
            new: true,
          }
        );

        console.log("update Data", updateData);

        if (updateData) {
          res.status(200).json({
            success: true,
            message: "Bid Request has been updated successfully!",
            data: updateData,
          });
        }
      }
    } catch (error) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
);

// fetch product slug api
// router.get("/item/:slug", async (req, res) => {
//   try {
//     const slug = req.params.slug;

//     const productDoc = await Product.findOne({ slug, isActive: true }).populate(
//       {
//         path: "brand",
//         select: "name isActive slug",
//       }
//     );

//     const hasNoBrand =
//       productDoc?.brand === null || productDoc?.brand?.isActive === false;

//     if (!productDoc || hasNoBrand) {
//       return res.status(404).json({
//         message: "No product found.",
//       });
//     }

//     res.status(200).json({
//       product: productDoc,
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: "Your request could not be processed. Please try again.",
//     });
//   }
// });

// fetch product name search api
// router.get("/list/search/:name", async (req, res) => {
//   try {
//     const name = req.params.name;

//     const productDoc = await Product.find(
//       { name: { $regex: new RegExp(name), $options: "is" }, isActive: true },
//       { name: 1, slug: 1, imageUrl: 1, price: 1, _id: 0 }
//     );

//     if (productDoc.length < 0) {
//       return res.status(404).json({
//         message: "No product found.",
//       });
//     }

//     res.status(200).json({
//       products: productDoc,
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: "Your request could not be processed. Please try again.",
//     });
//   }
// });

// fetch store products by advanced filters api
// router.get("/list", async (req, res) => {
//   try {
//     let {
//       sortOrder,
//       rating,
//       max,
//       min,
//       category,
//       page = 1,
//       limit = 10,
//     } = req.query;
//     sortOrder = JSON.parse(sortOrder);

//     const categoryFilter = category ? { category } : {};
//     const basicQuery = getStoreProductsQuery(min, max, rating);

//     const userDoc = await checkAuth(req);
//     const categoryDoc = await Category.findOne(
//       { slug: categoryFilter.category, isActive: true },
//       "products -_id"
//     );

//     if (categoryDoc && categoryFilter !== category) {
//       basicQuery.push({
//         $match: {
//           isActive: true,
//           _id: {
//             $in: Array.from(categoryDoc.products),
//           },
//         },
//       });
//     }

//     let products = null;
//     const productsCount = await Product.aggregate(basicQuery);
//     const count = productsCount.length;
//     const size = count > limit ? page - 1 : 0;
//     const currentPage = count > limit ? Number(page) : 1;

//     // paginate query
//     const paginateQuery = [
//       { $sort: sortOrder },
//       { $skip: size * limit },
//       { $limit: limit * 1 },
//     ];

//     if (userDoc) {
//       const wishListQuery = getStoreProductsWishListQuery(userDoc.id).concat(
//         basicQuery
//       );

//       products = await Product.aggregate(wishListQuery.concat(paginateQuery));
//     } else {
//       products = await Product.aggregate(basicQuery.concat(paginateQuery));
//     }
//     res.status(200).json({
//       products,
//       totalPages: Math.ceil(count / limit),
//       currentPage,
//       count,
//     });
//   } catch (error) {
//     console.log("error", error);
//     res.status(400).json({
//       error: "Your request could not be processed. Please try again.",
//     });
//   }
// });

// fetch store products by brand api
// router.get("/list/brand/:slug", async (req, res) => {
//   try {
//     const slug = req.params.slug;

//     const brand = await Brand.findOne({ slug, isActive: true });

//     if (!brand) {
//       return res.status(404).json({
//         message: `Cannot find brand with the slug: ${slug}.`,
//       });
//     }

//     const userDoc = await checkAuth(req);

//     if (userDoc) {
//       const products = await Product.aggregate([
//         {
//           $match: {
//             isActive: true,
//             // brand: brand._id,
//           },
//         },
//         {
//           $lookup: {
//             from: "wishlists",
//             let: { product: "$_id" },
//             pipeline: [
//               {
//                 $match: {
//                   $and: [
//                     { $expr: { $eq: ["$$product", "$product"] } },
//                     { user: new Mongoose.Types.ObjectId(userDoc.id) },
//                   ],
//                 },
//               },
//             ],
//             as: "isLiked",
//           },
//         },
//         // {
//         //   $lookup: {
//         //     from: "brands",
//         //     localField: "brand",
//         //     foreignField: "_id",
//         //     as: "brands",
//         //   },
//         // },
//         {
//           $addFields: {
//             isLiked: { $arrayElemAt: ["$isLiked.isLiked", 0] },
//           },
//         },
//         {
//           $unwind: "$brands",
//         },
//         {
//           $addFields: {
//             "brand.name": "$brands.name",
//             "brand._id": "$brands._id",
//             "brand.isActive": "$brands.isActive",
//           },
//         },
//         { $project: { brands: 0 } },
//       ]);

//       res.status(200).json({
//         products: products.reverse().slice(0, 8),
//         page: 1,
//         pages: products.length > 0 ? Math.ceil(products.length / 8) : 0,
//         totalProducts: products.length,
//       });
//     } else {
//       const products = await Product.find({
//         brand: brand._id,
//         isActive: true,
//       }).populate("brand", "name");

//       res.status(200).json({
//         products: products.reverse().slice(0, 8),
//         page: 1,
//         pages: products.length > 0 ? Math.ceil(products.length / 8) : 0,
//         totalProducts: products.length,
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       error: "Your request could not be processed. Please try again.",
//     });
//   }
// });

// router.get("/list/select", auth, async (req, res) => {
//   try {
//     const products = await Product.find({}, "name");

//     res.status(200).json({
//       products,
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: "Your request could not be processed. Please try again.",
//     });
//   }
// });

// add product api
// router.post(
//   "/add",
//   auth,
//   role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
//   upload.single("image"),
//   async (req, res) => {
//     try {
//       const sku = req.body.sku;
//       const name = req.body.name;
//       const description = req.body.description;
//       const quantity = req.body.quantity;
//       const price = req.body.price;
//       const taxable = req.body.taxable;
//       const isActive = req.body.isActive;
//       const merchant = req.body.merchant;
//       const meetingId = "";
//       const meetingTime = req.body.meetingTime;
//       // const brand = req.body.brand;
//       const image = req.file;

//       if (!sku) {
//         return res.status(400).json({ error: "You must enter sku." });
//       }

//       if (!description || !name) {
//         return res
//           .status(400)
//           .json({ error: "You must enter description & name." });
//       }

//       if (!quantity) {
//         return res.status(400).json({ error: "You must enter a quantity." });
//       }

//       if (!price) {
//         return res.status(400).json({ error: "You must enter a price." });
//       }

//       const foundProduct = await Product.findOne({ sku });

//       if (foundProduct) {
//         return res.status(400).json({ error: "This sku is already in use." });
//       }

//       const { imageUrl, imageKey } = await s3Upload(image);

//       const product = new Product({
//         sku,
//         name,
//         description,
//         quantity,
//         price,
//         taxable,
//         isActive,
//         // brand,
//         imageUrl,
//         imageKey,
//         merchant,
//         meetingId,
//         meetingTime,
//       });

//       const savedProduct = await product.save();

//       res.status(200).json({
//         success: true,
//         message: `Product has been added successfully!`,
//         product: savedProduct,
//       });
//     } catch (error) {
//       return res.status(400).json({
//         error: "Your request could not be processed. Please try again.",
//       });
//     }
//   }
// );

// fetch products api
// router.get(
//   "/",
//   auth,
//   role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
//   async (req, res) => {
//     console.log("REQ IN MErchant =====>", req.user);
//     try {
//       let products = [];

//       if (req.user.merchant) {
//         // const brands = await Brand.find({
//         //   merchant: req.user.merchant,
//         // }).populate("merchant", "_id");

//         // const brandId = brands[0]?.["_id"];

//         products = await Product.find({ merchant: req.user.merchant });
//         // .populate({
//         //   path: "brand",
//         //   populate: {
//         //     path: "merchant",
//         //     model: "Merchant",
//         //   },
//         // })
//         // .where("brand", brandId);
//       } else {
//         products = await Product.find({});
//       }

//       res.status(200).json({
//         products,
//       });
//     } catch (error) {
//       res.status(400).json({
//         error: "Your request could not be processed. Please try again.",
//       });
//     }
//   }
// );

// fetch product api
// router.get(
//   "/:id",
//   auth,
//   role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
//   async (req, res) => {
//     try {
//       const productId = req.params.id;

//       let productDoc = null;

//       if (req.user.merchant) {
//         const brands = await Brand.find({
//           merchant: req.user.merchant,
//         }).populate("merchant", "_id");

//         const brandId = brands[0]["_id"];

//         productDoc = await Product.findOne({ _id: productId })
//           .populate({
//             path: "brand",
//             select: "name",
//           })
//           .where("brand", brandId);
//       } else {
//         productDoc = await Product.findOne({ _id: productId }).populate({
//           path: "brand",
//           select: "name",
//         });
//       }

//       if (!productDoc) {
//         return res.status(404).json({
//           message: "No product found.",
//         });
//       }

//       res.status(200).json({
//         product: productDoc,
//       });
//     } catch (error) {
//       res.status(400).json({
//         error: "Your request could not be processed. Please try again.",
//       });
//     }
//   }
// );

// router.put(
//   "/:id/active",
//   auth,
//   role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
//   async (req, res) => {
//     try {
//       const productId = req.params.id;
//       const update = req.body.product;
//       const query = { _id: productId };

//       await Product.findOneAndUpdate(query, update, {
//         new: true,
//       });

//       res.status(200).json({
//         success: true,
//         message: "Product has been updated successfully!",
//       });
//     } catch (error) {
//       res.status(400).json({
//         error: "Your request could not be processed. Please try again.",
//       });
//     }
//   }
// );

module.exports = router;
