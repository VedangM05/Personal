import classes from "./styles.module.css";

const Footer = ({ showCropper, setShowCropper, previewResult }) => {
  const downloadPreviewResult = () => {
    const blob = new Blob([JSON.stringify(previewResult)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "preview.json";
    link.click();
  };

  return (
    <div className={classes.footer}>
      <div className={classes.buttonsContainer}>
        <div
          onClick={() => setShowCropper(true)}
          className={`${classes.footerButton} ${
            showCropper ? classes.disabledButton : ""
          }`}
        >
          Start Cropper
        </div>
        <div
          onClick={() => setShowCropper(false)}
          className={`${classes.footerButton} ${
            !showCropper ? classes.disabledButton : ""
          }`}
        >
          Remove Cropper
        </div>
        <div className={classes.footerButton} onClick={downloadPreviewResult}>
          Generate Preview
        </div>
      </div>
      <div>
        <div className={`${classes.footerButton} ${classes.cancelButton}`}>
          Cancel
        </div>
      </div>
    </div>
  );
};

export default Footer;
