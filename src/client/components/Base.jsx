import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import LoginPage from './LoginPage';
import Nav from './Nav';
import Containers from './Containers';
import { ImagesRouter } from './images/';
import ImageSources from './ImageSources';
import Templates from './Templates';
import Volumes from './Volumes';

const PrivateRoute = ({ component: Component, authed, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (authed) {
        return <Component {...props} />;
      }
      return <Redirect to="/login" />;
    }}
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  authed: PropTypes.bool.isRequired,
};

const Base = ({ authed }) => (
  <Router>
    <div className="container-fluid">
      {authed ? <Nav /> : null}
      <Route
        exact
        path="/"
        render={() => {
          if (authed) {
            return <Redirect to="/containers" />;
          }
          return <Redirect to="/login" />;
        }}
      />
      <Route
        path="/login"
        render={() => {
          if (authed) {
            return <Redirect to="/" />;
          }
          return <LoginPage />;
        }}
      />

      <PrivateRoute path="/images" component={ImagesRouter} authed={authed} />
      <PrivateRoute path="/containers" component={Containers} authed={authed} />
      <PrivateRoute path="/imagesources" component={ImageSources} authed={authed} />
      <PrivateRoute path="/templates" component={Templates} authed={authed} />
      <PrivateRoute path="/volumes" component={Volumes} authed={authed} />
    </div>
  </Router>
);

Base.propTypes = {
  authed: PropTypes.bool.isRequired,
};

export default connect(state => ({
  authed: state.users.loggedIn,
}))(Base);
