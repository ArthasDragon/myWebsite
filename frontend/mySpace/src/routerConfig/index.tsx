import { asyncLoad } from '@util/index';

export default [
  {
    path: '/',
    component: asyncLoad('Home'),
    routes: [
      {
        path: '/bus',
        component: asyncLoad('Bus'),
      },
      {
        path: '/cart',
        component: asyncLoad('Cart'),
      },
    ],
  },
];
