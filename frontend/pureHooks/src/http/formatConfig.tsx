import { disposeBody } from './body';

export const formatConfig = (url, config) => {
  const { body, ignore, bodyType, method } = config;
  const m = method.toLowerCase().trim();
  // 参数是否拼接到url后面
  let isJoin = m === 'get' || m === 'delete' || bodyType === 'form';
  // 若config中自定义了则按照config中的进行处理
  if ('isJoin' in config) {
    isJoin = config.isJoin;
  }
  const params = disposeBody(body, isJoin, ignore, bodyType);

  if (isJoin) {
    if (params) {
      if (url.indexOf('?') === -1) {
        url += '?';
      } else if (!url.endsWith('&')) {
        url += '&';
      }
      url += params;
    }
    delete config.body;
  } else {
    config.body = params;
  }

  if (bodyType === 'form' && config.headers) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  }
  return { url, config };
};
