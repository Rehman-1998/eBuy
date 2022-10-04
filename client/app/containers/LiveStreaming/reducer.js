/*
 *
 * Video Call reducer
 *
 */

import { No_MEETING, GET_MEETING_ID, SET_MEETING_ID } from "./constants";

const initialState = {
  liveStream: {},
  meetingId: "",
  isMeeting: false,
};

const videoCallReducer = (state = initialState, action) => {
  switch (action.type) {
    case No_MEETING:
      console.log("IN REDUCER");
      return {
        ...state,
      };
      break;
    case GET_MEETING_ID:
      console.log("get meeting id in reducer", action);
      return {
        ...state,
      };
    case SET_MEETING_ID:
      console.log("set meeting id in reducer", action);
      return {
        ...state,
        isMeeting: true,
        meetingId: action.payload,
      };
    default:
      return state;
  }
};

export default videoCallReducer;
