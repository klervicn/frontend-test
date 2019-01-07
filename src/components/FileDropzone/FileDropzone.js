import React from "react";
import Dropzone from "react-dropzone";
import FileDisplay from "../FileDisplay/FileDisplay";

class FileDropzone extends React.Component {
  constructor() {
    super();
    this.state = { filename: null, error: false };
  }

  //Don't need to bind this function with this writing
  onDrop = (acceptedFiles, rejectedFiles) => {
    // If there is more than one file, display an error message and empty the dropzone
    if (rejectedFiles.length > 0 || acceptedFiles.length === 0) {
      this.setState({
        filename: null,
        error: true
      });
    } else {
      this.setState({
        filename: acceptedFiles[0].name,
        error: false
      });
    }
  };

  render() {
    const { filename, error } = this.state;
    return (
      <div className="dropzone">
        <Dropzone onDrop={this.onDrop} multiple={false}>
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <div
                {...getRootProps()}
                className={`file-dropzone${isDragActive ? " isActive" : ""}`}
              >
                <input {...getInputProps()} />
                <p>
                  <span className="fake-btn">Choose file </span>
                  <span className="file-dropzone__text">
                    or drop your file here
                  </span>
                </p>
              </div>
            );
          }}
        </Dropzone>
        {error ? (
          <p className="file-dropzone__error">Please drop only ONE file</p>
        ) : null}
        {filename ? <FileDisplay filename={filename} /> : null}
      </div>
    );
  }
}

export default FileDropzone;
