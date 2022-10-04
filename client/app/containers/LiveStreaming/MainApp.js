import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./CreateMeeting";
import ReactPlayer from "react-player";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { settingMeetingId } from "../Product/actions";

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = React.useState(null);
  const onClick = async () => {
    await getMeetingAndToken(meetingId);
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <button onClick={onClick}>Join</button>
      {" or "}
      <button onClick={onClick}>Create Meeting</button>
    </div>
  );
}

function Container(props) {
  const [joined, setJoined] = useState(false);
  const { join } = useMeeting();
  const { participants } = useMeeting();
  console.log("PARTICAPANTS +++", participants.keys());
  const joinMeeting = () => {
    setJoined(true);
    join();
  };

  return (
    <div key={props?.meetingId} className="container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined ? (
        <div>
          <Controls />
          {[...participants.keys()].map((participantId, index) => {
            return (
              <div
                style={{
                  position: "relative",
                  borderRadius: 8,
                  overflow: "hidden",
                  backgroundColor: "black",
                  width: "100%",
                  height: 300,
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <VideoComponent key={index} participantId={participantId} />;
              </div>
            );
          })}
        </div>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div>
      <button onClick={leave}>Leave</button>
      <button onClick={toggleMic}>toggleMic</button>
      <button onClick={toggleWebcam}>toggleWebcam</button>
    </div>
  );
}

function VideoComponent(props) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal } = useParticipant(
    props.participantId
  );
  const result = useParticipant(props?.participantId);
  console.log(
    "Web Cam Stream ======>",
    props,
    result,
    webcamStream
    // micStream,
    // webcamOn,
    // micOn,
    // props.participantId
  );

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div key={props.participantId}>
      {micOn && micRef && <audio ref={micRef} muted={isLocal} autoPlay />}
      {webcamOn && (
        <ReactPlayer
          //
          playsinline // very very imp prop
          pip={false}
          light={false}
          controls={true}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          height={"300px"}
          width={"300px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}

function MainApp() {
  const dispatch = useDispatch();
  const location = useLocation();
  const merchandId = useSelector((state) => state.account.user.merchant);
  console.log("STATE DATA =====>", location?.state?.meetingId);
  const [meetingId, setMeetingId] = useState(
    location.state ? location?.state?.meetingId : null
  );
  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
    dispatch(settingMeetingId(meetingId));
  };

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "C.V. Raman",
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => <Container meetingId={meetingId} />}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

export default MainApp;
