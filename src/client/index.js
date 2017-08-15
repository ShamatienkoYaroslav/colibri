/* eslint-disable no-undef */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './styles/sweetalert2.min.css';
import '../../node_modules/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff2';
import '../../node_modules/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff';
import '../../node_modules/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.svg';
import '../../node_modules/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.eot';
import '../../node_modules/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.ttf';

import store from './store';

import Base from './components/Base';

ReactDOM.render(
  <Provider store={store}>
    <Base />
  </Provider>,
  document.getElementById('app'),
);
