import React from 'react';
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
} from 'react-bootstrap';

import { fetchTemplates, fetchTemplate, deleteTemplate } from '../actions/templates';

import { PageTitle, ContentTable, ContentForm } from './elements';

const TemplateForm = ({
  name,
  image,
  volumes,
  handleChange,
}) => (
  <Grid>
    <form>
      <Row>
        <Col sm={12}>
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
      </Row>

      <Row>
        <Col sm={12}>
          <FormGroup controlId="image">
            <ControlLabel>Image</ControlLabel>
            <InputGroup>
              <FormControl
                type="text"
                value={image}
                placeholder="Enter image"
              />
              <InputGroup.Addon onClick={() => handleChange('image')}>...</InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        </Col>
      </Row>
    </form>
  </Grid>
);

let Template = ({
  templates,
  match,
  history,
  fetchTemplate: fetch,
  deleteTemplate: remove,
}) => {
  const id = match.params.id;

  const getDataById = () => {
    let data = {};
    const collection = templates.data;
    for (let i = 0; i < collection.length; i += 1) {
      if (collection[i].id === id) {
        data = collection[i];
        break;
      }
    }
    return data;
  };

  const data = getDataById();

  return (
    <ContentForm
      history={history}
      mainUrl="/templates"
      id={id}
      data={data}
      fetch={fetch}
      delete={remove}
    >
      <TemplateForm />
    </ContentForm>
  );
};

Template.propTypes = {
  templates: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  fetchTemplate: PropTypes.func.isRequired,
  deleteTemplate: PropTypes.func.isRequired,
};

Template = connect(state => ({
  templates: state.templates,
}), {
  fetchTemplate,
  deleteTemplate,
})(Template);

let TemplatesList = ({
  templates,
  history,
  fetchTemplates: fetch,
  deleteTemplate: deleteSelected,
}) => (
  <div>
    <PageTitle text="Templates" />
    <ContentTable
      history={history}
      url="/templates"
      data={templates.data}
      isFetched={templates.isFetched}
      fetch={fetch}
      deleteSelected={deleteSelected}
    />
  </div>
);

TemplatesList.propTypes = {
  history: PropTypes.shape().isRequired,
  templates: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
  }).isRequired,

  fetchTemplates: PropTypes.func.isRequired,
  deleteTemplate: PropTypes.func.isRequired,
};

TemplatesList = connect(state => ({
  templates: state.templates,
}), {
  fetchTemplates,
  deleteTemplate,
})(TemplatesList);

const Templates = () => (
  <Switch>
    <Route exact path="/templates" component={TemplatesList} />
    <Route path="/templates/new" component={Template} />
    <Route path="/templates/:id" component={Template} />
  </Switch>
);

export default Templates;
