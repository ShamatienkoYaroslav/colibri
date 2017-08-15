import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const NotFoundPage = ({ location: { pathname } }) => {
  return (
    <div className="not-found">
      <h1>Ooops...</h1>
      <h4>Can&apos;t find page &ldquo;{pathname}&rdquo;</h4>
      <h5>But you can go to <Link to="/containers">containers</Link></h5>
    </div>
  );
}

NotFoundPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default NotFoundPage;