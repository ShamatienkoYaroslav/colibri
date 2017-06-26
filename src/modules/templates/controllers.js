import Template from './model';

export const all = (req, res) => {
  try {
    res.status(200).json(Template.getTemplates());
  } catch (e) {
    res.status(400).json(e);
  }
};

export const create = (req, res) => {
  try {
    res.status(201).json(Template.createTemplate(req.body));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const change = (req, res) => {
  try {
    res.status(200).json(Template.changeTemplate(req.params.id, req.body));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const remove = (req, res) => {
  try {
    res.status(200).json(Template.removeTemplate(req.params.id));
  } catch (e) {
    res.status(400).json(e);
  }
};
