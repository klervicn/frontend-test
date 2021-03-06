import React, { Component } from "react";
import FileDropzone from "./components/FileDropzone/FileDropzone";
import "./Main.css";

class Main extends Component {
  render() {
    return (
      <div className="main">
        <header className="main__header">
          <h1>Droptor</h1>
          <h3>Upload your file</h3>
        </header>
        <FileDropzone />
      </div>
    );
  }
}

export default Main;
