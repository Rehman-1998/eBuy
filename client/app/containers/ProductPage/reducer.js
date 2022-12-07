/*
 *
 * Product reducer
 *
 */

import {
  BID_ERROR,
  BID_REQUEST,
  BID_SUCCESS,
  BID_FOR_SELLER_REQUEST,
  BID_FOR_SELLER_SUCCESS,
  BID_DELETE_REQUEST,
  BID_DELETE_SUCCESS,
  BID_UPDATE_REQUEST,
  BID_UPDATE_SUCCESS,
} from "./constant";

const initialState = {
  bid: {},
  bids: [],
  isLoading: false,
  error: false,
};

const bidReducer = (state = initialState, action) => {
  switch (action.type) {
    case BID_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case BID_FOR_SELLER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case BID_DELETE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case BID_UPDATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case BID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        bid: action.payload,
        error: false,
      };
    case BID_FOR_SELLER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        bids: action.payload,
        error: false,
      };
    case BID_DELETE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        bids: action.payload,
        error: false,
      };
    case BID_UPDATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        bids: action.payload,
        error: false,
      };
    case BID_ERROR:
      return {
        ...state,
        isLoading: false,
        error: false,
      };
    default:
      return state;
  }
};

export default bidReducer;
