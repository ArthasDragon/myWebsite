import React from 'react';
import * as Loadable from 'react-loadable';

function Loading() {
  return <div>加载中...</div>;
}

export const asyncLoad = path =>
  Loadable({
    loader: () => import(`@/pages/${path}`),
    loading: Loading,
  });
