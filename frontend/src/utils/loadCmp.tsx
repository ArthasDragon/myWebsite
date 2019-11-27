import React from 'react';
import * as Loadable from 'react-loadable';

export const asyncLoad = path =>
  Loadable({
    loader: () => import(`@/pages/${path}`),
    loading: () => <div>加载中...</div>,
  });

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
