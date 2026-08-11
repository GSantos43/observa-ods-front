<template>
  <q-page class="vc-ods-detail-page min-h-screen">
    <main
      v-if="detail"
      class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:py-14"
      :style="{ '--ods-color': detail.color }"
    >
      <RouterLink to="/" class="vc-about-back">
        <q-icon name="west" size="18px" />
        Voltar para o início
      </RouterLink>

      <section class="vc-ods-detail-hero mt-6">
        <div class="vc-ods-detail-hero-copy">
          <div class="flex flex-wrap items-center gap-2">
            <span class="vc-ods-detail-badge">ODS {{ detail.id }}</span>
            <span class="vc-ods-detail-status">{{ detail.status }}</span>
          </div>

          <p role="heading" aria-level="1" class="vc-ods-detail-title">
            {{ detail.title }}
          </p>
          <p class="vc-ods-detail-description">{{ detail.description }}</p>

          <div class="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            <div class="vc-ods-detail-metric">
              <strong>{{ detail.score }}</strong>
              <span>leitura municipal</span>
            </div>
            <div class="vc-ods-detail-metric">
              <strong>{{ detail.targets.length }}</strong>
              <span>metas locais</span>
            </div>
            <div class="vc-ods-detail-metric">
              <strong>{{ detail.indicators.length }}</strong>
              <span>indicadores</span>
            </div>
          </div>
        </div>

        <aside class="vc-ods-detail-image-wrap">
          <img
            :src="getGoalImageUrl(detail.id)"
            :alt="`ODS ${detail.id} - ${detail.title}`"
            class="vc-ods-detail-image"
          />
        </aside>
      </section>

      <section class="mt-8 grid items-stretch space-y-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <article class="vc-ods-detail-situation">
          <p class="text-xs font-black uppercase tracking-wide text-[#1d6d13]">
            Situação no município
          </p>
          <p role="heading" aria-level="2" class="vc-about-title text-slate-950">
            Leitura prioritária para Vitória da Conquista
          </p>
          <p class="mt-4 text-sm leading-7 text-slate-600">{{ detail.situation }}</p>

          <div class="mt-5 rounded-md border border-slate-200 bg-white p-4">
            <div class="flex gap-3">
              <span class="vc-ods-detail-pin">
                <q-icon name="flag" size="18px" />
              </span>
              <div>
                <p class="text-sm font-black text-slate-950">Objetivo municipal</p>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  {{ detail.municipalObjective }}
                </p>
              </div>
            </div>
          </div>
        </article>

        <aside class="vc-ods-detail-actions">
          <p class="text-xs font-black uppercase tracking-wide text-lime-200">Ações vinculadas</p>
          <p class="mt-3 text-2xl font-black leading-tight text-white">O que acompanhar agora</p>
          <div class="mt-5 space-y-3">
            <div v-for="action in detail.actions" :key="action" class="vc-ods-detail-action">
              <q-icon name="task_alt" size="18px" />
              <span>{{ action }}</span>
            </div>
            <p v-if="!detail.actions.length" class="text-sm leading-6 text-white/65">
              Nenhuma ação publicada para este objetivo.
            </p>
          </div>
        </aside>
      </section>

      <section class="vc-ods-analytics mt-8">
        <div class="vc-ods-analytics-head">
          <div>
            <p class="text-xs font-black uppercase tracking-wide text-[#1d6d13]">Panorama visual</p>
            <p role="heading" aria-level="2" class="vc-admin-section-title text-slate-950">
              Desempenho e cobertura do monitoramento
            </p>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Síntese da pontuação municipal e da disponibilidade de evidências deste objetivo.
            </p>
          </div>
          <span class="vc-ods-detail-note">Atualização mais recente</span>
        </div>

        <div class="mt-7 grid gap-7 lg:grid-cols-[260px_minmax(0,1fr)_minmax(280px,0.8fr)] lg:items-center">
          <article class="vc-ods-score-chart">
            <div class="vc-ods-score-ring" :style="scoreRingStyle">
              <div>
                <strong>{{ normalizedScore }}</strong>
                <span>de 100</span>
              </div>
            </div>
            <p class="mt-4 text-center text-sm font-black text-slate-950">Pontuação municipal</p>
            <p class="mt-1 text-center text-xs text-slate-500">{{ detail.status }}</p>
          </article>

          <article>
            <p class="text-sm font-black text-slate-950">Cobertura da leitura</p>
            <div class="mt-5 space-y-5">
              <div v-for="metric in coverageMetrics" :key="metric.label">
                <div class="flex items-center justify-between gap-4 text-xs">
                  <span class="font-bold text-slate-600">{{ metric.label }}</span>
                  <strong class="text-slate-950">{{ metric.value }}</strong>
                </div>
                <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div class="vc-ods-chart-bar" :style="{ width: `${metric.percent}%` }" />
                </div>
              </div>
            </div>
          </article>

          <article class="vc-ods-trend-chart">
            <p class="text-sm font-black text-slate-950">Tendência dos indicadores</p>
            <p class="mt-1 text-xs leading-5 text-slate-500">Distribuição das evidências publicadas.</p>
            <div class="mt-5 space-y-3">
              <div v-for="trend in trendSummary" :key="trend.label" class="grid grid-cols-[92px_1fr_24px] items-center gap-3">
                <span class="text-xs font-semibold text-slate-600">{{ trend.label }}</span>
                <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div class="h-full rounded-full" :style="{ width: `${trend.percent}%`, backgroundColor: trend.color }" />
                </div>
                <strong class="text-right text-xs text-slate-950">{{ trend.count }}</strong>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="mt-10">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="text-xs font-black uppercase tracking-wide text-[#1d6d13]">Metas locais</p>
            <p role="heading" aria-level="2" class="vc-admin-section-title text-slate-950">
              Prioridades, responsáveis e prazos
            </p>
          </div>
          <span class="vc-ods-detail-note">Leitura demonstrativa</span>
        </div>

        <div class="mt-5 grid gap-4" :class="targetGridClass">
          <article v-for="target in detail.targets" :key="target.code" class="vc-ods-target-card">
            <div class="vc-ods-target-meta">
              <span class="vc-ods-target-code">
                <span aria-hidden="true" /> Meta {{ target.code }}
              </span>
              <span class="vc-ods-target-priority">{{ target.priority }}</span>
            </div>
            <p class="vc-ods-target-title">{{ target.title }}</p>
            <p class="vc-ods-target-description" :title="target.description">{{ target.description }}</p>
            <div class="vc-ods-target-footer">
              <span :title="`Responsável: ${target.owner}`">
                <q-icon name="account_balance" size="16px" />
                <strong>{{ target.owner }}</strong>
              </span>
              <span :title="`Prazo: ${target.deadline}`">
                <q-icon name="event" size="16px" />
                <strong>{{ target.deadline }}</strong>
              </span>
            </div>
          </article>
        </div>
      </section>

      <section class="mt-10 grid items-start space-y-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article class="vc-ods-indicators-table">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-xs font-black uppercase tracking-wide text-[#1d6d13]">Indicadores</p>
              <p role="heading" aria-level="2" class="vc-admin-section-title text-slate-950">
                Evidências para acompanhamento
              </p>
            </div>
            <q-icon name="query_stats" class="text-3xl text-[#1d6d13]" />
          </div>

          <div class="mt-5 overflow-x-auto rounded-md border border-slate-200">
            <table class="vc-admin-table">
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>Valor</th>
                  <th>Período</th>
                  <th>Fonte</th>
                  <th>Tendência</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="indicator in detail.indicators" :key="indicator.name">
                  <td>{{ indicator.name }}</td>
                  <td>{{ indicator.value }}</td>
                  <td>{{ indicator.period }}</td>
                  <td>{{ indicator.source }}</td>
                  <td>
                    <span class="vc-admin-status">{{ indicator.trend }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <aside class="vc-ods-detail-map">
          <span class="vc-ods-detail-map-icon">
            <q-icon name="map" size="22px" />
          </span>
          <p class="mt-4 text-xl font-black leading-tight text-slate-950">Recortes sugeridos</p>
          <p class="mt-3 text-sm leading-6 text-slate-600">
            Bairro, distrito, zona urbana, zona rural, renda, gênero, raça e faixa etária devem ser
            usados quando a fonte permitir comparação responsável.
          </p>
        </aside>
      </section>
    </main>

    <main v-else class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <RouterLink to="/" class="vc-about-back">
        <q-icon name="west" size="18px" />
        Voltar para o início
      </RouterLink>
      <article class="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-xl font-black text-slate-950">ODS não encontrado</p>
        <p class="mt-2 text-sm leading-6 text-slate-600">
          Escolha um objetivo na página inicial para abrir os dados vinculados.
        </p>
      </article>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getGoalImageUrl, getOdsDetail } from '@/data/ods';
