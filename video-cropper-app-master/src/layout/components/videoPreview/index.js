import ReactPlayer from "react-player";
import classes from "./styles.module.css";
import videoPlayerImage from "../../../assets/images/video-player.png";

const VideoPreview = ({
  videoplayback,
  previewVideoRef,
  videoState,
  aspectRatio,
  cropperPosition,
  showCropper,
}) => {
  const previewHeight = 500;
  const previewWidth = previewHeight * aspectRatio;

  const cropperXOffset =
    (cropperPosition.x / cropperPosition.height) * previewHeight;

  return (
    <div className={classes.videoPreviewContainer}>
      <div className={classes.previewHeader}>
        <p className={classes.previewHeaderText}>Preview</p>
      </div>
      <div
        className={classes.previewVideoContainer}
        style={{
          width: `${previewWidth}px`,
          height: `${previewHeight}px`,
          display: showCropper ? "block" : "none",
        }}
      >
        <ReactPlayer
          url={videoplayback}
          ref={previewVideoRef}
          playing={videoState.isPlaying}
          playbackRate={videoState.playbackSpeed.value}
          volume={videoState.volume}
          width="auto"
          height={previewHeight}
          style={{
            position: "absolute",
            left: -cropperXOffset,
          }}
        />
      </div>
      <div
        className={classes.noPreviewContainer}
        style={{ display: showCropper ? "none" : "flex" }}
      >
        <img
          src={videoPlayerImage}
          className={classes.previewImage}
          alt="video-player"
        />
        <p className={classes.noPreviewHeading}>Preview not available</p>
        <p className={classes.noPreviewText}>
          Please click on "Start Cropper" and then play video
        </p>
      </div>
    </div>
  );
};

export default VideoPreview;
