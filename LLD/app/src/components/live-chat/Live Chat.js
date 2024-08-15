import ChatWindow from "./ChatWindow";
import VideoStream from "./VideoStream";

{/*
Issues:
1. If followers are huge, then every second thousands of messages may come so, we can't show every message
2. Not every message is required, and we need near real time so we can use long polling
3. Page size will explode if we keep pushing messages in our dom infinitely, so we need to set a limit
*/}

const LiveChat = () => {
  return (
    <div className="flex">
      <VideoStream />
      <ChatWindow />
    </div>
  );
};
export default LiveChat;