import type { OdsDetail } from '@/data/ods';
import { apiRequest } from '@/services/api';

const route = useRoute();
const detail = ref<OdsDetail>();
const normalizedScore = computed(() => Math.round(Math.max(0, Math.min(100, detail.value?.score ?? 0))));
const scoreRingStyle = computed(() => ({ background: `conic-gradient(var(--ods-color) 0 ${normalizedScore.value}%, #e6ece6 ${normalizedScore.value}% 100%)` }));
const coverageMetrics = computed(() => {
  const current = detail.value;
  if (!current) return [];
  return [
    { label: 'Metas locais estruturadas', value: `${current.targets.length} de 3`, percent: Math.min(100, (current.targets.length / 3) * 100) },
    { label: 'Indicadores publicados', value: `${current.indicators.length} de 3`, percent: Math.min(100, (current.indicators.length / 3) * 100) },
    { label: 'Ações municipais vinculadas', value: `${current.actions.length} de 3`, percent: Math.min(100, (current.actions.length / 3) * 100) },
  ];
});
const trendSummary = computed(() => {
  const trends = [
    { label: 'Melhora', color: '#1d6d13' }, { label: 'Estável', color: '#0a97d9' },
    { label: 'Atenção', color: '#d99b16' }, { label: 'Planejado', color: '#64748b' }, { label: 'Piora', color: '#c5192d' },
  ];
  const indicators = detail.value?.indicators ?? [];
  const total = Math.max(1, indicators.length);
  return trends.map((trend) => { const count = indicators.filter((item) => item.trend === trend.label).length; return { ...trend, count, percent: (count / total) * 100 }; });
});
const targetGridClass = computed(() => {
  const count = detail.value?.targets.length ?? 0;
  if (count <= 1) return 'max-w-3xl';
  if (count === 2) return 'lg:grid-cols-2';
  return 'md:grid-cols-2 xl:grid-cols-3';
});

watch(() => route.params.id, async (id) => {
  const goalId = Number(id);
  try { detail.value = await apiRequest<OdsDetail>(`/goals/${goalId}`); }
  catch { detail.value = getOdsDetail(goalId); }
}, { immediate: true });
</script>
