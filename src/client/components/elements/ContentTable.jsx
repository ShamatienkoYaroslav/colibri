import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Table, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

class ContentTable extends Component {
  constructor(props) {
    super(props);

    this.state = { activeRow: null };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.deleteSelected = this.deleteSelected.bind(this);
    this.reload = this.reload.bind(this);
  }

  componentDidMount() {
    this.props.fetch();
  }

  handleOnClick(activeRow) {
    this.setState({ activeRow });
  }

  handleDoubleClick(e) {
    e.preventDefault();
    this.props.history.push(`${this.props.url}/${this.state.activeRow}`);
  }

  deleteSelected() {
    this.props.deleteSelected(this.state.activeRow);
    this.setState({ activeRow: null });
  }

  reload() {
    this.props.fetch();
    this.setState({ activeRow: null });
  }

  render() {
    const activeRow = this.state.activeRow;
    const { data, isFetched } = this.props;

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
            <td>{name}</td>
          </tr>
        );
      });

      elementToRender = (
        <div>
          <ButtonToolbar>
            <ButtonGroup>
              <Button bsStyle="primary">Create</Button>
              <Button onClick={this.reload}>Reload</Button>
              <Button disabled={activeRow === null} onClick={this.deleteSelected}>Delete</Button>
            </ButtonGroup>

            {this.props.toolbarAddon}
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
      <Grid>
        {elementToRender}
      </Grid>
    );
  }
}

ContentTable.defaultProps = {
  toolbarAddon: '',
};

ContentTable.propTypes = {
  url: PropTypes.string.isRequired,
  history: PropTypes.shape().isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFetched: PropTypes.bool.isRequired,
  toolbarAddon: PropTypes.node.isRequired,
  fetch: PropTypes.func.isRequired,
  deleteSelected: PropTypes.func.isRequired,
};

export default ContentTable;
