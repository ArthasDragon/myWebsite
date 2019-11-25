import Home from '@/pages/Home';
import Gallery from '@/pages/Gallery';
import Cart from '@/pages/Cart';
import Games from '@/pages/Games';

export default [
  {
    path: '/home',
    component: Home,
    routes: [
      {
        path: '/cart',
        component: Cart,
      },
    ],
  },
  {
    path: '/gallery',
    component: Gallery,
  },
  {
    path: '/games',
    component: Games,
  },
];
