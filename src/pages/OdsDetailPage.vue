<template>
  <q-page class="vc-ods-detail-page min-h-screen">
    <main
      v-if="detail"
      class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:py-14"
      :style="{ '--ods-color': detail.color }"
    >
      <RouterLink
        to="/"
        class="vc-about-back vc-back-icon-only"
        aria-label="Voltar para o início"
        title="Voltar para o início"
      >
        <q-icon name="chevron_left" size="28px" />
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

      <section class="vc-ods-context-grid mt-8">
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
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-xs font-black uppercase tracking-wide text-lime-200">Ações vinculadas</p>
              <p class="mt-3 text-2xl font-black leading-tight text-white">O que acompanhar agora</p>
            </div>
            <span v-if="detail.actions.length > 2" class="vc-ods-actions-scope">
              2 mais recentes
            </span>
          </div>
          <div class="mt-5 space-y-3">
            <div v-for="action in visibleActions" :key="action.id" class="vc-ods-detail-action">
              <q-icon name="task_alt" size="18px" />
              <span class="min-w-0 flex-1">
                <strong>{{ action.name }}</strong>
                <em v-if="action.indicatorLinks.length">
                  {{ actionInfluenceLabel(action) }}
                </em>
                <em v-else>Indicador ainda não definido</em>
              </span>
              <small>{{ actionWeightLabel(action.weight) }}</small>
            </div>
            <p v-if="!detail.actions.length" class="text-sm leading-6 text-white/65">
              Nenhuma ação publicada para este objetivo.
            </p>
          </div>
          <div v-if="hiddenActionCount > 0" class="vc-ods-actions-toggle-wrap">
            <span class="vc-ods-actions-toggle">
              + {{ hiddenActionCount }} {{ hiddenActionCount === 1 ? 'ação adicional' : 'ações adicionais' }} no histórico
            </span>
          </div>
        </aside>
      </section>

      <section v-if="chartableIndicators.length > 0" class="vc-ods-action-progress mt-8">
        <header class="vc-ods-action-progress-head">
          <div>
            <p class="text-xs font-black uppercase tracking-wide text-[#1d6d13]">
              Evolução dos indicadores
            </p>
            <p role="heading" aria-level="2" class="vc-admin-section-title text-slate-950">
              Resultados monitorados ao longo do tempo
            </p>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              A linha conecta os valores publicados de cada indicador. As ações relacionadas
              aparecem como iniciativas que podem contribuir para o resultado observado.
            </p>
          </div>
          <span v-if="selectedIndicator" class="vc-ods-action-trend" :class="indicatorTrend.className">
            <q-icon :name="indicatorTrend.icon" size="18px" />
            {{ indicatorTrend.label }}
          </span>
        </header>

        <div v-if="selectedIndicator" class="mt-6 grid items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
          <article class="vc-ods-action-chart-card">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-sm font-black text-slate-950">{{ selectedIndicator.name }}</p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ polarityLabel(selectedIndicator.polarity) }} · unidade: {{ selectedIndicator.unit }}
                </p>
              </div>
              <q-select
                v-if="indicatorChartOptions.length > 1"
                v-model="selectedIndicatorId"
                :options="indicatorChartOptions"
                class="vc-ods-indicator-chart-select"
                emit-value
                map-options
                outlined
                dense
                options-dense
                label="Indicador exibido"
              />
              <span v-else class="vc-ods-action-chart-count">
                {{ indicatorProgress.points.length }} períodos
              </span>
            </div>

            <div ref="actionChartContainer" class="vc-ods-action-chart-scroll mt-4">
              <svg
                class="vc-ods-action-chart"
                :viewBox="`0 0 ${indicatorProgress.width} ${indicatorProgress.height}`"
                :style="{ width: `${indicatorProgress.width}px` }"
                role="img"
                :aria-label="`Evolução do indicador ${selectedIndicator.name} em ${indicatorProgress.points.length} períodos`"
              >
                <defs>
                  <linearGradient id="indicatorProgressArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--ods-color)" stop-opacity="0.22" />
                    <stop offset="100%" stop-color="var(--ods-color)" stop-opacity="0.01" />
                  </linearGradient>
                </defs>

                <g v-for="tick in indicatorProgress.yTicks" :key="tick.value">
                  <line
                    :x1="indicatorProgress.left"
                    :x2="indicatorProgress.width - indicatorProgress.right"
                    :y1="tick.y"
                    :y2="tick.y"
                    class="vc-ods-action-grid-line"
                  />
                  <text
                    :x="indicatorProgress.left - 18"
                    :y="tick.y + 4"
                    text-anchor="middle"
                    class="vc-ods-action-axis-label"
                  >
                    {{ formatCompactValue(tick.value) }}
                  </text>
                </g>

                <path :d="indicatorProgress.areaPath" fill="url(#indicatorProgressArea)" />
                <polyline :points="indicatorProgress.polyline" class="vc-ods-action-line" />

                <g v-for="point in indicatorProgress.points" :key="point.id">
                  <line
                    :x1="point.x"
                    :x2="point.x"
                    :y1="point.y"
                    :y2="indicatorProgress.plotBottom"
                    class="vc-ods-action-guide-line"
                  />
                  <circle :cx="point.x" :cy="point.y" r="10" class="vc-ods-action-point-halo" />
                  <circle :cx="point.x" :cy="point.y" r="5" class="vc-ods-action-point">
                    <title>{{ point.period }}: {{ point.displayValue }}</title>
                  </circle>
                  <text
                    :x="point.x"
                    :y="point.y - 17"
                    text-anchor="middle"
                    class="vc-ods-action-point-value"
                  >
                    {{ point.displayValue }}
                  </text>
                  <text
                    :x="point.x"
                    :y="indicatorProgress.plotBottom + 28"
                    text-anchor="middle"
                    class="vc-ods-action-axis-title"
                  >
                    {{ point.period }}
                  </text>
                </g>
              </svg>
            </div>
          </article>

          <aside class="vc-ods-action-summary">
            <p class="text-xs font-black uppercase tracking-wide text-[#1d6d13]">Leitura atual</p>
            <div class="vc-ods-action-current mt-4 flex items-end gap-2">
              <strong>{{ latestIndicatorPoint?.displayValue }}</strong>
            </div>
            <p class="mt-2 text-sm font-bold text-slate-950">
              {{ indicatorTrend.summary }}
            </p>
            <p class="mt-2 text-xs leading-5 text-slate-500">
              Comparação entre o primeiro e o último valor publicado desta série.
            </p>

            <div class="my-5 h-px bg-slate-200" />

            <p class="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Ações que podem influenciar
            </p>
            <div v-if="linkedActionsForSelected.length" class="mt-3">
              <div class="vc-ods-linked-actions-list space-y-2" :class="{ 'is-expanded': linkedActionsExpanded }">
                <div v-for="action in visibleLinkedActionsForSelected" :key="action.id" class="vc-ods-linked-action">
                  <q-icon name="conversion_path" size="16px" />
                  <span>
                    <strong>{{ action.name }}</strong>
                    <small>{{ expectedEffectLabel(action.effect) }}{{ action.newValue === null ? '' : ` · novo valor: ${formatActionValue(action.newValue, action.unit)}` }}</small>
                  </span>
                </div>
              </div>
              <q-btn
                v-if="hiddenLinkedActionsCount > 0"
                class="mt-2 w-full"
                flat
                dense
                no-caps
                color="green-9"
                :icon-right="linkedActionsExpanded ? 'expand_less' : 'expand_more'"
                :label="linkedActionsExpanded ? 'Mostrar somente 3 ações' : `Ver mais ${hiddenLinkedActionsCount} ações`"
                :aria-expanded="linkedActionsExpanded"
                @click="linkedActionsExpanded = !linkedActionsExpanded"
              />
            </div>
            <p v-else class="mt-3 text-xs leading-5 text-slate-500">
              Nenhuma ação foi relacionada diretamente a este indicador.
            </p>

            <div class="vc-ods-action-method mt-auto">
              <q-icon name="info" size="17px" />
              <span>Relação temporal não comprova causalidade; indica quais ações foram planejadas para influenciar o resultado.</span>
            </div>
          </aside>
        </div>

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

      <section class="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
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
      <RouterLink
        to="/"
        class="vc-about-back vc-back-icon-only"
        aria-label="Voltar para o início"
        title="Voltar para o início"
      >
        <q-icon name="chevron_left" size="28px" />
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
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getGoalImageUrl, getOdsDetail } from '@/data/ods';
import type { OdsAction, OdsDetail, OdsIndicator } from '@/data/ods';
import { apiRequest } from '@/services/api';

