import defaultConfig from './defaultConfig';
import { omit } from '@util/index';
import { formatConfig } from './formatConfig';
import { message } from 'antd';

/**
 *
 * @param u 请求地址
 * @param c 配置参数
 */
const uniHttp = async (u, c) => {
  const { dataType, autoShowError } = c;

  const { url, config } = formatConfig(u, c);
  const newConfig = omit(config, [
    'ignore',
    'bodyType',
    'autoShowError',
    'isJoin',
    'errMsg',
    'dataType',
  ]);

  try {
    const info = await fetch(url, {
      ...newConfig,
    });

    const resResult = await info[dataType]();

    if (autoShowError) {
      const { status, msg = '' } = resResult;

      if (status !== 'success') {
        message.warn(`请求失败，原因为：${msg}`);
      }
    }

    return resResult;
  } catch (err) {
    console.log(err);
    return { data: {}, RetCode: 4444, msg: err, success: false };
  }
};

export default {
  get: (url, config = {}) => async params => {
    return uniHttp(url, { method: 'GET', ...defaultConfig, ...config, body: params });
  },
  post: (url, config = {}) => async params => {
    return uniHttp(url, { method: 'POST', ...defaultConfig, ...config, body: params });
  },
};
