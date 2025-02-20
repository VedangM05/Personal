import React, { forwardRef } from "react";
import Draggable from "react-draggable";

const DraggableWrapper = forwardRef((props, ref) => (
  <Draggable {...props} nodeRef={ref}>
    <div ref={ref}>{props.children}</div>
  </Draggable>
));

export default DraggableWrapper;
