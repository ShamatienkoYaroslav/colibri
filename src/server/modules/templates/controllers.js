import Template from './model';
import User from '../users/model';

export const all = (req, res) => {
  try {
    res.status(200).json(Template.getTemplates(User.userIsAdmin(req.user)));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const one = (req, res) => {
  try {
    res.status(200).json(Template.getTemplate(req.params.id));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const create = (req, res) => {
  try {
    if (!User.userCanChange(req.user)) {
      throw new Error('Access error');
    }
    res.status(201).json(Template.createTemplate(req.body));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const change = (req, res) => {
  try {
    if (!User.userCanChange(req.user)) {
      throw new Error('Access error');
    }
    res.status(200).json(Template.changeTemplate(req.params.id, req.body));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const remove = (req, res) => {
  try {
    if (!User.userCanChange(req.user)) {
      throw new Error('Access error');
    }
    res.status(200).json(Template.removeTemplate(req.params.id));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const refresh = (req, res) => {
  try {
    if (!User.userCanChange(req.user)) {
      throw new Error('Access error');
    }
    res.status(200).json(Template.refreshTemplates());
  } catch (e) {
    res.status(400).json(e.toString());
  }
};
