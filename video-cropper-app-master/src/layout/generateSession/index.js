import { useRef, useState } from "react";

import classes from "./styles.module.css";
import Footer from "../components/footer";
import VideoPlayer from "../components/videoPlayer";
import VideoPreview from "../components/videoPreview";
import videoplayback from "../../assets/videos/videoplayback.mp4";

const GenerateSessionTab = () => {
  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);

  const [videoState, setVideoState] = useState({
    isPlaying: false,
    playbackSpeed: { label: "1x", value: 1 },
    duration: 0,
    volume: 1,
  });

  const [played, setPlayed] = useState(0);
  const [showCropper, setShowCropper] = useState(false);
  const [cropperAspectRatio, setCropperAspectRatio] = useState({
    label: "9:16",
    value: 9 / 16,
  });
  const [cropperPosition, setCropperPosition] = useState({ x: 0, y: 0 });

  const [previewResult, setPreviewResult] = useState([]);

  const isValidNewPreview = (timestamp) => {
    const isDuplicate = previewResult.some(
      (preview) => preview.timestamp === timestamp
    );

    if (isDuplicate) {
      return false;
    }
    return true;
  };

  const handleVideoStateChange = (newState) => {
    setVideoState(newState);

    const timestamp = played * newState.duration;

    if (
      showCropper &&
      (newState.isPlaying || videoState.isPlaying) &&
      isValidNewPreview(timestamp)
    ) {
      setPreviewResult([
        ...previewResult,
        {
          timestamp,
          volume: newState.volume,
          playbackSpeed: newState.playbackSpeed.value,
          coordinates: cropperPosition,
          isPlaying: newState.isPlaying,
          aspectRatio: cropperAspectRatio.value,
        },
      ]);
    }
  };

  const handleCropperPositionChange = (newPosition, currVideoState) => {
    setCropperPosition(newPosition);

    const timestamp = played * currVideoState.duration;

    if (currVideoState.isPlaying && isValidNewPreview(timestamp)) {
      setPreviewResult([
        ...previewResult,
        {
          timestamp: played * currVideoState.duration,
          volume: currVideoState.volume,
          playbackSpeed: currVideoState.playbackSpeed.value,
          coordinates: newPosition,
          isPlaying: currVideoState.isPlaying,
          aspectRatio: cropperAspectRatio.value,
        },
      ]);
    }
  };

  const handleShowCropper = (showCropper) => {
    setShowCropper(showCropper);

    const timestamp = played * videoState.duration;

    if (isValidNewPreview(timestamp) && videoState.isPlaying) {
      setPreviewResult([
        ...previewResult,
        {
          timestamp,
          volume: videoState.volume,
          playbackSpeed: videoState.playbackSpeed.value,
          coordinates: cropperPosition,
          isPlaying: videoState.isPlaying,
          aspectRatio: cropperAspectRatio.value,
        },
      ]);
    }
  };

  return (
    <>
      <div className={classes.bodyContainer}>
        <div className={classes.videoPlayerContainer}>
          <VideoPlayer
            videoplayback={videoplayback}
            videoRef={videoRef}
            previewVideoRef={previewVideoRef}
            videoState={videoState}
            setVideoState={handleVideoStateChange}
            cropperAspectRatio={cropperAspectRatio}
            setCropperAspectRatio={setCropperAspectRatio}
            cropperPosition={cropperPosition}
            setCropperPosition={handleCropperPositionChange}
            showCropper={showCropper}
            played={played}
            setPlayed={setPlayed}
          />
        </div>
        <div className={classes.videoPreviewContainer}>
          <VideoPreview
            videoplayback={videoplayback}
            previewVideoRef={previewVideoRef}
            videoState={videoState}
            aspectRatio={cropperAspectRatio.value}
            cropperPosition={cropperPosition}
            showCropper={showCropper}
          />
        </div>
      </div>
      <Footer
        showCropper={showCropper}
        setShowCropper={handleShowCropper}
        previewResult={previewResult}
      />
    </>
  );
};

export default GenerateSessionTab;
