import { lazy } from 'react';
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  DEVICE_ROUTE,
  LOGIN_ROUTE,
  NOT_FOUND_ROUTE,
  ORDERS_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
  USER_ORDERS_ROUTE,
} from './utils/constants';

const AdminPage = lazy(() => import('./pages/AdminPage/AdminPage'));
const AuthPage = lazy(() => import('./pages/AuthPage/AuthPage'));
const BasketPage = lazy(() => import('./pages/BasketPage/BasketPage'));
const DevicePage = lazy(() => import('./pages/DevicePage/DevicePage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage/OrdersPage'));
const SingleOrderPage = lazy(() =>
  import('./pages/SingleOrderPage/SingleOrderPage')
);
const UserOrdersPage = lazy(() =>
  import('./pages/UserOrdersPage/UserOrdersPage.jsx')
);
const ShopPage = lazy(() => import('./pages/ShopPage/ShopPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/NotFound'));

export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    Component: AdminPage,
  },
  {
    path: BASKET_ROUTE,
    Component: BasketPage,
  },
  {
    path: SHOP_ROUTE,
    Component: ShopPage,
  },
  {
    path: ORDERS_ROUTE,
    Component: OrdersPage,
  },
  {
    path: ORDERS_ROUTE + '/:id',
    Component: SingleOrderPage,
  },
  {
    path: USER_ORDERS_ROUTE + '/:id',
    Component: UserOrdersPage,
  },
  {
    path: DEVICE_ROUTE + '/:id',
    Component: DevicePage,
  },
  {
    path: NOT_FOUND_ROUTE,
    Component: NotFoundPage,
  },
];
export const publicRoutes = [
  {
    path: SHOP_ROUTE,
    Component: ShopPage,
  },
  {
    path: LOGIN_ROUTE,
    Component: AuthPage,
  },
  {
    path: REGISTRATION_ROUTE,
    Component: AuthPage,
  },
  {
    path: DEVICE_ROUTE + '/:id',
    Component: DevicePage,
  },
];
