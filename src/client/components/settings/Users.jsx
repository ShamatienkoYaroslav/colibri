import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Table, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import { fetchUsers, deleteUser } from '../../actions/users';
import { dialog, tables } from '../../utils';
import {
  deleteUser as deleteUserDialog,
  getRoles,
} from './methods';

import { PageTitle, Icon, Spinner} from '../elements';

const getRole = (role) => {
  const Roles = getRoles();
  if (role === Roles.ADMIN) {
    return 'Admin';
  } else if (role === Roles.CHANGE) {
    return 'User';
  }
};

class Users extends Component {
  constructor(props) {
    super(props);

    this.url = '/settings/users';

    this.state = { activeRow: null };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleReload = this.handleReload.bind(this);
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  handleOnClick(activeRow) {
    this.setState({ activeRow });
  }

  handleDoubleClick() {
    this.props.history.push(`${this.url}/${this.state.activeRow}`);
  }

  handleDelete() {
    const activeRow = this.state.activeRow;
    const data = tables.getTableElementById(this.props.users.data, activeRow);
    if (data) {
      deleteUserDialog(this, activeRow, data.name);
    }
  }

  handleCreate() {
    this.props.history.push(`${this.url}/new`);
  }

  handleReload() {
    this.props.fetchUsers();
    this.setState({ activeRow: null });
  }

  render() {
    const haveErrors = dialog.showError(this.props.users);

    const activeRow = this.state.activeRow;
    const { data, isFetched } = this.props.users;

    let elementToRender = <Spinner />;

    if (isFetched && !haveErrors) {
      const rows = data.map((element) => {
        const { id, name, role } = element;
        return (
          <tr
            key={data.indexOf(element)}
            className={id === activeRow ? 'active' : ''}
            onClick={() => this.handleOnClick(id)}
            onDoubleClick={this.handleDoubleClick}
          >
            <td>{`${name}`}</td>
            <td>{getRole(role)}</td>
          </tr>
        );
      });

      elementToRender = (
        <div>
          <ButtonToolbar>
            <ButtonGroup>
              <Button bsStyle="primary" onClick={this.handleCreate}>
                <Icon.Create />
                Create
              </Button>
              <Button onClick={this.handleReload}>
                <Icon.Refresh />
                Reload
              </Button>
              <Button disabled={activeRow === null} onClick={this.handleDelete}>
                <Icon.Delete />
                Delete
              </Button>
            </ButtonGroup>
          </ButtonToolbar>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </Table>
        </div>
      );
    }

    return (
      <div>
        <PageTitle text="Users" />
        <Grid>
          {elementToRender}
        </Grid>
      </div>
    );
  }
}

Users.propTypes = {
  history: PropTypes.shape().isRequired,
  users: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,

  fetchUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
};

export default connect(state => ({
  users: state.users,
}), {
  fetchUsers,
  deleteUser,
})(Users);
