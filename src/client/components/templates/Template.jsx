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
  Tabs,
  Tab,
  Table,
} from 'react-bootstrap';

import { fetchTemplate, createTemplate, changeTemplate, deleteTemplate } from '../../actions/templates';
import { fetchImages } from '../../actions/images';
import { fetchVolumes } from '../../actions/volumes';
import { dialog, tables, validator } from '../../utils';

import { PageTitle, ModalSelect, Icon, Spinner } from '../elements';

const RestartPolicy = {
  NONE: '',
  ALWAYS: 'always',
  UNLESS_STOPPED: 'unless-stopped',
  ON_FAILURE: 'on-failure',
};

const LogConfig = {
  JSON_FILE: 'json-file',
  SYSLOG: 'syslog',
  JOURNALD: 'journald',
  GELF: 'gelf',
  FLUENTD: 'fluentd',
  AWSLOGS: 'awslogs',
  SPLUNK: 'splunk',
  ETWLOGS: 'etwlogs',
  NONE: '',
};

const ReadOnly = {
  FALSE: false,
  TRUE: true,
};

const validateField = (data, field, volumesActiveRow = null) => {
  if (field === 'name') {
    return validator.validateField('name', data.name, 'Name is required');
  } else if (field === 'image') {
    return validator.validateField('image', data.image, 'Image is required');
  } else if (field === 'volume' && volumesActiveRow !== null) {
    return validator.validateField('volume', data.volumes[volumesActiveRow].volume, 'Volume is required');
  } else if (field === 'internalDir' && volumesActiveRow !== null) {
    return validator.validateField('internalDir', data.volumes[volumesActiveRow].internalDir, 'Internal directory is required');
  } 
  return null;
};

const validate = (state) => (
  validator.generateErrors([
    validateField(state.data, 'name'),
    validateField(state.data, 'image'),
    validateField(state.data, 'volume', state.volumesActiveRow),
    validateField(state.data, 'internalDir', state.volumesActiveRow),
  ])
);

class Template extends Component {
  constructor(props) {
    super(props);

    this.mainUrl = '/templates';
    this.id = this.props.match.params.id;
    this.ports = [];
    this.shouldReceiveProps = false;

    this.state = {
      new: !this.id,
      modified: false,
      showSelect: false,
      tableToSelect: '',
      portsActiveRow: null,
      volumesActiveRow: null,
      data: this.getDataById(this.props.templates.data),
      e: {},
    };

    this.getDataById = this.getDataById.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.generateModalSelect = this.generateModalSelect.bind(this);
    this.handleHostConfigChange = this.handleHostConfigChange.bind(this);
    this.handleRestartPolicyChange = this.handleRestartPolicyChange.bind(this);
    this.handleLogConfigChange = this.handleLogConfigChange.bind(this);
    this.handlePortsRowSelect = this.handlePortsRowSelect.bind(this);
    this.handleVolumesRowSelect = this.handleVolumesRowSelect.bind(this);
    this.handlePortsOnChange = this.handlePortsOnChange.bind(this);
    this.handleVolumesOnChange = this.handleVolumesOnChange.bind(this);
    this.generatePorts = this.generatePorts.bind(this);
    this.generatePortsBindings = this.generatePortsBindings.bind(this);
    this.generateExposedPorts = this.generateExposedPorts.bind(this);
    this.addPortsRow = this.addPortsRow.bind(this);
    this.addVolumesRow = this.addVolumesRow.bind(this);
    this.deletePortsRow = this.deletePortsRow.bind(this);
    this.deleteVolumesRow = this.deleteVolumesRow.bind(this);
    this.handleHideChange = this.handleHideChange.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.templates.propsReady) {
      this.shouldReceiveProps = true;
    }

