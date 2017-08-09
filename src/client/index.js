/* eslint-disable no-undef */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './styles/sweetalert2.min.css';

import store from './store';

import Base from './components/Base';

ReactDOM.render(
  <Provider store={store}>
    <Base />
  </Provider>,
  document.getElementById('app'),
);
