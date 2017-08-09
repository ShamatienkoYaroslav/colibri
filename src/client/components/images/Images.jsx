import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Table, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import { fetchImages, deleteImage, pruneImages, clarifyImages } from '../../actions/images';

import { PageTitle, ContentTable } from '../elements';

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
    this.handleClarify = this.handleClarify.bind(this);
  }

  componentDidMount() {
    this.props.fetchImages();
  }

  handleOnClick(activeRow) {
    this.setState({ activeRow });
  }

  handleDoubleClick(e) {
    this.props.history.push(`${this.url}/${this.state.activeRow}`);
  }

  handleDelete() {
    this.props.deleteImage(this.state.activeRow);
    this.setState({ activeRow: null });
  }

  handleCreate() {
    this.props.history.push(`${this.url}/new`);
  }

  handleReload() {
    this.props.fetchImages();
    this.setState({ activeRow: null });
  }

  handlePrune() {
    this.props.pruneImages();
    this.setState({ activeRow: null });
  }

  handleClarify() {
    this.props.clarifyImages();
    this.setState({ activeRow: null });
  }

  render() {
    const activeRow = this.state.activeRow;
    const { data, isFetched } = this.props.images;

    let elementToRender = 'Loading...';

    if (isFetched) {
      const rows = data.map((element) => {
        const { id, name, tag } = element;
        return (
          <tr
            key={data.indexOf(element)}
            className={id === activeRow ? 'active' : ''}
            onClick={() => this.handleOnClick(id)}
            onDoubleClick={this.handleDoubleClick}
          >
            <td>{`${name}:${tag}`}</td>
          </tr>
        );
      });

      elementToRender = (
        <div>
          <ButtonToolbar>
            <ButtonGroup>
              <Button bsStyle="primary" onClick={this.handleCreate}>Create</Button>
              <Button onClick={this.handleReload}>Reload</Button>
              <Button disabled={activeRow === null} onClick={this.handleDelete}>Delete</Button>
            </ButtonGroup>

            <ButtonGroup>
              <Button onClick={this.handlePrune}>Prune</Button>
              <Button onClick={this.handleClarify}>Clarify</Button>
            </ButtonGroup>
          </ButtonToolbar>

          <Table responsive hover>
            <thead>
              <tr>
                <th>
                  Name
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
};

export default connect(state => ({
  images: state.images,
}), {
  fetchImages,
  deleteImage,
  pruneImages,
  clarifyImages,
})(Images);