<template>
  <q-page class="vc-secretarias-page min-h-screen">
    <main class="vc-secretarias-main mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-10">
      <section class="vc-secretarias-hero">
        <div>
          <div class="vc-secretarias-hero-topbar">
            <RouterLink
              to="/"
              class="vc-about-back vc-back-icon-only"
              aria-label="Voltar para o início"
              title="Voltar para o início"
            >
              <q-icon name="chevron_left" size="28px" />
            </RouterLink>
            <p class="vc-ods-about-eyebrow">Secretarias municipais</p>
          </div>
          <p role="heading" aria-level="1" class="vc-secretarias-title">
            Áreas responsáveis pela execução e acompanhamento das políticas públicas
          </p>
          <p class="vc-secretarias-lead">
            Esta página organiza as áreas do município que podem contribuir com indicadores, ações e
            programas vinculados aos ODS.
          </p>
        </div>

      </section>

      <section class="vc-secretarias-content">
        <article class="vc-secretarias-flow">
          <div class="vc-secretarias-flow-header">
            <div class="min-w-0">
              <p class="text-xs font-black uppercase tracking-wide text-[#1d6d13]">
                Fluxo de trabalho
              </p>
              <p role="heading" aria-level="2" class="vc-about-title text-slate-950">
                Como cada secretaria entra no observatório
              </p>
              <p class="vc-secretarias-flow-copy">
                Uma sequência simples transforma informações setoriais em evidências públicas
                organizadas por ODS.
              </p>
            </div>
            <span class="vc-secretarias-flow-icon">
              <q-icon name="account_tree" size="22px" />
            </span>
          </div>

          <div class="vc-secretarias-steps">
            <div v-for="step in workflow" :key="step.label" class="vc-secretarias-step">
              <span>{{ step.index }}</span>
              <strong>{{ step.label }}</strong>
              <p>{{ step.text }}</p>
            </div>
          </div>
        </article>

        <aside class="vc-secretarias-panel">
          <p class="text-xs font-black uppercase tracking-wide text-lime-200">Governança ODS</p>
          <p class="mt-3 text-2xl font-black leading-tight text-white">
            Responsabilidade compartilhada, leitura integrada
          </p>
          <p class="mt-4 text-sm leading-7 text-white/78">
            As secretarias alimentam dados, validam evidências e conectam ações municipais aos
            objetivos acompanhados no ObservaODS.
          </p>

          <div class="vc-secretarias-checks">
            <div v-for="item in governanceChecks" :key="item" class="vc-secretarias-check">
              <q-icon name="done" size="18px" />
              <span>{{ item }}</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  </q-page>
</template>

<script setup lang="ts">
const workflow = [
  {
    index: '01',
    label: 'Informar',
    text: 'Secretarias indicam ações, programas e fontes oficiais.',
  },
  {
    index: '02',
    label: 'Validar',
    text: 'Equipes técnicas revisam método, período e recorte territorial.',
  },
  {
    index: '03',
    label: 'Acompanhar',
    text: 'Dados entram no painel para leitura pública por ODS.',
  },
];

const governanceChecks = [
  'Ações vinculadas aos ODS',
  'Fontes públicas identificadas',
  'Indicadores com responsável técnico',
  'Atualização contínua por período',
];
</script>
