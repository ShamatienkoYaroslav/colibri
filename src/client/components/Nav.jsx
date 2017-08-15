import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Nav, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { logout } from '../actions/users';
import { Auth } from '../utils';
import { Icon } from './elements';

const handleLogout = (e, logoutFunc) => {
  e.preventDefault();
  logoutFunc();
};

const NavigationLink = ({ to, active, title, onClick }) => (
  <li className={active ? 'active' : ''} onClick={onClick}>
    <NavLink to={to}>{title}</NavLink>
  </li>
)

NavigationLink.propTypes = {
  to: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = { pathname: document.location.pathname };

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect() {
    this.setState({ pathname: document.location.pathname });
  }

  render() {
    const { user, logout: logoutFunc } = this.props;
    const userIsAdmin = Auth.userIsAdmin();

    let divider = null;
    let settings = null;
    if (userIsAdmin) {
      settings = (
        <LinkContainer to="/settings">
          <MenuItem>
            <Icon glyph="cog" />
            Settings
          </MenuItem>
        </LinkContainer>
      );

      divider = (<MenuItem divider />);
    }

    return (
      <Navbar fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            Colibri
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavigationLink
              to="/containers"
              title="Containers"
              active={this.state.pathname === "/containers"}
              onClick={this.handleSelect}
            />
            <NavigationLink
              to="/images"
              title="Images"
              active={this.state.pathname === "/images"}
              onClick={this.handleSelect}
            />
            <NavigationLink
              to="/sources"
              title="Sources"
              active={this.state.pathname === "/sources"}
              onClick={this.handleSelect}
            />
            <NavigationLink
              to="/templates"
              title="Templates"
              active={this.state.pathname === "/templates"}
              onClick={this.handleSelect}
            />
            <NavigationLink
              to="/volumes"
              title="Volumes"
              active={this.state.pathname === "/volumes"}
              onClick={this.handleSelect}
            />
          </Nav>
          <Nav pullRight>
            <NavDropdown title={user.name} id="basic-nav-dropdown">
              {settings}
              {divider}
              <LinkContainer to="/login">
                <MenuItem
                  onClick={e => handleLogout(e, logoutFunc)}
                >
                  <Icon glyph="log-out" />
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
