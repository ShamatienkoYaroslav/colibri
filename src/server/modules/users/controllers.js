import User from './model';

export const all = (req, res) => {
  try {
    res.status(200).json(User.getUsers());
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const login = (req, res) => {
  try {
    res.status(200).json(User.loginUser(req.user));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const create = (req, res) => {
  try {
    res.status(201).json(User.createUser(req.body));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const change = (req, res) => {
  try {
    res.status(200).json(User.changeUser(req.params.id, req.body));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const remove = (req, res) => {
  try {
    res.status(200).json(User.removeUser(req.params.id));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};
