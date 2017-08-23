import fs from 'fs';
import path from 'path';

import Image from './model';
import User from '../users/model';
import { upload } from '../../utils';

export const all = (req, res) => {
  try {
    res.status(200).json(Image.getImages(User.userIsAdmin(req.user)));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const one = (req, res) => {
  try {
    res.status(200).json(Image.getImage(req.params.id));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const create = (req, res) => {
  try {
    res.status(201).json(Image.createImage(req.body));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const change = (req, res) => {
  try {
    res.status(200).json(Image.changeImage(req.params.id, req.body));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const remove = async (req, res) => {
  try {
    res.status(200).json(await Image.removeImage(req.params.id));
  } catch (e) {
    res.status(400).json(e.toString());
  }
};

export const info = (req, res) => {
  Image.getInfo(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((e) => {
      res.status(400).json(e.toString());
    });
};

export const pull = (req, res) => {
  Image.pullImage(req.params.id, (e, payload) => {
    if (e) {
      res.status(400).json(e.toString());
    }
    res.status(200).json(payload);
  });
};

export const loadImage = (req, res) => {
  Image.pullImageFromFile(req.file.filename, (e, payload) => {
    if (e) {
      res.status(400).json(e.toString());
    }
    res.status(200).json(payload);
  });
};

export const refresh = async (req, res) => {
  try {
    const result = await Image.refreshImages();
    res.status(200).json(result);
  } catch (e) {
    res.static(400).json(e.toString());
  }
};

export const prune = async (req, res) => {
  try {
    res.status(200).json(await Image.pruneImages());
  } catch (e) {
    res.static(400).json(e.toString());
  }
};

export const download = async (req, res) => { // TODO: BUG - size of downloaded file is bigger then real
  try {
    const { filename, messages } = await Image.getFileToDownloadImage(req.params.id);
    if (messages.length === 0) {
      res.status(200).download(path.resolve('.', filename), (e) => {
        if (e) { throw e; }
      });
    } else {
      res.status(200).json({ messages });
    }
  } catch (e) {
    res.static(400).json(e.toString());
  }
};