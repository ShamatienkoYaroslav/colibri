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
import { dialog, tables, objects } from '../../utils';

import { PageTitle, ModalSelect, Icon } from '../elements';

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

class Template extends Component {
  constructor(props) {
    super(props);

    this.mainUrl = '/templates';
    this.id = this.props.match.params.id;
    this.ports = [];

    this.state = {
      new: !this.id,
      modified: false,
      showSelect: false,
      tableToSelect: '',
      portsActiveRow: null,
      volumesActiveRow: null,
      data: {
        name: null,
        image: null,
        volumes: [],
        config: {
          ExposedPorts: null,
          HostConfig: {
            PortBindings: null,
            Privileged: null,
            RestartPolicy: {
              Name: null,
              MaximumRetryCount: null,
            },
            LogConfig: {
              Type: null,
            },
          },
        },
      },
    };

    this.getData = this.getData.bind(this);
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
  }

  componentDidMount() {
    this.fetchData();
  }

  getData() {
    return objects.merge(this.getDataById(), this.state.data);
  }

  getDataById() {
    let data = {};
    const collection = this.props.templates.data;
    for (let i = 0; i < collection.length; i += 1) {
      if (collection[i].id === this.id) {
        data = collection[i];
        break;
      }
    }
    return data;
  }

  fetchData() {
    this.props.fetchImages();
    this.props.fetchVolumes();
    if (!this.state.new) {
      this.props.fetchTemplate(this.id);
    }
  }

  goBack() {
    this.props.history.push(this.mainUrl);
  }

  handleChange(e) {
    if (typeof e === 'string') {
      this.setState({ showSelect: true, tableToSelect: e });
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
      this.props.createTemplate({ ...this.state.data, id: this.id, config });
    } else {
      this.props.changeTemplate(this.id, { ...this.getData(), config });
    }
    this.fetchData();

    this.props.history.push(`${this.mainUrl}/${this.id}`);

    this.setState({ modified: false, new: false });
  }

  handleDelete() {
    const data = this.getData();
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
      this.setState({ modified: true, showSelect: false, data: { ...this.state.data, image: value } });
    } else if (table === 'volumes') {
      const volumes = this.getData().volumes;
      volumes[this.state.volumesActiveRow]['volume'] = value;
      this.setState({
        modified: true,
        showSelect: false,
        data: {
          ...this.state.data,
          volumes,
        },
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
        value = value === 'on' ? true : false;
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
    const volumes = this.getData().volumes;
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
    const volumes = this.getData().volumes;
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
    const volumes = this.getData().volumes;
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

  render() {
    const { data: images, isFetched: imagesIsFetched } = this.props.images;
    const { data: volumes, isFetched: volumesIsFetched } = this.props.volumes;

    let elementToRender = 'Loading...';
    if ((this.state.new || this.props.templates.isFetched) && imagesIsFetched && volumesIsFetched) {
      const data = this.getData();
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
                            value={hostPort || 80}
                            name="hostPort"
                            placeholder="Enter host port"
                            onChange={this.handlePortsOnChange}
                          />
                        </td>
                        <td>
                          <FormControl
                            type="number"
                            value={exposedPort || 80}
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
                          <InputGroup>
                            <FormControl
                              type="text"
                              value={volumeName}
                              placeholder="Select volume"
                            />
                            <InputGroup.Addon onClick={() => this.handleChange('volumes')}>...</InputGroup.Addon>
                          </InputGroup>
                        </td>
                        <td>
                          <FormControl
                            type="text"
                            value={internalDir}
                            name="internalDir"
                            placeholder="Enter internal directory"
                            onChange={this.handleVolumesOnChange}
                          />
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
                  <FormGroup controlId="name">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl
                      type="text"
                      value={data.name || ''}
                      name="name"
                      placeholder="Enter name"
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <FormGroup controlId="image">
                    <ControlLabel>Image</ControlLabel>
                    <InputGroup>
                      <FormControl
                        type="text"
                        value={imageName}
                        placeholder="Select image"
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
