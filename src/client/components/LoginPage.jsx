import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col, Row, FormGroup, ControlLabel, FormControl, Button, HelpBlock } from 'react-bootstrap';

import { login, fetchUsers } from '../actions/users';

import logo from '../images/logo.svg';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: '',
      password: '',
    };

    this.authorizeUser = this.authorizeUser.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  getValidationState() {
    if (this.props.users.e) {
      return 'error';
    }
    return null;
  }

  authorizeUser(e) {
    e.preventDefault();

    const { user, password } = this.state;
    this.props.login(user, password);
  }

  handleInputChange(e) {
    e.preventDefault();

    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {
    const users = this.props.users.data;
    const usersToSelect = users.map(user => (
      <option key={user.id} value={user.name} >{ user.name }</option>
    ));
    usersToSelect.unshift(<option key={''} disabled value={''}>Select user</option>);

    let helpText;
    const validationState = this.getValidationState();
    if (validationState === 'error') {
      helpText = 'Incorect password';
    }

    return (
      <Grid>
        <Row>
          <Col sm={4} smOffset={4}>
            <div className="login-page">
              <img src={logo} />    

              <h2>Colibri</h2>

              <form onSubmit={this.authorizeUser}>
                <FormGroup validationState={validationState}>
                  <ControlLabel>User</ControlLabel>
                  <FormControl
                    componentClass="select"
                    placeholder="User"
                    name="user"
                    value={this.state.user}
                    onChange={this.handleInputChange}
                  >
                    { usersToSelect }
                  </FormControl>
                </FormGroup>
                <FormGroup validationState={validationState}>
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={this.handleInputChange}
                  />
                  <HelpBlock>{helpText}</HelpBlock>
                </FormGroup>
      
                <Button bsStyle="primary" type="submit">Login</Button>
              </form>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

LoginPage.defaultProps = {
  users: {
    e: '',
  },
};

LoginPage.propTypes = {
  login: PropTypes.func.isRequired,
  users: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFetched: PropTypes.bool.isRequired,
    e: PropTypes.string,
  }).isRequired,

  fetchUsers: PropTypes.func.isRequired,
};

export default connect(state => ({
  users: state.users,
}), { login, fetchUsers })(LoginPage);
