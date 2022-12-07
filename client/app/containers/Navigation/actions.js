/*
 *
 * Navigation actions
 *
 */

import axios from "axios";
import handleError from "../../utils/error";
import {
  TOGGLE_MENU,
  TOGGLE_CART,
  TOGGLE_BRAND,
  SEARCH_CHANGE,
  SUGGESTIONS_FETCH_REQUEST,
  SUGGESTIONS_CLEAR_REQUEST,
  ADD_SEARCH_KEYWORD_SUCCESS,
} from "./constants";

export const toggleMenu = () => {
  return {
    type: TOGGLE_MENU,
  };
};

export const toggleCart = () => {
  return {
    type: TOGGLE_CART,
  };
};

export const toggleBrand = () => {
  return {
    type: TOGGLE_BRAND,
  };
};

export const onSearch = (v) => {
  return {
    type: SEARCH_CHANGE,
    payload: v,
  };
};

export const onSuggestionsFetchRequested = (value) => {
  const inputValue = value.value.trim().toLowerCase();

  return async (dispatch, getState) => {
    try {
      if (inputValue && inputValue.length % 3 === 0) {
        const response = await axios.get(
          `/api/product/list/search/${inputValue}`
        );
        dispatch({
          type: SUGGESTIONS_FETCH_REQUEST,
          payload: response.data.products,
        });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const onSuggestionsClearRequested = () => {
  return {
    type: SUGGESTIONS_CLEAR_REQUEST,
    payload: [],
  };
};

export const onKeywordsAdd = (keywords) => {
  console.log("value in action ====>", keywords);

  return async (dispatch, getState) => {
    try {
      const response = await axios.post(`/api/search/add`, { keywords });
      if (response.data.success) {
        dispatch({
          type: ADD_SEARCH_KEYWORD_SUCCESS,
          payload: response.data,
        });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};
