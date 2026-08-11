<template>
  <q-page class="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-[#eef2ee] px-4 py-10">
    <main class="grid w-full max-w-5xl overflow-hidden rounded-xl border border-emerald-950/10 bg-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
      <section class="relative hidden overflow-hidden bg-[#061f12] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div class="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lime-300/10" />
        <div class="relative">
          <span class="grid h-12 w-12 place-items-center rounded-lg bg-lime-300 text-xs font-black text-[#06230f]">ODS</span>
          <p class="mt-8 text-xs font-black uppercase tracking-[0.18em] text-lime-200">Área administrativa</p>
          <h1 class="mt-4 max-w-md text-4xl font-black leading-tight">Dados públicos com gestão responsável.</h1>
          <p class="mt-5 max-w-md text-sm leading-7 text-white/70">Acesse o ambiente de curadoria de metas, indicadores, fontes e ações municipais vinculadas à Agenda 2030.</p>
        </div>
        <div class="relative flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-white/65">
          <q-icon name="verified_user" size="22px" class="text-lime-300" />
          Sessão protegida e acesso restrito à equipe autorizada
        </div>
      </section>

      <section class="p-6 sm:p-10 lg:p-12">
        <RouterLink to="/" class="vc-ods-about-eyebrow">
          <q-icon name="west" size="18px" /> Voltar ao observatório
        </RouterLink>
        <div class="mt-10">
          <p class="text-xs font-black uppercase tracking-wide text-[#1d6d13]">Bem-vindo</p>
          <p role="heading" aria-level="1" class="mt-2 text-3xl font-black text-slate-950">Entrar no ObservaODS</p>
          <p class="mt-3 text-sm leading-6 text-slate-500">Use suas credenciais institucionais para continuar.</p>
        </div>

        <q-form class="mt-8 space-y-4" @submit="submit">
          <q-input v-model.trim="email" outlined type="email" label="E-mail" autocomplete="username" :rules="[(value: string) => Boolean(value) || 'Informe o e-mail']">
            <template #prepend><q-icon name="mail_outline" /></template>
          </q-input>
          <q-input v-model="password" outlined :type="showPassword ? 'text' : 'password'" label="Senha" autocomplete="current-password" :rules="[(value: string) => value.length >= 8 || 'A senha deve ter pelo menos 8 caracteres']">
            <template #prepend><q-icon name="lock_outline" /></template>
            <template #append><q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword = !showPassword" /></template>
          </q-input>
          <q-banner v-if="error" dense rounded class="bg-red-50 text-red-800"><template #avatar><q-icon name="error_outline" /></template>{{ error }}</q-banner>
          <q-btn class="h-12 w-full" color="green-9" type="submit" icon="login" label="Entrar" no-caps :loading="auth.loading" />
        </q-form>
      </section>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth-store';

const auth = useAuthStore(); const route = useRoute(); const router = useRouter();
const email = ref(''); const password = ref(''); const showPassword = ref(false); const error = ref('');
async function submit() {
  error.value = '';
  try { await auth.login(email.value, password.value); const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') ? route.query.redirect : '/admin'; await router.replace(redirect); }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Não foi possível entrar.'; }
}
</script>
