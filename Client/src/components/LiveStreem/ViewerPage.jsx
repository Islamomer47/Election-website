import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function ViewerPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const zpRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [joined, setJoined] = useState(false);
  const [isValidRoom, setIsValidRoom] = useState(false);

  useEffect(() => {
    const storedRoomIds = JSON.parse(localStorage.getItem("roomIds")) || [];

    // Check if the roomId in the URL exists in the stored room IDs in local storage
    if (storedRoomIds.includes(roomId)) {
      setIsValidRoom(true);
      myMeeting();
    } else {
      alert("The live stream has ended.");
      navigate("/");
    }

    return () => {
      if (zpRef.current) {
        zpRef.current.destroy();
      }
    };
  }, [roomId, navigate]);

  const myMeeting = () => {
    const appID = 1457610972;
    const serverSecret = "995c7b15cc26ecc235dd0db2261bb86f";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      "Viewer"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    zp.joinRoom({
      container: videoContainerRef.current,
      sharedLinks: [
        {
          name: "Video Call Link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
      },
      maxUsers: 100, // Adjust according to your needs
      turnOnMicrophoneWhenJoining: false, // Ensure microphone is off
      turnOnCameraWhenJoining: false, // Ensure camera is off
      showMicrophoneStateOnView: false, // Hide mic button
      showCameraStateOnView: false, // Hide camera button
      showMicrophoneState: false, // Hide mic state
      showCameraButton: false, // Hide camera button
      showAudioVideoSettingsButton: false, // Hide audio/video settings
      showScreenSharingButton: false, // Hide screen sharing button
      showLeavingConfirmation: false, // Disable leaving confirmation
      showPreJoinView: false, // Disable pre-join view
      showTextChat: false, // Disable text chat
      showUserList: false, // Disable user list
      showFullScreenButton: false, // Hide full-screen button
      showMessageButton: false, // Hide message button
      showMemberListButton: false, // Hide member list button
      onJoinRoom: () => {
        setJoined(true);
      },
      onLeaveRoom: () => {
        navigate("/");
      },
    });
  };

  const handleExit = () => {
    if (zpRef.current) {
      zpRef.current.destroy();
    }
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {isValidRoom && joined && (
        <button
          onClick={handleExit}
          className="mb-4 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
        >
          Exit
        </button>
      )}
      {isValidRoom && !joined && (
        <header className="text-lg font-semibold text-gray-800 mb-4">
          Watching Live Stream
        </header>
      )}
      {!isValidRoom && (
        <div className="text-lg font-semibold text-gray-800 mb-4">
          The live stream has ended.
        </div>
      )}
      {isValidRoom && (
        <div
          ref={videoContainerRef}
          className="w-full h-full bg-gray-200 rounded-lg overflow-hidden mb-4"
        />
      )}
    </div>
  );
}

export default ViewerPage;
