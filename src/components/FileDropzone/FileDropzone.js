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
      filesTotal: null,
      uploaded: false
    };
    this.onDrop = this.onDrop.bind(this);
  }

  //Don't need to bind this function with this writing
  async onDrop(acceptedFiles, rejectedFiles) {
    // Show loading and remove old file
    this.setState({
      loading: true,
      filename: null,
      filesTotal: null,
      error: false,
      errorMessage: null,
      uploaded: false
    });
    // If there is more than one file, display an error message and empty the dropzone
    if (rejectedFiles.length > 0 || acceptedFiles.length === 0) {
      this.setState({
        error: true,
        errorMessage: "Please drop only ONE file",
        loading: false
      });
    } else {
      // Send file to the server
      try {
        await fetch("https://fhirtest.uhn.ca/baseDstu3/Binary", {
          method: "POST",
          body: acceptedFiles[0]
        });
        // Find total number of binaries
        const data = await fetch(
          "http://hapi.fhir.org/baseDstu3/Binary?_pretty=true&_summary=count"
        );
        const { total } = await data.json();
        this.setState({
          filename: acceptedFiles[0].name,
          filesTotal: total,
          loading: false,
          uploaded: true
        });
      } catch {
        // Error
        this.setState({
          error: true,
          errorMessage: "File not uploaded, server error",
          loading: false
        });
      }
    }
  }

  render() {
    const { filename, error, errorMessage, loading, filesTotal } = this.state;
    return (
      <div className="dropzone">
        {filesTotal !== null ? (
          <p className="dropzone__count">
            Total number of files on the server : {filesTotal}
          </p>
        ) : null}

        <Dropzone onDrop={this.onDrop} multiple={false}>
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <div
                {...getRootProps()}
                className={`file-dropzone${isDragActive ? " isActive" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="file-dropzone_content">
                  <p className="file-dropzone__content__text">
                    Drop your file here
                  </p>
                  <p className="file-dropzone__content__text">or</p>
                  <p className="fake-btn">Choose file </p>
                </div>
              </div>
            );
          }}
        </Dropzone>
        {loading ? <p className="file-dropzone__info">Loading...</p> : null}
        {error ? (
          <p className="file-dropzone__info file-dropzone__error">
            {errorMessage}
          </p>
        ) : null}
        {filename ? <FileDisplay filename={filename} /> : null}
      </div>
    );
  }
}

export default FileDropzone;
