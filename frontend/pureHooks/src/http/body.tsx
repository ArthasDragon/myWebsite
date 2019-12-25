import qs from 'qs';
import { isStr } from '@util/index';

export const disposeBody = (body, isJoin = true, ignore, bodyType) => {
  body = body || {};
  if (isJoin) {
    return qs.stringify(body);
  } else {
    switch (bodyType) {
      case 'json':
        if (isStr(body)) {
          try {
            body = JSON.parse(body);
          } catch (err) {
            return body;
          }
        } else {
          Object.keys(body).forEach(key => {
            let value = body[key];
            if (isStr(value)) {
              value = value.trim();
            }
            if (ignore.includes(value)) {
              delete body[key];
            } else {
              body[key] = value;
            }
          });
        }
        return JSON.stringify(body);
      case 'form':
        return disposeBody(body, true, ignore, null);
      case 'none':
        return body;
      default:
        return body;
    }
  }
};
