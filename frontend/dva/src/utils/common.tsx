export const omit = (obj, fields) => {
  const copy = { ...obj };
  for (let i = fields.length - 1; i > -1; i--) {
    delete copy[fields[i]];
  }
  return copy;
};

export const isObj = obj => Object.prototype.toString.call(obj) === '[object Object]';
export const isFunc = obj => typeof obj === 'function';
export const isNum = obj => typeof obj === 'number' && !Number.isNaN(obj);
export const isStr = obj => typeof obj === 'string';
export const isBool = obj => typeof obj === 'boolean';
export const isArr = obj => Array.isArray(obj);
export const isUNN = obj => obj === null || obj === undefined || Number.isNaN(obj);
export const isSymbol = obj => typeof obj === 'symbol';
export const isEmptyArr = obj => {
  return isArr(obj) && obj.length === 0;
};
export const notEmptyArr = obj => {
  return isArr(obj) && obj.length > 0;
};
