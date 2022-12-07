const express = require("express");
const router = express.Router();

// Bring in Models & Utils
const Search = require("../../models/search");

router.post("/add", async (req, res) => {
  console.log("IN API====", req.body.keywords);
  try {
    const { keywords } = req.body;
    const findKeyword = await Search.findOne({ keywords });
    if (findKeyword) {
      console.log("hi in find", findKeyword);
      const updateKeyword = await Search.findByIdAndUpdate(
        { _id: findKeyword._id },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
      res.status(200).json({
        success: true,
        data: updateKeyword,
      });
    } else {
      const searchVolume = await Search.create({ keywords });
      if (searchVolume) {
        res.status(200).json({
          success: true,
          data: searchVolume,
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const searchVolume = await Search.find({});
    if (searchVolume) {
      res.status(200).json({
        success: true,
        data: searchVolume,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

module.exports = router;
