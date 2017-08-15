import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import { fetchSources } from '../../actions/sources';

class SourcesSelect extends Component {
  constructor(props) {
    super(props);

    this.state = { activeRow: null };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleReload = this.handleReload.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    this.props.fetchSources();
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
    this.props.fetchSources();
    this.setState({ activeRow: null });
  }

  render() {
    const activeRow = this.state.activeRow;
    const { data, isFetched } = this.props.sources;

    let elementToRender = 'Loading...';

    if (isFetched) {
      const rows = data.map((element) => {
        const { id, name } = element;
        return (
          <tr
            key={data.indexOf(element)}
            className={id === activeRow ? 'active' : ''}
            onClick={() => this.handleOnClick(id)}
            onDoubleClick={this.handleDoubleClick}
          >
            <td>{`${name}`}</td>
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

SourcesSelect.propTypes = {
  sources: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,

  fetchSources: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default connect(state => ({
  sources: state.sources,
}), {
  fetchSources,
})(SourcesSelect);
