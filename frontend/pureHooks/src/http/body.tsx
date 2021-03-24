import qs from 'qs';
import { isStr } from '@util/index';

/**
 * 处理向后端传的body
 * @param body 传入的json类型的body
 * @param isJoin 是否加入到url后面
 * @param ignore 需要筛除的字段值
 * @param bodyType 向后端传的body类型   json、form
 */
export const disposeBody = (body, isJoin = true, ignore, bodyType) => {
  body = body || {};
  if (isJoin) {
    // 如果需要拼接在url后面  直接返回格式化后的string
    return qs.stringify(body);
  } else {
    // 根据bodyType的值返回不同的方案
    switch (bodyType) {
      case 'json':
        if (isStr(body)) {
          // 如果body是string  变成json之后返回
          try {
            body = JSON.parse(body);
          } catch (err) {
            return body;
          }
        } else {
          // 将body中的一级字段如果是字符串的话收尾去除空格
          Object.keys(body).forEach(key => {
            let value = body[key];
            if (isStr(value)) {
              value = value.trim();
            }
            // 如果值是需要筛选的则删除
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
