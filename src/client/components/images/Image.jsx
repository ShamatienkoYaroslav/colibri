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
  Table,
  Tabs,
  Tab,
  Checkbox,
} from 'react-bootstrap';

import { fetchImage, createImage, changeImage, deleteImage } from '../../actions/images';
import { fetchSources } from '../../actions/sources';
import { ImagesApi, format, dialog, tables, validator } from '../../utils';

import {
  deleteImage as deleteImageDialog,
  pullImage as pullImageDialog,
} from './methods';

import { PageTitle, ModalSelect, Icon, Spinner } from '../elements';

const validateField = (data, field) => {
  if (field === 'name') {
    return validator.validateField('name', data.name, 'Name is required');
  } else if (field === 'tag') {
    return validator.validateField('tag', data.tag, 'Tag is required');
  } else if (field === 'source' && !data.auto) {
    return validator.validateField('source', data.source, 'Source is required');
  }
  return null;
};

const validate = data => (
  validator.generateErrors([
    validateField(data, 'name'),
    validateField(data, 'tag'),
    validateField(data, 'source'),
  ])
);

class Image extends Component {
  constructor(props) {
    super(props);
    
    this.mainUrl = '/images';
    this.id = this.props.match.params.id;
    this.info = null;
    this.read = false;
    this.shouldReceiveProps = false;

    this.state = {
      new: !this.id,
      modified: false,
      showSelect: false,
      data: this.getDataById(this.props.images.data),
      e: {},
    };

    this.getInfo = this.getInfo.bind(this);
    this.getDataById = this.getDataById.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSelectSource = this.handleSelectSource.bind(this);
    this.handleHideChange = this.handleHideChange.bind(this);
    this.generateModalSelect = this.generateModalSelect.bind(this);
  }

  componentDidMount() {
    this.props.fetchSources();
    if (!this.state.new) {
      this.readImage();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.images.propsReady) {
      this.shouldReceiveProps = true;
    }

    if (this.shouldReceiveProps && nextProps.images.propsReady) {
      this.setState({ data: this.getDataById(nextProps.images.data) });
      this.shouldReceiveProps = false;
    }
  }

  async getInfo() {
    const resp = await ImagesApi.getInfo(this.id);
    return resp;
  }

