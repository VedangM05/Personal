import { useState } from "react";
import classes from "./index.module.css";
import Header from "./components/header";
import GenerateSessionTab from "./generateSession";
import PreviewSessionTab from "./previewSession";

const App = () => {
  const [activeTab, setActiveTab] = useState("generateSession");

  return (
    <div className={classes.layout}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {{
        generateSession: <GenerateSessionTab />,
        previewSession: <PreviewSessionTab />,
      }[activeTab] || <></>}
    </div>
  );
};

export default App;
