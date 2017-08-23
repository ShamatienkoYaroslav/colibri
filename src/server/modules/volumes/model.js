/* eslint-disable no-restricted-syntax */

import uuid from 'uuid';
import slug from 'slug';

import { database, docker } from '../../config';

const db = database();

const TABLE = 'volumes';

const Types = {
  BIND: 'bind',
  VOLUME: 'volume',
};

export default class Volume {
  constructor(args) {
    this.id = args.id || uuid();
    if (args.type === Types.VOLUME) {
      this.name = slug(args.name, {
        replacement: '_',
        symbols: true,
        remove: null,
        lower: true,
        charmap: slug.charmap,
        multicharmap: slug.multicharmap,
      });
    } else {
      this.name = args.name;
    }
    this.type = args.type || Types.BIND;
    this.hostDir = args.hostDir || '';
    this.slug = slug(this.name);
    this.hide = args.hide || false;
  }

  static getVolumes(showAll = true) {
    db.read();
    if (showAll) {
      return db.get(TABLE).value() || [];
    }
    return db.get(TABLE).filter({ hide: false }).value() || [];
  }

  static findById(id) {
    db.read();
    return db.get(TABLE).find({ id });
  }

  static getVolume(id) {
    const volume = Volume.findById(id).value();
    if (volume) {
      return { volume, messages: [] };
    }
    return { volume: {}, messages: ['No such volume with this id'] };
  }

  static createVolume(args) {
    db.read();

    const volumeDb = db.get(TABLE).find({ name: args.name }).value();
    if (volumeDb) {
      return { volume: {}, messages: ['Volume with this name exists'] };
    }

    let volume = new Volume({ ...args });
    const messages = volume.validate();
    if (messages.length === 0) {
      volume = volume.toJSON();

      if (volume.type === Types.VOLUME) {
        try {
          docker.createVolume({ name: volume.name });
        } catch (e) {
          return { volume: {}, messages: ['Can\'t create volume', e.message] };
        }
      }

      db.get(TABLE).push(volume).write();
      return { volume, messages };
    }
    return { volume: {}, messages };
  }

  static changeVolume(id, args) {
    const volumeDb = Volume.findById(id);
    if (volumeDb.value()) {
      let volume = volumeDb.value();
      if (volume.type === Types.VOLUME) {
        return { volume, messages: ["Can't change volume with type \"volume\""] };
      }

      volume = new Volume({ ...args, id });
      const messages = volume.validate();
      if (messages.length === 0) {
        return {
          volume: volumeDb.assign({ ...volume.toJSON() }).write(),
          messages,
        };
      }
      return { volume: {}, messages };
    }
    return { volume: {}, messages: ['No such volume with this id'] };
  }

  static async removeVolume(id) {
    const messages = [];
    const volume = Volume.findById(id).value();
    if (!volume) {
      messages.push('No such volume with this id');
      return { success: false, messages };
    }
    if (volume.type === Types.VOLUME) {
      try {
        const dockerVolume = await docker.getVolume(volume.name);
        await dockerVolume.remove();
      } catch (e) {
        messages.push('Can\'t remove volume from host');
        messages.push(e.message);
      }
    }
    return {
      success: db.get(TABLE).remove({ id }).write().length === 1,
      messages,
    };
  }

  static async refreshVolumes(creatVolumes = true) {
    let messages = [];
    if (creatVolumes) {
      const result = await Volume.createVolumesFromHost();
      messages = result.messages;
    }

    const usedVolumes = [];
    const volumes = Volume.getVolumes();
    let dockerVolumes = await docker.listVolumes();
    dockerVolumes = dockerVolumes.Volumes;
    for (const volume of volumes) {
      let usedVolume = false;
      if (volume.type === Types.VOLUME) {
        if (dockerVolumes !== null) {
          for (const dockerVolume of dockerVolumes) {
            if (volume.name === dockerVolume.Name) {
              usedVolume = true;
              break;
            }
          }
        }
      } else {
        usedVolume = true;
      }
      if (usedVolume) {
        usedVolumes.push(volume);
      }
      db.set(TABLE, usedVolumes).write();
    }
    return { volumes: usedVolumes, messages };
  }

  static async pruneVolumes() {
    try {
      await docker.pruneVolumes();
    } catch (e) {
      return { volumes: [], messages: [e.toString()] };
    }
    const result = await Volume.refreshVolumes(false);
    return { volumes: result.volumes, messages: result.messages };
  }

  static async createVolumesFromHost() {
    const volumes = [];
    const messages = [];
    let dockerVolumes = await docker.listVolumes();
    dockerVolumes = dockerVolumes.Volumes;
    if (dockerVolumes) {
      for (const dockerVolume of dockerVolumes) {
        const volume = db.get(TABLE).find({ name: dockerVolume.Name }).value();
        if (!volume) {
          const args = {
            name: dockerVolume.Name,
            type: Types.VOLUME,
          };
          const result = Volume.createVolume(args);
          if (result.messages.length === 0) {
            messages.concat(result.messages);
          } else {
            volumes.push(result.volume);
          }
        }
      }
    }
    return { volumes, messages };
  }

  static getBinds(volume, internalDir, readOnly) {
    let result = '';
    result = `${volume.hostDir}:${internalDir}`;
    if (volume.type === Types.VOLUME) {
      result = `${volume.name}:${internalDir}`;
    }
    if (readOnly) {
      result += ':ro';
    }
    return result;
  }

  validate() {
    const messages = [];
    if (!this.name) {
      messages.push('Name is required!');
    }
    if (this.type === Types.BIND && !this.hostDir) {
      messages.push('Host directory is required!');
    }
    return messages;
  }

  toJSON() {
    return { ...this };
  }
}
