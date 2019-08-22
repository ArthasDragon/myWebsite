import defaultConfig from './defaultConfig';
import { omit } from '@util/index';
import { formatConfig } from './formatConfig';

const uniHttp = async (u, c) => {
  const { dataType } = c;

  const { url, config } = formatConfig(u, c);
  const newConfig = omit(config, [
    'ignore',
    'bodyType',
    'autoShowError',
    'isJoin',
    'errMsg',
    'dataType',
  ]);
  const info = await fetch(url, {
    ...newConfig,
  });
  return info[dataType]();
};

export default {
  get: (url, config = {}) => async params => {
    return uniHttp(url, { method: 'GET', ...defaultConfig, ...config, body: params });
  },
  post: (url, config = {}) => async params => {
    return uniHttp(url, { method: 'POST', ...defaultConfig, ...config, body: params });
  },
};
