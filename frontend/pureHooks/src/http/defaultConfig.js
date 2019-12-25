export default {
  body: {},
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
  },
  //fetch默认不带cookie的，需要带上cookie的话，就按如下设置
  credentials: 'include',
  ignore: ['', null, undefined],
  bodyType: 'json',
  autoShowError: true,
  dataType: 'json',
  //跨域
  // mode:'cors-with-forced-preflight'//'no-cors','cors'
};
