import React from "react";
import * as Loadable from "react-loadable";

export const asyncLoad = path =>
  Loadable({
    loader: () => import(path),
    loading: () => <div>加载中...</div>
  });
