import React from 'react';
import Halogen from 'halogen';

import constants from '../../constants';

const Spinner = () => (
  <div className="spinner">
    <Halogen.MoonLoader color={constants.BRAND_COLOR} />
  </div>
);

export default Spinner;
