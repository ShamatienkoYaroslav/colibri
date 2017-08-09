import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { Grid, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import { PageTitle } from '.';

class ContentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      new: !this.props.id,
      read: false,
      modified: false,
      data: {},
    };

    this.goBack = this.goBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.concatPropsDataWithStateData = this.concatPropsDataWithStateData.bind(this);
  }

  componentDidMount() {
    this.props.fetch(this.props.id);
  }

  goBack() {
    this.props.history.push(this.props.mainUrl);
  }

  handleChange(e) {
    if (typeof e === 'string') {
      console.log(e);
      // TODO: open modal here
    } else {
      this.setState({
        ...this.state.data,
        data: {
          [e.target.name]: e.target.value,
        },
      });
    }

    this.setState({ modified: true });
  }

  handleClose() {
    this.goBack();
  }

  handleDelete() {
    this.props.delete(this.props.id);
    this.goBack();
  }

  concatPropsDataWithStateData() {
    const data = this.props.data;
    const stateData = this.state.data;
    const keys = Object.keys(stateData);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      data[key] = this.state.data[key];
    }
    return data;
  }

  render() {
    const data = this.concatPropsDataWithStateData();

    const title = `${data.name} ${this.state.modified || this.state.new ? '*' : ''}`;

    const children = Children.map(
      this.props.children,
      child => React.cloneElement(child, {
        ...data,
        handleChange: this.handleChange,
      }),
    );

    const toolbar = (
      <Grid>
        <ButtonToolbar>
          <ButtonGroup>
            <Button bsStyle="primary" onClick={this.handleClose}>Close</Button>
            <Button>Save</Button>
            <Button onClick={this.handleDelete}>Delete</Button>
          </ButtonGroup>

          {this.props.toolbarAddon}
        </ButtonToolbar>
      </Grid>
    );

    return (
      <div>
        <PageTitle text={title} />
        {toolbar}
        {children}
      </div>
    );
  }
}

export default ContentForm;
