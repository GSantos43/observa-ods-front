import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/IndexPage.vue') },
      { path: 'ods/:id', component: () => import('@/pages/OdsDetailPage.vue') },
      { path: 'ods', component: () => import('@/pages/OdsPage.vue') },
      { path: 'secretarias', component: () => import('@/pages/SecretariasPage.vue') },
      { path: 'transparencia', component: () => import('@/pages/TransparenciaPage.vue') },
      { path: 'quem-somos', component: () => import('@/pages/QuemSomosPage.vue') },
      { path: 'login', name: 'login', component: () => import('@/pages/LoginPage.vue'), meta: { guestOnly: true } },
      { path: 'admin', name: 'admin', component: () => import('@/pages/AdminPage.vue'), meta: { requiresAuth: true } },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
];

export default routes;
