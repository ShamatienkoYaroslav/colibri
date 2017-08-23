import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import { fetchImages } from '../../actions/images';

import { Spinner } from '../elements';
import { tables, dialog } from '../../utils';

class TemplatesSelect extends Component {
  constructor(props) {
    super(props);

    this.state = { activeRow: null };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleReload = this.handleReload.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    this.props.fetchImages();
  }

  onSelect() {
    this.props.onSelect(this.state.activeRow);
  }

  handleOnClick(activeRow) {
    this.setState({ activeRow });
  }

  handleDoubleClick() {
    this.onSelect();
  }

  handleReload() {
    this.props.fetchImages();
    this.setState({ activeRow: null });
  }

  render() {
    const haveErrors = dialog.showError(this.props.templates);

    const activeRow = this.state.activeRow;
    const { data: templates, isFetched: templateIsFetched } = this.props.templates;
    const { data: images, isFetched: imagesIsFetched } = this.props.images;

    let elementToRender = <Spinner />;

    if (templateIsFetched && imagesIsFetched && !haveErrors) {
      const rows = templates.map((element) => {
        const { id, name, image } = element;
        const imageData = tables.getTableElementById(images, image);
        let imageName = '';
        if (imageData) {
          imageName = imageData.name
        }
        return (
          <tr
            key={templates.indexOf(element)}
            className={id === activeRow ? 'active' : ''}
            onClick={() => this.handleOnClick(id)}
            onDoubleClick={this.handleDoubleClick}
          >
            <td>{name}</td>
            <td>{imageName}</td>
          </tr>
        );
      });

      elementToRender = (
        <div>
          <ButtonToolbar>
            <ButtonGroup>
              <Button bsStyle="primary" onClick={this.onSelect}>Select</Button>
              <Button onClick={this.handleReload}>Reload</Button>
            </ButtonGroup>
          </ButtonToolbar>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
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
        {elementToRender}
      </div>
    );
  }
}

TemplatesSelect.propTypes = {
  templates: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  images: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  fetchImages: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default connect(state => ({
  templates: state.templates,
  images: state.images,
}), {
  fetchImages,
})(TemplatesSelect);

