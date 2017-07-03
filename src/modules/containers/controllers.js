import Container from './model';

export const all = (req, res) => {
  try {
    res.status(200).json(Container.getContainers());
  } catch (e) {
    res.status(400).json(e);
  }
};

export const create = async (req, res) => {
  try {
    res.status(200).json(await Container.createContainer(req.body));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const change = (req, res) => {
  try {
    res.status(200).json(Container.changeContainer(req.params.id, req.body));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const start = async (req, res) => {
  try {
    res.status(200).json(await Container.startContainer(req.params.id));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const stop = async (req, res) => {
  try {
    res.status(200).json(await Container.stopContainer(req.params.id));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const remove = async (req, res) => {
  try {
    res.status(200).json(await Container.removeContainer(req.params.id));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const refresh = async (req, res) => {
  try {
    res.status(200).json(await Container.refreshContainers());
  } catch (e) {
    res.status(400).json(e);
  }
};

export const prune = async (req, res) => {
  try {
    res.status(200).json(await Container.pruneContainers());
  } catch (e) {
    res.status(400).json(e);
  }
};
