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

import { fetchUser, createUser, changeUser, deleteUser } from '../../actions/users';
import { dialog, tables, objects } from '../../utils';
import {
  deleteUser as deleteUserDialog,
  getRoles,
} from './methods';

import { PageTitle, Icon } from '../elements';

const Roles = getRoles();

class User extends Component {
  constructor(props) {
    super(props);

    this.mainUrl = '/settings/users';
    this.id = this.props.match.params.id;

    this.state = {
      new: !this.id,
      modified: false,
      data: {
        name: null,
        password: null,
        role: !this.id ? Roles.READ : null,
      },
    };

    this.getData = this.getData.bind(this);
    this.getDataById = this.getDataById.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    if (!this.state.new) {
      this.props.fetchUser(this.id);
    }
  }

  getData() {
    return objects.merge(this.getDataById(), this.state.data );
  }

  getDataById() {
    return tables.getTableElementById(this.props.users.data, this.id) || {};
  };

  goBack() {
    this.props.history.push(this.mainUrl);
  }

  handleChange(e) {
    this.setState({
      modified: true,
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value,
      },
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
    if (this.state.new) {
      this.id = uuid();
      this.props.createUser({ ...this.state.data, id: this.id });
    } else {
      this.props.changeUser(this.id, this.getData());
    }
    this.props.fetchUser(this.id);

    this.props.history.push(`${this.mainUrl}/${this.id}`);

    this.setState({ modified: false, new: false });
  }

  render() {
    const data = this.getData();
    const title = `${data.name} ${this.state.modified || this.state.new ? '*' : ''}`;

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
              <Button onClick={() => deleteUserDialog(this, this.id, data.name, false)}>
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
                <FormGroup controlId="role">
                  <ControlLabel>Role</ControlLabel>
                  <FormControl
                    componentClass="select"
                    placeholder="Select role"
                    name="role"
                    value={data.role}
                    onChange={this.handleChange}
                  >
                    <option value={Roles.ADMIN}>Admin</option>
                    <option value={Roles.CHANGE}>Change</option>
                    <option value={Roles.READ}>Read</option>
                  </FormControl>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
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
            
          </form>
        </Grid>
      </div>
    );
  }
}

User.propTypes = {
  users: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,

  fetchUser: PropTypes.func.isRequired,
  createUser: PropTypes.func.isRequired,
  changeUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
};

export default connect(state => ({
  users: state.users,
}), {
  fetchUser,
  createUser,
  changeUser,
  deleteUser,
})(User);