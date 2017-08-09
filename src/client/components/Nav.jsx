import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Nav, NavItem, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { logout } from '../actions/users';

const handleLogout = (e, logoutFunc) => {
  e.preventDefault();
  logoutFunc();
};

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = { activeKey: 1 };

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  render() {
    const activeKey = this.state.activeKey;
    const { user, logout: logoutFunc } = this.props;
    return (
      <Navbar fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            Colibri
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav activeKey={activeKey} onSelect={this.handleSelect}>
            <LinkContainer to="/containers">
              <NavItem eventKey={1} >Containers</NavItem>
            </LinkContainer>
            <LinkContainer to="/images">
              <NavItem eventKey={2}>Images</NavItem>
            </LinkContainer>
            <LinkContainer to="/imagesources">
              <NavItem eventKey={3}>Image Sources</NavItem>
            </LinkContainer>
            <LinkContainer to="/templates">
              <NavItem eventKey={4}>Templates</NavItem>
            </LinkContainer>
            <LinkContainer to="/volumes">
              <NavItem eventKey={5}>Volumes</NavItem>
            </LinkContainer>
          </Nav>
          <Nav activeKey={activeKey} pullRight onSelect={this.handleSelect}>
            <NavDropdown eventKey={6} title={user.name} id="basic-nav-dropdown">
              <MenuItem eventKey={6.1} >Settings</MenuItem>
              <LinkContainer to="/login">
                <MenuItem
                  eventKey={6.2}
                  onClick={e => handleLogout(e, logoutFunc)}
                >
                  Logout
                </MenuItem>
              </LinkContainer>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

NavBar.propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(state => ({
  user: state.users.user,
}), { logout })(NavBar);
