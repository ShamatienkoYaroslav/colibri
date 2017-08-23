import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Table, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import { fetchSources, deleteSource } from '../../actions/sources';
import { dialog } from '../../utils';

import { PageTitle, Icon, Spinner } from '../elements';

const Resources = {
  DOCKER_HUB: 'docker-hub',
  FTP: 'ftp',
};

class Sources extends Component {
  constructor(props) {
    super(props);

    this.url = '/sources';

    this.state = { activeRow: null };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleReload = this.handleReload.bind(this);
  }

  componentDidMount() {
    this.props.fetchSources();
  }

  handleOnClick(activeRow) {
    this.setState({ activeRow });
  }

  handleDoubleClick() {
    this.props.history.push(`${this.url}/${this.state.activeRow}`);
  }

  handleDelete() {
    let data = null;
    for (let i = 0; i < this.props.sources.data.length; i += 1) {
      const currentSource = this.props.sources.data[i];
      if (this.state.activeRow === currentSource.id) {
        data = currentSource;
      }
    }
    if (data) {
      dialog.showQuestionDialog(
        `Do you want to delete the source <strong>${data.name}</strong>?`,
        () => {
          this.props.deleteSource(this.state.activeRow);
          this.setState({ activeRow: null });
        },
      );
    }
  }

  handleCreate() {
    this.props.history.push(`${this.url}/new`);
  }

  handleReload() {
    this.props.fetchSources();
    this.setState({ activeRow: null });
  }

  render() {
    const haveErrors = dialog.showError(this.props.sources);

    const activeRow = this.state.activeRow;
    const { data, isFetched } = this.props.sources;

    let elementToRender = <Spinner />;

    if (isFetched && !haveErrors) {
      const rows = data.map((element) => {
        const { id, name, resource } = element;
        let resourceText = 'Docker Hub';
        if (resource === Resources.FTP) {
          resourceText = 'FTP';
        }
        return (
          <tr
            key={data.indexOf(element)}
            className={id === activeRow ? 'active' : ''}
            onClick={() => this.handleOnClick(id)}
            onDoubleClick={this.handleDoubleClick}
          >
            <td>{`${name}`}</td>
            <td>{`${resourceText}`}</td>
          </tr>
        );
      });

      elementToRender = (
        <div>
          <ButtonToolbar>
            <ButtonGroup>
              <Button bsStyle="primary" onClick={this.handleCreate}>
                <Icon.Close />
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
                <th>
                  Name
                </th>
                <th>
                  Resource
                </th>
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
        <PageTitle text="Sources" />
        <Grid>
          {elementToRender}
        </Grid>
      </div>
    );
  }
}

Sources.propTypes = {
  history: PropTypes.shape().isRequired,
  sources: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,

  fetchSources: PropTypes.func.isRequired,
  deleteSource: PropTypes.func.isRequired,
};

export default connect(state => ({
  sources: state.sources,
}), {
  fetchSources,
  deleteSource,
})(Sources);
