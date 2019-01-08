import React from "react";
import PropTypes from "prop-types";

/**
 * This is a separated component, in the case we want to manage more than 1 file
 */

const propTypes = {
  filename: PropTypes.string
};

const FileDisplay = ({ filename }) => (
  <div className="file-display">
    <p>{filename}</p>
  </div>
);

FileDisplay.propTypes = propTypes;

export default FileDisplay;
