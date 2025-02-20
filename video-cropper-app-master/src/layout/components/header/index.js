import classes from "./styles.module.css";

const Header = ({ activeTab, setActiveTab }) => {
  return (
    <div className={classes.header}>
      <div>
        <p className={classes.heading}>Cropper</p>
      </div>
      <div className={classes.tabsContainer}>
        <div
          className={`${classes.tabButton} ${
            activeTab === "generateSession" ? classes.activeTab : ""
          }`}
          onClick={() => setActiveTab("generateSession")}
        >
          <p className={classes.tabText}>Generate Session</p>
        </div>
        <div
          className={`${classes.tabButton} ${
            activeTab === "previewSession" ? classes.activeTab : ""
          }`}
          onClick={() => setActiveTab("previewSession")}
        >
          <p className={classes.tabText}>Preview Session</p>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Header;
