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
  ButtonToolbar,
  ButtonGroup,
  Button,
  Checkbox,
} from 'react-bootstrap';

import { fetchVolume, createVolume, changeVolume, deleteVolume } from '../../actions/volumes';
import { dialog, tables, validator } from '../../utils';

import { PageTitle, Icon, Spinner } from '../elements';

const Types = {
  BIND: 'bind',
  VOLUME: 'volume',
};

const validateField = (data, field) => {
  if (field === 'name') {
    return validator.validateField('name', data.name, 'Name is required');
  } else if (field === 'type') {
    return validator.validateField('type', data.type, 'Type is required');
  } else if (field === 'hostDir' && data.type === Types.BIND) {
    return validator.validateField('hostDir', data.hostDir, 'Host direcroty is required');
  }
  return null;
};

const validate = data => (
  validator.generateErrors([
    validateField(data, 'name'),
    validateField(data, 'type'),
    validateField(data, 'hostDir'),
  ])
);

class Volume extends Component {
  constructor(props) {
    super(props);

    this.mainUrl = '/volumes';
    this.id = this.props.match.params.id;
    this.shouldReceiveProps = false;

    this.state = {
      new: !this.id,
      modified: false,
      data: this.getDataById(this.props.volumes.data),
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
      this.props.fetchVolume(this.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.volumes.propsReady) {
      this.shouldReceiveProps = true;
    }

    if (this.shouldReceiveProps && nextProps.volumes.propsReady) {
      this.setState({ data: this.getDataById(nextProps.volumes.data) });
      this.shouldReceiveProps = false;
    }
  }

  getDataById(table) {
    return tables.getTableElementById(table, this.id) || {
      name: '',
      type: !this.id ? Types.BIND : '',
      hostDir: '',
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

  handleSave() {
    const e = validate(this.state.data);
    if (Object.keys(e).length !== 0) {
      this.setState({ e });
    } else {
      const data = this.state.data;
      if (this.state.new) {
        this.id = uuid();
        this.props.createVolume({ ...data, id: this.id });
      } else {
        this.props.changeVolume(this.id, data);
      }
      this.props.fetchVolume(this.id);
  
      this.props.history.push(`${this.mainUrl}/${this.id}`);
  
      this.setState({ modified: false, new: false, e });
    }
  }

  handleDelete() {
    const data = this.state.data;
    dialog.showQuestionDialog(
      `Do you want to delete the image <strong>${data.name}</strong>?`,
      () => {
        this.props.deleteVolume(this.id);
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
    const haveErrors = dialog.showError(this.props.volumes, this.goBack);

    let elementToRender = <Spinner />;
    if (this.props.volumes.isFetched && !haveErrors) {
      const { data, e } = this.state;
      const title = `${data.name} ${this.state.modified || this.state.new ? '*' : ''}`;
  
      let hostDir = null;
      if (data.type === Types.BIND) {
        hostDir = (
          <Row>
            <Col sm={12}>
              <FormGroup controlId="hostDir" validationState={validator.getValidationState(e.hostDir)}>
                <ControlLabel>Host Directory</ControlLabel>
                <FormControl
                  type="text"
                  value={data.hostDir}
                  name="hostDir"
                  placeholder={validator.getValidationMessage(e.hostDir) || 'Enter host directory'}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
          </Row>
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
                  <FormGroup controlId="type" validationState={validator.getValidationState(e.type)}>
                    <ControlLabel>Type</ControlLabel>
                    <FormControl
                      componentClass="select"
                      placeholder={validator.getValidationMessage(e.type) || 'Select type'}
                      name="type"
                      value={data.type}
                      onChange={this.handleChange}
                    >
                      <option value={Types.BIND}>Bind</option>
                      <option value={Types.VOLUME}>Volume</option>
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
  
              {hostDir}
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

Volume.propTypes = {
  volumes: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
    propsReady: PropTypes.bool.isRequired,
  }).isRequired,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,

  fetchVolume: PropTypes.func.isRequired,
  createVolume: PropTypes.func.isRequired,
  changeVolume: PropTypes.func.isRequired,
  deleteVolume: PropTypes.func.isRequired,
};

export default connect(state => ({
  volumes: state.volumes,
}), {
  fetchVolume,
  createVolume,
  changeVolume,
  deleteVolume,
})(Volume);
