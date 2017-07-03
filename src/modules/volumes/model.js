import uuid from 'uuid';
import slug from 'slug';

import { database, docker } from '../../config';

const db = database();

const TABLE = 'volumes';

const types = {
  BIND: 'bind',
  VOLUME: 'volume',
};

export default class Volume {
  constructor(args) {
    this.id = args.id || uuid();
    this.name = args.name;
    this.type = args.type || types.BIND;
    this.readOnly = args.readOnly || false;
    this.hostDir = args.hostDir;
    this.internalDir = args.internalDir;
    this.slug = slug(this.name);
  }

  static getVolumes() {
    db.read();
    return db.get(TABLE).value();
  }

  static findById(id) {
    db.read();
    return db.get(TABLE).find({ id });
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

      if (volume.type === types.VOLUME) {
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
      if (volume.type === types.VOLUME) {
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
    }
    if (volume.type === types.VOLUME) {
      try {
        const dockerVolume = await docker.getVolume(volume.name);
        await dockerVolume.remove();

        return {
          secusses: db.get(TABLE).remove({ id }).write().length === 1,
          messages,
        };
      } catch (e) {
        return { secusses: false, messages: ['Can\'t remove volume', e.message] };
      }
    }
    return {
      secusses: db.get(TABLE).remove({ id }).write().length === 1,
      messages,
    };
  }

  static async refreshVolumes() {
    // const volumes = Volume.getVolumes();
    // let dockerVolumes = await docker.listVolumes();
    // dockerVolumes = dockerVolumes.Volumes;
    // for (const dockerVolume of dockerVolumes) {
    //   for (let i = 0; i < volumes.length;) {
    //     if (volumes[i].name === dockerVolume.Name) {
    //       volumes.splice(i, 1);
    //     } else {
    //       i += 1;
    //     }
    //   }
    // }
    // db.set(TABLE, volumes).write();
    //
    // return { volumes };
  }

  static async pruneVolumes() {
    const result = await docker.pruneVolumes();
    await Volume.refreshVolumes();
    return { cleaned: result.VolumesDeleted };
  }

  static getBinds(volume) {
    let result = '';
    result = `${volume.hostDir}:${volume.internalDir}`;
    if (volume.type === types.VOLUME) {
      result = `${volume.name}:${volume.internalDir}`;
    }
    if (volume.readOnly) {
      result += ':ro';
    }
    return result;
  }

  validate() {
    const messages = [];
    if (!this.name) {
      messages.push('Name is required!');
    }
    if (!this.hostDir) {
      messages.push('Host directory is required!');
    }
    if (!this.internalDir) {
      messages.push('Internal directory is required!');
    }
    return messages;
  }

  toJSON() {
    return { ...this };
  }
}
