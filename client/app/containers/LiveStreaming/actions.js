/*
 *
 * Video Call actions
 *
 */

import { No_MEETING, GET_MEETING_ID, SET_MEETING_ID } from "./constants";

export const noMeetingAction = () => (dispatch) => {
  console.log("IN ACTION MEETING");
  dispatch({ type: No_MEETING });
};

export const getMeetingId = (meetingId) => (dispatch) => {
  console.log("meeting Id", meetingId);
  dispatch({
    type: GET_MEETING_ID,
    payload: meetingId,
  });
};

export const settingMeetingId = (meetingId) => (dispatch) => {
  console.log("meeting Id in action", meetingId);
  dispatch({
    type: SET_MEETING_ID,
    payload: meetingId,
  });
};
