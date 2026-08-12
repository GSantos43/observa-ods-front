import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/IndexPage.vue'), meta: { title: 'Início' } },
      { path: 'ods/:id', component: () => import('@/pages/OdsDetailPage.vue'), meta: { title: 'Detalhes do ODS' } },
      { path: 'ods', component: () => import('@/pages/OdsPage.vue'), meta: { title: 'Objetivos de Desenvolvimento Sustentável' } },
      { path: 'secretarias', component: () => import('@/pages/SecretariasPage.vue'), meta: { title: 'Secretarias Municipais' } },
      { path: 'transparencia', component: () => import('@/pages/TransparenciaPage.vue'), meta: { title: 'Transparência' } },
      { path: 'quem-somos', component: () => import('@/pages/QuemSomosPage.vue'), meta: { title: 'Quem Somos' } },
      { path: 'login', name: 'login', component: () => import('@/pages/LoginPage.vue'), meta: { guestOnly: true, title: 'Acesso Administrativo' } },
      { path: 'admin', name: 'admin', component: () => import('@/pages/AdminPage.vue'), meta: { requiresAuth: true, title: 'Painel Administrativo' } },
      { path: 'admin/triagem/:id', name: 'news-triage', component: () => import('@/pages/NewsTriagePage.vue'), meta: { requiresAuth: true, title: 'Triagem de Notícia' } },
    ],
  },
  {
    path: '/reproducao',
    name: 'reproducao',
    component: () => import('@/pages/ReproducaoPage.vue'),
    meta: { requiresAuth: true, title: 'Tela de Reprodução' },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
    meta: { title: 'Página não encontrada' },
  },
];

export default routes;
