<template>
  <q-page class="min-h-screen bg-[#eef2ee]">
    <div
      class="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)]"
    >
      <aside
        class="vc-admin-sidebar rounded-md border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-20 lg:h-[calc(100vh-6.5rem)]"
      >
        <div class="border-b border-slate-100 p-3">
          <div class="flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-md bg-[#1d6d13] text-white">
              <q-icon name="admin_panel_settings" size="22px" />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-bold leading-tight text-slate-950">Admin ObservaODS</p>
              <p class="mt-1 text-xs leading-snug text-slate-500">Gest&atilde;o mock dos ODS</p>
            </div>
          </div>
        </div>

        <nav class="vc-admin-nav mt-3 space-y-1">
          <button
            v-for="item in adminSections"
            :key="item.id"
            type="button"
            class="vc-admin-nav-item"
            :class="activeSection === item.id ? 'vc-admin-nav-item--active' : ''"
            @click="activeSection = item.id"
          >
            <span class="vc-admin-nav-icon">
              <q-icon :name="item.icon" size="18px" />
            </span>
            <span class="min-w-0 text-left">
              <span class="block text-sm font-semibold leading-tight">{{ item.label }}</span>
              <span class="mt-0.5 block text-xs leading-snug opacity-70">{{ item.caption }}</span>
            </span>
          </button>
        </nav>

        <div class="vc-admin-model-note mt-4 rounded-md border border-emerald-100 bg-emerald-50 p-3">
          <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">Modelo de dados</p>
          <p class="mt-2 text-xs leading-5 text-slate-600">
            Objetivo, meta, indicador, fonte, recorte territorial, per&iacute;odo e valor observado.
          </p>
        </div>
      </aside>

      <main class="min-w-0 space-y-5">
        <header
          class="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:flex sm:items-start sm:justify-between sm:gap-5"
        >
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">
              Painel administrativo
            </p>
            <p role="heading" aria-level="1" class="vc-admin-title text-slate-950">
              Gest&atilde;o de dados municipais vinculados aos ODS
            </p>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Cadastre objetivos, metas locais, indicadores, fontes e lan&ccedil;amentos por
              per&iacute;odo para alimentar o observat&oacute;rio. Os dados abaixo s&atilde;o
              demonstrativos.
            </p>
          </div>

          <div class="vc-admin-header-actions mt-4 flex flex-wrap gap-2 sm:mt-0">
            <q-btn outline color="green-9" icon="visibility" label="Ver site" no-caps to="/" />
            <q-btn
              color="green-9"
              icon="add"
              label="Novo dado"
              no-caps
              @click="activeSection = 'lancamentos'"
            />
          </div>
        </header>

        <Transition name="vc-page" mode="out-in">
          <section v-if="activeSection === 'visao'" key="visao" class="space-y-5">
            <div class="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.9fr)]">
              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">
                      Evolu&ccedil;&atilde;o dos registros
                    </p>
                    <p class="vc-admin-section-title text-slate-950">
                      Indicadores alimentados por ciclo
                    </p>
                    <p class="mt-2 text-sm leading-6 text-slate-500">
                      Volume mockado de dados publicados, revisados e em rascunho por m&ecirc;s.
                    </p>
                  </div>
                  <span class="vc-admin-status">2026</span>
                </div>

                <div class="vc-admin-line-chart mt-5">
                  <svg viewBox="0 0 420 170" role="img" aria-label="Evolucao mensal dos dados">
                    <path d="M24 132H396" class="vc-admin-chart-grid" />
                    <path d="M24 92H396" class="vc-admin-chart-grid" />
                    <path d="M24 52H396" class="vc-admin-chart-grid" />
                    <polyline :points="indicatorTrendPoints" class="vc-admin-chart-line" />
                    <circle
                      v-for="point in indicatorTrendCoords"
                      :key="point.label"
                      :cx="point.x"
                      :cy="point.y"
                      r="4"
                      class="vc-admin-chart-dot"
                    />
                  </svg>
                  <div
                    class="mt-3 grid grid-cols-6 gap-2 text-center text-[11px] font-semibold text-slate-500"
                  >
                    <span v-for="point in indicatorTrend" :key="point.label">{{
                      point.label
                    }}</span>
                  </div>
                </div>
              </article>

              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">
                      Situa&ccedil;&atilde;o editorial
                    </p>
                    <p class="vc-admin-section-title text-slate-950">Status dos indicadores</p>
                  </div>
                  <q-icon name="donut_large" class="text-2xl text-[#1d6d13]" />
                </div>

                <div class="mt-5 grid gap-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center">
                  <div class="vc-admin-donut" :style="statusDonutStyle">
                    <span>43</span>
                    <small>indicadores</small>
                  </div>
                  <div class="space-y-3">
                    <div v-for="item in indicatorStatus" :key="item.label">
                      <div class="flex items-center justify-between gap-3 text-xs">
                        <span class="font-semibold text-slate-700">{{ item.label }}</span>
                        <span class="font-bold text-slate-950">{{ item.value }}</span>
                      </div>
                      <div class="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          class="h-full rounded-full"
                          :style="{ width: `${item.percent}%`, backgroundColor: item.color }"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article
                v-for="metric in dashboardMetrics"
                :key="metric.label"
                class="vc-admin-stat rounded-md border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {{ metric.label }}
                    </p>
                    <p class="mt-2 text-2xl font-black leading-none text-slate-950">
                      {{ metric.value }}
                    </p>
                  </div>
                  <span class="vc-admin-stat-icon">
                    <q-icon :name="metric.icon" size="20px" />
                  </span>
                </div>
                <p class="mt-3 text-xs leading-5 text-slate-500">{{ metric.caption }}</p>
              </article>
            </section>

            <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">
                      Cobertura por eixo
                    </p>
                    <p class="vc-admin-section-title text-slate-950">
                      Leitura tem&aacute;tica municipal
                    </p>
                  </div>
                  <q-btn flat color="green-9" icon="tune" label="Filtrar eixos" no-caps />
                </div>

                <div class="mt-5 grid gap-3 md:grid-cols-2">
                  <div
                    v-for="axis in coverageByAxis"
                    :key="axis.label"
                    class="rounded-md border border-slate-100 bg-slate-50 p-4"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <p class="text-sm font-bold text-slate-950">{{ axis.label }}</p>
                        <p class="mt-1 text-xs leading-5 text-slate-500">{{ axis.description }}</p>
                      </div>
                      <span class="text-lg font-black text-slate-950">{{ axis.percent }}%</span>
                    </div>
                    <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-white">
                      <div
                        class="h-full rounded-full bg-[#1d6d13]"
                        :style="{ width: `${axis.percent}%` }"
                      />
                    </div>
                    <div class="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{{ axis.indicators }} indicadores</span>
                      <span>{{ axis.sources }} fontes</span>
                    </div>
                  </div>
                </div>
              </article>

              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">
                  Funil de valida&ccedil;&atilde;o
                </p>
                <div class="mt-5 space-y-3">
                  <div
                    v-for="stage in validationPipeline"
                    :key="stage.label"
                    class="vc-admin-funnel-row"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-sm font-semibold text-slate-950">{{ stage.label }}</span>
                      <span class="text-sm font-black text-slate-950">{{ stage.value }}</span>
                    </div>
                    <div class="mt-2 h-8 overflow-hidden rounded bg-slate-100">
                      <div
                        class="grid h-full place-items-center rounded bg-[#1d6d13] text-[11px] font-bold text-white"
                        :style="{ width: `${stage.percent}%` }"
                      >
                        {{ stage.percent }}%
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">
                      &Uacute;ltimos lan&ccedil;amentos
                    </p>
                    <p class="mt-1 text-sm text-slate-500">
                      Registros mockados aguardando valida&ccedil;&atilde;o.
                    </p>
                  </div>
                  <q-btn
                    flat
                    color="green-9"
                    icon="add"
                    label="Adicionar"
                    no-caps
                    @click="activeSection = 'lancamentos'"
                  />
                </div>
                <div class="mt-4 overflow-x-auto rounded-md border border-slate-200">
                  <table class="vc-admin-table">
                    <thead>
                      <tr>
                        <th>Indicador</th>
                        <th>ODS</th>
                        <th>Per&iacute;odo</th>
                        <th>Valor</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="entry in recentEntries" :key="entry.indicator">
                        <td>{{ entry.indicator }}</td>
                        <td>{{ entry.goal }}</td>
                        <td>{{ entry.period }}</td>
                        <td>{{ entry.value }}</td>
                        <td>
                          <span class="vc-admin-status">{{ entry.status }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </article>

              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">
                  ODS que exigem aten&ccedil;&atilde;o
                </p>
                <div class="mt-4 space-y-3">
                  <div
                    v-for="risk in priorityRisks"
                    :key="risk.goal"
                    class="grid gap-3 rounded-md border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[48px_minmax(0,1fr)]"
                  >
                    <div class="h-12 w-12 overflow-hidden rounded-md">
                      <img
                        :src="getGoalImage(risk.id)"
                        :alt="risk.goal"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center justify-between gap-2">
                        <p class="truncate text-sm font-bold text-slate-950">{{ risk.goal }}</p>
                        <span class="vc-admin-status">{{ risk.status }}</span>
                      </div>
                      <p class="mt-1 text-xs leading-5 text-slate-500">{{ risk.reason }}</p>
                    </div>
                  </div>
                </div>
              </article>

              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">
                  Pend&ecirc;ncias editoriais
                </p>
                <div class="mt-4 space-y-3">
                  <div
                    v-for="task in editorialTasks"
                    :key="task.title"
                    class="flex gap-3 rounded-md border border-slate-100 bg-slate-50 p-3"
                  >
                    <q-icon :name="task.icon" class="mt-0.5 text-lg text-[#1d6d13]" />
                    <div>
                      <p class="text-sm font-semibold text-slate-950">{{ task.title }}</p>
                      <p class="mt-1 text-xs leading-5 text-slate-500">{{ task.text }}</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">
                    Fluxo de alimenta&ccedil;&atilde;o
                  </p>
                  <p class="vc-admin-section-title text-slate-950">
                    Da agenda global ao dado municipal
                  </p>
                </div>
                <q-icon name="schema" class="text-2xl text-[#1d6d13]" />
              </div>

              <div class="mt-5 grid gap-3 md:grid-cols-4">
                <div
                  v-for="step in dataFlow"
                  :key="step.label"
                  class="rounded-md border border-slate-100 bg-slate-50 p-4"
                >
                  <span class="vc-admin-step-index">{{ step.index }}</span>
                  <p class="mt-3 text-sm font-bold text-slate-950">{{ step.label }}</p>
                  <p class="mt-2 text-xs leading-5 text-slate-500">{{ step.text }}</p>
                </div>
              </div>
            </article>
          </section>

          <section v-else-if="activeSection === 'semaforo'" key="semaforo" class="space-y-5">
            <AdminSectionHeader
              eyebrow="Sem&aacute;foro ODS"
              title="Prioridade de acompanhamento por objetivo"
              text="Consulte a leitura de desempenho de Vit&oacute;ria da Conquista na base do IDSC e converta a pontua&ccedil;&atilde;o em tr&ecirc;s estados de gest&atilde;o: tranquilo, aten&ccedil;&atilde;o e alerta."
              icon="traffic"
            />

            <article
              class="vc-admin-semaphore-source relative overflow-hidden rounded-md border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">
                    Fonte externa
                  </p>
                  <p class="vc-admin-section-title text-slate-950">
                    IDSC - Vit&oacute;ria da Conquista
                  </p>
                  <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Os ODS 1 a 17 s&atilde;o carregados da API p&uacute;blica do IDSC. O ODS 18
                    permanece como refer&ecirc;ncia municipal demonstrativa enquanto n&atilde;o
                    existir retorno equivalente na fonte externa.
                  </p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <q-btn
                    outline
                    color="green-9"
                    icon="open_in_new"
                    label="Abrir perfil IDSC"
                    no-caps
                    :href="idscProfileUrl"
                    target="_blank"
                  />
                  <q-btn
                    color="green-9"
                    icon="refresh"
                    label="Atualizar"
                    no-caps
                    :loading="semaphoreLoading"
                    @click="loadIdscSemaphore"
                  />
                </div>
              </div>

              <div class="mt-5 grid gap-3 md:grid-cols-3">
                <div
                  v-for="rule in semaphoreRules"
                  :key="rule.label"
                  class="vc-admin-semaphore-rule"
                >
                  <span class="vc-admin-semaphore-dot" :style="{ backgroundColor: rule.color }" />
                  <div>
                    <p class="text-sm font-bold text-slate-950">{{ rule.label }}</p>
                    <p class="mt-1 text-xs leading-5 text-slate-500">{{ rule.text }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span class="vc-admin-status">{{ semaphoreSourceLabel }}</span>
                <span v-if="semaphoreUpdatedAt">Atualizado em {{ semaphoreUpdatedAt }}</span>
                <span v-if="semaphoreError" class="text-red-700">{{ semaphoreError }}</span>
              </div>

              <q-inner-loading :showing="semaphoreLoading">
                <q-spinner color="green-9" size="32px" />
              </q-inner-loading>
            </article>

            <div class="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">
                      Leitura geral
                    </p>
                    <p class="vc-admin-section-title text-slate-950">Sem&aacute;foro ODS</p>
                    <p class="mt-2 text-sm leading-6 text-slate-500">
                      Distribui&ccedil;&atilde;o dos objetivos por situa&ccedil;&atilde;o de
                      acompanhamento.
                    </p>
                  </div>
                  <span class="vc-admin-status">{{ semaphoreGoals.length }} ODS</span>
                </div>

                <div class="mt-5 grid gap-5 sm:grid-cols-[92px_minmax(0,1fr)] xl:grid-cols-1">
                  <div class="vc-admin-traffic-light" aria-label="Semaforo ODS">
                    <span
                      v-for="item in semaphoreSummary"
                      :key="item.status"
                      class="vc-admin-traffic-light-bulb"
                      :class="`vc-admin-traffic-light-bulb--${item.status}`"
                    />
                  </div>

                  <div class="space-y-3">
                    <div
                      v-for="item in semaphoreSummary"
                      :key="item.status"
                      class="vc-admin-semaphore-count"
                    >
                      <div class="flex items-center justify-between gap-3">
                        <span class="flex items-center gap-2 text-sm font-bold text-slate-950">
                          <span
                            class="vc-admin-semaphore-dot"
                            :style="{ backgroundColor: item.color }"
                          />
                          {{ item.label }}
                        </span>
                        <strong class="text-lg leading-none text-slate-950">{{
                          item.count
                        }}</strong>
                      </div>
                      <div class="mt-3 h-2 overflow-hidden rounded-full bg-white">
                        <div
                          class="h-full rounded-full"
                          :style="{ width: `${item.percent}%`, backgroundColor: item.color }"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article
                class="relative min-h-[20rem] overflow-hidden rounded-md border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">
                      Mapa de prioridades
                    </p>
                    <p class="vc-admin-section-title text-slate-950">
                      Pontua&ccedil;&atilde;o por ODS
                    </p>
                    <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                      Quanto menor a pontua&ccedil;&atilde;o, maior a prioridade de acompanhamento
                      na gest&atilde;o.
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      M&eacute;dia
                    </p>
                    <p class="text-2xl font-black leading-none text-slate-950">
                      {{ semaphoreAverage }}
                    </p>
                  </div>
                </div>

                <div class="mt-5 space-y-3">
                  <div
                    v-for="goal in semaphoreRankedGoals"
                    :key="goal.id"
                    class="vc-admin-semaphore-row"
                  >
                    <div class="flex min-w-0 items-center gap-3">
                      <img
                        :src="getGoalImage(goal.id)"
                        :alt="`ODS ${goal.id} - ${goal.title}`"
                        class="h-11 w-11 shrink-0 rounded object-cover"
                      />
                      <div class="min-w-0">
                        <p class="truncate text-sm font-bold text-slate-950">
                          ODS {{ goal.id }} - {{ goal.title }}
                        </p>
                        <p class="mt-1 truncate text-xs text-slate-500">{{ goal.description }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <span
                        class="vc-admin-semaphore-pill"
                        :class="`vc-admin-semaphore-pill--${goal.status}`"
                      >
                        {{ getSemaphoreMeta(goal.status).label }}
                      </span>
                      <strong class="w-12 text-right text-sm text-slate-950">{{
                        formatScore(goal.score)
                      }}</strong>
                    </div>
                  </div>
                </div>

                <q-inner-loading :showing="semaphoreLoading">
                  <q-spinner color="green-9" size="32px" />
                </q-inner-loading>
              </article>
            </div>

            <article
              class="relative min-h-[21rem] overflow-hidden rounded-md border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">
                    Grade operacional
                  </p>
                  <p class="vc-admin-section-title text-slate-950">ODS por cor de acompanhamento</p>
                  <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    Use esta leitura para priorizar curadoria, solicita&ccedil;&atilde;o de novas
                    fontes e revis&atilde;o de indicadores vinculados.
                  </p>
                </div>
                <span class="vc-admin-status">Escala 0-100</span>
              </div>

              <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                <article
                  v-for="goal in semaphoreGoals"
                  :key="goal.id"
                  class="vc-admin-semaphore-goal rounded-md border border-slate-200 bg-slate-50 p-3"
                >
                  <div class="flex gap-3">
                    <img
                      :src="getGoalImage(goal.id)"
                      :alt="`ODS ${goal.id} - ${goal.title}`"
                      class="h-16 w-16 shrink-0 rounded object-cover"
                    />
                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <span
                          class="vc-admin-semaphore-pill"
                          :class="`vc-admin-semaphore-pill--${goal.status}`"
                        >
                          {{ getSemaphoreMeta(goal.status).label }}
                        </span>
                        <span class="text-xs font-bold text-slate-500">{{ goal.source }}</span>
                      </div>
                      <p class="mt-2 text-sm font-bold leading-snug text-slate-950">
                        ODS {{ goal.id }} - {{ goal.title }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-4">
                    <div class="flex items-center justify-between gap-3 text-xs">
                      <span class="font-semibold text-slate-500">Pontua&ccedil;&atilde;o</span>
                      <strong class="text-slate-950">{{ formatScore(goal.score) }}</strong>
                    </div>
                    <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-white">
                      <div
                        class="h-full rounded-full"
                        :style="{
                          width: `${Math.max(goal.score, 6)}%`,
                          backgroundColor: getSemaphoreMeta(goal.status).color,
                        }"
                      />
                    </div>
                  </div>
                </article>
              </div>

              <q-inner-loading :showing="semaphoreLoading">
                <q-spinner color="green-9" size="32px" />
              </q-inner-loading>
            </article>
          </section>

          <section v-else-if="activeSection === 'objetivos'" key="objetivos" class="space-y-5">
            <AdminSectionHeader
              eyebrow="Objetivos"
              title="ODS adotados no observat&oacute;rio"
              text="Organize a leitura p&uacute;blica de cada objetivo e conecte prioridades locais, secretarias respons&aacute;veis e indicadores."
              icon="flag"
            />

            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <article
                v-for="goal in managedGoals"
                :key="goal.id"
                class="vc-managed-goal-card rounded-md border border-slate-200 bg-white p-4 shadow-sm"
                :style="{ '--goal-accent': getGoalAccent(goal.id) }"
              >
                <div class="vc-managed-goal-card-bar" />
                <div class="flex gap-4">
                  <div class="vc-managed-goal-thumb h-16 w-16 shrink-0 overflow-hidden rounded-md">
                    <img
                      :src="getGoalImage(goal.id)"
                      :alt="goal.title"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="vc-managed-goal-badge">
                      ODS {{ goal.id }}
                    </p>
                    <p class="mt-3 text-base font-bold leading-snug text-slate-950">
                      {{ goal.title }}
                    </p>
                    <p class="mt-2 text-sm leading-6 text-slate-600">{{ goal.focus }}</p>
                  </div>
                </div>
                <div class="mt-5 grid grid-cols-3 gap-2">
                  <div class="vc-managed-goal-stat">
                    <strong>{{ goal.targets }}</strong>
                    <span>metas</span>
                  </div>
                  <div class="vc-managed-goal-stat">
                    <strong>{{ goal.indicators }}</strong>
                    <span>indicadores</span>
                  </div>
                  <div class="vc-managed-goal-stat">
                    <strong>{{ goal.sources }}</strong>
                    <span>fontes</span>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section v-else-if="activeSection === 'indicadores'" key="indicadores" class="space-y-5">
            <AdminSectionHeader
              eyebrow="Indicadores"
              title="Cadastro e curadoria de indicadores"
              text="Controle unidade de medida, periodicidade, polaridade, desagrega&ccedil;&otilde;es e rela&ccedil;&atilde;o com metas locais."
              icon="query_stats"
            />

            <div class="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <p class="text-sm font-bold text-slate-950">Novo indicador</p>
                <div class="mt-4 space-y-3">
                  <q-select
                    v-model="indicatorForm.goal"
                    :options="goalOptions"
                    label="ODS vinculado"
                    outlined
                    dense
                  />
                  <q-input v-model="indicatorForm.name" label="Nome do indicador" outlined dense />
                  <q-input v-model="indicatorForm.unit" label="Unidade de medida" outlined dense />
                  <div class="grid gap-3 sm:grid-cols-2">
                    <q-select
                      v-model="indicatorForm.frequency"
                      :options="frequencyOptions"
                      label="Periodicidade"
                      outlined
                      dense
                    />
                    <q-select
                      v-model="indicatorForm.polarity"
                      :options="polarityOptions"
                      label="Polaridade"
                      outlined
                      dense
                    />
                  </div>
                  <q-input
                    v-model="indicatorForm.description"
                    label="Descri&ccedil;&atilde;o metodol&oacute;gica"
                    outlined
                    dense
                    type="textarea"
                  />
                  <q-btn
                    class="w-full"
                    color="green-9"
                    icon="save"
                    label="Salvar indicador"
                    no-caps
                    :loading="adminSaving"
                    @click="saveIndicator"
                  />
                </div>
              </article>

              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <p class="text-sm font-bold text-slate-950">Indicadores cadastrados</p>
                <div class="mt-4 space-y-3">
                  <div
                    v-for="indicator in indicators"
                    :key="indicator.name"
                    class="rounded-md border border-slate-100 bg-slate-50 p-4"
                  >
                    <div class="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p class="text-sm font-bold text-slate-950">{{ indicator.name }}</p>
                        <p class="mt-1 text-xs leading-5 text-slate-500">
                          {{ indicator.goal }} &middot; {{ indicator.target }} &middot;
                          {{ indicator.frequency }}
                        </p>
                      </div>
                      <span class="vc-admin-status">{{ indicator.status }}</span>
                    </div>
                    <p class="mt-3 text-xs leading-5 text-slate-600">{{ indicator.description }}</p>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section v-else-if="activeSection === 'metas'" key="metas" class="space-y-5">
            <AdminSectionHeader
              eyebrow="Metas locais"
              title="Tradu&ccedil;&atilde;o municipal das metas da Agenda 2030"
              text="Cadastre metas adaptadas &agrave; realidade de Vit&oacute;ria da Conquista, com respons&aacute;veis, prazos e prioridade."
              icon="track_changes"
            />

            <div class="grid gap-3 lg:grid-cols-2">
              <article
                v-for="target in localTargets"
                :key="target.code"
                class="rounded-md border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div class="flex items-start justify-between gap-3">
                  <span class="vc-admin-code">{{ target.code }}</span>
                  <span class="vc-admin-status">{{ target.priority }}</span>
                </div>
                <p class="mt-3 text-sm font-bold text-slate-950">{{ target.title }}</p>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ target.text }}</p>
                <div class="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                  <span
                    >Respons&aacute;vel: <strong>{{ target.owner }}</strong></span
                  >
                  <span
                    >Prazo: <strong>{{ target.deadline }}</strong></span
                  >
                </div>
              </article>
            </div>
          </section>

          <section v-else-if="activeSection === 'acoes'" key="acoes" class="space-y-5">
            <AdminSectionHeader
              eyebrow="A&ccedil;&otilde;es"
              title="Criar a&ccedil;&atilde;o vinculada aos ODS"
              text="Registre a secretaria respons&aacute;vel, peso, nome, descri&ccedil;&atilde;o e o ODS que ser&aacute; fortalecido pela iniciativa."
              icon="add_task"
            />

            <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <div class="grid gap-3 md:grid-cols-2">
                  <q-input
                    v-model="actionForm.name"
                    label="Nome da a&ccedil;&atilde;o"
                    outlined
                    dense
                  />
                  <q-select
                    v-model="actionForm.department"
                    :options="departmentOptions"
                    label="Secretaria respons&aacute;vel"
                    outlined
                    dense
                  />
                  <q-select
                    v-model="actionForm.goal"
                    :options="goalOptions"
                    label="ODS que vai ajudar"
                    outlined
                    dense
                  />
                  <q-input
                    v-model.number="actionForm.weight"
                    label="Peso"
                    outlined
                    dense
                    type="number"
                    min="1"
                    max="5"
                  />
                </div>

                <div class="mt-4 rounded-md border border-slate-100 bg-slate-50 p-4">
                  <div class="flex items-center justify-between gap-3 text-xs">
                    <span class="font-bold uppercase tracking-wide text-slate-500">
                      Peso da a&ccedil;&atilde;o
                    </span>
                    <span class="vc-admin-status">{{ actionForm.weight }} de 5</span>
                  </div>
                  <q-slider
                    v-model="actionForm.weight"
                    class="mt-2"
                    color="green-9"
                    :min="1"
                    :max="5"
                    :step="1"
                    markers
                  />
                </div>

                <q-input
                  v-model="actionForm.description"
                  class="mt-3"
                  label="Descri&ccedil;&atilde;o"
                  outlined
                  dense
                  type="textarea"
                />

                <div class="mt-4 flex flex-wrap justify-end gap-2">
                  <q-btn outline color="grey-8" icon="drafts" label="Salvar rascunho" no-caps :loading="adminSaving" @click="saveAction('DRAFT')" />
                  <q-btn
                    color="green-9"
                    icon="task_alt"
                    label="Criar a&ccedil;&atilde;o"
                    no-caps
                    :loading="adminSaving"
                    @click="saveAction('PUBLISHED')"
                  />
                </div>
              </article>

              <aside class="space-y-5">
                <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                  <p class="text-sm font-bold text-slate-950">Resumo da a&ccedil;&atilde;o</p>
                  <div v-if="selectedActionGoal" class="mt-4 flex gap-3">
                    <div class="h-16 w-16 shrink-0 overflow-hidden rounded-md">
                      <img
                        :src="getGoalImage(selectedActionGoal.id)"
                        :alt="selectedActionGoal.title"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-bold uppercase tracking-wide text-slate-500">
                        {{ actionForm.goal }}
                      </p>
                      <p class="mt-1 text-sm font-bold leading-snug text-slate-950">
                        {{ actionForm.name }}
                      </p>
                      <p class="mt-2 text-xs leading-5 text-slate-500">
                        {{ actionForm.department }} &middot; peso {{ actionForm.weight }}
                      </p>
                    </div>
                  </div>
                  <p class="mt-4 text-sm leading-6 text-slate-600">
                    {{ actionForm.description }}
                  </p>
                </article>

                <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                  <p class="text-sm font-bold text-slate-950">A&ccedil;&otilde;es cadastradas</p>
                  <div class="mt-4 space-y-3">
                    <div
                      v-for="action in municipalActions"
                      :key="action.name"
                      class="rounded-md border border-slate-100 bg-slate-50 p-4"
                    >
                      <div class="flex items-start justify-between gap-3">
                        <div>
                          <p class="text-sm font-bold text-slate-950">{{ action.name }}</p>
                          <p class="mt-1 text-xs leading-5 text-slate-500">
                            {{ action.department }} &middot; {{ action.goal }}
                          </p>
                        </div>
                        <span class="vc-admin-status">Peso {{ action.weight }}</span>
                      </div>
                      <p class="mt-3 text-xs leading-5 text-slate-600">
                        {{ action.description }}
                      </p>
                    </div>
                  </div>
                </article>
              </aside>
            </div>
          </section>

          <section v-else-if="activeSection === 'fontes'" key="fontes" class="space-y-5">
            <AdminSectionHeader
              eyebrow="Fontes"
              title="Cat&aacute;logo de bases, portais e evid&ecirc;ncias"
              text="Registre origem, periodicidade, atualiza&ccedil;&atilde;o, licen&ccedil;a e contato t&eacute;cnico de cada fonte."
              icon="dataset"
            />

            <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <div class="space-y-3">
                  <div
                    v-for="source in sources"
                    :key="source.name"
                    class="grid gap-3 rounded-md border border-slate-100 bg-slate-50 p-4 md:grid-cols-[minmax(0,1fr)_160px]"
                  >
                    <div>
                      <p class="text-sm font-bold text-slate-950">{{ source.name }}</p>
                      <p class="mt-1 text-xs leading-5 text-slate-500">{{ source.description }}</p>
                    </div>
                    <div class="text-xs leading-5 text-slate-500">
                      <p>
                        Atualiza&ccedil;&atilde;o: <strong>{{ source.frequency }}</strong>
                      </p>
                      <p>
                        Status: <strong>{{ source.status }}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <p class="text-sm font-bold text-slate-950">Nova fonte</p>
                <div class="mt-4 space-y-3">
                  <q-input v-model="sourceForm.name" label="Nome da fonte" outlined dense />
                  <q-input
                    v-model="sourceForm.url"
                    label="URL ou refer&ecirc;ncia"
                    outlined
                    dense
                  />
                  <q-select
                    v-model="sourceForm.frequency"
                    :options="frequencyOptions"
                    label="Periodicidade"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="sourceForm.owner"
                    label="Respons&aacute;vel t&eacute;cnico"
                    outlined
                    dense
                  />
                  <q-toggle
                    v-model="sourceForm.publicReusable"
                    color="green-9"
                    label="Fonte p&uacute;blica e reutiliz&aacute;vel"
                  />
                  <q-btn
                    class="w-full"
                    color="green-9"
                    icon="save"
                    label="Salvar fonte"
                    no-caps
                    :loading="adminSaving"
                    @click="saveSource"
                  />
                </div>
              </article>
            </div>
          </section>

          <section v-else key="lancamentos" class="space-y-5">
            <AdminSectionHeader
              eyebrow="Lan&ccedil;amentos"
              title="Adicionar valor observado por indicador"
              text="Simule o registro de uma s&eacute;rie hist&oacute;rica informando indicador, territ&oacute;rio, per&iacute;odo, valor, fonte e status de valida&ccedil;&atilde;o."
              icon="edit_note"
            />

            <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <div class="grid gap-3 md:grid-cols-2">
                  <q-select
                    v-model="entryForm.indicator"
                    :options="indicatorOptions"
                    label="Indicador"
                    outlined
                    dense
                  />
                  <q-select
                    v-model="entryForm.goal"
                    :options="goalOptions"
                    label="ODS"
                    outlined
                    dense
                  />
                  <q-input v-model="entryForm.territory" label="Territ&oacute;rio" outlined dense />
                  <q-input v-model="entryForm.period" label="Per&iacute;odo" outlined dense />
                  <q-input v-model="entryForm.value" label="Valor" outlined dense />
                  <q-select
                    v-model="entryForm.source"
                    :options="sourceOptions"
                    label="Fonte"
                    outlined
                    dense
                  />
                </div>
                <q-input
                  v-model="entryForm.note"
                  class="mt-3"
                  label="Observa&ccedil;&atilde;o t&eacute;cnica"
                  outlined
                  dense
                  type="textarea"
                />
                <div class="mt-4 flex flex-wrap justify-end gap-2">
                  <q-btn outline color="grey-8" icon="drafts" label="Salvar rascunho" no-caps :loading="adminSaving" @click="saveObservation('DRAFT')" />
                  <q-btn
                    color="green-9"
                    icon="task_alt"
                    label="Enviar para valida&ccedil;&atilde;o"
                    no-caps
                    :loading="adminSaving"
                    @click="saveObservation('REVIEW')"
                  />
                </div>
              </article>

              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <p class="text-sm font-bold text-slate-950">Checklist de qualidade</p>
                <div class="mt-4 space-y-3">
                  <q-checkbox
                    v-for="check in qualityChecks"
                    :key="check"
                    v-model="checkedQuality"
                    :val="check"
                    color="green-9"
                    :label="check"
                  />
                </div>
              </article>
            </div>
          </section>
        </Transition>
      </main>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/stores/auth-store';

type AdminSection =
  | 'visao'
  | 'semaforo'
  | 'objetivos'
  | 'indicadores'
  | 'metas'
  | 'acoes'
  | 'fontes'
  | 'lancamentos';

type SemaphoreStatus = 'tranquilo' | 'atencao' | 'alerta';

interface IdscGoalApiItem {
  numOds?: number;
  pontuacao?: number;
  label?: string;
  descricao?: string;
}

interface SemaphoreGoal {
  id: number;
  title: string;
  score: number;
  description: string;
  status: SemaphoreStatus;
  source: 'IDSC' | 'ObservaODS';
}

const AdminSectionHeader = defineComponent({
  props: {
    eyebrow: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    icon: { type: String, required: true },
  },
  setup(props) {
    return () =>
      h('article', { class: 'rounded-md border border-slate-200 bg-white p-5 shadow-sm' }, [
        h('div', { class: 'flex items-start justify-between gap-4' }, [
          h('div', [
            h(
              'p',
              { class: 'text-xs font-bold uppercase tracking-wide text-[#1d6d13]' },
              props.eyebrow,
            ),
            h('p', { class: 'vc-admin-section-title text-slate-950' }, props.title),
            h('p', { class: 'mt-2 max-w-3xl text-sm leading-6 text-slate-600' }, props.text),
          ]),
          h('span', { class: 'vc-admin-section-icon' }, [
            h('i', { class: 'q-icon material-icons', 'aria-hidden': 'true' }, props.icon),
          ]),
        ]),
      ]);
  },
});

const activeSection = ref<AdminSection>('visao');
const auth = useAuthStore();
const $q = useQuasar();
const adminSaving = ref(false);
const checkedQuality = ref<string[]>(['Fonte identificada', 'Per\u00edodo informado']);
const idscProfileUrl = 'https://idsc.cidadessustentaveis.org.br/profiles/2933307/';
const semaphoreLoading = ref(false);
const semaphoreLoaded = ref(false);
const semaphoreError = ref('');
const semaphoreUpdatedAt = ref('');

const adminSections = [
  {
    id: 'visao',
    label: 'Vis\u00e3o geral',
    caption: 'Resumo e pend\u00eancias',
    icon: 'space_dashboard',
  },
  {
    id: 'semaforo',
    label: 'Sem\u00e1foro ODS',
    caption: 'Tranquilo, aten\u00e7\u00e3o e alerta',
    icon: 'traffic',
  },
  { id: 'objetivos', label: 'Objetivos ODS', caption: 'Temas municipais', icon: 'flag' },
  {
    id: 'indicadores',
    label: 'Indicadores',
    caption: 'Cadastro e metodologia',
    icon: 'query_stats',
  },
  { id: 'metas', label: 'Metas locais', caption: 'Prioridades e prazos', icon: 'track_changes' },
  {
    id: 'acoes',
    label: 'A\u00e7\u00f5es',
    caption: 'Cadastro por secretaria',
    icon: 'add_task',
  },
  { id: 'fontes', label: 'Fontes de dados', caption: 'Bases e evid\u00eancias', icon: 'dataset' },
  {
    id: 'lancamentos',
    label: 'Lan\u00e7amentos',
    caption: 'S\u00e9rie hist\u00f3rica',
    icon: 'edit_note',
  },
] satisfies Array<{ id: AdminSection; label: string; caption: string; icon: string }>;

const semaphoreMeta: Record<SemaphoreStatus, { label: string; color: string; text: string }> = {
  tranquilo: {
    label: 'Tranquilo',
    color: '#1d6d13',
    text: 'Pontua\u00e7\u00e3o igual ou superior a 60 pontos.',
  },
  atencao: {
    label: 'Aten\u00e7\u00e3o',
    color: '#d99b16',
    text: 'Pontua\u00e7\u00e3o entre 50 e 59,99 pontos.',
  },
  alerta: {
    label: 'Alerta',
    color: '#d64545',
    text: 'Pontua\u00e7\u00e3o abaixo de 50 pontos.',
  },
};

const semaphoreRules = [
  { ...semaphoreMeta.tranquilo, label: 'Verde - tranquilo', status: 'tranquilo' },
  { ...semaphoreMeta.atencao, label: 'Amarelo - aten\u00e7\u00e3o', status: 'atencao' },
  { ...semaphoreMeta.alerta, label: 'Vermelho - alerta', status: 'alerta' },
] satisfies Array<{
  label: string;
  status: SemaphoreStatus;
  color: string;
  text: string;
}>;

const fallbackSemaphoreApiGoals: IdscGoalApiItem[] = [
  { numOds: 1, pontuacao: 51.98, label: 'Erradica\u00e7\u00e3o da pobreza' },
  { numOds: 2, pontuacao: 47.06, label: 'Fome zero e agricultura sustent\u00e1vel' },
  { numOds: 3, pontuacao: 60.72, label: 'Sa\u00fade e bem-estar' },
  { numOds: 4, pontuacao: 40.38, label: 'Educa\u00e7\u00e3o de qualidade' },
  { numOds: 5, pontuacao: 40.32, label: 'Igualdade de g\u00eanero' },
  { numOds: 6, pontuacao: 82.65, label: '\u00c1gua pot\u00e1vel e saneamento' },
  { numOds: 7, pontuacao: 82.17, label: 'Energia acess\u00edvel e limpa' },
  { numOds: 8, pontuacao: 39.5, label: 'Trabalho decente e crescimento econ\u00f4mico' },
  { numOds: 9, pontuacao: 11.09, label: 'Ind\u00fastria, inova\u00e7\u00e3o e infraestrutura' },
  { numOds: 10, pontuacao: 30.07, label: 'Redu\u00e7\u00e3o das desigualdades' },
  { numOds: 11, pontuacao: 71.97, label: 'Cidades e comunidades sustent\u00e1veis' },
  { numOds: 12, pontuacao: 35.77, label: 'Consumo e produ\u00e7\u00e3o respons\u00e1veis' },
  { numOds: 13, pontuacao: 73.3, label: 'A\u00e7\u00e3o contra a mudan\u00e7a global do clima' },
  { numOds: 14, pontuacao: 84.98, label: 'Vida na \u00e1gua' },
  { numOds: 15, pontuacao: 26.72, label: 'Vida terrestre' },
  { numOds: 16, pontuacao: 45.47, label: 'Paz, justi\u00e7a e institui\u00e7\u00f5es eficazes' },
  { numOds: 17, pontuacao: 21.16, label: 'Parcerias e meios de implementa\u00e7\u00e3o' },
];

const localGoal18: SemaphoreGoal = {
  id: 18,
  title: 'Igualdade \u00e9tnico-racial',
  score: 52.4,
  description:
    'Objetivo municipal complementar para acompanhar equidade racial, representatividade e acesso a direitos.',
  status: 'atencao',
  source: 'ObservaODS',
};

const semaphoreGoals = ref<SemaphoreGoal[]>([
  ...normalizeSemaphoreGoals(fallbackSemaphoreApiGoals, 'ObservaODS'),
  localGoal18,
]);

const dashboardMetrics = [
  {
    label: 'ODS ativos',
    value: '18',
    caption: 'Objetivos organizados para leitura municipal.',
    icon: 'flag',
  },
  {
    label: 'Indicadores',
    value: '43',
    caption: 'Entre publicados, em revis\u00e3o e planejados.',
    icon: 'query_stats',
  },
  {
    label: 'Fontes',
    value: '12',
    caption: 'Portais, relat\u00f3rios e bases institucionais.',
    icon: 'dataset',
  },
  {
    label: 'Pend\u00eancias',
    value: '7',
    caption: 'Itens aguardando valida\u00e7\u00e3o t\u00e9cnica.',
    icon: 'pending_actions',
  },
];

const indicatorTrend = [
  { label: 'Jan', value: 18 },
  { label: 'Fev', value: 24 },
  { label: 'Mar', value: 31 },
  { label: 'Abr', value: 29 },
  { label: 'Mai', value: 37 },
  { label: 'Jun', value: 43 },
];

const indicatorTrendCoords = computed(() => {
  const max = Math.max(...indicatorTrend.map((point) => point.value));
  const min = Math.min(...indicatorTrend.map((point) => point.value));
  const range = max - min || 1;

  return indicatorTrend.map((point, index) => ({
    label: point.label,
    x: 24 + index * 74.4,
    y: 132 - ((point.value - min) / range) * 88,
  }));
});

const indicatorTrendPoints = computed(() =>
  indicatorTrendCoords.value.map((point) => `${point.x},${point.y}`).join(' '),
);

const indicatorStatus = [
  { label: 'Publicado', value: 24, percent: 56, color: '#1d6d13' },
  { label: 'Em revis\u00e3o', value: 12, percent: 28, color: '#d99b16' },
  { label: 'Rascunho', value: 7, percent: 16, color: '#64748b' },
];

const statusDonutStyle = computed(() => ({
  background: 'conic-gradient(#1d6d13 0 56%, #d99b16 56% 84%, #64748b 84% 100%)',
}));

const semaphoreSummary = computed(() =>
  semaphoreRules.map((rule) => {
    const count = semaphoreGoals.value.filter((goal) => goal.status === rule.status).length;
    const total = semaphoreGoals.value.length || 1;

    return {
      ...rule,
      count,
      percent: Math.round((count / total) * 100),
    };
  }),
);

const semaphoreAverage = computed(() => {
  const total = semaphoreGoals.value.reduce((sum, goal) => sum + goal.score, 0);
  const average = total / (semaphoreGoals.value.length || 1);

  return formatScore(average);
});

const semaphoreRankedGoals = computed(() =>
  [...semaphoreGoals.value].sort((current, next) => current.score - next.score),
);

const semaphoreSourceLabel = computed(() =>
  semaphoreLoaded.value ? 'Dados IDSC carregados' : 'Leitura demonstrativa',
);

const coverageByAxis = [
  {
    label: 'Social',
    description: 'Renda, assist\u00eancia, sa\u00fade, educa\u00e7\u00e3o e direitos.',
    percent: 82,
    indicators: 18,
    sources: 5,
  },
  {
    label: 'Urbano e ambiental',
    description: 'Saneamento, mobilidade, res\u00edduos, clima e infraestrutura.',
    percent: 64,
    indicators: 11,
    sources: 4,
  },
  {
    label: 'Econ\u00f4mico',
    description: 'Trabalho, renda, inova\u00e7\u00e3o e inclus\u00e3o produtiva.',
    percent: 51,
    indicators: 7,
    sources: 2,
  },
  {
    label: 'Governan\u00e7a',
    description: 'Transpar\u00eancia, participa\u00e7\u00e3o, parcerias e controle social.',
    percent: 73,
    indicators: 7,
    sources: 3,
  },
];

const validationPipeline = [
  { label: 'Coletados', value: 58, percent: 100 },
  { label: 'Com metadados', value: 49, percent: 84 },
  { label: 'Validados', value: 36, percent: 62 },
  { label: 'Publicados', value: 24, percent: 41 },
];

const priorityRisks = [
  {
    id: 6,
    goal: 'ODS 6 - Agua e saneamento',
    status: 'Fonte parcial',
    reason: 'Faltam recortes por territorio e atualizacao de periodicidade.',
  },
  {
    id: 10,
    goal: 'ODS 10 - Desigualdades',
    status: 'Revisar',
    reason: 'Indicadores precisam de desagregacao por renda, genero e raca.',
  },
  {
    id: 13,
    goal: 'ODS 13 - Clima',
    status: 'Planejado',
    reason: 'Dados climaticos ainda dependem de fonte tecnica consolidada.',
  },
];

const dataFlow = [
  { index: '01', label: 'ODS', text: 'Define o tema p\u00fablico e a \u00e1rea de impacto.' },
  { index: '02', label: 'Meta', text: 'Traduz a ambi\u00e7\u00e3o global para prioridade local.' },
  {
    index: '03',
    label: 'Indicador',
    text: 'Mede evolu\u00e7\u00e3o, compara\u00e7\u00e3o e recortes.',
  },
  { index: '04', label: 'Fonte e valor', text: 'Registra origem, per\u00edodo e dado observado.' },
];

const editorialTasks = [
  {
    title: 'Revisar metadados',
    text: 'Indicadores de saneamento precisam de unidade, periodicidade e fonte oficial.',
    icon: 'rule',
  },
  {
    title: 'Validar recortes',
    text: 'Separar dados por bairro, distrito, zona urbana e zona rural quando houver disponibilidade.',
    icon: 'map',
  },
  {
    title: 'Publicar atualiza\u00e7\u00e3o',
    text: 'Lote de educa\u00e7\u00e3o est\u00e1 pronto para revis\u00e3o final antes de ir ao painel p\u00fablico.',
    icon: 'publish',
  },
];

const managedGoals = ref([
  {
    id: 1,
    title: 'Erradica\u00e7\u00e3o da pobreza',
    focus: 'Renda, moradia, vulnerabilidade e acesso a servi\u00e7os.',
    targets: 5,
    indicators: 4,
    sources: 3,
  },
  {
    id: 2,
    title: 'Fome zero e agricultura sustent\u00e1vel',
    focus: 'Seguran\u00e7a alimentar, abastecimento e agricultura familiar.',
    targets: 4,
    indicators: 3,
    sources: 2,
  },
  {
    id: 3,
    title: 'Sa\u00fade e bem-estar',
    focus:
      'Aten\u00e7\u00e3o b\u00e1sica, vigil\u00e2ncia, vacina\u00e7\u00e3o e qualidade de vida.',
    targets: 7,
    indicators: 6,
    sources: 4,
  },
  {
    id: 4,
    title: 'Educa\u00e7\u00e3o de qualidade',
    focus: 'Aprendizagem, perman\u00eancia, creches e ensino integral.',
    targets: 6,
    indicators: 5,
    sources: 3,
  },
  {
    id: 6,
    title: '\u00c1gua pot\u00e1vel e saneamento',
    focus: 'Abastecimento, esgotamento, drenagem e seguran\u00e7a h\u00eddrica.',
    targets: 4,
    indicators: 5,
    sources: 3,
  },
  {
    id: 11,
    title: 'Cidades sustent\u00e1veis',
    focus: 'Mobilidade, habita\u00e7\u00e3o, planejamento urbano e resili\u00eancia.',
    targets: 6,
    indicators: 7,
    sources: 4,
  },
]);

const indicators = ref([
  {
    name: 'Fam\u00edlias em situa\u00e7\u00e3o de vulnerabilidade acompanhadas',
    goal: 'ODS 1',
    target: 'Meta local 1.2',
    frequency: 'Mensal',
    status: 'Em revis\u00e3o',
    description:
      'Percentual de fam\u00edlias cadastradas e acompanhadas pela rede socioassistencial.',
  },
  {
    name: 'Cobertura da aten\u00e7\u00e3o b\u00e1sica',
    goal: 'ODS 3',
    target: 'Meta local 3.8',
    frequency: 'Quadrimestral',
    status: 'Publicado',
    description:
      'Cobertura estimada das equipes de sa\u00fade da fam\u00edlia por territ\u00f3rio.',
  },
  {
    name: 'Taxa de perman\u00eancia escolar',
    goal: 'ODS 4',
    target: 'Meta local 4.1',
    frequency: 'Anual',
    status: 'Rascunho',
    description:
      'Indicador de perman\u00eancia de estudantes na rede municipal ao longo do ano letivo.',
  },
]);

const localTargets = ref([
  {
    code: '1.2 VC',
    title: 'Reduzir vulnerabilidades sociais priorit\u00e1rias',
    text: 'Monitorar renda, moradia, seguran\u00e7a alimentar e acesso a servi\u00e7os essenciais por territ\u00f3rio.',
    owner: 'Desenvolvimento Social',
    deadline: '2030',
    priority: 'Alta',
  },
  {
    code: '4.1 VC',
    title: 'Ampliar perman\u00eancia e aprendizagem',
    text: 'Acompanhar fluxo escolar, frequ\u00eancia, alfabetiza\u00e7\u00e3o e indicadores de qualidade da educa\u00e7\u00e3o.',
    owner: 'Educa\u00e7\u00e3o',
    deadline: '2028',
    priority: 'Alta',
  },
  {
    code: '11.3 VC',
    title: 'Qualificar planejamento urbano',
    text: 'Integrar habita\u00e7\u00e3o, mobilidade, infraestrutura e participa\u00e7\u00e3o social no acompanhamento urbano.',
    owner: 'Infraestrutura',
    deadline: '2030',
    priority: 'M\u00e9dia',
  },
  {
    code: '16.6 VC',
    title: 'Fortalecer transpar\u00eancia institucional',
    text: 'Publicar evid\u00eancias, fontes e s\u00e9ries hist\u00f3ricas de forma acess\u00edvel e rastre\u00e1vel.',
    owner: 'Administra\u00e7\u00e3o',
    deadline: 'Cont\u00ednuo',
    priority: 'M\u00e9dia',
  },
]);

const sources = ref([
  {
    name: 'Cadastro \u00danico municipal',
    description:
      'Base de refer\u00eancia para vulnerabilidade social e perfil das fam\u00edlias acompanhadas.',
    frequency: 'Mensal',
    status: 'Mapeada',
  },
  {
    name: 'Sistema municipal de educa\u00e7\u00e3o',
    description:
      'Registros de matr\u00edcula, frequ\u00eancia, perman\u00eancia e indicadores da rede de ensino.',
    frequency: 'Bimestral',
    status: 'Em integra\u00e7\u00e3o',
  },
  {
    name: 'Portal da Transpar\u00eancia',
    description: 'Receitas, despesas, contratos, conv\u00eanios e documentos administrativos.',
    frequency: 'Cont\u00ednua',
    status: 'Publicada',
  },
]);

const recentEntries = ref([
  {
    indicator: 'Cobertura da aten\u00e7\u00e3o b\u00e1sica',
    goal: 'ODS 3',
    period: '2026.1',
    value: '78,4%',
    status: 'Publicado',
  },
  {
    indicator: 'Taxa de perman\u00eancia escolar',
    goal: 'ODS 4',
    period: '2025',
    value: '91,2%',
    status: 'Rascunho',
  },
  {
    indicator: 'Fam\u00edlias acompanhadas',
    goal: 'ODS 1',
    period: 'Jul/2026',
    value: '12.480',
    status: 'Em revis\u00e3o',
  },
]);

const municipalActions = ref([
  {
    name: 'Busca ativa de fam\u00edlias vulner\u00e1veis',
    department: 'Secretaria Municipal de Desenvolvimento Social',
    goal: 'ODS 1',
    weight: 5,
    description:
      'Mapeia fam\u00edlias em maior vulnerabilidade para priorizar acesso a benef\u00edcios, servi\u00e7os e acompanhamento territorial.',
  },
  {
    name: 'Plano de perman\u00eancia escolar',
    department: 'Secretaria Municipal de Educa\u00e7\u00e3o',
    goal: 'ODS 4',
    weight: 4,
    description:
      'Acompanha frequ\u00eancia e fluxo escolar para reduzir abandono e fortalecer aprendizagem na rede municipal.',
  },
  {
    name: 'Monitoramento de saneamento por territ\u00f3rio',
    department: 'Secretaria Municipal de Infraestrutura Urbana',
    goal: 'ODS 6',
    weight: 4,
    description:
      'Organiza demandas e evid\u00eancias sobre abastecimento, drenagem e esgotamento em bairros e distritos.',
  },
]);

const frequencyOptions = ['Mensal', 'Bimestral', 'Quadrimestral', 'Semestral', 'Anual'];
const polarityOptions = ['Quanto maior, melhor', 'Quanto menor, melhor', 'Contextual'];
const departmentOptions = ref([
  'Secretaria Municipal de Desenvolvimento Social',
  'Secretaria Municipal de Educa\u00e7\u00e3o',
  'Secretaria Municipal de Sa\u00fade',
  'Secretaria Municipal de Meio Ambiente',
  'Secretaria Municipal de Infraestrutura Urbana',
  'Secretaria Municipal de Administra\u00e7\u00e3o',
  'Secretaria Municipal de Transpar\u00eancia',
]);
const goalOptions = computed(() => managedGoals.value.map((goal) => `ODS ${goal.id} - ${goal.title}`));
const indicatorOptions = computed(() => indicators.value.map((indicator) => indicator.name));
const sourceOptions = computed(() => sources.value.map((source) => source.name));
const qualityChecks = [
  'Fonte identificada',
  'Per\u00edodo informado',
  'Unidade de medida definida',
  'Recorte territorial revisado',
  'Metodologia documentada',
];

const indicatorForm = ref({
  goal: goalOptions.value[0],
  name: 'Taxa de acesso a servi\u00e7os essenciais',
  unit: '%',
  frequency: 'Anual',
  polarity: 'Quanto maior, melhor',
  description: 'Descreve como o indicador ser\u00e1 calculado e quais recortes ser\u00e3o aceitos.',
});

const sourceForm = ref({
  name: 'Painel setorial municipal',
  url: 'https://dados.pmvc.ba.gov.br',
  frequency: 'Mensal',
  owner: 'Equipe tecnica',
  publicReusable: true,
});

const actionForm = ref({
  name: 'Mutir\u00e3o de atendimento territorial',
  department: departmentOptions.value[0],
  goal: goalOptions.value[0],
  weight: 3,
  description:
    'A\u00e7\u00e3o demonstrativa para registrar a iniciativa, sua secretaria respons\u00e1vel e o ODS diretamente impactado.',
});

const entryForm = ref({
  indicator: indicatorOptions.value[0],
  goal: goalOptions.value[0],
  territory: 'Vit\u00f3ria da Conquista',
  period: '2026',
  value: '0',
  source: sourceOptions.value[0],
  note: 'Registro demonstrativo para validar o fluxo de alimenta\u00e7\u00e3o.',
});

const selectedActionGoal = computed(() => {
  const goalId = Number(actionForm.value.goal?.match(/^ODS (\d+)/)?.[1]);

  return managedGoals.value.find((goal) => goal.id === goalId);
});

interface ApiGoal { id: number; title: string; localFocus: string }
interface ApiDepartment { id: string; name: string }
interface ApiTarget { id: string; code: string; title: string; description: string; deadline: string; priority: string; goalId: number; department?: ApiDepartment | null }
interface ApiIndicator { id: string; name: string; description: string; frequency: string; status: string; goalId: number; target?: { code: string } | null; goal: ApiGoal }
interface ApiSource { id: string; name: string; description?: string | null; frequency: string; status: string }
interface ApiObservation { id: string; period: string; displayValue?: string | null; value: string; status: string; indicator: { name: string; goalId: number }; source: ApiSource }
interface ApiAction { id: string; name: string; description: string; weight: number; goalId: number; department: ApiDepartment }

const apiDepartments = ref<ApiDepartment[]>([]);
const apiIndicators = ref<ApiIndicator[]>([]);
const apiSources = ref<ApiSource[]>([]);
const frequencyToApi: Record<string, string> = { Mensal: 'MONTHLY', Bimestral: 'BIMONTHLY', Quadrimestral: 'FOUR_MONTHLY', Semestral: 'SEMIANNUAL', Anual: 'ANNUAL', 'Contínua': 'CONTINUOUS' };
const frequencyFromApi: Record<string, string> = { MONTHLY: 'Mensal', BIMONTHLY: 'Bimestral', QUARTERLY: 'Trimestral', FOUR_MONTHLY: 'Quadrimestral', SEMIANNUAL: 'Semestral', ANNUAL: 'Anual', CONTINUOUS: 'Contínua' };
const statusFromApi: Record<string, string> = { DRAFT: 'Rascunho', REVIEW: 'Em revisão', PUBLISHED: 'Publicado', ARCHIVED: 'Arquivado' };
const priorityFromApi: Record<string, string> = { HIGH: 'Alta', MEDIUM: 'Média', CONTINUOUS: 'Contínua' };
const polarityToApi: Record<string, string> = { 'Quanto maior, melhor': 'HIGHER_IS_BETTER', 'Quanto menor, melhor': 'LOWER_IS_BETTER', Contextual: 'CONTEXTUAL' };

async function loadAdminData() {
  try {
    const [goals, departments, targets, indicatorRows, sourceRows, observations, actions] = await Promise.all([
      auth.request<ApiGoal[]>('/goals'), auth.request<ApiDepartment[]>('/departments'), auth.request<ApiTarget[]>('/targets'),
      auth.request<ApiIndicator[]>('/indicators'), auth.request<ApiSource[]>('/sources'), auth.request<ApiObservation[]>('/observations'), auth.request<ApiAction[]>('/actions'),
    ]);
    apiDepartments.value = departments; apiIndicators.value = indicatorRows; apiSources.value = sourceRows;
    departmentOptions.value = departments.map((item) => item.name);
    managedGoals.value = goals.map((goal) => ({ id: goal.id, title: goal.title, focus: goal.localFocus, targets: targets.filter((item) => item.goalId === goal.id).length, indicators: indicatorRows.filter((item) => item.goalId === goal.id).length, sources: 0 }));
    indicators.value = indicatorRows.map((item) => ({ name: item.name, goal: `ODS ${item.goalId}`, target: item.target?.code ? `Meta local ${item.target.code}` : 'Sem meta vinculada', frequency: frequencyFromApi[item.frequency] ?? item.frequency, status: statusFromApi[item.status] ?? item.status, description: item.description }));
    localTargets.value = targets.map((item) => ({ code: item.code, title: item.title, text: item.description, owner: item.department?.name ?? 'ObservaODS', deadline: item.deadline, priority: priorityFromApi[item.priority] ?? item.priority }));
    sources.value = sourceRows.map((item) => ({ name: item.name, description: item.description ?? '', frequency: frequencyFromApi[item.frequency] ?? item.frequency, status: statusFromApi[item.status] ?? item.status }));
    recentEntries.value = observations.slice(0, 8).map((item) => ({ indicator: item.indicator.name, goal: `ODS ${item.indicator.goalId}`, period: item.period, value: item.displayValue ?? String(item.value), status: statusFromApi[item.status] ?? item.status }));
    municipalActions.value = actions.map((item) => ({ name: item.name, department: item.department.name, goal: `ODS ${item.goalId}`, weight: item.weight, description: item.description }));
  } catch (error) { $q.notify({ type: 'negative', message: error instanceof Error ? error.message : 'Falha ao carregar o painel.' }); }
}

async function runSave(callback: () => Promise<unknown>, message: string) {
  adminSaving.value = true;
  try { await callback(); $q.notify({ type: 'positive', message }); await loadAdminData(); }
  catch (error) { $q.notify({ type: 'negative', message: error instanceof Error ? error.message : 'Não foi possível salvar.' }); }
  finally { adminSaving.value = false; }
}
function selectedGoalId(value?: string) { return Number(value?.match(/^ODS (\d+)/)?.[1]); }
async function saveIndicator() {
  await runSave(() => auth.request('/indicators', { method: 'POST', body: JSON.stringify({ name: indicatorForm.value.name, description: indicatorForm.value.description, unit: indicatorForm.value.unit, frequency: frequencyToApi[indicatorForm.value.frequency], polarity: polarityToApi[indicatorForm.value.polarity], status: 'PUBLISHED', goalId: selectedGoalId(indicatorForm.value.goal) }) }), 'Indicador salvo.');
}
async function saveSource() {
  await runSave(() => auth.request('/sources', { method: 'POST', body: JSON.stringify({ name: sourceForm.value.name, url: sourceForm.value.url, frequency: frequencyToApi[sourceForm.value.frequency], technicalOwner: sourceForm.value.owner, publicReusable: sourceForm.value.publicReusable, status: 'PUBLISHED' }) }), 'Fonte salva.');
}
async function saveAction(status: 'DRAFT' | 'PUBLISHED') {
  const department = apiDepartments.value.find((item) => item.name === actionForm.value.department);
  await runSave(() => auth.request('/actions', { method: 'POST', body: JSON.stringify({ name: actionForm.value.name, description: actionForm.value.description, weight: actionForm.value.weight, status, goalId: selectedGoalId(actionForm.value.goal), departmentId: department?.id }) }), status === 'DRAFT' ? 'Rascunho salvo.' : 'Ação criada.');
}
async function saveObservation(status: 'DRAFT' | 'REVIEW') {
  const indicator = apiIndicators.value.find((item) => item.name === entryForm.value.indicator);
  const source = apiSources.value.find((item) => item.name === entryForm.value.source);
  const normalized = entryForm.value.value.replace(/\./g, '').replace(',', '.');
  await runSave(() => auth.request('/observations', { method: 'POST', body: JSON.stringify({ indicatorId: indicator?.id, sourceId: source?.id, territory: entryForm.value.territory, period: entryForm.value.period, value: Number(normalized), displayValue: entryForm.value.value, note: entryForm.value.note, status }) }), status === 'DRAFT' ? 'Rascunho salvo.' : 'Lançamento enviado para revisão.');
}

onMounted(loadAdminData);

watch(activeSection, (section) => {
  if (section === 'semaforo' && !semaphoreLoaded.value && !semaphoreLoading.value) {
    void loadIdscSemaphore();
  }
});

function classifySemaphore(score: number): SemaphoreStatus {
  if (score >= 60) {
    return 'tranquilo';
  }

  if (score >= 50) {
    return 'atencao';
  }

  return 'alerta';
}

function normalizeGoalTitle(id: number, label = '') {
  const correctedLabels: Record<number, string> = {
    10: 'Redu\u00e7\u00e3o das desigualdades',
    18: 'Igualdade \u00e9tnico-racial',
  };

  return correctedLabels[id] ?? label;
}

function normalizeGoalDescription(id: number, description = '') {
  const fallbackDescriptions: Record<number, string> = {
    1: 'Renda, vulnerabilidade social e acesso a servi\u00e7os essenciais.',
    2: 'Seguran\u00e7a alimentar, abastecimento e agricultura sustent\u00e1vel.',
    3: 'Sa\u00fade, bem-estar, aten\u00e7\u00e3o b\u00e1sica e qualidade de vida.',
    4: 'Aprendizagem, perman\u00eancia escolar e educa\u00e7\u00e3o inclusiva.',
    5: 'Equidade de g\u00eanero, prote\u00e7\u00e3o e autonomia das mulheres.',
    6: 'Disponibilidade de \u00e1gua, saneamento e seguran\u00e7a h\u00eddrica.',
    7: 'Acesso a energia limpa, segura e economicamente vi\u00e1vel.',
    8: 'Emprego, renda, empreendedorismo e crescimento inclusivo.',
    9: 'Infraestrutura, inova\u00e7\u00e3o, conectividade e desenvolvimento produtivo.',
    10: 'Redu\u00e7\u00e3o de desigualdades sociais, territoriais e de renda.',
    11: 'Planejamento urbano, habita\u00e7\u00e3o, mobilidade e resili\u00eancia.',
    12: 'Consumo respons\u00e1vel, produ\u00e7\u00e3o sustent\u00e1vel e gest\u00e3o de recursos.',
    13: 'A\u00e7\u00e3o clim\u00e1tica, preven\u00e7\u00e3o de riscos e adapta\u00e7\u00e3o.',
    14: 'Prote\u00e7\u00e3o dos ecossistemas aqu\u00e1ticos e recursos h\u00eddricos.',
    15: 'Conserva\u00e7\u00e3o ambiental, biodiversidade e recupera\u00e7\u00e3o de \u00e1reas.',
    16: 'Institui\u00e7\u00f5es eficazes, transpar\u00eancia, seguran\u00e7a e justi\u00e7a.',
    17: 'Parcerias, governan\u00e7a de dados e meios de implementa\u00e7\u00e3o.',
    18: 'Equidade racial, representatividade e acesso igualit\u00e1rio a direitos.',
  };
  const compactDescription = description.replace(/\s+/g, ' ').trim();

  return compactDescription || fallbackDescriptions[id] || 'Leitura de desempenho do ODS.';
}

function normalizeSemaphoreGoals(items: IdscGoalApiItem[], source: SemaphoreGoal['source']) {
  return items
    .map((item) => {
      const id = Number(item.numOds);
      const score = Number(item.pontuacao);

      if (!Number.isFinite(id) || !Number.isFinite(score)) {
        return null;
      }

      return {
        id,
        title: normalizeGoalTitle(id, item.label),
        score,
        description: normalizeGoalDescription(id, item.descricao),
        status: classifySemaphore(score),
        source,
      } satisfies SemaphoreGoal;
    })
    .filter((goal): goal is SemaphoreGoal => goal !== null)
    .sort((current, next) => current.id - next.id);
}

async function loadIdscSemaphore() {
  semaphoreLoading.value = true;
  semaphoreError.value = '';

  try {
    const payload = await auth.request<{ goals: SemaphoreGoal[] }>('/idsc/sync', { method: 'POST' });
    if (payload.goals.length < 18) {
      throw new Error('Resposta incompleta da API IDSC');
    }
    semaphoreGoals.value = payload.goals;
    semaphoreLoaded.value = true;
    semaphoreUpdatedAt.value = new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date());
  } catch {
    semaphoreGoals.value = [
      ...normalizeSemaphoreGoals(fallbackSemaphoreApiGoals, 'ObservaODS'),
      localGoal18,
    ];
    semaphoreLoaded.value = false;
    semaphoreUpdatedAt.value = '';
    semaphoreError.value =
      'N\u00e3o foi poss\u00edvel consultar a API agora; exibindo leitura demonstrativa.';
  } finally {
    semaphoreLoading.value = false;
  }
}

function getSemaphoreMeta(status: SemaphoreStatus) {
  return semaphoreMeta[status];
}

function formatScore(score: number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(score);
}

function getGoalAccent(id: number) {
  const accents: Record<number, string> = {
    1: '#e5243b',
    2: '#dda63a',
    3: '#4c9f38',
    4: '#c5192d',
    5: '#ff3a21',
    6: '#26bde2',
    7: '#fcc30b',
    8: '#a21942',
    9: '#fd6925',
    10: '#dd1367',
    11: '#fd9d24',
    12: '#bf8b2e',
    13: '#3f7e44',
    14: '#0a97d9',
    15: '#56c02b',
    16: '#00689d',
    17: '#19486a',
    18: '#7a3f98',
  };

  return accents[id] ?? '#1d6d13';
}

function getGoalImage(id: number) {
  const extension = id === 18 ? 'png' : 'jpg';

  return new URL(`../assets/${id}.${extension}`, import.meta.url).href;
}
</script>
