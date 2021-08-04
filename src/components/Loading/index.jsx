import React from "react";
import ReactLoading from "react-loading";
import "./loading.scss";

function Loading(props) {
  return (
    <div className="Loading">
      <ReactLoading type="bubbles" color="cyan" height={"20%"} width={"20%"} />
    </div>
  );
}

export default Loading;
