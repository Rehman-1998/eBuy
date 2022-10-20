/**
 *
 * ProductList
 *
 */

import React from "react";

import { Link, useHistory } from "react-router-dom";

import AddToWishList from "../AddToWishList";

const ProductList = (props) => {
  const { products, updateWishlist, authenticated } = props;

  const history = useHistory();

  return (
    <div className="product-list">
      {products.map((product, index) => (
        <div key={index} className="mb-3 mb-md-0">
          <div className="product-container">
            <div className="item-box">
              <div className="add-wishlist-box">
                <AddToWishList
                  id={product._id}
                  liked={product?.isLiked ?? false}
                  enabled={authenticated}
                  updateWishlist={updateWishlist}
                  authenticated={authenticated}
                />
              </div>

              <div className="item-link">
                <div className="item-image-container">
                  <div className="item-image-box">
                    <Link
                      to={`/product/${product.slug}`}
                      className="d-flex flex-column h-100"
                    >
                      <img
                        className="item-image"
                        src={`${
                          product.imageUrl
                            ? product.imageUrl
                            : "/images/placeholder-image.png"
                        }`}
                      />
                    </Link>
                  </div>
                </div>
                <div className="item-body">
                  <div className="item-details p-3">
                    <h1 className="item-name">{product.name}</h1>
                    {/* {product.brand && Object.keys(product.brand).length > 0 && (
                        <p className="by">
                          By <span>{product.brand.name}</span>
                        </p>
                      )} */}
                    <h3 className="mb-0">Description :</h3>
                    <p className="item-desc mb-0">{product.description}</p>
                    {/* {product.meetingTime ? (
                        <p className="by">
                          <span>Daily Meeting at {product.meetingTime}</span>
                        </p>
                      ) : null} */}
                    {product.meetingId !== "" ? (
                      <button
                        className=" red button my-2"
                        onClick={() =>
                          history.push("/videocall", {
                            meetingId: product.meetingId,
                            isMeetingStarted: true,
                          })
                        }
                      >
                        {/* <span
                          onClick={() =>
                            history.push("/videocall", {
                              meetingId: product.meetingId,
                              isMeetingStarted: true,
                            })
                          }
                        > */}
                        Join Now
                        {/* </span> */}
                      </button>
                    ) : (
                      <span
                        style={{
                          color: "#ed3737",
                          textDecoration: "underline",
                          fontSize: "11px",
                          marginTop: "3px",
                        }}
                      >
                        Daily Meeting at {product.meetingTime}
                      </span>
                    )}
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between align-items-center px-4 mb-2 item-footer">
                  <p className="price mb-0">${product.price}</p>
                  {product.totalReviews > 0 && (
                    <p className="mb-0">
                      <span className="fs-16 fw-1 mr-1">
                        {parseFloat(product?.averageRating).toFixed(1)}
                      </span>
                      <span
                        className={`fa fa-star ${
                          product.totalReviews !== 0 ? "checked" : ""
                        }`}
                        style={{ color: "#ffb302" }}
                      ></span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
