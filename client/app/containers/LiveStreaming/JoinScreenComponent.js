import React from "react";
export function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = React.useState(null);
  const onClick = async () => {
    console.log("hello");
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
