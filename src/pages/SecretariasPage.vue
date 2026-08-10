<template>
  <q-page class="vc-secretarias-page min-h-screen">
    <main class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-10">
      <RouterLink to="/" class="vc-about-back">
        <q-icon name="west" size="18px" />
        Voltar para o início
      </RouterLink>

      <section class="vc-secretarias-hero mt-6">
        <div>
          <p class="vc-ods-about-eyebrow">Secretarias municipais</p>
          <p role="heading" aria-level="1" class="vc-secretarias-title">
            Áreas responsáveis pela execução e acompanhamento das políticas públicas
          </p>
          <p class="vc-secretarias-lead">
            Esta página organiza as áreas do município que podem contribuir com indicadores, ações e
            programas vinculados aos ODS.
          </p>
        </div>

        <aside class="vc-secretarias-summary">
          <span class="vc-secretarias-summary-icon">
            <q-icon name="account_balance" size="24px" />
          </span>
          <strong>3 eixos</strong>
          <span>execução, evidência e monitoramento</span>
        </aside>
      </section>

      <section class="vc-secretarias-grid mt-6">
        <article
          v-for="item in departments"
          :key="item.title"
          class="vc-secretaria-card"
          :style="{ '--secretaria-accent': item.color }"
        >
          <div class="vc-secretaria-card-head">
            <span class="vc-secretaria-icon">
              <q-icon :name="item.icon" size="22px" />
            </span>
            <span class="vc-secretaria-badge">{{ item.badge }}</span>
          </div>

          <p role="heading" aria-level="2" class="vc-secretaria-title">
            {{ item.title }}
          </p>
          <p class="mt-3 text-sm leading-6 text-slate-600">{{ item.text }}</p>

          <div class="mt-5 flex flex-wrap gap-2">
            <span v-for="goal in item.goals" :key="goal" class="vc-secretaria-goal">
              {{ goal }}
            </span>
          </div>
        </article>
      </section>

      <section class="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article class="vc-secretarias-flow">
          <p class="text-xs font-black uppercase tracking-wide text-[#1d6d13]">
            Fluxo de trabalho
          </p>
          <p role="heading" aria-level="2" class="vc-about-title text-slate-950">
            Como cada secretaria entra no observatório
          </p>

          <div class="mt-6 grid gap-3 md:grid-cols-3">
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

          <div class="mt-6 space-y-3">
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
const departments = [
  {
    title: 'Desenvolvimento social',
    text: 'Indicadores de vulnerabilidade, renda, segurança alimentar e acesso a direitos.',
    icon: 'groups',
    badge: 'Proteção social',
    goals: ['ODS 1', 'ODS 2', 'ODS 10'],
    color: '#1d6d13',
  },
  {
    title: 'Educação e saúde',
    text: 'Acompanhamento de aprendizagem, permanência escolar, atenção básica e qualidade de vida.',
    icon: 'local_hospital',
    badge: 'Cuidado e aprendizagem',
    goals: ['ODS 3', 'ODS 4', 'ODS 5'],
    color: '#0a97d9',
  },
  {
    title: 'Meio ambiente e infraestrutura',
    text: 'Dados sobre saneamento, mobilidade, resíduos, clima e planejamento urbano.',
    icon: 'location_city',
    badge: 'Território sustentável',
    goals: ['ODS 6', 'ODS 11', 'ODS 13'],
    color: '#dda63a',
  },
];

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
