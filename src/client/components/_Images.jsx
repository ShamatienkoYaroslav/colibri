import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import {
  Grid,
  Col,
  Row,
  FormGroup,
  ControlLabel,
  FormControl,
  InputGroup,
  ButtonGroup,
  Button,
  Table,
  Tabs,
  Tab,
} from 'react-bootstrap';

import { fetchImage, fetchImages, deleteImage, pruneImages, clarifyImages } from '../actions/images';
import { ImagesApi, format } from '../utils';

import { PageTitle, ContentTable, ContentForm } from './elements';

import ImageTest from './images/Image';

class ImageForm extends Component {
  constructor(props) {
    super(props);
    this.info = {};

    this.getInfo = this.getInfo.bind(this);
  }

  async componentDidMount() {
    const resp = await this.getInfo();
    if (resp.messages.length !== 0) {
      console.log(resp.messages);
    } else {
      this.info = resp.info;
      this.forceUpdate();
    }
  }

  async getInfo() {
    const resp = await ImagesApi.getInfo(this.props.id);
    return resp;
  }

  render() {
    const { name, tag, source, handleChange } = this.props;
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
                    {keys.map(key => (
                      <tr>
                        <td>{key.split('/')[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>
        );
      }

      if (env) {
        envVars = (
          <div className="tab-content">
            <Row>
              <Col sm={12}>
                <Table condensed bordered responsive readOnly>
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
        );
      }
    }

    return (
      <Grid>
        <form>
          <Row>
            <Col sm={8}>
              <FormGroup controlId="name">
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  type="text"
                  value={name}
                  name="name"
                  placeholder="Enter name"
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup controlId="tag">
                <ControlLabel>Tag</ControlLabel>
                <FormControl
                  type="text"
                  value={tag}
                  name="tag"
                  placeholder="Enter tag"
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <FormGroup controlId="source">
                <ControlLabel>Source</ControlLabel>
                <InputGroup>
                  <FormControl
                    type="text"
                    value={source}
                    placeholder="Enter source"
                  />
                  <InputGroup.Addon onClick={() => handleChange('source')}>...</InputGroup.Addon>
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
        </form>

        <div>
          <h4>Info</h4>
          <Row>
            <Col sm={12}>
              <FormGroup controlId="author">
                <ControlLabel>Author</ControlLabel>
                <FormControl.Static>{author}</FormControl.Static>
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
                <FormControl.Static>{size}</FormControl.Static>
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup controlId="cmd">
                <ControlLabel>Cmd</ControlLabel>
                <FormControl.Static>{command}</FormControl.Static>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={4}>
              <FormGroup controlId="arch">
                <ControlLabel>Architecture</ControlLabel>
                <FormControl.Static>{arch}</FormControl.Static>
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup controlId="os">
                <ControlLabel>OS</ControlLabel>
                <FormControl.Static>{os}</FormControl.Static>
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup controlId="dockerVersion">
                <ControlLabel>Docker Version</ControlLabel>
                <FormControl.Static>{dockerVersion}</FormControl.Static>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <FormGroup controlId="dockerId">
                <ControlLabel>Docker ID</ControlLabel>
                <FormControl.Static>{dockerId}</FormControl.Static>
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
            <Tab eventKey={1} title="Exposed Ports">{exposedPorts}</Tab>
            <Tab eventKey={2} title="Env Vars">{envVars}</Tab>
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
      </Grid>
    );
  }
}

let Image = ({
  images,
  match,
  history,
  fetchImage: fetch,
  deleteImage: remove,
  // changeImage: change,
}) => {
  const id = match.params.id;

  const getDataById = () => {
    let data = {};
    const collection = images.data;
    for (let i = 0; i < collection.length; i += 1) {
      if (collection[i].id === id) {
        data = collection[i];
        break;
      }
    }
    return data;
  };

  const data = getDataById();

  const toolbarAddon = (
    <ButtonGroup>
      <Button>Pull</Button>
    </ButtonGroup>
  );

  return (
    <ContentForm
      history={history}
      mainUrl="/images"
      id={id}
      data={data}
      toolbarAddon={toolbarAddon}
      fetch={fetch}
      delete={remove}
    >
      <ImageForm id={id} />
    </ContentForm>
  );
};

Image.propTypes = {
  images: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  fetchImage: PropTypes.func.isRequired,
  deleteImage: PropTypes.func.isRequired,
  // changeImage: PropTypes.func.isRequired,
};

Image = connect(state => ({
  images: state.images,
}), {
  fetchImage,
  deleteImage,
})(Image);

let ImagesList = ({
  images,
  history,
  fetchImages: fetch,
  deleteImage: deleteSelected,
  pruneImages: prune,
  clarifyImages: clarify,
}) => {
  const toolbarAddon = (
    <ButtonGroup>
      <Button onClick={prune}>Prune</Button>
      <Button onClick={clarify}>Clarify</Button>
    </ButtonGroup>
  );
  return (
    <div>
      <PageTitle text="Images" />
      <ContentTable
        history={history}
        url="/images"
        data={images.data}
        isFetched={images.isFetched}
        fetch={fetch}
        deleteSelected={deleteSelected}
        toolbarAddon={toolbarAddon}
      />
    </div>
  );
};

ImagesList.propTypes = {
  history: PropTypes.shape().isRequired,
  images: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,

  fetchImages: PropTypes.func.isRequired,
  deleteImage: PropTypes.func.isRequired,
  pruneImages: PropTypes.func.isRequired,
  clarifyImages: PropTypes.func.isRequired,
};

ImagesList = connect(state => ({
  images: state.images,
}), {
  fetchImages,
  deleteImage,
  pruneImages,
  clarifyImages,
})(ImagesList);

const Images = () => (
  <Switch>
    <Route exact path="/images" component={ImagesList} />
    <Route path="/images/new" component={ImageTest} />
    <Route path="/images/:id" component={ImageTest} />
  </Switch>
);

export default Images;
