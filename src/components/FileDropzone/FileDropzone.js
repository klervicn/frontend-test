import React from "react";
import Dropzone from "react-dropzone";
import FileDisplay from "../FileDisplay/FileDisplay";
// require doesnt work in browser , because require is from webpack and not from electron
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

class FileDropzone extends React.Component {
  constructor() {
    super();
    this.state = {
      error: false,
      errorMessage: null,
      filename: null,
      filesTotal: null
    };
    this.onDrop = this.onDrop.bind(this);
  }

  onServerStateChanged = (event, { filename, filesTotal }) => {
    this.setState({
      filesTotal,
      filename,
      error: false,
      errorMessage: null
    });
  };

  onError = (event, { errorMessage }) => {
    this.setState({
      error: true,
      errorMessage,
      filename: null,
      filesTotal: null
    });
  };

  // Add listeners
  componentDidMount() {
    ipcRenderer.on("serverStateChanged", this.onServerStateChanged);
    ipcRenderer.on("error", this.onError);
  }

  // Remove listeners
  componentWillUnmount() {
    ipcRenderer.removeListener("serverStateChanged", this.onServerStateChanged);
    ipcRenderer.removeListener("error", this.onError);
  }

  async onDrop(acceptedFiles, rejectedFiles) {
    // If there is more than one file, display an error message and empty the dropzone
    if (rejectedFiles.length > 0 || acceptedFiles.length === 0) {
      this.setState({
        error: true,
        errorMessage: "Please drop only ONE file",
        filename: null,
        filesTotal: null
      });
      return;
    }
    // Check if file is PDF
    if (!acceptedFiles[0].name.endsWith(".pdf")) {
      this.setState({
        error: true,
        errorMessage: "Only PDF file is accepted",
        filename: null,
        filesTotal: null
      });
      return;
    }
    // Check file size
    if (acceptedFiles[0].size / 1000000 > 2) {
      this.setState({
        error: true,
        errorMessage: "File cannot exceed 2 mb",
        filename: null,
        filesTotal: null
      });
      return;
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
          error: false,
          errorMessage: null,
          filename: acceptedFiles[0].name,
          filesTotal: total
        });
      } catch (error) {
        this.setState({
          error: true,
          errorMessage: error.toString(),
          filename: null,
          filesTotal: null
        });
      }
    }
  }

  render() {
    const { filename, error, errorMessage, filesTotal } = this.state;
    return (
      <div className="dropzone">
        {filesTotal && (
          <p className="dropzone__count">
            Total number of files on the server : {filesTotal}
          </p>
        )}

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
        {error && (
          <p className="file-dropzone__info file-dropzone__error">
            {errorMessage}
          </p>
        )}
        {filename && <FileDisplay filename={filename} />}
      </div>
    );
  }
}

export default FileDropzone;
