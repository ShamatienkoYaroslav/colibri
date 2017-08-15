import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuid from 'uuid';
import {
  Grid,
  Col,
  Row,
  FormGroup,
  ControlLabel,
  FormControl,
  InputGroup,
  ButtonToolbar,
  ButtonGroup,
  Button,
} from 'react-bootstrap';

import {
  fetchContainer,
  createContainer,
  changeContainer,
  deleteContainer,
  startContainer,
  stopContainer,
} from '../../actions/containers';
import { fetchTemplates } from '../../actions/templates';
import { dialog, tables, objects } from '../../utils';

import {
  deleteContainer as deleteContainerDialog,
  startContainer as startContainerDialog,
  stopContainer as stopContainerDialog,
} from './methods';

import { PageTitle, ModalSelect, Icon } from '../elements';

const ContainerStatus = {
  RUNNIG: 'runnig',
  STOPPED: 'stopped',
  EXISTS: 'created',
  LACKING: 'lacking',
};

class Container extends Component {
  constructor(props) {
    super(props);

    this.mainUrl = '/containers';
    this.id = this.props.match.params.id;

    this.state = {
      new: !this.id,
      modified: false,
      showSelect: false,
      data: {
        name: null,
        image: null,
        template: null,
        status: !this.id ? ContainerStatus.LACKING : null,
        containerId: null,
        auto: null,
      },
    };

    this.getData = this.getData.bind(this);
    this.getDataById = this.getDataById.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSelectTemplate = this.handleSelectTemplate.bind(this);
    this.generateModalSelect = this.generateModalSelect.bind(this);
  }

  componentDidMount() {
    this.props.fetchTemplates();
    if (!this.state.new) {
      this.props.fetchContainer(this.id);
    }
  }

  getData() {
    const stateData = this.state.data;
    let status = stateData.status;
    const data = this.getDataById();
    if (data) {
      if (data.auto) {
        status = data.status;
      }
    }
    return objects.merge(data, { ...this.state.data, status });
  }

  getDataById() {
    return tables.getTableElementById(this.props.containers.data, this.id) || {};
  }

  goBack() {
    this.props.history.push(this.mainUrl);
  }

  handleChange(e) {
    if (typeof e === 'string') {
      this.setState({ showSelect: true });
    } else {
      this.setState({
        modified: true,
        data: {
          ...this.state.data,
          [e.target.name]: e.target.value,
        },
      });
    }
  }

  handleClose() {
    if (this.state.modified) {
      dialog.showOnCloseDialog(this.goBack);
    } else {
      this.goBack();
    }
  }

  handleSave() {
    if (this.state.new) {
      this.id = uuid();
      this.props.createContainer({ ...this.state.data, id: this.id });
    } else {
      this.props.changeContainer(this.id, this.getData());
    }
    this.props.fetchTemplates();
    this.props.fetchContainer(this.id);

    this.props.history.push(`${this.mainUrl}/${this.id}`);

    this.setState({ modified: false, new: false });
  }

  handleSelectTemplate(template) {
    this.setState({
      modified: true,
      showSelect: false,
      data: {
        ...this.state.data,
        template,
      },
    });
  }

  generateModalSelect() {
    return (
      <ModalSelect
        table="templates"
        show={this.state.showSelect}
        onHide={() => this.setState({ showSelect: false })}
        onSelect={value => this.handleSelectTemplate(value)}
      />
    );
  }

  render() {
    const { data: templates, isFetched: templatesIsFetched } = this.props.templates;

    let elementToRender = 'Loading...';
    if ((this.state.new || this.props.containers.isFetched) && templatesIsFetched) {
      const data = this.getData();
      const title = `${data.name} ${this.state.modified || this.state.new ? '*' : ''}`;

      const templateData = tables.getTableElementById(templates, data.template);
      let templateName = '';
      if (templateData) {
        templateName = templateData.name;
      }

      let template = null;
      if (!data.auto) {
        template = (
          <Row>
            <Col sm={12}>
              <FormGroup controlId="template">
                <ControlLabel>Template</ControlLabel>
                <InputGroup>
                  <FormControl
                    type="text"
                    value={templateName}
                    placeholder="Select template"
                  />
                  <InputGroup.Addon onClick={() => this.handleChange('')}>...</InputGroup.Addon>
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
        );
      }

      elementToRender = (
        <div>
          <PageTitle text={title} />
          
          <Grid>
            <ButtonToolbar>
              <ButtonGroup>
                <Button bsStyle="primary" onClick={this.handleClose}>
                  <Icon.Close />
                  Close
                </Button>
                <Button onClick={this.handleSave}>
                  <Icon.Save />
                  Save
                </Button>
                <Button
                  disabled={this.state.new}
                  onClick={() => deleteContainerDialog(this, this.id, data.name, false)}
                >
                  <Icon.Delete />
                  Delete
                </Button>
              </ButtonGroup>

              <ButtonGroup>
                <Button
                  disabled={this.state.new}
                  onClick={() => startContainerDialog(this, this.id, data.name)}
                >
                  <Icon.Start />
                  Start
                </Button>
                <Button
                  disabled={this.state.new}
                  onClick={() => stopContainerDialog(this, this.id, data.name)}
                >
                  <Icon.Stop />
                  Stop
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Grid>
          
          <Grid>
            <form>
              <Row>
                <Col sm={8}>
                  <FormGroup controlId="name">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl
                      type="text"
                      value={data.name}
                      name="name"
                      placeholder="Enter name"
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>

                <Col sm={4}>
                  <FormGroup controlId="status">
                    <ControlLabel>Status</ControlLabel>
                    <FormControl.Static>{data.status || 'unknown'}</FormControl.Static>
                  </FormGroup>
                </Col>
              </Row>

              {template}

              <Row>
                <Col sm={8}>
                  <FormGroup controlId="containerId">
                    <ControlLabel>Container Id</ControlLabel>
                    <FormControl.Static>{data.containerId || 'none'}</FormControl.Static>
                  </FormGroup>
                </Col>

                <Col sm={4}>
                  <FormGroup controlId="auto">
                    <ControlLabel>Created from Host</ControlLabel>
                    <FormControl.Static>{data.auto ? 'Yes' : 'No'}</FormControl.Static>
                  </FormGroup>
                </Col>
              </Row>
            </form>
          </Grid>

          {this.generateModalSelect()}
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

Container.propTypes = {
  containers: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  templates: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,

  fetchContainer: PropTypes.func.isRequired,
  createContainer: PropTypes.func.isRequired,
  changeContainer: PropTypes.func.isRequired,
  deleteContainer: PropTypes.func.isRequired,
  startContainer: PropTypes.func.isRequired,
  stopContainer: PropTypes.func.isRequired,
  fetchTemplates: PropTypes.func.isRequired,
};

export default connect(state => ({
  containers: state.containers,
  templates: state.templates,
}), {
  fetchContainer,
  createContainer,
  changeContainer,
  deleteContainer,
  startContainer,
  stopContainer,
  fetchTemplates,
})(Container);
