import React from "react";
import * as Loadable from "react-loadable";

export const asyncLoad = (path: "String") =>
  Loadable({
    loader: () => import(path),
    loading: () => <div>加载中...</div>,
  });
