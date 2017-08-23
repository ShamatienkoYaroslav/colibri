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
  Checkbox,
} from 'react-bootstrap';

import { fetchSource, createSource, changeSource, deleteSource } from '../../actions/sources';
import { dialog, tables, validator } from '../../utils';

import { PageTitle, Icon, Spinner } from '../elements';

const Resources = {
  DOCKER_HUB: 'docker-hub',
  FTP: 'ftp',
};

const validateField = (data, field) => {
  if (field === 'name') {
    return validator.validateField('name', data.name, 'Name is required');
  } else if (field === 'resource') {
    return validator.validateField('resource', data.resource, 'Resource is required');
  } else if (field === 'host' && data.resource === Resources.FTP) {
    return validator.validateField('host', data.host, 'Host is required');
  } else if (field === 'port' && data.resource === Resources.FTP) {
    return validator.validateField('port', data.port, 'Port is required');
  } else if (field === 'user' && data.resource === Resources.FTP) {
    return validator.validateField('user', data.user, 'User is required');
  } else if (field === 'password' && data.resource === Resources.FTP) {
    return validator.validateField('password', data.password, 'Password is required');
  } else if (field === 'filename' && data.resource === Resources.FTP) {
    return validator.validateField('filename', data.filename, 'Filename is required');
  }
  return null;
};

const validate = data => (
  validator.generateErrors([
    validateField(data, 'name'),
    validateField(data, 'resource'),
    validateField(data, 'host'),
    validateField(data, 'port'),
    validateField(data, 'user'),
    validateField(data, 'password'),
    validateField(data, 'filename'),
  ])
);

class Source extends Component {
  constructor(props) {
    super(props);

    this.mainUrl = '/sources';
    this.id = this.props.match.params.id;
    this.shouldReceiveProps = false;

    this.state = {
      new: !this.id,
      modified: false,
      data: this.getDataById(this.props.sources.data, this.id),
      e: {},
    };

    this.getDataById = this.getDataById.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleHideChange = this.handleHideChange.bind(this);
  }

  componentDidMount() {
    if (!this.state.new) {
      this.props.fetchSource(this.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.sources.propsReady) {
      this.shouldReceiveProps = true;
    }

    if (this.shouldReceiveProps && nextProps.sources.propsReady) {
      this.setState({ data: this.getDataById(nextProps.sources.data) });
      this.shouldReceiveProps = false;
    }
  }

  getDataById(table) {
    return tables.getTableElementById(table, this.id) || {
      name: '',
      resource: !this.id ? Resources.DOCKER_HUB : '',
      host: '',
      port: '',
      user: '',
      password: '',
      filename: '',
      hide: false,
    };
  };

  goBack() {
    this.props.history.push(this.mainUrl);
  }

  handleChange(event) {
    const name = event.target.name;
    const data = {
      ...this.state.data,
      [name]: event.target.value,
    };
    const e = validator.generateNextErrorsState(this.state.e, name, validateField(data, name));
    this.setState({
      modified: true,
      data,
      e,
    });
  }

  handleClose() {
    if (this.state.modified) {
      dialog.showOnCloseDialog(this.goBack);
    } else {
      this.goBack();
    }
  }

  async handleSave() {
    const e = validate(this.state.data);
    if (Object.keys(e).length !== 0) {
      this.setState({ e });
    } else {
      if (this.state.new) {
        this.id = uuid();
        await this.props.createSource({ ...this.state.data, id: this.id });
      } else {
        await this.props.changeSource(this.id, this.state.data);
      }
      await this.props.fetchSource(this.id);

      this.props.history.push(`${this.mainUrl}/${this.id}`);

      this.setState({ modified: false, new: false });
    }
  }

  handleDelete() {
    const data = this.state.data;
    dialog.showQuestionDialog(
      `Do you want to delete the source <strong>${data.name}</strong>?`,
      () => {
        this.props.deleteSource(this.id);
        this.goBack();
      },
    );
  }

  handleHideChange(e) {
    const name = e.target.name;
    let value = e.target.value;
    if (name === 'hide') {
      if (this.state.data.hide) {
        value = false;
      } else {
        value = value === 'on';
      }
    }

    this.setState({
      modified: true,
      data: {
        ...this.state.data,
        hide: value,
      },
    });
  }

  render() {
    const haveErrors = dialog.showError(this.props.sources, this.goBack);

    let elementToRender = <Spinner />;
    if (this.props.sources.isFetched && !haveErrors) {
      const { data, e } = this.state;
      const title = `${data.name} ${this.state.modified || this.state.new ? '*' : ''}`;
  
      let ftp = null;
      if (data.resource === Resources.FTP) {
        ftp = (
          <div>
            <h4>FTP Settings</h4>
            <Row>
              <Col sm={8}>
                <FormGroup controlId="host" validationState={validator.getValidationState(e.host)}>
                  <ControlLabel>Host</ControlLabel>
                  <FormControl
                    type="text"
                    value={data.host}
                    name="host"
                    placeholder={validator.getValidationMessage(e.host) || 'Enter host'}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
              
              <Col sm={4}>
                <FormGroup controlId="port" validationState={validator.getValidationState(e.port)}>
                  <ControlLabel>Port</ControlLabel>
                  <FormControl
                    type="number"
                    value={data.port}
                    name="port"
                    placeholder={validator.getValidationMessage(e.port) || 'Enter port'}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
  
            <Row>
              <Col sm={6}>
                <FormGroup controlId="user" validationState={validator.getValidationState(e.user)}>
                  <ControlLabel>User</ControlLabel>
                  <FormControl
                    type="text"
                    value={data.user}
                    name="user"
                    placeholder={validator.getValidationMessage(e.user) || 'Enter user'}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
  
              <Col sm={6}>
                <FormGroup controlId="password" validationState={validator.getValidationState(e.password)}>
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    type="password"
                    value={data.password}
                    name="password"
                    placeholder={validator.getValidationMessage(e.password) || 'Enter password'}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
  
            <Row>
              <Col sm={12}>
                <FormGroup controlId="filename" validationState={validator.getValidationState(e.filename)}>
                  <ControlLabel>Filename</ControlLabel>
                  <FormControl
                    type="text"
                    value={data.filename}
                    name="filename"
                    placeholder={validator.getValidationMessage(e.filename) || 'Enter filename'}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
          </div>
        );
      }
  
      elementToRender = (
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
                  <FormGroup controlId="name" validationState={validator.getValidationState(e.name)}>
                    <ControlLabel>Name</ControlLabel>
                    <FormControl
                      type="text"
                      value={data.name}
                      name="name"
                      placeholder={validator.getValidationMessage(e.name) || 'Enter name'}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>
  
                <Col sm={4}>
                  <FormGroup controlId="resource" validationState={validator.getValidationState(e.resource)}>
                    <ControlLabel>Resource</ControlLabel>
                    <FormControl
                      componentClass="select"
                      placeholder={validator.getValidationMessage(e.resource) || 'Select resource'}
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
  
              <Row>
                <Col sm={1}>
                  <Checkbox
                    name="hide"
                    checked={data.hide}
                    onChange={this.handleHideChange}
                  >
                    Hiden
                  </Checkbox>
                </Col>
              </Row>
  
              {ftp}
            </form>
          </Grid>
        </div>
      );
    }

    return (
      <div>
        {elementToRender}
      </div>
    );
  }
}

Source.propTypes = {
  sources: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
    propsReady: PropTypes.bool.isRequired,
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
