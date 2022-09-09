import React, { useEffect } from "react";
import { useSocket } from "../../contexts/Socket";
import { createMeeting, authToken } from "./CreateMeeting";
import MainApp from "./MainApp";

const LiveStreaming = () => {
  const { socket, connect, disconnect } = useSocket();
  useEffect(() => {
    connect();
  }, []);

  socket?.emit("connection");
  socket?.emit("liveUsers");
  // const token =
  //   " Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDlmNTc5NjI5MzY2MDkwY2JjMzIzZiIsImlhdCI6MTY2MjM4MjI0MCwiZXhwIjoxNjYyOTg3MDQwfQ.wR0n8kTGWjaD7zz0YLrXTJ30iA0ysJ6L-CGt9a6S-XA";
  createMeeting({ token: authToken });

  return (
    <>
      {/* <h1>Hello world</h1> */}
      <MainApp />
    </>
  );
};

export default LiveStreaming;
