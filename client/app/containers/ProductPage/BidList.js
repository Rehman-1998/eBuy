/**
 *
 * ReviewList
 *
 */

import React, { useEffect } from "react";

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

const BidList = (props) => {
  const dispatch = useDispatch();
  const bidArray = useSelector((state) => state.bid.bids);
  console.log("bod data", bidArray);

  useEffect(() => {
    dispatch(getBidforSeller());
  }, []);

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

  const getProduct = (review) => {
    if (review.product) {
      const product = review.product;
      return (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <img
            className="item-image"
            src={`${
              product.imageUrl
                ? product.imageUrl
                : "/images/placeholder-image.png"
            }`}
          />
        </div>
      );
    }
  };

  return (
    <div className="review-dashboard">
      <div className="r-list">
        {bidArray?.map((item, index) => (
          <div key={index} className="review-box">
            <div className="mb-3 p-4">
              <div className="d-flex flex-row mx-0 mb-2 mb-lg-3 align-items-center justify-content-between">
                <div className="review-content">
                  <div className="d-flex flex-row mx-0 mb-2 align-items-center justify-content-between">
                    <p className="mb-0 fw-2 fs-16 text-truncate">
                      Product Name : {item.product.name}
                    </p>
                    <div className="d-block d-lg-none">{getAvatar(item)}</div>
                  </div>
                  <p className="mb-0 fw-1 fs-14 word-break-all">
                    User Price : {item.bidPrice}
                  </p>
                  <p className="mb-0 fw-1 fs-14 word-break-all">
                    User Quantity : {item.bidQuantity}
                  </p>
                </div>
                <div className="d-none d-lg-block">{getAvatar(item)}</div>
              </div>
              <div className="d-flex flex-column flex-lg-row mx-0 mb-3 align-items-start justify-content-between">
                <div className="w-100 mb-3 mb-lg-0 review-product-box">
                  {/* User Quantity : {item.bidQuantity} */}
                </div>
                {getProduct(item)}
              </div>
              <label className="text-black">{`${item.user.firstName} ${
                item.user.lastName
              } Bid Requested on ${formatDate(item.product.created)}`}</label>
              <hr />
              {item.status === "Approved" ? (
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mx-0">
                  <div className="d-flex flex-row mx-0">
                    <CheckIcon className="text-green" />
                    <p className="ml-2 mb-0">Approved</p>
                  </div>
                  <Button
                    className="mt-3 mt-lg-0"
                    text="Delete"
                    icon={<TrashIcon width={15} />}
                    onClick={() => dispatch(deleteBidRequest(item._id))}
                  />
                </div>
              ) : item.status === "Rejected" ? (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <RefreshIcon className="text-primary" />
                    <p className="fw-2 ml-3 mb-0">Re Approve Review</p>
                  </div>
                  <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mx-0">
                    <Button
                      className="text-uppercase"
                      variant="primary"
                      size="md"
                      text="Approve"
                      onClick={() =>
                        dispatch(updateBidRequest(item._id, "Approved"))
                      }
                    />
                    <Button
                      className="mt-3 mt-lg-0"
                      text="Delete"
                      icon={<TrashIcon width={15} />}
                      onClick={() => dispatch(deleteBidRequest(item._id))}
                    />
                  </div>
                </>
              ) : (
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mx-0">
                  <div className="d-flex flex-column flex-lg-row mx-0">
                    <Button
                      variant="dark"
                      className="text-uppercase"
                      size="md"
                      text="Approve"
                      onClick={() =>
                        dispatch(updateBidRequest(item, "Approved"))
                      }
                    />
                    <Button
                      variant="danger"
                      className="mt-3 mt-lg-0 ml-lg-2 text-uppercase"
                      size="md"
                      text="Reject"
                      onClick={() =>
                        dispatch(updateBidRequest(item._id, "Rejected"))
                      }
                    />
                  </div>
                  <Button
                    className="mt-3 mt-lg-0"
                    text="Delete"
                    icon={<TrashIcon width={15} />}
                    onClick={() => dispatch(deleteBidRequest(item._id))}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidList;
