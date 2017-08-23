import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Table, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import { fetchTemplates, deleteTemplate } from '../../actions/templates';
import { fetchImages } from '../../actions/images';
import { dialog, tables } from '../../utils';

import { PageTitle, Icon, Spinner } from '../elements';

class Templates extends Component {
  constructor(props) {
    super(props);

    this.url = '/templates';

    this.state = { activeRow: null };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleReload = this.handleReload.bind(this);
  }

  componentDidMount() {
    this.props.fetchTemplates();
    this.props.fetchImages();
  }

  handleOnClick(activeRow) {
    this.setState({ activeRow });
  }

  handleDoubleClick() {
    this.props.history.push(`${this.url}/${this.state.activeRow}`);
  }

  handleDelete() {
    let data = null;
    for (let i = 0; i < this.props.templates.data.length; i += 1) {
      const currentTemplate = this.props.templates.data[i];
      if (this.state.activeRow === currentTemplate.id) {
        data = currentTemplate;
      }
    }
    if (data) {
      dialog.showQuestionDialog(
        `Do you want to delete the template <strong>${data.name}</strong>?`,
        () => {
          this.props.deleteTemplate(this.state.activeRow);
          this.setState({ activeRow: null });
        },
      );
    }
  }

  handleCreate() {
    this.props.history.push(`${this.url}/new`);
  }

  handleReload() {
    this.props.fetchTemplates();
    this.setState({ activeRow: null });
  }

  render() {
    const haveErrors = dialog.showError(this.props.templates);

    const activeRow = this.state.activeRow;
    const { data: templates, isFetched: templatesIsFetched } = this.props.templates;
    const { data: images, isFetched: imagesIsFetched } = this.props.images;

    let elementToRender = <Spinner />;

    if (templatesIsFetched && imagesIsFetched && !haveErrors) {
      const rows = templates.map((element) => {
        const { id, name, image } = element;
        const imageData = tables.getTableElementById(images, image);
        let imageName = '';
        let imageTag = '';
        if (imageData) {
          imageName = imageData.name;
          imageTag = imageData.tag;
        }
        return (
          <tr
            key={templates.indexOf(element)}
            className={id === activeRow ? 'active' : ''}
            onClick={() => this.handleOnClick(id)}
            onDoubleClick={this.handleDoubleClick}
          >
            <td>{`${name}`}</td>
            <td>{`${imageName}:${imageTag}`}</td>
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
                <th>
                  Name
                </th>
                <th>
                  Image
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
        <PageTitle text="Templates" />
        <Grid>
          {elementToRender}
        </Grid>
      </div>
    );
  }
}

Templates.propTypes = {
  history: PropTypes.shape().isRequired,
  images: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  templates: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,

  fetchTemplates: PropTypes.func.isRequired,
  fetchImages: PropTypes.func.isRequired,
  deleteTemplate: PropTypes.func.isRequired,
};

export default connect(state => ({
  images: state.images,
  templates: state.templates,
}), {
  fetchTemplates,
  fetchImages,
  deleteTemplate,
})(Templates);
