import 'babel-polyfill';
import * as moment from 'moment';
import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import 'whatwg-fetch';
import App from './App';
import './styles/index.less';
moment.locale('zh-cn');

const rootEl = document.getElementById('root');
render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootEl
);
// if (module.hot) {
//   module.hot.accept("./App", () => {
//     const NewApp = require("./App").default;
//     render(
//       <AppContainer>
//         <NewApp />
//       </AppContainer>,
//       rootEl
//     );
//   });
// }
