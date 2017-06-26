const devConfig = {
  DATA_FILE: './data/db-dev.json',
  SETTINGS_FILE: './data/settings-dev.json',
  USER_NAME: 'dev',
  USER_PASSWORD: 'dev',
  JWT_SECRET: 'spacesheep',
};

const testConfig = {
  DATA_FILE: './data/db-test.json',
  SETTINGS_FILE: './data/settings-test.json',
  USER_NAME: 'test',
  USER_PASSWORD: 'test',
};

const prodConfig = {
  DATA_FILE: './data/db.json',
  SETTINGS_FILE: './data/.settings.json',
  USER_NAME: 'admin',
  USER_PASSWORD: 'admin',
};

const defaultConfig = {
  PORT: process.env.PORT || 5000,
  CRYPTO_ALGORITM: 'aes-256-ctr',
  CRYPTO_PASSWORD: 'wildwolf',
  DOCKER_SOCKET: '/var/run/docker.sock',
};

function envConfig(env) {
  switch (env) {
    case 'development':
      return devConfig;
    case 'test':
      return testConfig;
    default:
      return prodConfig;
  }
}

export default {
  ...defaultConfig,
  ...envConfig(process.env.NODE_ENV),
};
