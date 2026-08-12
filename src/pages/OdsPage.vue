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

      <section class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p class="vc-ods-about-eyebrow">
            Objetivos do Desenvolvimento Sustentável
          </p>
          <p role="heading" aria-level="1" class="vc-page-title text-slate-950">
            Os ODS como referência para políticas públicas municipais
          </p>
          <p class="vc-page-lead text-slate-600">
            Esta área reúne a leitura dos objetivos adotados pelo observatório, conectando metas
            globais a temas locais como saúde, educação, renda, saneamento, clima, governança e
            transparência pública.
          </p>
        </div>

        <aside class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <q-icon name="flag" class="text-3xl text-[#1d6d13]" />
          <p class="mt-4 text-3xl font-black text-slate-950">18</p>
          <p class="mt-1 text-sm font-semibold text-slate-600">objetivos acompanhados</p>
        </aside>
      </section>

      <section class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="item in priorities"
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
const priorities = [
  {
    title: 'Leitura por território',
    text: 'Apoia análises por bairros, distritos e recortes sociais para identificar desigualdades.',
    icon: 'map',
  },
  {
    title: 'Indicadores e metas',
    text: 'Organiza dados por objetivo, facilitando acompanhamento, comparação e prestação de contas.',
    icon: 'query_stats',
  },
  {
    title: 'Agenda integrada',
    text: 'Conecta secretarias, programas e fontes públicas dentro de uma mesma lógica de monitoramento.',
    icon: 'hub',
  },
];
</script>