    if (this.shouldReceiveProps && nextProps.templates.propsReady) {
      this.setState({ data: this.getDataById(nextProps.templates.data) });
      this.shouldReceiveProps = false;
    }
  }

  getDataById(table) {
    return tables.getTableElementById(table, this.id) || {
      name: '',
      image: '',
      volumes: [],
      hide: false,
      config: {
        ExposedPorts: '',
        HostConfig: {
          PortBindings: '',
          Privileged: false,
          RestartPolicy: {
            Name: RestartPolicy.NONE,
            MaximumRetryCount: 0,
          },
          LogConfig: {
            Type: LogConfig.NONE,
          },
        },
      },
    };
  }

  async fetchData() {
    this.props.fetchImages();
    this.props.fetchVolumes();
    if (!this.state.new) {
      await this.props.fetchTemplate(this.id);
    }
  }

  goBack() {
    this.props.history.push(this.mainUrl);
  }

  handleChange(event) {
    if (typeof event === 'string') {
      this.setState({ showSelect: true, tableToSelect: event });
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
    const e = validate(this.state);
    if (Object.keys(e).length !== 0) {
      this.setState({ e });
    } else {
      const config = {
        ...this.state.data.config,
        ExposedPorts: this.generateExposedPorts(),
        HostConfig: {
          ...this.state.data.config.HostConfig,
          PortBindings: this.generatePortsBindings(),
        },
      };
      
      if (this.state.new) {
        this.id = uuid();
        await this.props.createTemplate({ ...this.state.data, id: this.id, config });
      } else {
        await this.props.changeTemplate(this.id, { ...this.state.data, config });
      }
      await this.fetchData();

      this.props.history.push(`${this.mainUrl}/${this.id}`);

      this.setState({ modified: false, new: false });
    }
  }

  handleDelete() {
    const data = this.state.data;
    dialog.showQuestionDialog(
      `Do you want to delete the template <strong>${data.name}</strong>?`,
      () => {
        this.props.deleteTemplate(this.id);
        this.goBack();
      },
    );
  }

  handleSelect(table, value) {
    if (table === 'images') {
      const data = {
        ...this.state.data,
        image: value,
      };
      const e = validator.generateNextErrorsState(this.state.e, 'image', validateField(data, 'image'));
      this.setState({
        modified: true,
        showSelect: false,
        data,
        e,
      });
    } else if (table === 'volumes') {
      const volumes = this.state.data.volumes;
      volumes[this.state.volumesActiveRow]['volume'] = value;
      const data = {
        ...this.state.data,
        volumes,
      };
      const e = validator.generateNextErrorsState(this.state.e, 'volume', validateField(data, 'volume'));
      this.setState({
        modified: true,
        showSelect: false,
        data,
        e,
      });
    }
  }

  handleHostConfigChange(e) {
    const name = e.target.name;
    let value = e.target.value;
    if (name === 'Privileged') {
      if (this.state.data.config.HostConfig.Privileged) {
        value = false;
      } else {
        value = value === 'on';
      }
      
    }
    this.setState({
      modified: true,
      data: {
        ...this.state.data,
        config: {
          ...this.state.data.config,
          HostConfig: {
            ...this.state.data.config.HostConfig,
            [name]: value,
          },
        },
      },
    });
  }

  handleLogConfigChange(e) {
    this.setState({
      modified: true,
      data: {
        ...this.state.data,
        config: {
          ...this.state.data.config,
          HostConfig: {
            ...this.state.data.config.HostConfig,
            LogConfig: {
              ...this.state.data.config.HostConfig.LogConfig,
              [e.target.name]: e.target.value,
            },
          },
        },
      },
    });
  }

  handleRestartPolicyChange(e) {
    this.setState({
      modified: true,
      data: {
        ...this.state.data,
        config: {
          ...this.state.data.config,
          HostConfig: {
            ...this.state.data.config.HostConfig,
            RestartPolicy: {
              ...this.state.data.config.HostConfig.RestartPolicy,
              [e.target.name]: e.target.value,
            },
          },
        },
      },
    });
  }

  handlePortsRowSelect(portsActiveRow) {
    this.setState({ portsActiveRow });
  }

  handleVolumesRowSelect(volumesActiveRow) {
    this.setState({ volumesActiveRow });
  }

  handlePortsOnChange(e) {
    this.ports[this.state.portsActiveRow][e.target.name] = e.target.value;
    this.setState({ modified: true });
  }

  handleVolumesOnChange(e) {
    const volumes = this.state.data.volumes;
    volumes[this.state.volumesActiveRow][e.target.name] = e.target.value;
    this.setState({
      modified: true,
      data: {
        ...this.state.data,
        volumes,
      },
    });
  }

  generateModalSelect() {
    const { tableToSelect, showSelect } = this.state;
    return (
      <ModalSelect
        table={tableToSelect}
        show={showSelect}
        onHide={() => this.setState({ showSelect: false })}
        onSelect={(value) => this.handleSelect(tableToSelect, value)}
      />
    );
  }

  generatePorts(portBindings) {
    const ports = [];
    if (portBindings) {
      const keys = Object.keys(portBindings);
      for (let i = 0; i < keys.length; i += 1) {
        const exposedPort = keys[i].split('/')[0];
        const hostPorts = portBindings[keys[i]];
        for (let j = 0; j < hostPorts.length; j += 1) {
          const hostPort = hostPorts[j].HostPort;
          ports.push({ exposedPort, hostPort });
        }
      }
    }
    this.ports = ports;
  }

  generatePortsBindings() {
    const portBindings = {};
    for (let i = 0; i < this.ports.length; i += 1) {
      const { hostPort, exposedPort } = this.ports[i];
      if (hostPort && exposedPort) {
        const key = `${exposedPort}/tcp`;
        if (!portBindings[key]) {
          portBindings[key] = [];
        }
        portBindings[key].push({ HostPort: hostPort });
      }
    }
    return portBindings;
  }

  generateExposedPorts() {
    const exposedPorts = {};
    for (let i = 0; i < this.ports.length; i += 1) {
      const { exposedPort } = this.ports[i];
      if (exposedPort) {
        const key = `${exposedPort}/tcp`;
        if (!exposedPorts[key]) {
          exposedPorts[key] = {};
        }
      }
    }
    return exposedPorts;
  }

  addPortsRow() {
    this.ports.push({ hostPort: 80 , exposedPort: 80 });
    this.setState({ modified: true, portsActiveRow: this.ports.length - 1 });
  }

  addVolumesRow() {
    const volumes = this.state.data.volumes;
    volumes.push({ volume: '', internalDir: '', readOnly: false });
    this.setState({
      modified: true,
      volumesActiveRow: volumes.length - 1,
      data: {
        ...this.state.data,
        volumes,
      },
    });
  }

  deletePortsRow() {
    this.ports.splice(this.state.portsActiveRow, 1);
    this.setState({ modified: true, portsActiveRow: this.ports.length - 1 });
  }

  deleteVolumesRow() {
    const volumes = this.state.data.volumes;
    volumes.splice(this.state.volumesActiveRow, 1);
    this.setState({
      modified: true,
      volumesActiveRow: volumes.length - 1,
      data: {
        ...this.state.data,
        volumes,
      },
    });
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
    const haveErrors = dialog.showError(this.props.templates, this.goBack);

    const { data: images, isFetched: imagesIsFetched } = this.props.images;
    const { data: volumes, isFetched: volumesIsFetched } = this.props.volumes;

    let elementToRender = <Spinner />;
    if ((this.state.new || this.props.templates.isFetched) && imagesIsFetched && volumesIsFetched && !haveErrors) {
      const { data, e } = this.state;
      const title = `${data.name} ${this.state.modified || this.state.new ? '*' : ''}`;
      const image = tables.getTableElementById(images, data.image);
      const imageName = image ? `${image.name}:${image.tag}` : '';

      const {
        Privileged: privileged,
        RestartPolicy:
        restartPolicy,
        LogConfig: logConfig,
        PortBindings: portBindings,
      } = data.config.HostConfig;

      const restartPolicyName = restartPolicy.Name || RestartPolicy.NONE;
      const restartPolicyCount = restartPolicy.MaximumRetryCount || 0;
      const LogConfigType = logConfig.Type || LogConfig.NONE;

      if (!this.state.modified) {
        this.generatePorts(portBindings);
      }

      const portsElement = (
        <Tab eventKey={1} title="Ports">
          <div className="tab-elements">
            <ButtonToolbar>
              <ButtonGroup>
                <Button bsStyle="primary" onClick={this.addPortsRow}>
                  <Icon.Create />
                  Add
                </Button>
                <Button onClick={this.deletePortsRow}>
                  <Icon.Delete />
                  Delete
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
            <Table condensed responsive>
              <thead>
                <tr>
                  <th>Host Port</th>
                  <th>Exposed Port</th>
                </tr>
              </thead>
              <tbody>
                {this.ports.map((item) => {
                  const { hostPort, exposedPort } = item;
                  const key = this.ports.indexOf(item);
                  const activeRow = this.state.portsActiveRow === key;
                  let row = (
                    <tr
                      key={key}
                      className={activeRow ? 'active' : ''}
                      onClick={() => this.handlePortsRowSelect(key)}
                    >
                      <td>{hostPort}</td>
                      <td>{exposedPort}</td>
                    </tr>
                  );

                  if (activeRow) {
                    row = (
                      <tr
                        key={key}
                        className={activeRow ? 'active' : ''}
                      >
                        <td>
                          <FormControl
                            type="number"
                            value={hostPort || 0}
                            name="hostPort"
                            placeholder="Enter host port"
                            onChange={this.handlePortsOnChange}
                          />
                        </td>
                        <td>
                          <FormControl
                            type="number"
                            value={exposedPort || 0}
                            name="exposedPort"
                            placeholder="Enter exposed port"
                            onChange={this.handlePortsOnChange}
                          />
                        </td>
                      </tr>
                    );
                  }
                  return row;
                })}
              </tbody>
            </Table>
          </div>
        </Tab>
      );

      const volumesElement = (
        <Tab eventKey={2} title="Volumes">
          <div className="tab-elements">
            <ButtonToolbar>
              <ButtonGroup>
                <Button bsStyle="primary" onClick={this.addVolumesRow}>
                  <Icon.Create />
                  Add
                </Button>
                <Button onClick={this.deleteVolumesRow}>
                  <Icon.Delete />
                  Delete
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
            <Table condensed responsive>
              <thead>
                <tr>
                  <th>Volume</th>
                  <th>Internal Dir</th>
                  <th>Read Only</th>
                </tr>
              </thead>
              <tbody>
                {data.volumes.map((item) => {
                  const { volume, internalDir, readOnly } = item;
                  const key = data.volumes.indexOf(item);
                  const activeRow = this.state.volumesActiveRow === key;
                  const volumeData = tables.getTableElementById(volumes, volume);
                  let volumeName = '';
                  if (volumeData) {
                    volumeName = volumeData.name;
                  }
                  const className = `${activeRow ? 'active' : ''} ${volumeData === null ? 'danger' : ''}`;
                  let row = (
                    <tr
                      key={key}
                      className={className}
                      onClick={() => this.handleVolumesRowSelect(key)}
                    >
                      <td>{volumeName}</td>
                      <td>{internalDir}</td>
                      <td>{readOnly.toString()}</td>
                    </tr>
                  );

                  if (activeRow) {
                    row = (
                      <tr
                        key={key}
                        className={className}
                      >
                        <td>
                          <FormGroup validationState={validator.getValidationState(e.volume)}>
                            <InputGroup>
                              <FormControl
                                type="text"
                                value={volumeName}
                                placeholder={validator.getValidationMessage(e.volume) || 'Select volume'}
                                onChange={() => {}}
                              />
                              <InputGroup.Addon onClick={() => this.handleChange('volumes')}>...</InputGroup.Addon>
                            </InputGroup>
                          </FormGroup>
                        </td>
                        <td>
                          <FormGroup validationState={validator.getValidationState(e.internalDir)}>
                            <FormControl
                              type="text"
                              value={internalDir}
                              name="internalDir"
                              placeholder={validator.getValidationMessage(e.internalDir) || 'Enter internal directory'}
                              onChange={this.handleVolumesOnChange}
                            />
                          </FormGroup>
                        </td>
                        <td>
                          <FormControl
                            componentClass="select"
                            placeholder="Select read only state"
                            name="readOnly"
                            value={readOnly}
                            onChange={this.handleVolumesOnChange}
                          >
                            <option value={ReadOnly.FALSE}>false</option>
                            <option value={ReadOnly.TRUE}>true</option>
                          </FormControl>
                        </td>
                      </tr>
                    );
                  } 
                  return row;
                })}
              </tbody>
            </Table>
          </div>
        </Tab>
      );

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
                <Button onClick={this.handleDelete}>
                  <Icon.Delete />
                  Delete
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Grid>
          
          <Grid>
            <form>
              <Row>
                <Col sm={12}>
                  <FormGroup controlId="name" validationState={validator.getValidationState(e.name)}>
                    <ControlLabel>Name</ControlLabel>
                    <FormControl
                      type="text"
                      value={data.name || ''}
                      name="name"
                      placeholder={validator.getValidationMessage(e.name) || 'Enter name'}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <FormGroup controlId="image" validationState={validator.getValidationState(e.image)}>
                    <ControlLabel>Image</ControlLabel>
                    <InputGroup>
                      <FormControl
                        type="text"
                        value={imageName}
                        placeholder={validator.getValidationMessage(e.image) || 'Select image'}
                        onChange={() => {}}
                      />
                      <InputGroup.Addon onClick={() => this.handleChange('images')}>...</InputGroup.Addon>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <FormGroup controlId="LogConfigType">
                    <ControlLabel>Log Config</ControlLabel>
                    <FormControl
                      componentClass="select"
                      placeholder="Select log type"
                      name="Type"
                      value={LogConfigType}
                      onChange={this.handleLogConfigChange}
                    >
                      <option value={LogConfig.None}>None</option>
                      <option value={LogConfig.AWSLOGS}>Awslogs</option>
                      <option value={LogConfig.ETWLOGS}>Etwlogs</option>
                      <option value={LogConfig.FLUENTD}>Fluentd</option>
                      <option value={LogConfig.GELF}>Gelf</option>
                      <option value={LogConfig.JOURNALD}>Journald</option>
                      <option value={LogConfig.JSON_FILE}>Json File</option>
                      <option value={LogConfig.SPLUNK}>Splink</option>
                      <option value={LogConfig.SYSLOG}>Syslog</option>
                    </FormControl>
                  </FormGroup>
                </Col>

                <Col sm={4}>
                  <FormGroup controlId="restartPolicyName">
                    <ControlLabel>Restart Policy</ControlLabel>
                    <FormControl
                      componentClass="select"
                      placeholder="Select restart policy"
                      name="Name"
                      value={restartPolicyName}
                      onChange={this.handleRestartPolicyChange}
                    >
                      <option value={RestartPolicy.None}>None</option>
                      <option value={RestartPolicy.ALWAYS}>Always</option>
                      <option value={RestartPolicy.ON_FAILURE}>On Failure</option>
                      <option value={RestartPolicy.UNLESS_STOPPED}>Unless Stopped</option>
                    </FormControl>
                  </FormGroup>
                </Col>

                <Col sm={4}>
                  <FormGroup controlId="restartPolicyCount">
                    <ControlLabel>Restart Policy Max Count</ControlLabel>
                    <FormControl
                      type="number"
                      value={restartPolicyCount}
                      name="MaximumRetryCount"
                      placeholder="Enter restart policy max count"
                      readOnly={restartPolicyName !== RestartPolicy.ON_FAILURE}
                      onChange={this.handleRestartPolicyChange}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <Checkbox name="Privileged" checked={privileged} onChange={this.handleHostConfigChange}>Privileged</Checkbox>
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <Tabs defaultActiveKey={1} id="tabs">
                    {portsElement}
                    {volumesElement}
                  </Tabs>
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

Template.propTypes = {
  templates: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
    propsReady: PropTypes.bool.isRequired,
  }).isRequired,
  images: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  volumes: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,

  fetchTemplate: PropTypes.func.isRequired,
  createTemplate: PropTypes.func.isRequired,
  changeTemplate: PropTypes.func.isRequired,
  deleteTemplate: PropTypes.func.isRequired,
  fetchImages: PropTypes.func.isRequired,
  fetchVolumes: PropTypes.func.isRequired,
};

export default connect(state => ({
  templates: state.templates,
  images: state.images,
  volumes: state.volumes,
}), {
  fetchTemplate,
  createTemplate,
  changeTemplate,
  deleteTemplate,
  fetchImages,
  fetchVolumes,
})(Template);
