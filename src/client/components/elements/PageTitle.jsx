import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-bootstrap';

const PageTitle = ({ text }) => (
  <Grid>
    <h4 className="page-title">{text}</h4>
  </Grid>
);

PageTitle.propTypes = {
  text: PropTypes.string.isRequired,
};

export default PageTitle;
