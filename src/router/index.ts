import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { useAuthStore } from '@/stores/auth-store';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(({ store }) => {
  const createHistory = import.meta.env.SSR ? createMemoryHistory : createWebHistory;

  const Router = createRouter({
    scrollBehavior: (to) => {
      if (to.hash) {
        return { el: to.hash, behavior: 'smooth', top: 88 };
      }

      return { left: 0, top: 0 };
    },
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.BASE_URL),
  });

  Router.beforeEach(async (to) => {
    const auth = useAuthStore(store);
    try { await auth.restoreSession(); } catch { auth.logout(); }
    if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } };
    if (to.meta.guestOnly && auth.isAuthenticated) return { name: 'admin' };
    return true;
  });

  return Router;
});
