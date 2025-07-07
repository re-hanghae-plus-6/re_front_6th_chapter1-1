import DefaultLayout from '../components/layout/DefaultLayout.js';
import HomePage from '../pages/home/HomePage.js';
import DetailPage from '../pages/home/detail/DetailPage.js';
import NotFoundPage from '../pages/NotFoundPage.js';
import ExamplePage from '../pages/ExamplePage.js';

export const ROUTES = [
  {
    path: '',
    layout: DefaultLayout,
    children: [
      {
        path: '',
        component: HomePage,
      },
      { path: 'detail/:id', component: DetailPage },
      { path: 'example', component: ExamplePage },
    ],
  },
  {
    path: '404',
    component: NotFoundPage,
  },
];
