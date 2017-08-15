import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from 'react-bootstrap';

import { PageTitle } from '../elements';

const Settings = () => (
  <div>
    <PageTitle text="Settings" />
    <Grid>
      <Link to="/settings/users">Users</Link>
    </Grid>
  </div>
);

export default Settings;