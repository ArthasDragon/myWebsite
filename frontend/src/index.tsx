import 'babel-polyfill';
import * as moment from 'moment';
import 'whatwg-fetch';
import '@/styles/index.less';
import 'antd/dist/antd.less';

import models from './models';

import dva from 'dva';
import router from './routerConfig/dva';

moment.locale('zh-cn');

const app = dva();

if (Array.isArray(models)) {
  models.forEach(model => {
    app.model(model);
  });
}

app.router(router);

app.start('#root');
