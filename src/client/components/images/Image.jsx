import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuid from 'uuid';
import swal from 'sweetalert2';
import {
  Grid,
  Col,
  Row,
  FormGroup,
  ControlLabel,
  FormControl,
  InputGroup,
  ButtonToolbar,
  ButtonGroup,
  Button,
  Table,
  Tabs,
  Tab,
} from 'react-bootstrap';

import { fetchImage, createImage, changeImage, deleteImage } from '../../actions/images';
import { ImagesApi, format } from '../../utils';

import { PageTitle } from '../elements';

class Image extends Component {
  constructor(props) {
    super(props);
    
    this.mainUrl = '/images';
    this.id = this.props.match.params.id;
    this.info = null;

    this.state = {
      new: !this.id,
      read: false,
      modified: false,
      data: {
        name: '',
        tag: '',
        source: '',
      },
    };

    this.getInfo = this.getInfo.bind(this);
    this.getData = this.getData.bind(this);
    this.getDataById = this.getDataById.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePull = this.handlePull.bind(this);
    this.pullImage = this.pullImage.bind(this);
  }

  async componentDidMount() {
    if (!this.state.new) {
      await this.readImage();
    }
  }

  async getInfo() {
    const resp = await ImagesApi.getInfo(this.id);
    return resp;
  }

