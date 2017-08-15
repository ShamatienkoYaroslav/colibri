import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuid from 'uuid';
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
} from 'react-bootstrap';

import { fetchSource, createSource, changeSource, deleteSource } from '../../actions/sources';
import { dialog } from '../../utils';

import { PageTitle, Icon } from '../elements';

const Resources = {
  DOCKER_HUB: 'docker-hub',
  FTP: 'ftp',
};

class Source extends Component {
  constructor(props) {
    super(props);

    this.mainUrl = '/sources';
    this.id = this.props.match.params.id;

    this.state = {
      new: !this.id,
      modified: false,
      data: {
        name: '',
        resource: !this.id ? Resources.DOCKER_HUB : '',
        host: '',
        port: '',
        user: '',
        password: '',
        filename: '',
      },
    };

    this.getData = this.getData.bind(this);
    this.getDataById = this.getDataById.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    if (!this.state.new) {
      this.props.fetchSource(this.id);
    }
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
    const collection = this.props.sources.data;
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
        modified: true,
        data: {
          ...this.state.data,
          [e.target.name]: e.target.value,
        },
      });
    }
  }

  handleClose() {
    if (this.state.modified) {
      dialog.showOnCloseDialog(this.goBack);
    } else {
      this.goBack();
    }
  }

  handleSave() {
    if (this.state.new) {
      this.id = uuid();
      this.props.createSource({ ...this.state.data, id: this.id });
    } else {
      this.props.changeSource(this.id, this.getData());
    }
    this.props.fetchSource(this.id);

    this.props.history.push(`${this.mainUrl}/${this.id}`);

    this.setState({ modified: false, new: false });
  }

  handleDelete() {
    const data = this.getData();
    dialog.showQuestionDialog(
      `Do you want to delete the source <strong>${data.name}</strong>?`,
      () => {
        this.props.deleteSource(this.id);
        this.goBack();
      },
    );
  }

  render() {
    const data = this.getData();

    const title = `${data.name} ${this.state.modified || this.state.new ? '*' : ''}`;

    let ftp = null;
    if (data.resource === Resources.FTP) {
      ftp = (
        <div>
          <h4>FTP Settings</h4>
          <Row>
            <Col sm={8}>
              <FormGroup controlId="host">
                <ControlLabel>Host</ControlLabel>
                <FormControl
                  type="text"
                  value={data.host}
                  name="host"
                  placeholder="Enter host"
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
            
            <Col sm={4}>
              <FormGroup controlId="port">
                <ControlLabel>Port</ControlLabel>
                <FormControl
                  type="number"
                  value={data.port}
                  name="port"
                  placeholder="Enter port"
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <FormGroup controlId="user">
                <ControlLabel>User</ControlLabel>
                <FormControl
                  type="text"
                  value={data.user}
                  name="user"
                  placeholder="Enter user"
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup controlId="password">
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  type="password"
                  value={data.password}
                  name="password"
                  placeholder="Enter password"
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <FormGroup controlId="filename">
                <ControlLabel>Filename</ControlLabel>
                <FormControl
                  type="text"
                  value={data.filename}
                  name="filename"
                  placeholder="Enter filename"
                  onChange={this.handleChange}
                />
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
              <Button bsStyle="primary" onClick={this.handleClose}>
                <Icon.Close />
                Close
              </Button>
              <Button onClick={this.handleSave}>
                <Icon.Save />
                Save
              </Button>
              <Button onClick={this.handleDelete}>
                <Icon.Delete />
                Delete
              </Button>
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
                <FormGroup controlId="resource">
                  <ControlLabel>Resource</ControlLabel>
                  <FormControl
                    componentClass="select"
                    placeholder="Select resource"
                    name="resource"
                    value={data.resource}
                    onChange={this.handleChange}
                  >
                    <option value={Resources.DOCKER_HUB}>Docker Hub</option>
                    <option value={Resources.FTP}>FTP</option>
                  </FormControl>
                </FormGroup>
              </Col>
            </Row>

            {ftp}
          </form>
        </Grid>
      </div>
    );

  }
}

Source.propTypes = {
  sources: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,

  fetchSource: PropTypes.func.isRequired,
  createSource: PropTypes.func.isRequired,
  changeSource: PropTypes.func.isRequired,
  deleteSource: PropTypes.func.isRequired,
};

export default connect(state => ({
  sources: state.sources,
}), {
  fetchSource,
  createSource,
  changeSource,
  deleteSource,
})(Source);
