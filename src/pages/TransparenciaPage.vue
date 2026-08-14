<template>
  <q-page class="vc-transparencia-page min-h-screen">
    <main class="vc-transparencia-main mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <div class="vc-transparencia-surface">
        <div class="vc-transparencia-topbar">
          <RouterLink
            to="/"
            class="vc-about-back vc-back-icon-only"
            aria-label="Voltar para o início"
            title="Voltar para o início"
          >
            <q-icon name="chevron_left" size="28px" />
          </RouterLink>
          <span class="vc-transparencia-badge">
            <q-icon name="verified" size="16px" />
            Dados públicos
          </span>
        </div>

        <section class="vc-transparencia-intro">
          <span class="vc-transparencia-intro-icon">
            <q-icon name="policy" size="25px" />
          </span>
          <div class="min-w-0">
            <p class="vc-ods-about-eyebrow">
              Transparência e dados abertos
            </p>
            <p role="heading" aria-level="1" class="vc-page-title text-slate-950">
              Fontes públicas para consulta, auditoria social e tomada de decisão
            </p>
            <p class="vc-page-lead text-slate-600">
              A área de transparência centraliza referências de dados que podem alimentar o
              observatório e apoiar análises sobre a evolução dos objetivos no município.
            </p>
          </div>
        </section>

        <section class="vc-transparencia-sources">
          <div class="vc-transparencia-section-heading">
            <div>
              <p class="text-xs font-black uppercase tracking-wide text-[#1d6d13]">
                Fontes de referência
              </p>
              <p class="mt-1 text-sm leading-6 text-slate-600">
                Consulte as categorias utilizadas para documentar e acompanhar os indicadores.
              </p>
            </div>
            <span>{{ sources.length }} categorias</span>
          </div>

          <div class="vc-transparencia-grid">
            <article
              v-for="item in sources"
              :key="item.title"
              class="vc-transparencia-card"
            >
              <span class="vc-card-icon">
                <q-icon :name="item.icon" size="18px" />
              </span>
              <p role="heading" aria-level="2" class="vc-card-title text-slate-950">
                {{ item.title }}
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600">{{ item.text }}</p>
            </article>
          </div>
        </section>
      </div>
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
