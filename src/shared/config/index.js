import ensureEnvVariablesExist from '../../shared/utils/ensureEnvVariablesExist';

ensureEnvVariablesExist([
  'NODE_ENV',
]);

const isDevelopment = process.env.NODE_ENV === 'development';

const CONFIG = {
  IS_DEVELOPMENT: isDevelopment,
  IS_HOT_DEVELOPMENT: isDevelopment && module.hot,
};

export default CONFIG;
