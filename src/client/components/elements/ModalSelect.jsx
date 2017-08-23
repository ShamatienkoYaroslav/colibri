import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import ImagesSelect from '../images/ImagesSelect';
import TemplatesSelect from '../templates/TemplatesSelect';
import SourcesSelect from '../sources/SourcesSelect';
import VolumesSelect from '../volumes/VolumesSelect';
import { PageTitle } from '../elements';

const ModalSelect = ({
  table,
  show,
  onHide,
  onSelect,
}) => {
  let title = '';
  let body = null;
  if (table === 'images') {
    title = 'Select image';
    body = (
      <ImagesSelect onSelect={onSelect} />
    );
  } else if (table === 'templates') {
    title = 'Select template';
    body = (
      <TemplatesSelect onSelect={onSelect} />
    );
  } else if (table === 'sources') {
    title = 'Select source';
    body = (
      <SourcesSelect onSelect={onSelect} />
    );
  } else if (table === 'volumes') {
    title = 'Select volumes';
    body = (
      <VolumesSelect onSelect={onSelect} />
    );
  }

  return (
    <Modal bsSize="large" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          <PageTitle text={title} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
      </Modal.Body>
    </Modal>
  );
}

ModalSelect.propTypes = {
  table: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ModalSelect;