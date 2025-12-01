import React from "react";
import { CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <div className="loading-container">
      <CircularProgress color="primary" />
    </div>
  );
};

export default Loading;
