import React from 'react';
import * as Loadable from 'react-loadable';

export const asyncLoad = path =>
  Loadable({
    loader: () => import(`@/pages/${path}`),
    loading: () => <div>加载中...</div>,
  });
