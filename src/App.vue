<template>
  <router-view />

  <Transition name="vc-route-loading">
    <div
      v-if="routeLoading"
      class="vc-route-loading"
      role="status"
      aria-live="polite"
      aria-label="Carregando página"
    >
      <div class="vc-route-loading__content">
        <q-spinner-puff color="light-green-5" size="58px" :thickness="4" />
        <span>Carregando conteúdo</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/latin-800.css';
import '@fontsource/inter/latin-ext-400.css';
import '@fontsource/inter/latin-ext-500.css';
import '@fontsource/inter/latin-ext-600.css';
import '@fontsource/inter/latin-ext-700.css';
import '@fontsource/inter/latin-ext-800.css';
import { routeLoading } from '@/services/route-loading';
</script>

<style scoped>
.vc-route-loading {
  position: fixed;
  z-index: 10000;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgb(3 24 14 / 68%);
  cursor: progress;
  backdrop-filter: blur(3px);
}

.vc-route-loading__content {
  display: flex;
  min-width: 190px;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  padding: 1.4rem 1.7rem;
  border: 1px solid rgb(255 255 255 / 14%);
  border-radius: 0.8rem;
  background: rgb(4 36 21 / 88%);
  color: #fff;
  box-shadow: 0 22px 55px rgb(0 0 0 / 30%);
}

.vc-route-loading__content span {
  font-size: 0.78rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.vc-route-loading-enter-active,
.vc-route-loading-leave-active {
  transition: opacity 180ms ease;
}

.vc-route-loading-enter-from,
.vc-route-loading-leave-to {
  opacity: 0;
}
</style>
