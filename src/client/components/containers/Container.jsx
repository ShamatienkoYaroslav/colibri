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
  Checkbox,
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
import { dialog, tables, validator } from '../../utils';

import {
  deleteContainer as deleteContainerDialog,
  startContainer as startContainerDialog,
  stopContainer as stopContainerDialog,
} from './methods';

import { PageTitle, ModalSelect, Icon, Spinner } from '../elements';

const ContainerStatus = {
  RUNNIG: 'runnig',
  STOPPED: 'stopped',
  EXISTS: 'created',
  LACKING: 'lacking',
};

const validateField = (data, field) => {
  if (field === 'name') {
    return validator.validateField('name', data.name, 'Name is required');
  } else if (field === 'template' && !data.auto) {
    return validator.validateField('template', data.template, 'Template is required');
  }
  return null;
};

const validate = data => (
  validator.generateErrors([
    validateField(data, 'name'),
    validateField(data, 'template'),
  ])
);

class Container extends Component {
  constructor(props) {
    super(props);

    this.mainUrl = '/containers';
    this.id = this.props.match.params.id;
    this.shouldReceiveProps = false;

    this.state = {
      new: !this.id,
      modified: false,
      showSelect: false,
      data: this.getDataById(this.props.containers.data),
      e: {},
    };

    this.getDataById = this.getDataById.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSelectTemplate = this.handleSelectTemplate.bind(this);
    this.generateModalSelect = this.generateModalSelect.bind(this);
    this.handleHideChange = this.handleHideChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchTemplates();
    if (!this.state.new) {
      this.props.fetchContainer(this.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.containers.propsReady) {
      this.shouldReceiveProps = true;
    }

    if (this.shouldReceiveProps && nextProps.containers.propsReady) {
      this.setState({ data: this.getDataById(nextProps.containers.data) });
      this.shouldReceiveProps = false;
    }
  }

  getDataById(table) {
    return tables.getTableElementById(table, this.id) || {
      name: '',
      image: '',
      template: '',
      status: !this.id ? ContainerStatus.LACKING : '',
      containerId: '',
      auto: '',
      hide: false,
    };
  }

  goBack() {
    this.props.history.push(this.mainUrl);
  }

  handleChange(event) {
    if (typeof event === 'string') {
      this.setState({ showSelect: true });
    } else {
      const name = event.target.name;
      const data = {
        ...this.state.data,
        [name]: event.target.value,
      };
      const e = validator.generateNextErrorsState(this.state.e, name, validateField(data, name));
      this.setState({
        modified: true,
        data,
        e,
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

  async handleSave() {
    const e = validate(this.state.data);
    if (Object.keys(e).length !== 0) {
      this.setState({ e });
    } else {
      if (this.state.new) {
        this.id = uuid();
        await this.props.createContainer({ ...this.state.data, id: this.id });
      } else {
        await this.props.changeContainer(this.id, this.state.data);
      }
      this.props.fetchTemplates();
      await this.props.fetchContainer(this.id);
  
      this.props.history.push(`${this.mainUrl}/${this.id}`);
  
      this.setState({ modified: false, new: false, e });
    }
  }

  handleSelectTemplate(template) {
    const data = {
      ...this.state.data,
      template,
    };
    const e = validator.generateNextErrorsState(this.state.e, 'template', validateField(data, 'template'));
    this.setState({
      modified: true,
      showSelect: false,
      data,
      e,
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

  handleHideChange(e) {
    const name = e.target.name;
    let value = e.target.value;
    if (name === 'hide') {
      if (this.state.data.hide) {
        value = false;
      } else {
        value = value === 'on';
      }
    }

    this.setState({
      modified: true,
      data: {
        ...this.state.data,
        hide: value,
      },
    });
  }

  render() {
    const haveErrors = dialog.showError(this.props.containers, this.goBack);

    const { data: templates, isFetched: templatesIsFetched } = this.props.templates;

    let elementToRender = <Spinner />;
    if ((this.state.new || this.props.containers.isFetched) && templatesIsFetched && !haveErrors) {
      const { data, e } = this.state;
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
              <FormGroup controlId="template" validationState={validator.getValidationState(e.template)}>
                <ControlLabel>Template</ControlLabel>
                <InputGroup>
                  <FormControl
                    type="text"
                    value={templateName}
                    placeholder={validator.getValidationMessage(e.template) || 'Select template'}
                    onChange={() => {}}
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
                  <FormGroup controlId="name" validationState={validator.getValidationState(e.name)}>
                    <ControlLabel>Name</ControlLabel>
                    <FormControl
                      type="text"
                      value={data.name}
                      name="name"
                      placeholder={validator.getValidationMessage(e.name) || 'Enter name'}
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

              <Row>
                <Col sm={1}>
                  <Checkbox
                    name="hide"
                    checked={data.hide}
                    onChange={this.handleHideChange}
                  >
                    Hiden
                  </Checkbox>
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
    propsReady: PropTypes.bool.isRequired,
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
