import "whatwg-fetch";
import "babel-polyfill";
import "./index.less";
import React from "react";
import { render } from "react-dom";
import App from "./App";
import { AppContainer } from "react-hot-loader";
import "moment/locale/zh-cn";
import moment from "moment";
moment.locale("zh-cn");
const rootEl = document.getElementById("root");
render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootEl
);
if (module.hot) {
  module.hot.accept("./App", () => {
    const NewApp = require("./App").default;
    render(
      <AppContainer>
        <NewApp />
      </AppContainer>,
      rootEl
    );
  });
}
