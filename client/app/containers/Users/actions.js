/*
 *
 * Users actions
 *
 */

import axios from "axios";

import {
  FETCH_USERS,
  FETCH_SEARCHED_USERS,
  SET_ADVANCED_FILTERS,
  SET_USERS_LOADING,
  ADD_USER_REQUEST,
  ADD_USER_SUCCESS,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  USER_ERROR,
} from "./constants";

import handleError from "../../utils/error";
import { success } from "react-notification-system-redux";
import { goBack } from "connected-react-router";

export const setUserLoading = (value) => {
  return {
    type: SET_USERS_LOADING,
    payload: value,
  };
};

export const fetchUsers = (page) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setUserLoading(true));
      const response = await axios.get(`/api/user`, {
        params: {
          page: page ?? 1,
          limit: 20,
        },
      });

      const { users, totalPages, currentPage, count } = response.data;

      dispatch({
        type: FETCH_USERS,
        payload: users,
      });
      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: { totalPages, currentPage, count },
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setUserLoading(false));
    }
  };
};

export const searchUsers = (filter) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setUserLoading(true));

      const response = await axios.get(`/api/user/search`, {
        params: {
          search: filter.value,
        },
      });

      dispatch({ type: FETCH_SEARCHED_USERS, payload: response.data.users });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setUserLoading(false));
    }
  };
};

export const addUser = (userData) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: ADD_USER_REQUEST, payload: true });

      const response = await axios.post("/api/auth/register", userData);

      const successfulOptions = {
        title: `User has been addedd successfully! Thank you!`,
        position: "tr",
        autoDismiss: 1,
      };

      if (response?.data?.success === true) {
        dispatch({ type: ADD_USER_SUCCESS, payload: response.data.user });
        dispatch(success(successfulOptions));
      } else {
        const title = `Please try to  again!`;
        handleError(error, dispatch, title);
        dispatch({ type: USER_ERROR, payload: response.data.error });
      }
    } catch (error) {
      console.log("Err===>", error);
      // const title = `Please try to  again!`;
      // handleError(error, dispatch, title);
    } finally {
      // dispatch({ type: USER_ERROR, payload: false });
    }
  };
};

export const updateUser = (userData) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: UPDATE_USER_REQUEST, payload: true });

      const response = await axios.put("/api/user/update", userData);
      console.log("Update Response user=====>", response);

      const successfulOptions = {
        title: `User has been updated successfully! Thank you!`,
        position: "tr",
        autoDismiss: 1,
      };

      if (response?.data?.success === true) {
        dispatch({ type: UPDATE_USER_SUCCESS, payload: response.data.user });
        dispatch(success(successfulOptions));
        dispatch(goBack());
      } else {
        const title = `Please try to  again!`;
        handleError(error, dispatch, title);
        dispatch({ type: USER_ERROR, payload: response.data.error });
      }
    } catch (error) {
      console.log("Err===>", error);
    }
  };
};

export const deleteUser = (userData) => {
  console.log("delete user action===", userData);
  return async (dispatch, getState) => {
    try {
      dispatch({ type: DELETE_USER_REQUEST, payload: true });

      const response = await axios.delete(`/api/user/delete${userData._id}`);

      const successfulOptions = {
        title: `User has been deleted successfully! Thank you!`,
        position: "tr",
        autoDismiss: 1,
      };

      if (response?.data?.success === true) {
        dispatch({ type: DELETE_USER_SUCCESS, payload: response.data.user });
        dispatch(success(successfulOptions));
        dispatch(goBack());
      } else {
        const title = `Please try to  again!`;
        handleError(error, dispatch, title);
        dispatch({ type: USER_ERROR, payload: response.data.error });
      }
    } catch (error) {
      console.log("Err===>", error);
    }
  };
};
