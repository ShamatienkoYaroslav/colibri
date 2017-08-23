import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';

const Icon = ({ glyph }) => (
  <span className="icon"><Glyphicon glyph={glyph} /></span>
);

Icon.propTypes = {
  glyph: PropTypes.string.isRequired,
};

Icon.Refresh = () => (
  <Icon glyph="refresh" />
);

Icon.Delete = () => (
  <Icon glyph="trash" />
);

Icon.Sync = () => (
  <Icon glyph="repeat" />
);

Icon.Prune = () => (
  <Icon glyph="fire" />
);

Icon.Pull = () => (
  <Icon glyph="download-alt" />
);

Icon.Save = () => (
  <Icon glyph="floppy-disk" />
);

Icon.Create = () => (
  <Icon glyph="plus" />
);

Icon.Close = () => (
  <Icon glyph="remove" />
);

Icon.Start = () => (
  <Icon glyph="play" />
);

Icon.Stop = () => (
  <Icon glyph="pause" />
);

Icon.Load = () => (
  <Icon glyph="arrow-down" />
);

Icon.Download = () => (
  <Icon glyph="arrow-up" />
);

export default Icon;
