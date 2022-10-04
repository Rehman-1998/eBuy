export const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5MmU3NzE4Yy04ZDg0LTRhNmItYTc1NC02NTlhMTdhZTlmYTYiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY2NDE5OTU0MCwiZXhwIjoxNjY0ODA0MzQwfQ._rc6WDIhK1R1oJV7t3pFlHz-kgKDmWMtQIo5yhKN11Q";
// console.log("Process====", process.env.REACT_APP_VIDEOSDK_SECRET_KEY);
// API call to create meeting
export const createMeeting = async ({ token }) => {
  let meetingId;
  const res = await fetch(`https://api.videosdk.live/v1/meetings`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ region: "sg001" }),
  })
    .then((res) => res.json())
    .then((result) => {
      meetingId = result?.meetingId;
    })
    .catch((err) => console.log("ERR", err));

  return meetingId;
};
