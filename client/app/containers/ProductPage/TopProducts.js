/**
 *
 * ReviewList
 *
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ReactStars from "react-rating-stars-component";

import { formatDate } from "../../utils/date";
import { getRandomColors } from "../../utils";
import Button from "../../components/Common/Button";
import {
  CheckIcon,
  RefreshIcon,
  TrashIcon,
} from "../../components/Common/Icon";
import { getBidforSeller, deleteBidRequest, updateBidRequest } from "./actions";
import SubPage from "../../components/Manager/SubPage";

const TopProducts = (props) => {
  const [topData, setTopData] = useState([]);

  const getData = async () => {
    console.log("IN function");
    const response = await axios.get(`/api/product/top`);
    console.log("RESPONSE====>", response);
    if (response?.data?.success === true) {
      setTopData(response?.data?.data);
    }
  };
  useEffect(() => {
    // dispatch(getBidforSeller());
    console.log("IN Useeggect");
    getData();
  }, []);
  //   const dispatch = useDispatch();
  //   const bidArray = useSelector((state) => state.bid.bids);
  //   console.log("bod data", bidArray);

  const { reviews, approveReview, rejectReview, deleteReview } = props;

  const getAvatar = (review) => {
    const color = getRandomColors();
    if (review.actualPrice) {
      return (
        <div
          className="d-flex flex-column justify-content-center align-items-center fw-1 text-white avatar"
          style={{ backgroundColor: color ? color : "red" }}
        >
          {review.actualPrice}
        </div>
      );
    }
  };

  const getProduct = (item) => {
    console.log("Review", item);
    if (item) {
      return (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <img
            style={{ width: "300px", height: "300px", objectFit: "cover" }}
            className="item-image"
            src={`${
              item.imageUrl ? item.imageUrl : "/images/placeholder-image.png"
            }`}
          />
        </div>
      );
    }
  };

  return (
    <>
      <div className="sub-page">
        <div className="subpage-header">
          <h2>Top Selling Products</h2>
        </div>
        <div className="subpage-body">
          <div className="product-dashboard ">
            <div className="p-list">
              {topData?.map((product, index) => (
                <Link
                  to={`/product/${product.slug}`}
                  key={index}
                  className="d-flex flex-row align-items-center mx-0 mb-3 product-box"
                >
                  <img
                    className="item-image"
                    src={`${
                      product && product.imageUrl
                        ? product.imageUrl
                        : "/images/placeholder-image.png"
                    }`}
                  />
                  <div className="d-flex flex-column justify-content-center px-3 text-truncate">
                    <h4 className="text-truncate">{product.name}</h4>
                    <p className="mb-0 text-truncate">{product.description}</p>
                    <p className="mb-0 text-truncate">
                      Number of Sales {product.sales}
                    </p>
                    <p className="mb-0 text-truncate">{product.price}$</p>
                    <p className="mb-0 text-truncate">
                      By {product.merchant.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopProducts;
