import ImageSource from './model';

export const all = (req, res) => {
  try {
    res.status(200).json(ImageSource.getImageSources());
  } catch (e) {
    res.status(400).json(e);
  }
};

export const create = (req, res) => {
  try {
    res.status(200).json(ImageSource.createImageSource(req.body));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const change = (req, res) => {
  try {
    res.status(200).json(ImageSource.changeImageSource(req.params.id, req.body));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const remove = (req, res) => {
  try {
    res.status(200).json(ImageSource.removeImageSource(req.params.id));
  } catch (e) {
    res.status(400).json(e);
  }
};