type OdsDetailPayload = Omit<OdsDetail, 'actions'> & {
  actions: Array<OdsAction | string>;
};

const route = useRoute();
const detail = ref<OdsDetail>();
const linkedActionsExpanded = ref(false);
const selectedIndicatorId = ref<string>();
const actionChartContainer = ref<HTMLElement>();
const actionChartContainerWidth = ref(680);
let actionChartResizeObserver: ResizeObserver | undefined;
let actionChartResizeFrame: number | undefined;
const normalizedScore = computed(() => Math.round(Math.max(0, Math.min(100, detail.value?.score ?? 0))));
const scoreRingStyle = computed(() => ({ background: `conic-gradient(var(--ods-color) 0 ${normalizedScore.value}%, #e6ece6 ${normalizedScore.value}% 100%)` }));
const visibleActions = computed(() => {
  const actions = detail.value?.actions ?? [];
  return actions.slice(-2);
});
const hiddenActionCount = computed(() => Math.max(0, (detail.value?.actions.length ?? 0) - 2));
const chartableIndicators = computed(() =>
  (detail.value?.indicators ?? []).filter((indicator) => indicator.observations.length > 1),
);
const indicatorChartOptions = computed(() =>
  chartableIndicators.value.map((indicator) => ({ label: indicator.name, value: indicator.id })),
);
const selectedIndicator = computed(() =>
  chartableIndicators.value.find((indicator) => indicator.id === selectedIndicatorId.value)
  ?? chartableIndicators.value[0],
);
const indicatorProgress = computed(() => {
  const observations = selectedIndicator.value?.observations ?? [];
  const width = Math.max(300, actionChartContainerWidth.value, observations.length * 110);
  const height = 280;
  const left = 58;
  const right = 28;
  const top = 30;
  const plotBottom = 210;
  const plotHeight = plotBottom - top;
  const plotWidth = width - left - right;
  const values = observations.map((observation) => Number(observation.value));
  const rawMinimum = Math.min(...values, 0);
  const rawMaximum = Math.max(...values, 1);
  const range = rawMaximum - rawMinimum || 1;
  const padding = Math.max(range * 0.12, 0.5);
  const minimum = rawMinimum >= 0 ? Math.max(0, rawMinimum - padding) : rawMinimum - padding;
  const maximum = rawMaximum + padding;
  const scaleRange = maximum - minimum || 1;
  const yForValue = (value: number) => top + ((maximum - value) / scaleRange) * plotHeight;
  const points = observations.map((observation, index) => {
    const value = Number(observation.value);
    return {
      ...observation,
      index,
      value,
      x: observations.length === 1 ? left + plotWidth / 2 : left + (index / (observations.length - 1)) * plotWidth,
      y: yForValue(value),
    };
  });
  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const value = maximum - (index / 4) * scaleRange;
    return { value, y: yForValue(value) };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(' ');
  const areaPath = points.length
    ? `M ${points[0]?.x ?? left} ${plotBottom} L ${polyline.replaceAll(' ', ' L ')} L ${points.at(-1)?.x ?? width - right} ${plotBottom} Z`
    : '';

  return { width, height, left, right, plotBottom, points, yTicks, polyline, areaPath };
});
const latestIndicatorPoint = computed(() => indicatorProgress.value.points.at(-1));
const indicatorTrend = computed(() => {
  const indicator = selectedIndicator.value;
  const points = indicatorProgress.value.points;
  const firstValue = points[0]?.value ?? 0;
  const latestValue = points.at(-1)?.value ?? 0;
  const delta = latestValue - firstValue;
  const relativeVariation = firstValue === 0 ? undefined : (delta / Math.abs(firstValue)) * 100;
  const isStable = Math.abs(delta) < 0.0001;
  const isProgress = indicator?.polarity === 'LOWER_IS_BETTER' ? delta < 0 : delta > 0;
  const variationMagnitude = relativeVariation === undefined
    ? `${formatCompactValue(Math.abs(delta))} ${indicator?.unit ?? ''}`.trim()
    : `${Math.abs(relativeVariation).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;

  if (indicator?.polarity === 'CONTEXTUAL') {
    return {
      label: 'Variação contextual',
      summary: `${delta >= 0 ? 'Aumento' : 'Redução'} de ${variationMagnitude} no período`,
      icon: 'swap_vert',
      className: 'is-stable',
    };
  }

  if (isStable) {
    return {
      label: 'Estável',
      summary: 'Sem variação entre o primeiro e o último período',
      icon: 'trending_flat',
      className: 'is-stable',
    };
  }

  if (isProgress) {
    return {
      label: 'Progresso',
      summary: `${delta >= 0 ? 'Avanço' : 'Redução favorável'} de ${variationMagnitude}`,
      icon: 'trending_up',
      className: 'is-progress',
    };
  }

  return {
    label: 'Regressão',
    summary: `${delta >= 0 ? 'Aumento desfavorável' : 'Queda'} de ${variationMagnitude}`,
    icon: 'trending_down',
    className: 'is-regression',
  };
});
const linkedActionsForSelected = computed(() => {
  const indicatorId = selectedIndicator.value?.id;
  if (!indicatorId) return [];
  return (detail.value?.actions ?? []).flatMap((action) => {
    const link = action.indicatorLinks.find((item) => item.indicatorId === indicatorId);
    return link ? [{
      id: action.id,
      name: action.name,
      effect: link.expectedEffect,
      newValue: link.newValue ?? null,
      unit: link.unit,
    }] : [];
  });
});
const visibleLinkedActionsForSelected = computed(() =>
  linkedActionsExpanded.value ? linkedActionsForSelected.value : linkedActionsForSelected.value.slice(0, 3),
);
const hiddenLinkedActionsCount = computed(() =>
  Math.max(0, linkedActionsForSelected.value.length - 3),
);
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
  if (count <= 1) return 'grid-cols-1';
  if (count === 2) return 'lg:grid-cols-2';
  return 'md:grid-cols-2 xl:grid-cols-3';
});

function formatCompactValue(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    notation: Math.abs(value) >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: Math.abs(value) < 10 ? 1 : 0,
  }).format(value);
}

function polarityLabel(polarity: OdsIndicator['polarity']) {
  if (polarity === 'HIGHER_IS_BETTER') return 'Quanto maior, melhor';
  if (polarity === 'LOWER_IS_BETTER') return 'Quanto menor, melhor';
  return 'Indicador contextual';
}

function expectedEffectLabel(effect: OdsAction['indicatorLinks'][number]['expectedEffect']) {
  if (effect === 'INCREASE') return 'Efeito esperado: aumentar';
  if (effect === 'DECREASE') return 'Efeito esperado: reduzir';
  return 'Efeito esperado: manter';
}

function actionWeightLabel(weight: number) {
  const labels = ['Complementar', 'Apoio', 'Relevante', 'Estruturante', 'Prioritária'];
  return labels[weight - 1] ?? `${weight}/5`;
}

function formatActionValue(value: number, unit: string) {
  const formatted = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

function actionInfluenceLabel(action: OdsAction) {
  const firstLink = action.indicatorLinks[0];
  if (!firstLink) return 'Indicador ainda não definido';
  const remaining = action.indicatorLinks.length - 1;
  return `Influencia: ${firstLink.name}${remaining > 0 ? ` e mais ${remaining}` : ''}`;
}

function normalizeOdsDetail(payload: OdsDetailPayload): OdsDetail {
  return {
    ...payload,
    indicators: (payload.indicators ?? []).map((indicator, index) => ({
      ...indicator,
      id: indicator.id || `legacy-indicator-${payload.id}-${index}`,
      unit: indicator.unit || '',
      polarity: indicator.polarity || 'CONTEXTUAL',
      observations: indicator.observations ?? [],
    })),
    actions: (payload.actions ?? []).map((action, index) => {
      if (typeof action === 'string') {
        return {
          id: `legacy-${payload.id}-${index}`,
          name: action,
          description: '',
          weight: 3,
          createdAt: `2026-${String(index + 1).padStart(2, '0')}-01T12:00:00.000Z`,
          indicatorLinks: [],
        };
      }

      return {
        ...action,
        id: action.id || `action-${payload.id}-${index}`,
        description: action.description || '',
        weight: Math.max(1, Math.min(5, Number(action.weight) || 1)),
        createdAt: action.createdAt || new Date().toISOString(),
        indicatorLinks: action.indicatorLinks ?? [],
      };
    }),
  };
}

watch(
  actionChartContainer,
  (element) => {
    actionChartResizeObserver?.disconnect();
    actionChartResizeObserver = undefined;

    if (!element) return;

    const updateWidth = () => {
      if (actionChartResizeFrame) window.cancelAnimationFrame(actionChartResizeFrame);
      actionChartResizeFrame = window.requestAnimationFrame(() => {
        const nextWidth = Math.max(300, Math.floor(element.clientWidth));
        if (Math.abs(nextWidth - actionChartContainerWidth.value) > 1) {
          actionChartContainerWidth.value = nextWidth;
        }
      });
    };

    updateWidth();
    actionChartResizeObserver = new ResizeObserver(updateWidth);
    actionChartResizeObserver.observe(element);
  },
  { flush: 'post' },
);

onBeforeUnmount(() => {
  actionChartResizeObserver?.disconnect();
  if (actionChartResizeFrame) window.cancelAnimationFrame(actionChartResizeFrame);
});

watch(chartableIndicators, (indicators) => {
  if (!indicators.some((indicator) => indicator.id === selectedIndicatorId.value)) {
    selectedIndicatorId.value = indicators[0]?.id;
  }
}, { immediate: true });

watch(selectedIndicatorId, () => {
  linkedActionsExpanded.value = false;
});

watch(() => route.params.id, async (id) => {
  const goalId = Number(id);
  linkedActionsExpanded.value = false;
  try {
    detail.value = normalizeOdsDetail(await apiRequest<OdsDetailPayload>(`/goals/${goalId}`));
  } catch {
    const fallback = getOdsDetail(goalId);
    detail.value = fallback ? normalizeOdsDetail(fallback) : undefined;
  }
}, { immediate: true });
</script>
