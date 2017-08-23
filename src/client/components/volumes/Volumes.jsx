import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Table, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import { fetchVolumes, deleteVolume, pruneVolumes, synchronizeVolumes } from '../../actions/volumes';
import { dialog } from '../../utils';

import { PageTitle, Icon, Spinner } from '../elements';

class Volumes extends Component {
  constructor(props) {
    super(props);

    this.url = '/volumes';

    this.state = { activeRow: null };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleReload = this.handleReload.bind(this);
    this.handlePrune = this.handlePrune.bind(this);
    this.handleSynchronize = this.handleSynchronize.bind(this);
  }

  componentDidMount() {
    this.props.fetchVolumes();
  }

  handleOnClick(activeRow) {
    this.setState({ activeRow });
  }

  handleDoubleClick() {
    this.props.history.push(`${this.url}/${this.state.activeRow}`);
  }

  handleDelete() {
    let data = null;
    for (let i = 0; i < this.props.volumes.data.length; i += 1) {
      const currentVolume = this.props.volumes.data[i];
      if (this.state.activeRow === currentVolume.id) {
        data = currentVolume;
      }
    }
    if (data) {
      dialog.showQuestionDialog(
        `Do you want to delete the volume <strong>${data.name}</strong>?`,
        () => {
          this.props.deleteVolume(this.state.activeRow);
          this.setState({ activeRow: null });
        },
      );
    }
  }

  handleCreate() {
    this.props.history.push(`${this.url}/new`);
  }

  handleReload() {
    this.props.fetchVolumes();
    this.setState({ activeRow: null });
  }

  handlePrune() {
    dialog.showQuestionDialog(
      'Do you want to prune volumes?',
      () => {
        this.props.pruneVolumes();
        this.setState({ activeRow: null });
      },
    );
  }

  handleSynchronize() {
    dialog.showQuestionDialog(
      'Do you want to synchronize volumes?',
      () => {
        this.props.synchronizeVolumes();
        this.setState({ activeRow: null });
      },
    );
  }

  render() {
    const haveErrors = dialog.showError(this.props.volumes);

    const activeRow = this.state.activeRow;
    const { data, isFetched } = this.props.volumes;

    let elementToRender = <Spinner />;

    if (isFetched && !haveErrors) {
      const rows = data.map((element) => {
        const { id, name, type } = element;
        return (
          <tr
            key={data.indexOf(element)}
            className={id === activeRow ? 'active' : ''}
            onClick={() => this.handleOnClick(id)}
            onDoubleClick={this.handleDoubleClick}
          >
            <td>{`${name}`}</td>
            <td>{`${type}`}</td>
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

            <ButtonToolbar>
              <ButtonGroup>
                <Button onClick={this.handleSynchronize}>
                  <Icon.Sync />
                  Synchronize
                </Button>
                <Button onClick={this.handlePrune}>
                  <Icon.Prune />
                  Delete Unused
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </ButtonToolbar>

          <Table responsive hover>
            <thead>
              <tr>
                <th>
                  Name
                </th>
                <th>
                  Type
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
        <PageTitle text="Volumes" />
        <Grid>
          {elementToRender}
        </Grid>
      </div>
    );
  }
}

Volumes.propTypes = {
  history: PropTypes.shape().isRequired,
  volumes: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,

  fetchVolumes: PropTypes.func.isRequired,
  deleteVolume: PropTypes.func.isRequired,
  pruneVolumes: PropTypes.func.isRequired,
  synchronizeVolumes: PropTypes.func.isRequired,
};

export default connect(state => ({
  volumes: state.volumes,
}), {
  fetchVolumes,
  deleteVolume,
  pruneVolumes,
  synchronizeVolumes,
})(Volumes);
