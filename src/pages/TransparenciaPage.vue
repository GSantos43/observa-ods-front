<template>
  <q-page class="min-h-screen bg-[#f4f5f3]">
    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 text-sm font-semibold text-[#1d6d13] hover:text-[#15560f]"
      >
        <q-icon name="west" size="18px" />
        Voltar para o início
      </RouterLink>

      <section class="mt-6">
        <p class="vc-ods-about-eyebrow">
          Transparência e dados abertos
        </p>
        <p role="heading" aria-level="1" class="vc-page-title text-slate-950">
          Fontes públicas para consulta, auditoria social e tomada de decisão
        </p>
        <p class="vc-page-lead text-slate-600">
          A área de transparência centraliza referências de dados que podem alimentar o observatório
          e apoiar análises sobre a evolução dos objetivos no município.
        </p>
      </section>

      <section class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="item in sources"
          :key="item.title"
          class="rounded-md border border-slate-200 bg-white p-5 shadow-sm"
        >
          <span class="vc-card-icon">
            <q-icon :name="item.icon" size="18px" />
          </span>
          <p role="heading" aria-level="2" class="vc-card-title text-slate-950">
            {{ item.title }}
          </p>
          <p class="mt-2 text-sm leading-6 text-slate-600">{{ item.text }}</p>
        </article>
      </section>
    </main>
  </q-page>
</template>

<script setup lang="ts">
const sources = [
  {
    title: 'Portais oficiais',
    text: 'Bases institucionais de receitas, despesas, contratos, convênios e serviços públicos.',
    icon: 'account_balance',
  },
  {
    title: 'Indicadores municipais',
    text: 'Séries históricas e recortes territoriais para acompanhar evolução das políticas.',
    icon: 'monitor',
  },
  {
    title: 'Evidências e relatórios',
    text: 'Documentos, painéis e publicações que ajudam a qualificar a leitura dos dados.',
    icon: 'article',
  },
];
</script>
