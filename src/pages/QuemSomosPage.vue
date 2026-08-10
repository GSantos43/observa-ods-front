<template>
  <q-page class="vc-about-page min-h-screen">
    <main class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-10">
      <RouterLink to="/" class="vc-about-back">
        <q-icon name="west" size="18px" />
        Voltar para o início
      </RouterLink>

      <section class="vc-about-hero mt-6">
        <div class="vc-about-hero-copy">
          <p class="text-xs font-black uppercase tracking-wide text-lime-200">Quem somos</p>
          <p role="heading" aria-level="1" class="vc-about-hero-title">
            Dados públicos mais perto das decisões da cidade
          </p>
          <p class="vc-about-hero-lead">
            O ObservaODS organiza informações relacionadas aos Objetivos de Desenvolvimento
            Sustentável para apoiar acompanhamento, planejamento e transparência pública em Vitória
            da Conquista.
          </p>

          <div class="vc-about-hero-stats">
            <div v-for="stat in heroStats" :key="stat.label" class="vc-about-hero-stat">
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </div>
          </div>
        </div>

        <aside class="vc-about-agenda">
          <span class="vc-about-agenda-icon">
            <q-icon name="hub" size="24px" />
          </span>
          <p class="text-xs font-black uppercase tracking-wide text-emerald-900/70">
            Agenda 2030
          </p>
          <p class="mt-3 text-3xl font-black leading-none text-emerald-950">Leitura integrada</p>
          <p class="mt-4 text-sm leading-6 text-emerald-950/75">
            Indicadores, políticas públicas e participação social conectados em uma mesma visão de
            desenvolvimento sustentável.
          </p>
        </aside>
      </section>

      <section class="vc-about-pillars mt-6">
        <article
          v-for="item in pillars"
          :key="item.title"
          class="vc-about-pillar"
          :style="{ '--pillar-accent': item.color }"
        >
          <span class="vc-about-pillar-icon">
            <q-icon :name="item.icon" size="22px" />
          </span>
          <p role="heading" aria-level="2" class="vc-about-pillar-title">
            {{ item.title }}
          </p>
          <p class="mt-3 text-sm leading-6 text-slate-600">{{ item.text }}</p>
        </article>
      </section>

      <section class="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <article id="metodologia" class="vc-about-method scroll-mt-24">
          <p class="text-xs font-black uppercase tracking-wide text-[#1d6d13]">Metodologia</p>
          <p role="heading" aria-level="2" class="vc-about-title text-slate-950">
            Como os dados são conectados aos ODS
          </p>
          <p class="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Cada objetivo funciona como uma chave de organização temática. A partir dele,
            indicadores, fontes públicas, programas municipais e metas de acompanhamento podem ser
            reunidos em uma mesma leitura, facilitando comparação, priorização e prestação de contas.
          </p>

          <div class="mt-6 grid gap-3 sm:grid-cols-3">
            <div v-for="step in methodologySteps" :key="step.label" class="vc-about-step">
              <span>{{ step.index }}</span>
              <strong>{{ step.label }}</strong>
              <p>{{ step.text }}</p>
            </div>
          </div>
        </article>

        <aside id="participacao" class="vc-about-participation scroll-mt-24">
          <p class="text-xs font-black uppercase tracking-wide text-lime-200">
            Participação social
          </p>
          <p role="heading" aria-level="2" class="mt-3 text-2xl font-black leading-tight text-white">
            Um espaço para leitura pública e colaboração institucional
          </p>
          <p class="mt-4 text-sm leading-7 text-white/78">
            A proposta é apoiar secretarias, conselhos, instituições de ensino, organizações sociais
            e cidadãos no acompanhamento contínuo das políticas públicas.
          </p>

          <div class="mt-6 space-y-3">
            <div v-for="partner in partners" :key="partner" class="vc-about-partner">
              <q-icon name="check" size="18px" />
              <span>{{ partner }}</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  </q-page>
</template>

<script setup lang="ts">
const heroStats = [
  { value: '18', label: 'ODS acompanhados' },
  { value: '43', label: 'indicadores em leitura' },
  { value: '12', label: 'fontes mapeadas' },
];

const pillars = [
  {
    title: 'Transparência',
    text: 'Organiza fontes, indicadores e evidências em linguagem acessível para acompanhamento público.',
    icon: 'dataset',
    color: '#1d6d13',
  },
  {
    title: 'Integração',
    text: 'Conecta áreas do município em uma leitura comum sobre desenvolvimento sustentável.',
    icon: 'account_tree',
    color: '#0f766e',
  },
  {
    title: 'Monitoramento',
    text: 'Apoia a observação de avanços, lacunas e prioridades territoriais ao longo do tempo.',
    icon: 'query_stats',
    color: '#b45309',
  },
];

const methodologySteps = [
  {
    index: '01',
    label: 'Organizar',
    text: 'Agrupa indicadores, fontes e metas por objetivo.',
  },
  {
    index: '02',
    label: 'Relacionar',
    text: 'Conecta programas municipais às prioridades públicas.',
  },
  {
    index: '03',
    label: 'Acompanhar',
    text: 'Transforma evidências em leitura contínua de gestão.',
  },
];

const partners = [
  'Secretarias municipais',
  'Conselhos e controle social',
  'Instituições de ensino',
  'Organizações sociais e cidadãos',
];
</script>
