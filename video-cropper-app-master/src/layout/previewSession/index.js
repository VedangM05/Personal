import { useEffect, useRef, useState } from "react";
import classes from "./styles.module.css";
import videoPlayerImage from "../../assets/images/video-player.png";
import videoplayback from "../../assets/videos/videoplayback.mp4";
import ReactPlayer from "react-player";

const PreviewSessionTab = () => {
  const fileInputRef = useRef(null);
  const previewVideoRef = useRef(null);

  const [jsonData, setJsonData] = useState(null);
  const [videoState, setVideoState] = useState({
    isPlaying: false,
    playbackSpeed: 1,
    volume: 1,
    cropPosition: { x: 0, y: 0, width: 0, height: 0 },
    aspectRatio: 9 / 16,
  });
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);

  useEffect(() => {
    if (!jsonData || jsonData.length === 0) return;

    const firstData = jsonData[0];
    setVideoState({
      isPlaying: firstData.isPlaying,
      playbackSpeed: firstData.playbackSpeed,
      volume: firstData.volume,
      cropPosition: firstData.coordinates,
      aspectRatio: firstData.aspectRatio,
    });

    if (isPlayerReady) {
      previewVideoRef.current.seekTo(firstData.timestamp, "seconds");
    }
  }, [jsonData, isPlayerReady]);

  useEffect(() => {
    if (!jsonData || jsonData.length === 0) return;

    const initializePlayback = () => {
      setVideoState({
        isPlaying: jsonData[0].isPlaying,
        playbackSpeed: jsonData[0].playbackSpeed,
        volume: jsonData[0].volume,
        cropPosition: jsonData[0].coordinates,
        aspectRatio: jsonData[0].aspectRatio,
      });
    };

    initializePlayback();

    const intervalId = setInterval(() => {
      const currentTime = previewVideoRef.current.getCurrentTime();
      const nextDataIndex = jsonData.findIndex(
        (data) => data.timestamp > currentTime
      );

      if (nextDataIndex === -1 || nextDataIndex >= jsonData.length) {
        setVideoState({
          ...videoState,
          isPlaying: false,
        });
        clearInterval(intervalId);
        return;
      }

      if (nextDataIndex !== currentDataIndex) {
        setCurrentDataIndex(nextDataIndex);
        const data = jsonData[nextDataIndex];

        setVideoState({
          ...videoState,
          playbackSpeed: data.playbackSpeed,
          volume: data.volume,
          cropPosition: data.coordinates,
          aspectRatio: data.aspectRatio,
        });
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [jsonData, currentDataIndex, isPlayerReady]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "application/json") {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setJsonData(data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          alert("Invalid JSON file. Please upload a valid JSON file.");
        }
      };

      reader.readAsText(file);
    } else {
      alert("Please upload a valid JSON file.");
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const previewHeight = 500;
  const previewWidth = previewHeight * videoState.aspectRatio;

  return (
    <>
      <div className={classes.previewSessionContainer}>
        {jsonData ? (
          <div
            className={classes.previewVideoContainer}
            style={{
              width: `${previewWidth}px`,
              height: `${previewHeight}px`,
            }}
          >
            <ReactPlayer
              url={videoplayback}
              ref={previewVideoRef}
              playing={videoState.isPlaying}
              playbackRate={videoState.playbackSpeed}
              volume={videoState.volume}
              onReady={() => setIsPlayerReady(true)}
              width="auto"
              height={previewHeight}
              style={{
                position: "absolute",
                left: videoState.cropPosition.height
                  ? (-videoState.cropPosition.x /
                      videoState.cropPosition.height) *
                    previewHeight
                  : -videoState.cropPosition.x,
              }}
            />
          </div>
        ) : (
          <>
            <img
              src={videoPlayerImage}
              className={classes.previewImage}
              alt="video-player"
            />
            <p className={classes.uploadJsonText}>
              Upload JSON to Preview Session
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            <div onClick={handleClick} className={classes.uploadButton}>
              Upload JSON
            </div>
          </>
        )}
      </div>
      <div></div>
    </>
  );
};

export default PreviewSessionTab;