  getDataById(table) {
    return tables.getTableElementById(table, this.id) || {
      name: '',
      tag: 'latest',
      source: '',
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
        await this.props.createImage({ ...this.state.data, id: this.id });
      } else {
        await this.props.changeImage(this.id, this.state.data);
      }

      this.props.fetchSources();

      this.props.history.push(`${this.mainUrl}/${this.id}`);

      this.read = true;
      this.setState({ modified: false, new: false });
    }
  }

  handleDelete() {
    const data = this.state.data;
    dialog.showQuestionDialog(
      `Do you want to delete the image <strong>${data.name}:${data.tag}</strong>?`,
      () => {
        this.props.deleteImage(this.id);
        this.goBack();
      },
    );
  }

  async readImage() {
    this.info = null;
    const resp = await this.getInfo();
    if (resp.messages.length === 0) {
      this.info = resp.info;
    }
    await this.props.fetchImage(this.id);
    this.read = false;
  }

  handleSelectSource(source) {
    const data = {
      ...this.state.data,
      source,
    };
    const e = validator.generateNextErrorsState(this.state.e, 'source', validateField(data, 'source'));
    this.setState({
      modified: true,
      showSelect: false,
      data,
      e,
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

  generateModalSelect() {
    return (
      <ModalSelect
        table="sources"
        show={this.state.showSelect}
        onHide={() => this.setState({ showSelect: false })}
        onSelect={value => this.handleSelectSource(value)}
      />
    );
  }

  render() {
    if (this.read) {
      this.readImage();
    }

    const haveErrors = dialog.showError(this.props.images, this.goBack);

    const imagesIsFethed = this.props.images.isFetched;
    const { data: sources, isFetched: sourcesIsFetched } = this.props.sources;

    let elementToRender = <Spinner />;
    if (imagesIsFethed && sourcesIsFetched && !haveErrors) {
      const { data, e } = this.state;
      const title = `${data.name} ${this.state.modified || this.state.new ? '*' : ''}`;
      const sourceData = tables.getTableElementById(sources, data.source);
      let sourceName = '';
      if (sourceData) {
        sourceName = sourceData.name;
      }
  
      let info = null;
      if (!this.state.new) {
        info = (
          <div>
            <p>Now you can <a role="button" onClick={() => pullImageDialog(this, this.id, data.name, data.tag, false)}>pull</a> the image.</p>
          </div>
        );
      }
      if (this.info) {
        const { 
          Architecture: arch, 
          Author: author, 
          Config: config,
          Created: created,
          DockerVersion: dockerVersion,
          Os: os,
          Size: size,
          Id: dockerId,
          Parent: parent,
          Comment: comment,
        } = this.info;
  
        let command = '';
        let exposedPorts = '';
        let tty = false;
        let entryPoint = '';
        let envVars = '';
        if (config) {
          const { Cmd: cmd, ExposedPorts: ports, Env: env } = config;
          tty = config.Tty;
          entryPoint = config.Entrypoint;
  
          if (cmd) {
            for (let i = 0; i < cmd.length; i += 1) {
              command += `${cmd[i]} `;
            }
          }
  
          if (ports) {
            const keys = Object.keys(ports);
            exposedPorts = (
              <Tab eventKey={2} title="Exposed Ports">
                <div className="tab-content">
                  <Row>
                    <Col sm={12}>
                      <Table condensed bordered responsive readOnly>
                        <thead>
                          <tr>
                            <th>Port</th>
                          </tr>
                        </thead>
                        <tbody>
                          {keys.map(item => (
                            <tr key={keys.indexOf(item)}>
                              <td>{item.split('/')[0]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </div>
              </Tab>
            );
          }
  
          if (env) {
            envVars = (
              <Tab eventKey={1} title="Env Vars">
                <div className="tab-elements">
                  <Row>
                    <Col sm={12}>
                      <Table condensed responsive readOnly>
                        <thead>
                          <tr>
                            <th>Variable</th>
                          </tr>
                        </thead>
                        <tbody>
                          {env.map(item => (
                            <tr key={env.indexOf(item)}>
                              <td>{item}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </div>
              </Tab>
            );
          }
        }
  
        info = (
          <div>
            <h4>Info</h4>
            <Row>
              <Col sm={12}>
                <FormGroup controlId="author">
                  <ControlLabel>Author</ControlLabel>
                  <FormControl.Static>{author || 'none'}</FormControl.Static>
                </FormGroup>
              </Col>
            </Row>
  
            <Row>
              <Col sm={4}>
                <FormGroup controlId="created">
                  <ControlLabel>Created</ControlLabel>
                  <FormControl.Static>{format.formatDate(created)}</FormControl.Static>
                </FormGroup>
              </Col>
              <Col sm={4}>
                <FormGroup controlId="size">
                  <ControlLabel>Size</ControlLabel>
                  <FormControl.Static>{size || 0}</FormControl.Static>
                </FormGroup>
              </Col>
              <Col sm={4}>
                <FormGroup controlId="cmd">
                  <ControlLabel>Cmd</ControlLabel>
                  <FormControl.Static>{command || 'none'}</FormControl.Static>
                </FormGroup>
              </Col>
            </Row>
  
            <Row>
              <Col sm={4}>
                <FormGroup controlId="arch">
                  <ControlLabel>Architecture</ControlLabel>
                  <FormControl.Static>{arch || 'none'}</FormControl.Static>
                </FormGroup>
              </Col>
              <Col sm={4}>
                <FormGroup controlId="os">
                  <ControlLabel>OS</ControlLabel>
                  <FormControl.Static>{os || 'none'}</FormControl.Static>
                </FormGroup>
              </Col>
              <Col sm={4}>
                <FormGroup controlId="dockerVersion">
                  <ControlLabel>Docker Version</ControlLabel>
                  <FormControl.Static>{dockerVersion || 'none'}</FormControl.Static>
                </FormGroup>
              </Col>
            </Row>
  
            <Row>
              <Col sm={12}>
                <FormGroup controlId="dockerId">
                  <ControlLabel>Docker ID</ControlLabel>
                  <FormControl.Static>{dockerId || 'none'}</FormControl.Static>
                </FormGroup>
              </Col>
            </Row>
  
            <Row>
              <Col sm={12}>
                <FormGroup controlId="parent">
                  <ControlLabel>Parent</ControlLabel>
                  <FormControl.Static>{parent || 'none'}</FormControl.Static>
                </FormGroup>
              </Col>
            </Row>
  
            <Row>
              <Col sm={8}>
                <FormGroup controlId="entryPoint">
                  <ControlLabel>Entrypoint</ControlLabel>
                  <FormControl.Static>{entryPoint || 'none'}</FormControl.Static>
                </FormGroup>
              </Col>
              <Col sm={4}>
                <FormGroup controlId="tty">
                  <ControlLabel>Tty</ControlLabel>
                  <FormControl.Static>{tty || 'false'}</FormControl.Static>
                </FormGroup>
              </Col>
            </Row>
  
            <Tabs defaultActiveKey={1} id="tabs">
              {envVars}
              {exposedPorts}
            </Tabs>
  
            <Row>
              <Col sm={12}>
                <FormGroup controlId="comment">
                  <ControlLabel>Comment</ControlLabel>
                  <FormControl.Static>{comment || 'none'}</FormControl.Static>
                </FormGroup>
              </Col>
            </Row>
          </div>
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
                <Button onClick={() => deleteImageDialog(this, this.id, data.name, data.tag, false)}>
                  <Icon.Delete />
                  Delete
                </Button>
              </ButtonGroup>
  
              <ButtonGroup>
                <Button onClick={() => pullImageDialog(this, this.id, data.name, data.tag, false)}>
                  <Icon.Pull />
                  Update
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
                  <FormGroup controlId="tag" validationState={validator.getValidationState(e.tag)}>
                    <ControlLabel>Tag</ControlLabel>
                    <FormControl
                      type="text"
                      value={data.tag}
                      name="tag"
                      placeholder={validator.getValidationMessage(e.tag) || 'Enter tag'}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
  
              <Row>
                <Col sm={12}>
                  <FormGroup controlId="source" validationState={validator.getValidationState(e.source)}>
                    <ControlLabel>Source</ControlLabel>
                    <InputGroup>
                      <FormControl
                        type="text"
                        value={sourceName}
                        placeholder={validator.getValidationMessage(e.source) || 'Enter source'}
                        onChange={() => {}}
                      />
                      <InputGroup.Addon onClick={() => this.handleChange('')}>...</InputGroup.Addon>
                    </InputGroup>
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
  
            {info}
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

Image.propTypes = {
  images: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
    propsReady: PropTypes.bool.isRequired,
  }).isRequired,
  sources: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  fetchImage: PropTypes.func.isRequired,
  createImage: PropTypes.func.isRequired,
  changeImage: PropTypes.func.isRequired,
  deleteImage: PropTypes.func.isRequired,
  fetchSources: PropTypes.func.isRequired,
};

export default connect(state => ({
  images: state.images,
  sources: state.sources,
}), {
  fetchImage,
  createImage,
  changeImage,
  deleteImage,
  fetchSources,
})(Image);
