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
import { dialog, tables, validator } from '../../utils';
import {
  deleteUser as deleteUserDialog,
  getRoles,
} from './methods';

import { PageTitle, Icon, Spinner } from '../elements';

const Roles = getRoles();

const validateField = (data, field) => {
  if (field === 'name') {
    return validator.validateField('name', data.name, 'Name is required');
  } else if (field === 'password') {
    return validator.validateField('password', data.password, 'Password is required');
  } else if (field === 'role') {
    return validator.validateField('role', data.role, 'Role is required');
  }
  return null;
};

const validate = data => (
  validator.generateErrors([
    validateField(data, 'name'),
    validateField(data, 'password'),
    validateField(data, 'role'),
  ])
);

class User extends Component {
  constructor(props) {
    super(props);

    this.mainUrl = '/settings/users';
    this.id = this.props.match.params.id;
    this.shouldReceiveProps = false;

    this.state = {
      new: !this.id,
      modified: false,
      data: this.getDataById(this.props.users.data),
      e: {},
    };

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

  componentWillReceiveProps(nextProps) {
    if (!nextProps.users.propsReady) {
      this.shouldReceiveProps = true;
    }

    if (this.shouldReceiveProps && nextProps.users.propsReady) {
      this.setState({ data: this.getDataById(nextProps.users.data) });
      this.shouldReceiveProps = false;
    }
  }

  getDataById(table) {
    return tables.getTableElementById(table, this.id) || {
      name: '',
      password: '',
      role: !this.id ? Roles.CHANGE : '',
    };
  }

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
      if (this.state.new) {
        this.id = uuid();
        this.props.createUser({ ...this.state.data, id: this.id });
      } else {
        this.props.changeUser(this.id, this.state.data);
      }
      this.props.fetchUser(this.id);

      this.props.history.push(`${this.mainUrl}/${this.id}`);

      this.setState({ modified: false, new: false });
    }
  }

  render() {
    const haveErrors = dialog.showError(this.props.users, this.goBack);

    let elementToRender = <Spinner />;
    if (this.props.users.isFetched && !haveErrors) {
      const { data, e } = this.state;
      const title = `${data.name} ${this.state.modified || this.state.new ? '*' : ''}`;

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
                  <FormGroup controlId="role" validationState={validator.getValidationState(e.role)}>
                    <ControlLabel>Role</ControlLabel>
                    <FormControl
                      componentClass="select"
                      placeholder={validator.getValidationMessage(e.role) || 'Select role'}
                      name="role"
                      value={data.role}
                      onChange={this.handleChange}
                    >
                      <option value={Roles.ADMIN}>Admin</option>
                      <option value={Roles.CHANGE}>User</option>
                    </FormControl>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
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

User.propTypes = {
  users: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
    propsReady: PropTypes.bool.isRequired,
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