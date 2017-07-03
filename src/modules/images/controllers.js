import Image from './model';

export const all = (req, res) => {
  try {
    res.status(200).json(Image.getImages());
  } catch (e) {
    res.status(400).json(e);
  }
};

export const create = (req, res) => {
  try {
    res.status(201).json(Image.createImage(req.body));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const change = (req, res) => {
  try {
    res.status(200).json(Image.changeImage(req.params.id, req.body));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const remove = async (req, res) => {
  try {
    res.status(200).json(await Image.removeImage(req.params.id));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const info = (req, res) => {
  Image.getInfo(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((e) => {
      res.status(400).json(e);
    });
};

export const pull = (req, res) => {
  Image.pullImage(req.params.id, (e, payload) => {
    if (e) {
      res.status(400).json(e);
    }
    res.status(200).json(payload);
  });
};

export const refresh = async (req, res) => {
  try {
    res.status(200).json(await Image.refreshImages());
  } catch (e) {
    res.static(400).json(e);
  }
};

export const prune = async (req, res) => {
  try {
    res.status(200).json(await Image.pruneImages());
  } catch (e) {
    res.static(400).json(e);
  }
};
