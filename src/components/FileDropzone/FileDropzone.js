import React from "react";
import Dropzone from "react-dropzone";
import FileDisplay from "../FileDisplay/FileDisplay";

class FileDropzone extends React.Component {
  constructor() {
    super();
    this.state = {
      error: false,
      errorMessage: null,
      filename: null,
      loading: false,
      uploaded: false
    };
  }

  //Don't need to bind this function with this writing
  onDrop = (acceptedFiles, rejectedFiles) => {
    // Show loading and remove old file
    this.setState({ loading: true, filename: null });
    // If there is more than one file, display an error message and empty the dropzone
    if (rejectedFiles.length > 0 || acceptedFiles.length === 0) {
      this.setState({
        error: true,
        errorMessage: "Please drop only ONE file",
        filename: null,
        loading: false
      });
    } else {
      // Send file to the server
      fetch("https://fhirtest.uhn.ca/baseDstu3/Binary", {
        method: "POST",
        body: acceptedFiles[0]
      }).then(response => {
        // Success
        if (response.status === 200 || response.status === 201) {
          this.setState({
            error: false,
            errorMessage: null,
            filename: acceptedFiles[0].name,
            loading: false,
            uploaded: true
          });
        } else {
          // Error
          this.setState({
            error: true,
            errorMessage: "File not uploaded, server error",
            filename: null,
            loading: false,
            uploaded: false
          });
        }
      });
    }
  };

  render() {
    const { filename, error, errorMessage, loading } = this.state;
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
        {loading ? <span>Loading...</span> : null}
        {error ? <p className="file-dropzone__error">{errorMessage}</p> : null}
        {filename ? <FileDisplay filename={filename} /> : null}
      </div>
    );
  }
}

export default FileDropzone;
