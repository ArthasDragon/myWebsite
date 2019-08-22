import Home from '@/pages/Home';
import Bus from '@/pages/Bus';
import Cart from '@/pages/Cart';

export default [
  {
    path: '/',
    component: Home,
    routes: [
      {
        path: '/bus',
        component: Bus,
      },
      {
        path: '/cart',
        component: Cart,
      },
    ],
  },
];
