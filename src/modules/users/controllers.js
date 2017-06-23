import User from './model';

export const login = (req, res) => {
  try {
    res.status(200).json(User.loginUser(req.user));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const create = (req, res) => {
  try {
    res.status(201).json(User.createUser(req.body));
  } catch (e) {
    res.status(400).json(e);
  }
};

export const change = (req, res) => {
  try {
    res.status(200).json(User.changeUser(req.params.id, req.body));
  } catch (e) {
    res.status(400).json(e);
  }
};
