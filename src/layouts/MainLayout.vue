<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="vc-main-header border-b border-white/10 text-white shadow-sm">
      <q-toolbar class="mx-auto h-14 max-w-6xl gap-2 px-4 sm:gap-3 sm:px-6">
        <q-toolbar-title class="flex min-w-0 items-center text-sm font-semibold">
          <RouterLink
            to="/"
            aria-label="Ir para a página inicial"
            class="vc-header-brand inline-flex shrink-0 items-center rounded-sm"
          >
            <img
              :src="brandImageUrl"
              alt="ObservaODS"
              class="h-14 w-auto max-w-[132px] shrink-0 object-contain drop-shadow-sm sm:h-16 sm:max-w-[180px]"
            />
          </RouterLink>
        </q-toolbar-title>

        <nav class="hidden items-center gap-1 md:flex">
          <q-btn-dropdown
            v-for="group in menuGroups"
            :key="group.label"
            class="vc-header-menu"
            flat
            dense
            no-caps
            dropdown-icon="expand_more"
            :label="group.label"
            content-class="vc-header-dropdown"
          >
            <q-list dense padding class="min-w-[250px]">
              <q-item
                v-for="item in group.items"
                :key="item.to"
                clickable
                v-close-popup
                :to="item.to"
                active-class="vc-header-dropdown-active"
              >
                <q-item-section avatar>
                  <span class="vc-header-dropdown-icon">
                    <q-icon :name="item.icon" size="18px" />
                  </span>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-sm font-semibold text-slate-950">
                    {{ item.label }}
                  </q-item-label>
                  <q-item-label caption class="text-xs leading-snug text-slate-500">
                    {{ item.caption }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </nav>

        <div class="hidden text-right leading-tight xl:block">
          <p class="text-[10px] font-medium uppercase tracking-wide text-lime-100/70">
            Prefeitura Municipal
          </p>
          <p class="mt-1 text-xs font-semibold text-white">Vitória da Conquista</p>
        </div>

        <div
          v-if="auth.isAuthenticated && auth.user"
          class="vc-header-user flex min-w-0 items-center gap-2 border-l border-white/15 pl-2 sm:pl-3"
          :title="auth.user.name"
        >
          <q-avatar size="30px" class="hidden bg-lime-300 text-xs font-bold text-emerald-950 sm:flex">
            {{ userInitials }}
          </q-avatar>
          <div class="min-w-0 leading-tight">
            <span class="block max-w-20 truncate text-[11px] font-semibold text-white sm:max-w-32 sm:text-xs">
              {{ userFirstName }}
            </span>
            <span class="mt-0.5 hidden text-[9px] uppercase tracking-wide text-white/50 lg:block">
              Usuário logado
            </span>
          </div>
        </div>

        <q-btn
          v-if="auth.isAuthenticated"
          class="hidden sm:inline-flex"
          flat dense no-caps icon="logout" label="Sair"
          aria-label="Encerrar sessão"
          @click="logout"
        />
        <q-btn
          v-else
          class="hidden sm:inline-flex"
          flat dense no-caps icon="login" label="Entrar"
          to="/login"
        />

        <q-btn-dropdown
          class="vc-header-menu md:hidden"
          flat
          dense
          round
          dropdown-icon="menu"
          content-class="vc-header-dropdown"
        >
          <q-list
            dense
            padding
            class="vc-mobile-menu-list box-border max-h-[calc(100vh-16px)] w-[360px] max-w-[calc(100vw-16px)] overflow-x-hidden overflow-y-auto"
          >
            <template v-if="auth.isAuthenticated && auth.user">
              <q-item class="mb-1">
                <q-item-section avatar>
                  <q-avatar size="34px" class="bg-lime-200 text-xs font-bold text-emerald-950">
                    {{ userInitials }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-sm font-semibold text-slate-950">
                    {{ auth.user.name }}
                  </q-item-label>
                  <q-item-label caption class="truncate text-xs text-slate-500">
                    {{ auth.user.email }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup class="rounded-lg" @click="logout">
                <q-item-section avatar>
                  <span class="vc-header-dropdown-icon">
                    <q-icon name="logout" size="18px" />
                  </span>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-sm font-semibold text-slate-950">
                    Sair da conta
                  </q-item-label>
                  <q-item-label caption class="text-xs text-slate-500">
                    Encerrar a sessão com segurança
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator class="my-2" />
            </template>
            <template v-for="group in menuGroups" :key="group.label">
              <q-item-label
                header
                class="text-[11px] font-bold uppercase tracking-wide text-slate-500"
              >
                {{ group.label }}
              </q-item-label>
              <q-item
                v-for="item in group.items"
                :key="item.to"
                clickable
                v-close-popup
                :to="item.to"
                active-class="vc-header-dropdown-active"
              >
                <q-item-section avatar>
                  <span class="vc-header-dropdown-icon">
                    <q-icon :name="item.icon" size="18px" />
                  </span>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-sm font-semibold text-slate-950">
                    {{ item.label }}
                  </q-item-label>
                  <q-item-label caption class="text-xs leading-snug text-slate-500">
                    {{ item.caption }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <q-separator v-if="!auth.isAuthenticated" class="my-2" />
            <q-item v-if="!auth.isAuthenticated" clickable v-close-popup to="/login">
              <q-item-section avatar><span class="vc-header-dropdown-icon"><q-icon name="login" size="18px" /></span></q-item-section>
              <q-item-section><q-item-label class="text-sm font-semibold text-slate-950">Entrar</q-item-label></q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-transparent">
      <q-linear-progress
        v-if="isPageLoading"
        indeterminate
        color="lime-4"
        class="vc-route-loader"
      />

      <router-view v-slot="{ Component }">
        <Transition name="vc-page" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </Transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth-store';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const brandImageUrl = new URL('../assets/logo.png', import.meta.url).href;
const userFirstName = computed(() => auth.user?.name.trim().split(/\s+/)[0] || 'Usuário');
const userInitials = computed(() => {
  const name = auth.user?.name.trim();
  if (!name) return 'US';

  const parts = name.split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.charAt(0) ?? '' : '';
  return `${first}${last}`.toUpperCase();
});
const isPageLoading = ref(false);
let loadingTimer: number | undefined;

const menuGroups = [
  {
    label: 'Páginas',
    items: [
      {
        label: 'Início',
        caption: 'Visão geral do observatório',
        to: '/',
        icon: 'home',
      },
      {
        label: 'Objetivos ODS',
        caption: 'Metas, temas e prioridades',
        to: '/ods',
        icon: 'flag',
      },
      {
        label: 'Secretarias',
        caption: 'Áreas responsáveis e ações',
        to: '/secretarias',
        icon: 'account_balance',
      },
      {
        label: 'Transparência',
        caption: 'Fontes, dados e evidências',
        to: '/transparencia',
        icon: 'dataset',
      },
      {
        label: 'Admin',
        caption: 'Gestão mock dos dados',
        to: '/admin',
        icon: 'admin_panel_settings',
      },
    ],
  },
  {
    label: 'Quem somos',
    items: [
      {
        label: 'Sobre o ObservaODS',
        caption: 'Propósito, atuação e governança',
        to: '/quem-somos',
        icon: 'info',
      },
      {
        label: 'Metodologia',
        caption: 'Como dados e ODS se conectam',
        to: '/quem-somos#metodologia',
        icon: 'schema',
      },
      {
        label: 'Participação social',
        caption: 'Conselhos, sociedade civil e controle',
        to: '/quem-somos#participacao',
        icon: 'groups',
      },
    ],
  },
];

watch(
  () => route.fullPath,
  () => {
    isPageLoading.value = true;

    if (loadingTimer) {
      window.clearTimeout(loadingTimer);
    }

    loadingTimer = window.setTimeout(() => {
      isPageLoading.value = false;
    }, 480);
  },
);

onBeforeUnmount(() => {
  if (loadingTimer) {
    window.clearTimeout(loadingTimer);
  }
});

async function logout() {
  auth.logout();
  await router.push('/login');
}
</script>
