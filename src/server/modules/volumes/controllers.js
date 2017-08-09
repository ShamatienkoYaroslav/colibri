import Volume from './model';
import User from '../users/model';

export const all = (req, res) => {
  try {
    res.status(200).json(Volume.getVolumes(User.userIsAdmin(req.user)));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const create = (req, res) => {
  try {
    if (!User.userCanChange(req.user)) {
      throw new Error('Access error');
    }
    res.status(200).json(Volume.createVolume(req.body));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const change = (req, res) => {
  try {
    if (!User.userCanChange(req.user)) {
      throw new Error('Access error');
    }
    res.status(200).json(Volume.changeVolume(req.params.id, req.body));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const remove = async (req, res) => {
  try {
    if (!User.userCanChange(req.user)) {
      throw new Error('Access error');
    }
    res.status(200).json(await Volume.removeVolume(req.params.id));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const refresh = async (req, res) => {
  try {
    if (!User.userCanChange(req.user)) {
      throw new Error('Access error');
    }
    res.status(200).json(await Volume.refreshVolumes());
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const prune = async (req, res) => {
  try {
    if (!User.userCanChange(req.user)) {
      throw new Error('Access error');
    }
    res.status(200).json(await Volume.pruneVolumes());
  } catch (e) {
    res.status(400).json(e.toString());
  }
};
