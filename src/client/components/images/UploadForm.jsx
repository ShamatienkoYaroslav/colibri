import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, InputGroup } from 'react-bootstrap';
import Halogen from 'halogen';

import { PageTitle } from '../elements';

class UploadForm extends Component {
  constructor(props) {
    super(props);

    this.uploaded = false;

    this.state = { file: null };

    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleUploading = this.handleUploading.bind(this);
  }

  handleFileSelect(e) {
    const file = e.target.files[0];
    this.setState({ file });
  }

  handleUploading() {
    this.props.onFileUpload(this.state.file);
  }

  render() {
    const { show, uploading, onHide } = this.props;

    let spinner = null;
    if (this.uploaded) {
      spinner = (
        <p className="footer-file-upload">File uploaded.</p>
      );
    }
    if (uploading) {
      this.uploaded = true;

      spinner = (
        <div className="spinner">
          <Halogen.MoonLoader color="#EA5455" />
        </div>
      );
    }

    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            <PageTitle text="Upload image(s)" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <div className="file-upload">
            <p className="annotation">
              Select file with proper <strong>Docker image(s)</strong> to upload. By reading this file, Colibri will create or update images.
            </p>

            <p className="annotation">
              Select file by pressing the <strong>Select</strong> button, then press the <strong>Upload</strong> button to upload file to Colibri.
            </p>

            <InputGroup>
              <label className="input-group-btn">
                <span className="btn btn-default btn-file-upload" type="button">
                  Select
                  <input
                    type="file"
                    style={{ display: "none" }}
                    multiple
                    accept=".tar,.tar.gz,.tar.gzip,.tar.bz2,.tar.bzip2,.tbz2,.tb2,.tbz"
                    onChange={this.handleFileSelect} 
                  />
                </span>
              </label>

              <input
                type="text"
                className="form-control"
                readOnly
                placeholder="Select file to upload"
                onChange={this.handleFileSelect}
                value={ this.state.file ? this.state.file.name : '' }
              />

              <span className="input-group-btn">
                <Button
                  disabled={!this.state.file}
                  bsStyle="primary"
                  className="btn-file-upload"
                  onClick={this.handleUploading}
                >
                  Upload
                </Button>
              </span>
            </InputGroup> 
            
            {spinner}
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

UploadForm.propTypes = {
  show: PropTypes.bool.isRequired,
  uploading: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
};

export default UploadForm;