import ReactPlayer from "react-player";

import classes from "./styles.module.css";
import playButton from "../../../assets/images/play-button.png";
import pauseButton from "../../../assets/images/pause-button.png";
import volumeIcon from "../../../assets/images/volume-icon.png";
import CustomDropdown from "../customDropdown";
import { PlaybackSpeeds, CropperAspectRatios } from "../../../constants";
import { formatTime } from "../../../utils";
import CropperLayer from "../cropperLayer";

const VideoPlayer = ({
  videoplayback,
  videoRef,
  previewVideoRef,
  videoState,
  setVideoState,
  cropperAspectRatio,
  setCropperAspectRatio,
  cropperPosition,
  setCropperPosition,
  showCropper,
  played,
  setPlayed,
}) => {
  const handlePausePlay = () => {
    setVideoState({ ...videoState, isPlaying: !videoState.isPlaying });
  };

  const handleSeekChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setPlayed(newValue);
    videoRef.current.seekTo(newValue);
    if (previewVideoRef.current) {
      previewVideoRef.current.seekTo(newValue);
    }
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
  };

  const handleVolumeChange = (e) =>
    setVideoState({ ...videoState, volume: parseFloat(e.target.value) });

  const handleCropperPositionChange = (newPosition) => {
    const cropperPosition = {
      ...newPosition,
      width: videoRef.current.wrapper.clientWidth,
      height: videoRef.current.wrapper.clientHeight,
    };
    setCropperPosition(cropperPosition, videoState);
  };

  return (
    <div className={classes.videoPlayerContainer}>
      <div className={classes.videoWrapper}>
        <CropperLayer
          aspectRatio={cropperAspectRatio.value}
          cropperPosition={cropperPosition}
          setCropperPosition={handleCropperPositionChange}
          videoRef={videoRef}
          showCropper={showCropper}
        />
        <ReactPlayer
          url={videoplayback}
          ref={videoRef}
          playing={videoState.isPlaying}
          playbackRate={videoState.playbackSpeed.value}
          volume={videoState.volume}
          onProgress={handleProgress}
          onDuration={(dur) => setVideoState({ ...videoState, duration: dur })}
          width="100%"
          height="100%"
          progressInterval={100}
        />
      </div>
      <div className={classes.videoPlayerControls}>
        <div className={classes.videoPlayerControlsRow}>
          <img
            src={videoState.isPlaying ? pauseButton : playButton}
            className={classes.playButton}
            alt="pause-play"
            onClick={() => {
              handlePausePlay();
            }}
          />
          <input
            type="range"
            min={0}
            max={1}
            className={classes.seekbarContainer}
            step="0.0001"
            value={played}
            onChange={handleSeekChange}
          />
        </div>
        <div className={classes.videoPlayerControlsRow}>
          <div className={classes.timestampContainer}>
            <p>{formatTime(played * videoState.duration)}</p>
            <p style={{ opacity: 0.5 }}>|</p>
            <p style={{ opacity: 0.5 }}>{formatTime(videoState.duration)}</p>
          </div>
          <div className={classes.volumeContainer}>
            <img src={volumeIcon} className={classes.volumeIcon} alt="volume" />
            <input
              type="range"
              min={0}
              max={1}
              className={classes.seekbarContainer}
              step="0.0001"
              value={videoState.volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
        <div className={classes.videoEditorControlsRow}>
          <CustomDropdown
            label="Playback Speed"
            options={PlaybackSpeeds}
            selected={videoState.playbackSpeed}
            onChange={(value) => {
              setVideoState({ ...videoState, playbackSpeed: value });
            }}
          />
          <CustomDropdown
            label="Cropper Aspect Ratio"
            options={CropperAspectRatios}
            selected={cropperAspectRatio}
            onChange={(value) => {
              setCropperAspectRatio(value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
