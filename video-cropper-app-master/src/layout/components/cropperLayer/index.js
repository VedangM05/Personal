import Draggable from "react-draggable";
import classes from "./styles.module.css";

const CropperLayer = ({
  aspectRatio,
  cropperPosition,
  setCropperPosition,
  showCropper,
}) => {
  if (!showCropper) {
    return null;
  }

  const handleDrag = (e, data) => {
    setCropperPosition({ x: data.x, y: data.y });
  };

  return (
    <div className={classes.cropperOverlay}>
      <Draggable
        axis="x"
        bounds="parent"
        onDrag={handleDrag}
        defaultPosition={cropperPosition}
      >
        <div style={{ aspectRatio }} className={classes.cropperBox}>
          <div />
          <div
            style={{
              borderLeft: "1px dashed white",
              borderRight: "1px dashed white",
            }}
          />
          <div />
          <div
            style={{
              borderTop: "1px dashed white",
              borderBottom: "1px dashed white",
            }}
          />
          <div style={{ border: "1px dashed white" }} />
          <div
            style={{
              borderTop: "1px dashed white",
              borderBottom: "1px dashed white",
            }}
          />
          <div />
          <div
            style={{
              borderLeft: "1px dashed white",
              borderRight: "1px dashed white",
            }}
          />
          <div />
        </div>
      </Draggable>
    </div>
  );
};

export default CropperLayer;
