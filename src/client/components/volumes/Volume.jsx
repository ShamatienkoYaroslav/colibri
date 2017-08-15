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
} from 'react-bootstrap';

import { fetchVolume, createVolume, changeVolume, deleteVolume } from '../../actions/volumes';
import { dialog } from '../../utils';

import { PageTitle, Icon } from '../elements';

const Types = {
  BIND: 'bind',
  VOLUME: 'volume',
};

class Volume extends Component {
  constructor(props) {
    super(props);

    this.mainUrl = '/volumes';
    this.id = this.props.match.params.id;

    this.state = {
      new: !this.id,
      modified: false,
      data: {
        name: '',
        type: !this.id ? Types.BIND : '',
        hostDir: '',
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
      this.props.fetchVolume(this.id);
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
    const collection = this.props.volumes.data;
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
      this.state.modified = true;
      this.setState({
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
      this.props.createVolume({ ...this.state.data, id: this.id });
    } else {
      this.props.changeVolume(this.id, this.getData());
    }
    this.props.fetchVolume(this.id);

    this.props.history.push(`${this.mainUrl}/${this.id}`);

    this.setState({ modified: false, new: false });
  }

  handleDelete() {
    const data = this.getData();
    dialog.showQuestionDialog(
      `Do you want to delete the image <strong>${data.name}</strong>?`,
      () => {
        this.props.deleteVolume(this.id);
        this.goBack();
      },
    );
  }

  render() {
    const data = this.getData();

    const title = `${data.name} ${this.state.modified || this.state.new ? '*' : ''}`;

    let hostDir = null;
    if (data.type === Types.BIND) {
      hostDir = (
        <Row>
          <Col sm={12}>
            <FormGroup controlId="hostDir">
              <ControlLabel>Host Directory</ControlLabel>
              <FormControl
                type="text"
                value={data.hostDir}
                name="hostDir"
                placeholder="Enter host directory"
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
        </Row>
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
                <FormGroup controlId="type">
                  <ControlLabel>Type</ControlLabel>
                  <FormControl
                    componentClass="select"
                    placeholder="Select type"
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

            {hostDir}
          </form>
        </Grid>
      </div>
    );

  }
}

Volume.propTypes = {
  volumes: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
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
