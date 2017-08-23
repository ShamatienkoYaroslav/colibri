import os from 'os';

import Container from './model';
import User from '../users/model';

export const all = (req, res) => {
  try {
    res.status(200).json(Container.getContainers(User.userIsAdmin(req.user)));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const one = (req, res) => {
  try {
    res.status(200).json(Container.getContainer(req.params.id));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const create = async (req, res) => {
  try {
    res.status(200).json(await Container.createContainer(req.body));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const change = (req, res) => {
  try {
    res.status(200).json(Container.changeContainer(req.params.id, req.body));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const start = async (req, res) => {
  try {
    res.status(200).json(await Container.startContainer(req.params.id));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const stop = async (req, res) => {
  try {
    res.status(200).json(await Container.stopContainer(req.params.id));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const remove = async (req, res) => {
  try {
    res.status(200).json(await Container.removeContainer(req.params.id));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const refresh = async (req, res) => {
  try {
    res.status(200).json(await Container.refreshContainers());
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const prune = async (req, res) => {
  try {
    res.status(200).json(await Container.pruneContainers());
  } catch (e) {
    res.status(400).json(e.toString());
  }
};