  getData() {
    const data = this.getDataById();
    const stateData = this.state.data;
    const keys = Object.keys(stateData);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (stateData[key]) {
        data[key] = stateData[key];
      }
    }
    return data;
  }

  getDataById() {
    let data = {};
    const collection = this.props.images.data;
    for (let i = 0; i < collection.length; i += 1) {
      if (collection[i].id === this.id) {
        data = collection[i];
        break;
      }
    }
    return data;
  };

  goBack() {
    this.props.history.push(this.mainUrl);
  }

  handleChange(e) {
    if (typeof e === 'string') {
      console.log(e);
      // TODO: open modal here
    } else {
      this.setState({
        data: {
          ...this.state.data,
          [e.target.name]: e.target.value,
        },
      });
    }

    this.setState({ modified: true });
  }

  handleClose() {
    this.goBack();
  }

  async handleSave() {
    if (this.state.new) {
      this.id = uuid();
      this.props.createImage({ ...this.state.data, id: this.id });
    } else {
      this.props.changeImage(this.id, this.getData());
    }

    this.props.history.push(`${this.mainUrl}/${this.id}`);

    this.setState({ modified: false, new: false, read: true });
  }

  handleDelete() {
    this.props.deleteImage(this.id);
    this.goBack();
  }

  handlePull() {
    let pulled = false;
    const data = this.getData();
    swal({
      html: `Do you want to pull the image <strong>${data.name}:${data.tag}</strong>?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#EA5455',
      showLoaderOnConfirm: true,
      useRejections: false,
      preConfirm: () => (
        new Promise(async (resolve) => {
          await this.pullImage();
          pulled = true;
          resolve();
        })
      ),
    })
    .then(() => {
      if (pulled) {
        swal({
          html: `The image <strong>${data.name}:${data.tag}</strong> was pulled.`,
          type: 'success',
          confirmButtonColor: '#EA5455',
        });
      }
    });
  }

  async readImage() {
    this.info = null;
    const resp = await this.getInfo();
    if (resp.messages.length === 0) {
      this.info = resp.info;
    }
    this.props.fetchImage(this.id);
    this.setState({ read: false });
  }

  async pullImage() {
    try {
      const pullResp = await ImagesApi.pullImage(this.id);
      if (pullResp.success) {
        const infoResp = await ImagesApi.getInfo(this.id);
        if (infoResp.messages.length !== 0) {
          console.log('ERROR_PULL_IMAGE_GET_INFO', infoResp.messages);
        } else {
          this.info = infoResp.info;
          this.forceUpdate();
        }
      }
    } catch (e) {
      console.log('ERROR_PULL_IMAGE', e); 
    }
  }

  pullImageConfirm() {
    return new Promise(async (resolve) => {
      await this.pullImage();
      resolve();
    });
  }

  render() {
    if (this.state.read) {
      this.readImage();
    }

    const data = this.getData();

    const title = `${data.name} ${this.state.modified || this.state.new ? '*' : ''}`;

    let info = null;
    if (!this.state.new) {
      info = (
        <div>
          <p>Now you can <a role="button" onClick={this.handlePull}>pull</a> the image.</p>
        </div>
      );
    }
    if (this.info) {
      const { 
        Architecture: arch, 
        Author: author, 
        Config: config,
        Created: created,
        DockerVersion: dockerVersion,
        Os: os,
        Size: size,
        Id: dockerId,
        Parent: parent,
        Comment: comment,
      } = this.info;

      let command = '';
      let exposedPorts = '';
      let tty = false;
      let entryPoint = '';
      let envVars = '';
      if (config) {
        const { Cmd: cmd, ExposedPorts: ports, Env: env } = config;
        tty = config.Tty;
        entryPoint = config.Entrypoint;

        if (cmd) {
          for (let i = 0; i < cmd.length; i += 1) {
            command += `${cmd[i]} `;
          }
        }

        if (ports) {
          const keys = Object.keys(ports);
          exposedPorts = (
            <Tab eventKey={2} title="Exposed Ports">
              <div className="tab-content">
                <Row>
                  <Col sm={12}>
                    <Table condensed bordered responsive readOnly>
                      <thead>
                        <tr>
                          <th>Port</th>
                        </tr>
                      </thead>
                      <tbody>
                        {keys.map(item => (
                          <tr key={keys.indexOf(item)}>
                            <td>{item.split('/')[0]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
            </Tab>
          );
        }

        if (env) {
          envVars = (
            <Tab eventKey={1} title="Env Vars">
              <div className="tab-content">
                <Row>
                  <Col sm={12}>
                    <Table condensed bordered responsive readOnly>
                      <thead>
                        <tr>
                          <th>Variable</th>
                        </tr>
                      </thead>
                      <tbody>
                        {env.map(item => (
                          <tr key={env.indexOf(item)}>
                            <td>{item}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
            </Tab>
          );
        }
      }

      info = (
        <div>
          <h4>Info</h4>
          <Row>
            <Col sm={12}>
              <FormGroup controlId="author">
                <ControlLabel>Author</ControlLabel>
                <FormControl.Static>{author || 'none'}</FormControl.Static>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={4}>
              <FormGroup controlId="created">
                <ControlLabel>Created</ControlLabel>
                <FormControl.Static>{format.formatDate(created)}</FormControl.Static>
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup controlId="size">
                <ControlLabel>Size</ControlLabel>
                <FormControl.Static>{size || 0}</FormControl.Static>
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup controlId="cmd">
                <ControlLabel>Cmd</ControlLabel>
                <FormControl.Static>{command || 'none'}</FormControl.Static>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={4}>
              <FormGroup controlId="arch">
                <ControlLabel>Architecture</ControlLabel>
                <FormControl.Static>{arch || 'none'}</FormControl.Static>
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup controlId="os">
                <ControlLabel>OS</ControlLabel>
                <FormControl.Static>{os || 'none'}</FormControl.Static>
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup controlId="dockerVersion">
                <ControlLabel>Docker Version</ControlLabel>
                <FormControl.Static>{dockerVersion || 'none'}</FormControl.Static>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <FormGroup controlId="dockerId">
                <ControlLabel>Docker ID</ControlLabel>
                <FormControl.Static>{dockerId || 'none'}</FormControl.Static>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <FormGroup controlId="parent">
                <ControlLabel>Parent</ControlLabel>
                <FormControl.Static>{parent || 'none'}</FormControl.Static>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={8}>
              <FormGroup controlId="entryPoint">
                <ControlLabel>Entrypoint</ControlLabel>
                <FormControl.Static>{entryPoint || 'none'}</FormControl.Static>
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup controlId="tty">
                <ControlLabel>Tty</ControlLabel>
                <FormControl.Static>{tty || 'false'}</FormControl.Static>
              </FormGroup>
            </Col>
          </Row>

          <Tabs defaultActiveKey={1} id="tabs">
            {envVars}
            {exposedPorts}
          </Tabs>

          <Row>
            <Col sm={12}>
              <FormGroup controlId="comment">
                <ControlLabel>Comment</ControlLabel>
                <FormControl.Static>{comment || 'none'}</FormControl.Static>
              </FormGroup>
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <div>
        <PageTitle text={title} />
        
        <Grid>
          <ButtonToolbar>
            <ButtonGroup>
              <Button bsStyle="primary" onClick={this.handleClose}>Close</Button>
              <Button onClick={this.handleSave}>Save</Button>
              <Button onClick={this.handleDelete}>Delete</Button>
            </ButtonGroup>

            <ButtonGroup>
              <Button onClick={this.handlePull}>Pull</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Grid>
        
        <Grid>
          <form>
            <Row>
              <Col sm={8}>
                <FormGroup controlId="name">
                  <ControlLabel>Name</ControlLabel>
                  <FormControl
                    type="text"
                    value={data.name}
                    name="name"
                    placeholder="Enter name"
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
              <Col sm={4}>
                <FormGroup controlId="tag">
                  <ControlLabel>Tag</ControlLabel>
                  <FormControl
                    type="text"
                    value={data.tag}
                    name="tag"
                    placeholder="Enter tag"
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col sm={12}>
                <FormGroup controlId="source">
                  <ControlLabel>Source</ControlLabel>
                  <InputGroup>
                    <FormControl
                      type="text"
                      value={data.source}
                      placeholder="Enter source"
                    />
                    <InputGroup.Addon onClick={() => this.handleChange('source')}>...</InputGroup.Addon>
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
          </form>

          {info}
        </Grid>
      </div>
    );
  }
}

Image.propTypes = {
  images: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  fetchImage: PropTypes.func.isRequired,
  createImage: PropTypes.func.isRequired,
  changeImage: PropTypes.func.isRequired,
  deleteImage: PropTypes.func.isRequired,
};

export default connect(state => ({
  images: state.images,
}), {
  fetchImage,
  createImage,
  changeImage,
  deleteImage,
})(Image);
