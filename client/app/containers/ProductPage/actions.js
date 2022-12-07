/*
 *
 * Video Call actions
 *
 */

import {
  BID_ERROR,
  BID_REQUEST,
  BID_SUCCESS,
  BID_FOR_SELLER_REQUEST,
  BID_FOR_SELLER_SUCCESS,
  BID_DELETE_REQUEST,
  BID_UPDATE_REQUEST,
  BID_DELETE_SUCCESS,
} from "./constant";
import { success } from "react-notification-system-redux";
import handleError from "../../utils/error";
import axios from "axios";

export const addBid = (bidData) => async (dispatch, getState) => {
  console.log("Bid Data in action", bidData);
  dispatch({
    type: BID_REQUEST,
  });

  const successfulOptions = {
    title: `Your request has been sent !`,
    position: "tr",
    autoDismiss: 1,
  };

  const response = await axios.post(`/api/bid/add`, bidData);
  if (response?.data?.success === true) {
    dispatch({
      type: BID_SUCCESS,
      payload: response.data.data,
    });
    dispatch(success(successfulOptions));
  }
  if (response?.data?.error === true) {
    dispatch({ type: BID_ERROR, payload: response.data.data });
    handleError("Your request not sent !", dispatch);
  }
};

export const getBidforSeller = () => async (dispatch, getState) => {
  let store = getState();
  const userId = store?.account?.user?.merchant;
  dispatch({
    type: BID_FOR_SELLER_REQUEST,
  });

  const successfulOptions = {
    title: `Your request has been sent !`,
    position: "tr",
    autoDismiss: 1,
  };

  const response = await axios.get(`/api/bid/${userId}`);
  if (response?.data?.success === true) {
    dispatch({
      type: BID_FOR_SELLER_SUCCESS,
      payload: response.data.data,
    });
  }
  if (response?.data?.error === true) {
    dispatch({ type: BID_ERROR, payload: response.data.data });
  }
};

export const deleteBidRequest = (id) => async (dispatch, getState) => {
  console.log("IN DElETE Action");
  dispatch({
    type: BID_DELETE_REQUEST,
  });

  const response = await axios.delete(`/api/bid/delete/${id}`);
  if (response?.data?.success === true) {
    const successfulOptions = {
      title: `${response?.data?.message}`,
      position: "tr",
      autoDismiss: 1,
    };
    dispatch(getBidforSeller());
    dispatch(success(successfulOptions));
  }
  if (response?.data?.error === true) {
    dispatch({ type: BID_ERROR, payload: response.data.data });
    handleError("Your request not sent !", dispatch);
  }
};

export const updateBidRequest =
  (item, status) => async (dispatch, getState) => {
    console.log("IN update Action", item, status);
    dispatch({
      type: BID_UPDATE_REQUEST,
    });

    const response = await axios.put(`/api/bid/update`, { item, status });
    if (response?.data?.success === true) {
      const successfulOptions = {
        title: `${response?.data?.message}`,
        position: "tr",
        autoDismiss: 1,
      };
      dispatch(getBidforSeller());
      dispatch(success(successfulOptions));
    }
    if (response?.data?.error === true) {
      dispatch({ type: BID_ERROR, payload: response.data.data });
      handleError("Your request not sent !", dispatch);
    }
  };
