import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import { Spinner } from '../elements';
import { dialog } from '../../utils';

class ImagesSelect extends Component {
  constructor(props) {
    super(props);

    this.state = { activeRow: null };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleReload = this.handleReload.bind(this);
    this.onSelect = this.onSelect.bind(this);
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
    this.setState({ activeRow: null });
  }

  render() {
    const haveErrors = dialog.showError(this.props.images);

    const activeRow = this.state.activeRow;
    const { data, isFetched } = this.props.images;

    let elementToRender = <Spinner />;

    if (isFetched && !haveErrors) {
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
              <Button bsStyle="primary" onClick={this.onSelect}>Select</Button>
              <Button onClick={this.handleReload}>Reload</Button>
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
        {elementToRender}
      </div>
    );
  }
}

ImagesSelect.propTypes = {
  images: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default connect(state => ({
  images: state.images,
}), {})(ImagesSelect);
