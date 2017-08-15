import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Table, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import { fetchImages, deleteImage, pruneImages, clarifyImages } from '../../actions/images';
import { fetchSources } from '../../actions/sources';
import { dialog, tables } from '../../utils';
import {
  deleteImage as deleteImageDialog,
  pullImage as pullImageDialog,
} from './methods';

import { PageTitle, Icon } from '../elements';

class Images extends Component {
  constructor(props) {
    super(props);

    this.url = '/images';

    this.state = { activeRow: null };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleReload = this.handleReload.bind(this);
    this.handlePrune = this.handlePrune.bind(this);
    this.handleSynchronize = this.handleSynchronize.bind(this);
    this.handlePull = this.handlePull.bind(this);
  }

  componentDidMount() {
    this.props.fetchSources();
    this.props.fetchImages();
  }

  handleOnClick(activeRow) {
    this.setState({ activeRow });
  }

  handleDoubleClick(e) {
    this.props.history.push(`${this.url}/${this.state.activeRow}`);
  }

  handleDelete() {
    const activeRow = this.state.activeRow;
    const data = tables.getTableElementById(this.props.images.data, activeRow);
    if (data) {
      deleteImageDialog(this, activeRow, data.name, data.tag);
    }
  }

  handleCreate() {
    this.props.history.push(`${this.url}/new`);
  }

  handleReload() {
    this.props.fetchSources();
    this.props.fetchImages();
    this.setState({ activeRow: null });
  }

  handlePrune() {
    dialog.showQuestionDialog(
      'Do you want to prune images?',
      () => {
        this.props.pruneImages();
        this.setState({ activeRow: null });
      },
    );
  }

  handleSynchronize() {
    dialog.showQuestionDialog(
      'Do you want to synchronize images?',
      () => {
        this.props.clarifyImages();
        this.setState({ activeRow: null });
      },
    );
  }

  handlePull() {
    const activeRow = this.state.activeRow;
    const data = tables.getTableElementById(this.props.images.data, activeRow);
    if (data) {
      pullImageDialog(this, activeRow, data.name, data.tag);
    }
  }

  render() {
    const activeRow = this.state.activeRow;
    const { data, isFetched } = this.props.images;

    let elementToRender = 'Loading...';

    if (isFetched) {
      const rows = data.map((element) => {
        const { id, name, tag, source } = element;
        const sourceData = tables.getTableElementById(this.props.sources.data, source);
        let sourceName = '';
        if (sourceData) {
          sourceName = sourceData.name;
        }
        return (
          <tr
            key={data.indexOf(element)}
            className={id === activeRow ? 'active' : ''}
            onClick={() => this.handleOnClick(id)}
            onDoubleClick={this.handleDoubleClick}
          >
            <td>{`${name}:${tag}`}</td>
            <td>{`${sourceName}`}</td>
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

            <ButtonGroup>
              <Button onClick={this.handleSynchronize}>
                <Icon.Sync />
                Synchronize
              </Button>
              <Button onClick={this.handlePrune}>
                <Icon.Prune />
                Prune
              </Button>
            </ButtonGroup>

            <ButtonGroup>
              <Button disabled={activeRow === null} onClick={this.handlePull}>
                <Icon.Pull />
                Pull
              </Button>
            </ButtonGroup>
          </ButtonToolbar>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Source</th>
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
        <PageTitle text="Images" />
        <Grid>
          {elementToRender}
        </Grid>
      </div>
    );
  }
}

Images.propTypes = {
  history: PropTypes.shape().isRequired,
  images: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,

  fetchImages: PropTypes.func.isRequired,
  deleteImage: PropTypes.func.isRequired,
  pruneImages: PropTypes.func.isRequired,
  clarifyImages: PropTypes.func.isRequired,
  fetchSources: PropTypes.func.isRequired,
};

export default connect(state => ({
  images: state.images,
  sources: state.sources,
}), {
  fetchImages,
  deleteImage,
  pruneImages,
  clarifyImages,
  fetchSources,
})(Images);