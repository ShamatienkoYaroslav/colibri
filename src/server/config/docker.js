import Docker from 'dockerode';

import constants from './constants';

const docker = new Docker({ socketPath: constants.DOCKER_SOCKET });

export default docker;
