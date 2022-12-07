/*
 *
 * Users reducer
 *
 */

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

const initialState = {
  users: [],
  searchedUsers: [],
  advancedFilters: {
    totalPages: 1,
    currentPage: 1,
    count: 0,
  },
  user: {},
  error: {},
  isLoading: false,
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case FETCH_SEARCHED_USERS:
      return {
        ...state,
        searchedUsers: action.payload,
      };
    case SET_ADVANCED_FILTERS:
      return {
        ...state,
        advancedFilters: {
          ...state.advancedFilters,
          ...action.payload,
        },
      };
    case SET_USERS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case ADD_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case UPDATE_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case DELETE_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
      };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
      };
    case USER_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default usersReducer;
