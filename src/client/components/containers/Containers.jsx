import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Table, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import {
  fetchContainers,
  deleteContainer,
  startContainer,
  stopContainer,
  synchronizeContainers,
  pruneContainers,
} from '../../actions/containers';
import { fetchImages } from '../../actions/images';
import { fetchTemplates } from '../../actions/templates';
import { dialog, tables } from '../../utils';
import {
  deleteContainer as deleteContainerDialog,
  startContainer as startContainerDialog,
  stopContainer as stopContainerDialog,
} from './methods';

import { PageTitle, Icon, Spinner } from '../elements';

class Containers extends Component {
  constructor(props) {
    super(props);

    this.url = '/containers';

    this.state = { activeRow: null };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleReload = this.handleReload.bind(this);
    this.startContainer = this.startContainer.bind(this);
    this.stopContainer = this.stopContainer.bind(this);
    this.handleSynchronize = this.handleSynchronize.bind(this);
    this.handlePrune = this.handlePrune.bind(this);
  }

  componentDidMount() {
    this.props.fetchContainers();
    this.props.fetchImages();
    this.props.fetchTemplates();
  }

  handleOnClick(activeRow) {
    this.setState({ activeRow });
  }

  handleDoubleClick() {
    this.props.history.push(`${this.url}/${this.state.activeRow}`);
  }

  handleDelete() {
    const activeRow = this.state.activeRow;
    const data = tables.getTableElementById(this.props.containers.data, activeRow);
    if (data) {
      deleteContainerDialog(this, activeRow, data.name);
    }
  }

  handleCreate() {
    this.props.history.push(`${this.url}/new`);
  }

  handleReload() {
    this.props.fetchContainers();
    this.props.fetchImages();
    this.props.fetchTemplates();
    this.setState({ activeRow: null });
  }

  startContainer() {
    const activeRow = this.state.activeRow;
    const data = tables.getTableElementById(this.props.containers.data, activeRow);
    if (data) {
      startContainerDialog(this, activeRow, data.name);
    }
  }

  stopContainer() {
    const activeRow = this.state.activeRow;
    const data = tables.getTableElementById(this.props.containers.data, activeRow);
    if (data) {
      stopContainerDialog(this, activeRow, data.name);
    }
  }

  handleSynchronize() {
    dialog.showQuestionDialog(
      'Do you want to synchronize containers?',
      () => {
        this.props.synchronizeContainers();
        this.setState({ activeRow: null });
      },
    );
  }

  handlePrune() {
    dialog.showQuestionDialog(
      'Do you want to prune containers?',
      () => {
        this.props.pruneContainers();
        this.setState({ activeRow: null });
      },
    );
  }

  render() {
    const haveErrors = dialog.showError(this.props.containers);

    const activeRow = this.state.activeRow;
    const { data: containers, isFetched: containersIsFetched } = this.props.containers;
    const { data: images, isFetched: imagesIsFetched } = this.props.images;
    const { data: templates, isFetched: templatesIsFetched } = this.props.templates;

    let elementToRender = <Spinner />;

    if (containersIsFetched && imagesIsFetched && templatesIsFetched && !haveErrors) {
      const rows = containers.map((element) => {
        const { id, name, image, template, status } = element;
        const imageData = tables.getTableElementById(images, image);
        let imageName = image;
        let imageTag = '';
        if (imageData) {
          imageName = imageData.name;
          imageTag = imageData.tag;
        }

        const templateData = tables.getTableElementById(templates, template);
        let templateName = template;
        if (templateData) {
          templateName = templateData.name;
        }
        return (
          <tr
            key={containers.indexOf(element)}
            className={id === activeRow ? 'active' : ''}
            onClick={() => this.handleOnClick(id)}
            onDoubleClick={this.handleDoubleClick}
          >
            <td>{name}</td>
            <td>{`${imageName}:${imageTag}`}</td>
            <td>{templateName}</td>
            <td>{status}</td>
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
                Delete Unused
              </Button>
            </ButtonGroup>

            <ButtonGroup>
              <Button disabled={activeRow === null} onClick={this.startContainer}>
                <Icon.Start />
                Start
              </Button>
              <Button disabled={activeRow === null} onClick={this.stopContainer}>
                <Icon.Stop />
                Stop
              </Button>
            </ButtonGroup>
          </ButtonToolbar>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
                <th>Template</th>
                <th>Status</th>
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
        <PageTitle text="Containers" />
        <Grid>
          {elementToRender}
        </Grid>
      </div>
    );
  }
}

Containers.propTypes = {
  history: PropTypes.shape().isRequired,
  images: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  templates: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  containers: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,

  fetchContainers: PropTypes.func.isRequired,
  fetchImages: PropTypes.func.isRequired,
  fetchTemplates: PropTypes.func.isRequired,
  deleteContainer: PropTypes.func.isRequired,
  startContainer: PropTypes.func.isRequired,
  stopContainer: PropTypes.func.isRequired,
  synchronizeContainers: PropTypes.func.isRequired,
  pruneContainers: PropTypes.func.isRequired,
};

export default connect(state => ({
  images: state.images,
  containers: state.containers,
  templates: state.templates,
}), {
  fetchContainers,
  fetchImages,
  fetchTemplates,
  deleteContainer,
  startContainer,
  stopContainer,
  synchronizeContainers,
  pruneContainers,
})(Containers);
