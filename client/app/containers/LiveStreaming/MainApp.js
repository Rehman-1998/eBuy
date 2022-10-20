import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
  usePubSub,
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
  const dispatch = useDispatch();
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div>
      <button
        onClick={() => {
          leave();
          dispatch(settingMeetingId(""));
        }}
      >
        Leave
      </button>
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
          playIcon={<></>}
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
      <MeetingChat />
    </div>
  );
}

const MessageList = ({ messages }) => {
  return (
    <div>
      {messages?.map((message, i) => {
        const { senderName, message: text, timestamp } = message;

        return (
          <div
            style={{
              margin: 8,
              backgroundColor: "darkblue",
              borderRadius: 8,
              overflow: "hidden",
              padding: 8,
              color: "#fff",
            }}
            key={i}
          >
            <p style={{ margin: 0, padding: 0, fontStyle: "italic" }}>
              {senderName}
            </p>
            <h3 style={{ margin: 0, padding: 0, marginTop: 4 }}>{text}</h3>
            <p
              style={{
                margin: 0,
                padding: 0,
                opacity: 0.6,
                marginTop: 4,
              }}
            >
              {formatAMPM(new Date(timestamp))}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const Title = ({ title, dark }) => {
  return <h2 style={{ color: dark ? primary : "#fff" }}>{title}</h2>;
};

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

const MeetingChat = () => {
  const { publish, messages } = usePubSub("CHAT", {});
  const [message, setMessage] = useState("");
  return (
    <div
      style={{
        marginLeft: 8,
        width: 400,
        backgroundColor: "blue",
        overflowY: "scroll",
        borderRaduis: 8,
        height: `calc(100vh - ${120 + 2 * 8}px)`,
        padding: 8,
      }}
    >
      <Title title={"Chat"} />

      <div style={{ display: "flex" }}>
        <input
          value={message}
          onChange={(e) => {
            const v = e.target.value;
            setMessage(v);
          }}
        />
        <button
          className={"button default"}
          onClick={() => {
            const m = message;

            if (m.length) {
              publish(m, { persist: true });
              setMessage("");
            }
          }}
        >
          Send
        </button>
      </div>
      <MessageList messages={messages} />
    </div>
  );
};

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
