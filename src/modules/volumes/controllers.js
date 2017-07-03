import Volume from './model';

export const all = (req, res) => {
  try {
    res.status(200).json(Volume.getVolumes());
  } catch (e) {
    res.status(400).json(e);
  }
};

export const create = (req, res) => {
  try {
    res.status(200).json(Volume.createVolume(req.body));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const change = (req, res) => {
  try {
    res.status(200).json(Volume.changeVolume(req.params.id, req.body));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const remove = async (req, res) => {
  try {
    res.status(200).json(await Volume.removeVolume(req.params.id));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const refresh = async (req, res) => {
  try {
    res.status(200).json(await Volume.refreshVolumes());
  } catch (e) {
    res.status(400).json(e);
  }
};

export const prune = async (req, res) => {
  try {
    res.status(200).json(await Volume.pruneVolumes());
  } catch (e) {
    res.status(400).json(e);
  }
};
