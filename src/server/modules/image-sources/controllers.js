import ImageSource from './model';
import User from '../users/model';

export const all = (req, res) => {
  try {
    res.status(200).json(ImageSource.getImageSources(User.userIsAdmin(req.user)));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const one = (req, res) => {
  try {
    res.status(200).json(ImageSource.getImageSource(req.params.id));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const create = (req, res) => {
  try {
    res.status(200).json(ImageSource.createImageSource(req.body));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const change = (req, res) => {
  try {
    res.status(200).json(ImageSource.changeImageSource(req.params.id, req.body));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const remove = (req, res) => {
  try {
    res.status(200).json(ImageSource.removeImageSource(req.params.id));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};
