import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import LoginPage from './LoginPage';
import Nav from './Nav';
import ContainersRouter from './containers/ContainersRouter';
import ImagesRouter from './images/ImagesRouter';
import SourcesRouter from './sources/SourcesRouter';
import TemplatesRouter from './templates/TemplatesRouter';
import VolumesRouter from './volumes/VolumesRouter';
import SettingsRouter from './settings/SettingsRouter';
import NotFoundPage from './NotFoundPage';

import { Auth } from '../utils';

const AdminRoute = ({ children }) => {
  if (Auth.userIsAdmin()) {
    return children;
  }
  return <Redirect to="/containers" />;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

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
      <Switch>
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
              return <Redirect to="/containers" />;
            }
            return <LoginPage />;
          }}
        />

        <PrivateRoute path="/images" component={ImagesRouter} authed={authed} />
        <PrivateRoute path="/containers" component={ContainersRouter} authed={authed} />
        <PrivateRoute path="/sources" component={SourcesRouter} authed={authed} />
        <PrivateRoute path="/templates" component={TemplatesRouter} authed={authed} />
        <PrivateRoute path="/volumes" component={VolumesRouter} authed={authed} />
        <AdminRoute>
          <PrivateRoute path="/settings" component={SettingsRouter} authed={authed} />
        </AdminRoute>
        <PrivateRoute component={NotFoundPage} authed={authed} />
      </Switch>
    </div>
  </Router>
);

Base.propTypes = {
  authed: PropTypes.bool.isRequired,
};

export default connect(state => ({
  authed: state.users.loggedIn,
}))(Base);
