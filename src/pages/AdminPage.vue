<template>
  <q-page class="min-h-screen bg-[#eef2ee]">
    <div
      class="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)]"
    >
      <aside
        class="vc-admin-sidebar rounded-md border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-20 lg:self-start"
      >
        <nav class="vc-admin-nav space-y-1">
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

          <RouterLink
            to="/reproducao"
            class="vc-admin-nav-item mt-3 border-t border-slate-100 pt-3"
          >
            <span class="vc-admin-nav-icon">
              <q-icon name="connected_tv" size="18px" />
            </span>
            <span class="min-w-0 text-left">
              <span class="block text-sm font-semibold leading-tight">Tela de reprodu&ccedil;&atilde;o</span>
              <span class="mt-0.5 block text-xs leading-snug opacity-70">Exibi&ccedil;&atilde;o em TV</span>
            </span>
            <q-icon class="ml-auto" name="open_in_new" size="16px" />
          </RouterLink>
        </nav>

      </aside>

      <main class="min-w-0 space-y-5">
        <header
          v-if="activeSection === 'visao'"
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
            <section class="vc-admin-overview-metrics" aria-label="Resumo do observatório">
              <article
                v-for="metric in dashboardMetrics"
                :key="metric.label"
                class="vc-admin-stat"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="vc-admin-stat-label">{{ metric.label }}</p>
                    <p class="vc-admin-stat-value">{{ metric.value }}</p>
                  </div>
                  <span class="vc-admin-stat-icon">
                    <q-icon :name="metric.icon" size="20px" />
                  </span>
                </div>
                <p class="vc-admin-stat-caption">{{ metric.caption }}</p>
              </article>
            </section>

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

          <section v-else-if="activeSection === 'triagem'" key="triagem">
            <article class="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
              <header class="border-b border-slate-100 p-5 sm:p-6">
                <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">Triagem editorial</p>
                <p class="vc-admin-section-title text-slate-950">Notícias com potencial de contribuição aos ODS</p>
                <p class="mt-2 w-full text-sm leading-6 text-slate-600">
                  Analise as notícias importadas, valide sua relevância municipal e transforme evidências de iniciativas públicas em ações computáveis pelo ObservaODS.
                </p>
              </header>

              <div class="grid gap-3 border-b border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-3 sm:p-5">
                <button
                  type="button"
                  class="vc-triage-filter vc-triage-filter--pending"
                  :class="isTriageFilterActive('PENDING') ? 'vc-triage-filter--active' : ''"
                  :aria-pressed="isTriageFilterActive('PENDING')"
                  @click="toggleTriageFilter('PENDING')"
                >
                  <span><q-icon name="schedule" /> Aguardando análise</span>
                  <strong>{{ triageCounts.PENDING }}</strong>
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 8]">
                    {{
                      isTriageFilterActive('PENDING')
                        ? 'Clique novamente para remover este filtro'
                        : 'Clique para exibir somente as notícias aguardando análise'
                    }}
                  </q-tooltip>
                </button>
                <button
                  type="button"
                  class="vc-triage-filter vc-triage-filter--converted"
                  :class="isTriageFilterActive('CONVERTED') ? 'vc-triage-filter--active' : ''"
                  :aria-pressed="isTriageFilterActive('CONVERTED')"
                  @click="toggleTriageFilter('CONVERTED')"
                >
                  <span><q-icon name="task_alt" /> Convertidas em ações</span>
                  <strong>{{ triageCounts.CONVERTED }}</strong>
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 8]">
                    {{
                      isTriageFilterActive('CONVERTED')
                        ? 'Clique novamente para remover este filtro'
                        : 'Clique para filtrar as notícias já convertidas em ações'
                    }}
                  </q-tooltip>
                </button>
                <button
                  type="button"
                  class="vc-triage-filter vc-triage-filter--dismissed"
                  :class="isTriageFilterActive('DISMISSED') ? 'vc-triage-filter--active' : ''"
                  :aria-pressed="isTriageFilterActive('DISMISSED')"
                  @click="toggleTriageFilter('DISMISSED')"
                >
                  <span><q-icon name="do_not_disturb_on" /> Não aplicáveis</span>
                  <strong>{{ triageCounts.DISMISSED }}</strong>
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 8]">
                    {{
                      isTriageFilterActive('DISMISSED')
                        ? 'Clique novamente para remover este filtro'
                        : 'Clique para exibir as notícias classificadas como não aplicáveis'
                    }}
                  </q-tooltip>
                </button>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
                <div>
                  <p class="text-sm font-bold text-slate-950">Fila de notícias</p>
                  <p class="mt-1 text-xs text-slate-500">Clique em uma linha para abrir a análise completa.</p>
                </div>
                <q-btn
                  v-if="triageFilters.length"
                  flat
                  color="green-9"
                  icon="view_list"
                  label="Exibir todas"
                  no-caps
                  @click="clearTriageFilters"
                />
              </div>

              <div class="overflow-x-auto">
                <table class="vc-admin-table vc-triage-table">
                  <thead>
                    <tr>
                      <th>Notícia</th>
                      <th>Classificação</th>
                      <th>Publicação</th>
                      <th>Validada</th>
                      <th>Lançada</th>
                      <th><span class="sr-only">Abrir</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in filteredTriageNews" :key="item.id">
                      <td>
                        <RouterLink :to="{ name: 'news-triage', params: { id: item.id } }" class="flex min-w-[310px] items-center gap-3 text-inherit no-underline">
                          <div class="h-14 w-20 shrink-0 overflow-hidden rounded bg-emerald-950">
                            <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" class="h-full w-full object-cover" />
                          </div>
                          <div class="min-w-0">
                            <p class="line-clamp-2 text-sm font-bold leading-5 text-slate-950">{{ item.title }}</p>
                            <p class="mt-1 max-w-sm truncate text-xs text-slate-500">{{ item.source }}</p>
                          </div>
                        </RouterLink>
                      </td>
                      <td>
                        <span v-if="item.primaryGoalId" class="vc-admin-code">ODS {{ item.primaryGoalId }}</span>
                        <span v-else class="text-xs text-slate-400">Sem ODS sugerido</span>
                      </td>
                      <td class="whitespace-nowrap">{{ item.publishedLabel || formatTriageDate(item.publishedAt) }}</td>
                      <td>
                        <span
                          class="vc-admin-status"
                          :class="item.triageStatus === 'PENDING' ? 'vc-triage-status--pending' : 'vc-triage-status--converted'"
                        >
                          <q-icon :name="item.triageStatus === 'PENDING' ? 'schedule' : 'verified'" class="mr-1" />
                          {{ item.triageStatus === 'PENDING' ? 'Não' : 'Sim' }}
                        </span>
                      </td>
                      <td>
                        <span
                          class="vc-admin-status"
                          :class="item.action ? 'vc-triage-status--converted' : 'vc-triage-status--dismissed'"
                        >
                          <q-icon :name="item.action ? 'task_alt' : 'remove_circle_outline'" class="mr-1" />
                          {{ actionLaunchLabel(item) }}
                        </span>
                      </td>
                      <td>
                        <q-btn flat round color="green-9" icon="chevron_right" :to="{ name: 'news-triage', params: { id: item.id } }">
                          <q-tooltip>Analisar notícia</q-tooltip>
                        </q-btn>
                      </td>
                    </tr>
                    <tr v-if="!filteredTriageNews.length">
                      <td colspan="6" class="py-10 text-center text-sm text-slate-500">Nenhuma notícia encontrada nesta situação.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          </section>

          <section v-else-if="activeSection === 'semaforo'" key="semaforo" class="space-y-5">
            <AdminSectionHeader
              eyebrow="Painel de monitoramento ODS"
              title="Classifica&ccedil;&atilde;o das prioridades por objetivo"
              text="Acompanhe o desempenho de Vit&oacute;ria da Conquista com base no IDSC e identifique, por faixas de pontua&ccedil;&atilde;o, os objetivos com desempenho satisfat&oacute;rio, necessidade de acompanhamento priorit&aacute;rio ou situa&ccedil;&atilde;o cr&iacute;tica."
              icon="traffic"
            />

            <article
              class="vc-admin-semaphore-source relative overflow-hidden rounded-md border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">
                    Origem dos dados
                  </p>
                  <p class="vc-admin-section-title text-slate-950">
                    IDSC - Vit&oacute;ria da Conquista
                  </p>
                  <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    As pontua&ccedil;&otilde;es dos ODS 1 a 17 s&atilde;o obtidas pela API p&uacute;blica do
                    IDSC. O ODS 18 utiliza, provisoriamente, uma refer&ecirc;ncia municipal
                    demonstrativa, pois ainda n&atilde;o possui correspond&ecirc;ncia na base externa.
                  </p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <q-btn
                    outline
                    color="green-9"
                    icon="open_in_new"
                    label="Consultar perfil no IDSC"
                    no-caps
                    :href="idscProfileUrl"
                    target="_blank"
                  />
                  <q-btn
                    color="green-9"
                    icon="refresh"
                    label="Atualizar dados"
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
                <span v-if="semaphoreUpdatedAt">&Uacute;ltima atualiza&ccedil;&atilde;o: {{ semaphoreUpdatedAt }}</span>
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
                      Panorama consolidado
                    </p>
                    <p class="vc-admin-section-title text-slate-950">Distribui&ccedil;&atilde;o por faixa de desempenho</p>
                    <p class="mt-2 text-sm leading-6 text-slate-500">
                      S&iacute;ntese dos objetivos segundo o grau de prioridade para acompanhamento
                      pela gest&atilde;o municipal.
                    </p>
                  </div>
                  <span class="vc-admin-status">{{ semaphoreGoals.length }} ODS</span>
                </div>

                <div class="mt-5 grid gap-5 sm:grid-cols-[92px_minmax(0,1fr)] xl:grid-cols-1">
                  <div class="vc-admin-traffic-light" aria-label="Classifica&ccedil;&atilde;o de desempenho dos ODS">
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
                      An&aacute;lise comparativa
                    </p>
                    <p class="vc-admin-section-title text-slate-950">
                      Desempenho por objetivo
                    </p>
                    <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                      Pontua&ccedil;&otilde;es mais baixas indicam maior necessidade de an&aacute;lise,
                      articula&ccedil;&atilde;o institucional e resposta da gest&atilde;o municipal.
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      M&eacute;dia geral
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
                    Vis&atilde;o detalhada
                  </p>
                  <p class="vc-admin-section-title text-slate-950">Classifica&ccedil;&atilde;o individual dos ODS</p>
                  <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    Utilize esta leitura como subs&iacute;dio para orientar a curadoria dos dados,
                    qualificar as fontes e revisar os indicadores associados a cada objetivo.
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
                      <span class="font-semibold text-slate-500">&Iacute;ndice de desempenho</span>
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

            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <RouterLink
                v-for="goal in managedGoals"
                :key="goal.id"
                :to="`/ods/${goal.id}`"
                class="vc-managed-goal-card"
                :style="{ '--goal-accent': getGoalAccent(goal.id) }"
                :aria-label="`Monitorar ODS ${goal.id} - ${goal.title}`"
              >
                <div class="vc-managed-goal-content">
                  <div class="vc-managed-goal-thumb">
                    <img
                      :src="getGoalImage(goal.id)"
                      :alt="goal.title"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div class="vc-managed-goal-heading min-w-0">
                    <p class="vc-managed-goal-badge">ODS {{ goal.id }}</p>
                    <p class="vc-managed-goal-title">
                      {{ goal.title }}
                    </p>
                  </div>
                  <span class="vc-managed-goal-link-icon" aria-hidden="true">
                    <q-icon name="arrow_forward" size="17px" />
                  </span>
                </div>
                <p class="vc-managed-goal-description">{{ goal.focus }}</p>
                <div class="vc-managed-goal-stats" aria-label="Resumo de cadastros do objetivo">
                  <div class="vc-managed-goal-stat">
                    <strong>{{ goal.targets }}</strong>
                    <span>{{ countLabel(goal.targets, 'meta', 'metas') }}</span>
                  </div>
                  <div class="vc-managed-goal-stat">
                    <strong>{{ goal.indicators }}</strong>
                    <span>{{ countLabel(goal.indicators, 'indicador', 'indicadores') }}</span>
                  </div>
                  <div class="vc-managed-goal-stat">
                    <strong>{{ goal.sources }}</strong>
                    <span>{{ countLabel(goal.sources, 'fonte', 'fontes') }}</span>
                  </div>
                </div>
              </RouterLink>
            </div>
          </section>

          <section v-else-if="activeSection === 'indicadores'" key="indicadores" class="space-y-5">
            <AdminSectionHeader
              eyebrow="Indicadores"
              title="Cadastro e curadoria de indicadores"
              text="Controle unidade de medida, periodicidade, polaridade, desagrega&ccedil;&otilde;es e rela&ccedil;&atilde;o com metas locais."
              icon="query_stats"
            />

            <div class="grid items-start gap-5 xl:grid-cols-[400px_minmax(0,1fr)]">
              <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-start gap-3">
                  <span class="vc-admin-section-icon"><q-icon name="add_chart" size="20px" /></span>
                  <div>
                    <p class="text-sm font-bold text-slate-950">Novo indicador</p>
                    <p class="mt-1 text-xs leading-5 text-slate-500">
                      Defina o que será medido e, se já houver um dado disponível, registre o primeiro valor.
                    </p>
                  </div>
                </div>
                <q-form class="mt-5 space-y-3" @submit="saveIndicator">
                  <q-select
                    v-model="indicatorForm.goal"
                    :options="goalOptions"
                    label="ODS vinculado *"
                    outlined
                    dense
                    :rules="[requiredRule]"
                  />
                  <q-input v-model.trim="indicatorForm.name" label="Nome do indicador *" outlined dense :rules="[requiredRule]" />
                  <q-input v-model.trim="indicatorForm.unit" label="Unidade de medida *" hint="Exemplo: %, pessoas, km²" outlined dense :rules="[requiredRule]" />
                  <div class="grid gap-3 sm:grid-cols-2">
                    <q-select
                      v-model="indicatorForm.frequency"
                      :options="frequencyOptions"
                      label="Periodicidade *"
                      outlined
                      dense
                      :rules="[requiredRule]"
                    />
                    <q-select
                      v-model="indicatorForm.polarity"
                      :options="polarityOptions"
                      label="Polaridade *"
                      outlined
                      dense
                      :rules="[requiredRule]"
                    />
                  </div>
                  <q-input
                    v-model.trim="indicatorForm.description"
                    label="Descrição metodológica *"
                    outlined
                    dense
                    type="textarea"
                    rows="3"
                    :rules="[requiredRule]"
                  />

                  <section class="vc-indicator-initial-value">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-xs font-bold text-slate-800">Registrar valor inicial</p>
                        <p class="mt-1 text-[11px] leading-4 text-slate-500">
                          Opcional. Cria o primeiro ponto da série histórica junto com o indicador.
                        </p>
                      </div>
                      <q-toggle
                        v-model="indicatorForm.includeInitialValue"
                        color="green-9"
                        :disable="!apiSources.length"
                        aria-label="Registrar valor inicial"
                      />
                    </div>

                    <div v-if="indicatorForm.includeInitialValue" class="mt-4 grid gap-x-3 gap-y-1 sm:grid-cols-2">
                      <q-input
                        v-model.trim="indicatorForm.initialValue"
                        label="Valor inicial *"
                        inputmode="decimal"
                        outlined
                        dense
                        :rules="[requiredRule, validNumberRule]"
                      />
                      <q-input
                        v-model.trim="indicatorForm.initialPeriod"
                        label="Período *"
                        hint="Exemplo: 2026 ou 2026.1"
                        outlined
                        dense
                        :rules="[requiredRule]"
                      />
                      <q-select
                        v-model="indicatorForm.initialSourceId"
                        class="sm:col-span-2"
                        :options="sourceSelectOptions"
                        option-label="label"
                        option-value="value"
                        emit-value
                        map-options
                        label="Fonte do valor *"
                        outlined
                        dense
                        :rules="[requiredRule]"
                      />
                      <q-input
                        v-model.trim="indicatorForm.initialTerritory"
                        label="Território *"
                        outlined
                        dense
                        :rules="[requiredRule]"
                      />
                      <q-select
                        v-model="indicatorForm.initialStatus"
                        :options="observationStatusOptions"
                        option-label="label"
                        option-value="value"
                        emit-value
                        map-options
                        label="Situação do valor *"
                        outlined
                        dense
                      />
                    </div>

                    <div v-else-if="!apiSources.length" class="mt-3 flex items-center justify-between gap-3 rounded-md bg-amber-50 px-3 py-2">
                      <p class="text-[11px] leading-4 text-amber-800">Cadastre uma fonte antes de incluir valores.</p>
                      <q-btn flat dense color="amber-10" label="Cadastrar fonte" no-caps @click="activeSection = 'fontes'" />
                    </div>
                  </section>

                  <q-btn
                    class="w-full"
                    color="green-9"
                    icon="save"
                    :label="indicatorForm.includeInitialValue ? 'Salvar indicador e valor' : 'Salvar indicador'"
                    no-caps
                    unelevated
                    type="submit"
                    :loading="adminSaving"
                  />
                </q-form>
              </article>

              <article class="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                <div class="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 p-5">
                  <div>
                    <p class="text-sm font-bold text-slate-950">Indicadores cadastrados</p>
                    <p class="mt-1 text-xs leading-5 text-slate-500">
                      Localize por nome ou ODS. Clique em uma linha para consultar, editar ou publicar valores.
                    </p>
                  </div>
                  <span class="vc-admin-status">
                    {{ filteredIndicators.length === indicators.length ? indicators.length : `${filteredIndicators.length} de ${indicators.length}` }}
                    cadastrados
                  </span>
                </div>

                <div class="vc-indicator-directory-toolbar">
                  <q-input
                    v-model="indicatorSearch"
                    class="vc-indicator-directory-search"
                    outlined
                    dense
                    clearable
                    debounce="150"
                    label="Buscar indicador"
                    placeholder="Nome, meta, unidade ou descrição"
                  >
                    <template #prepend><q-icon name="search" size="19px" /></template>
                  </q-input>
                  <q-select
                    v-model="indicatorGoalFilter"
                    class="vc-indicator-directory-filter"
                    :options="indicatorGoalFilterOptions"
                    emit-value
                    map-options
                    outlined
                    dense
                    clearable
                    label="Filtrar por ODS"
                  >
                    <template #prepend><q-icon name="filter_alt" size="18px" /></template>
                  </q-select>
                  <q-btn
                    v-if="indicatorSearch || indicatorGoalFilter"
                    flat
                    dense
                    color="green-9"
                    icon="filter_alt_off"
                    label="Limpar"
                    no-caps
                    @click="clearIndicatorFilters"
                  />
                </div>

                <div class="overflow-x-auto">
                  <table class="vc-admin-table vc-indicator-directory-table">
                    <thead>
                      <tr>
                        <th>Indicador</th>
                        <th>Vinculação</th>
                        <th>Monitoramento</th>
                        <th>Último valor</th>
                        <th>Situação</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="indicator in paginatedIndicators"
                        :key="indicator.id"
                        class="vc-indicator-directory-row"
                        role="button"
                        tabindex="0"
                        :aria-label="`Abrir informações e lançamentos de ${indicator.name}`"
                        @click="openIndicatorValue(indicator.id)"
                        @keydown.enter.prevent="openIndicatorValue(indicator.id)"
                        @keydown.space.prevent="openIndicatorValue(indicator.id)"
                      >
                        <td>
                          <div class="vc-indicator-directory-name">
                            <strong>{{ indicator.name }}</strong>
                            <span>{{ indicator.description }}</span>
                          </div>
                        </td>
                        <td>
                          <span class="vc-admin-code">{{ indicator.goal }}</span>
                          <p class="vc-indicator-directory-secondary">{{ indicator.target }}</p>
                        </td>
                        <td>
                          <strong class="vc-indicator-directory-primary">{{ indicator.frequency }}</strong>
                          <p class="vc-indicator-directory-secondary">
                            {{ indicator.unit }} · {{ indicator.polarity }}
                          </p>
                        </td>
                        <td>
                          <strong class="vc-indicator-directory-value">{{ indicator.lastValue }}</strong>
                          <p class="vc-indicator-directory-secondary">
                            {{ indicator.lastPeriod ? `Período ${indicator.lastPeriod}` : 'Série não iniciada' }}
                          </p>
                        </td>
                        <td>
                          <span class="vc-admin-status">{{ indicator.status }}</span>
                          <p class="vc-indicator-directory-secondary">
                            {{ indicator.observationCount }}
                            {{ countLabel(indicator.observationCount, 'lançamento', 'lançamentos') }}
                          </p>
                        </td>
                      </tr>
                      <tr v-if="!filteredIndicators.length">
                        <td colspan="5" class="vc-indicator-directory-empty">
                          <q-icon name="search_off" size="28px" />
                          <strong>{{ indicators.length ? 'Nenhum indicador corresponde aos filtros' : 'Nenhum indicador cadastrado' }}</strong>
                          <span>
                            {{ indicators.length ? 'Ajuste a busca ou remova o filtro de ODS.' : 'Use o formulário ao lado para criar o primeiro indicador.' }}
                          </span>
                          <q-btn
                            v-if="indicators.length"
                            flat
                            dense
                            color="green-9"
                            label="Limpar filtros"
                            no-caps
                            @click="clearIndicatorFilters"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <footer v-if="filteredIndicators.length" class="vc-indicator-directory-pagination">
                  <p>
                    Exibindo {{ indicatorPageStart }}–{{ indicatorPageEnd }} de
                    {{ filteredIndicators.length }} indicadores
                  </p>
                  <q-pagination
                    v-if="indicatorTotalPages > 1"
                    v-model="indicatorPage"
                    :max="indicatorTotalPages"
                    :max-pages="5"
                    boundary-numbers
                    direction-links
                    color="green-9"
                    active-color="green-9"
                    size="sm"
                    aria-label="Paginação dos indicadores"
                  />
                </footer>
              </article>
            </div>

            <q-dialog v-model="indicatorValueDialogOpen" persistent>
              <q-card class="vc-target-dialog vc-indicator-value-dialog">
                <q-card-section class="vc-target-dialog-header">
                  <div class="min-w-0">
                    <p class="text-[11px] font-bold uppercase tracking-[0.06em] text-green-9">
                      Série histórica · ODS {{ selectedValueIndicator?.goalId }}
                    </p>
                    <p class="mt-1.5 text-xl font-bold leading-tight text-slate-950">
                      {{ editingObservationId ? 'Editar último lançamento' : 'Registrar valor do indicador' }}
                    </p>
                    <p class="mt-2 max-w-xl text-sm leading-5 text-slate-500">
                      {{ selectedValueIndicator?.name }}
                    </p>
                  </div>
                  <q-btn class="vc-target-dialog-close" flat round dense icon="close" aria-label="Fechar formulário" @click="closeIndicatorValueDialog" />
                </q-card-section>

                <div v-if="selectedValueIndicator" class="vc-indicator-dialog-summary">
                  <div class="vc-indicator-unit-editor">
                    <span>Unidade de medida</span>
                    <q-input
                      v-model.trim="indicatorValueForm.unit"
                      class="vc-indicator-unit-input"
                      aria-label="Unidade de medida do indicador"
                      placeholder="Exemplo: %, pessoas, km²"
                      outlined
                      dense
                      hide-bottom-space
                      :disable="adminSaving"
                    />
                  </div>
                  <div>
                    <span>Periodicidade</span>
                    <strong>{{ frequencyFromApi[selectedValueIndicator.frequency] ?? selectedValueIndicator.frequency }}</strong>
                  </div>
                  <div>
                    <span>Regra de leitura</span>
                    <strong>{{ polarityFromApi[selectedValueIndicator.polarity] ?? selectedValueIndicator.polarity }}</strong>
                  </div>
                  <div>
                    <span>Data de criação</span>
                    <strong>{{ formatIndicatorCreationDate(selectedValueIndicator.createdAt) }}</strong>
                  </div>
                </div>

                <q-separator />

                <q-form class="vc-target-dialog-form" @submit="saveIndicatorValue">
                  <q-card-section class="vc-target-dialog-body">
                    <div class="vc-target-form-section-heading">
                      <p>Valor observado</p>
                      <span>* Campos obrigatórios</span>
                    </div>
                    <div class="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
                      <q-input
                        v-model.trim="indicatorValueForm.period"
                        label="Período *"
                        hint="Exemplo: 2026, 2026.1 ou Ago/2026"
                        outlined
                        dense
                        autofocus
                        :rules="[requiredRule]"
                      />
                      <q-input
                        v-model.trim="indicatorValueForm.value"
                        :label="`Valor (${selectedValueIndicator?.unit ?? 'unidade'}) *`"
                        inputmode="decimal"
                        outlined
                        dense
                        :rules="[requiredRule, validNumberRule]"
                      />
                      <q-select
                        v-model="indicatorValueForm.sourceId"
                        :options="sourceSelectOptions"
                        option-label="label"
                        option-value="value"
                        emit-value
                        map-options
                        label="Fonte *"
                        outlined
                        dense
                        :rules="[requiredRule]"
                      />
                      <q-input
                        v-model.trim="indicatorValueForm.territory"
                        label="Território *"
                        outlined
                        dense
                        :rules="[requiredRule]"
                      />
                      <q-select
                        v-model="indicatorValueForm.status"
                        class="sm:col-span-2"
                        :options="observationStatusOptions"
                        option-label="label"
                        option-value="value"
                        emit-value
                        map-options
                        label="Situação do lançamento *"
                        outlined
                        dense
                      />
                      <q-input
                        v-model.trim="indicatorValueForm.note"
                        class="sm:col-span-2"
                        label="Observação técnica"
                        type="textarea"
                        rows="3"
                        maxlength="500"
                        outlined
                        dense
                      />
                    </div>

                    <div class="mt-2 flex items-start gap-2 rounded-md bg-slate-50 px-3 py-2.5 text-[11px] leading-4 text-slate-600">
                      <q-icon name="history" size="17px" color="green-9" />
                      <p>Os valores são guardados por período, fonte e território. Assim, o gráfico mostra a evolução sem apagar o histórico.</p>
                    </div>
                  </q-card-section>

                  <q-separator />

                  <q-card-actions class="vc-target-dialog-actions vc-indicator-dialog-actions">
                    <q-btn
                      v-if="editingObservationId"
                      flat
                      color="green-9"
                      icon="add"
                      label="Novo período"
                      no-caps
                      @click="startNewIndicatorPeriod"
                    />
                    <span class="flex-1" />
                    <q-btn flat color="grey-8" label="Cancelar" no-caps @click="closeIndicatorValueDialog" />
                    <q-btn
                      color="green-9"
                      icon="check"
                      :label="editingObservationId ? 'Salvar alteração' : 'Registrar valor'"
                      no-caps
                      unelevated
                      type="submit"
                      :loading="adminSaving"
                    />
                  </q-card-actions>
                </q-form>
              </q-card>
            </q-dialog>
          </section>

          <section v-else-if="activeSection === 'metas'" key="metas" class="space-y-5">
            <AdminSectionHeader
              eyebrow="Metas locais"
              title="Tradu&ccedil;&atilde;o municipal das metas da Agenda 2030"
              text="Cadastre metas adaptadas &agrave; realidade de Vit&oacute;ria da Conquista, com respons&aacute;veis, prazos e prioridade."
              icon="track_changes"
            />

            <article class="vc-target-toolbar">
              <div>
                <p class="text-sm font-bold text-slate-950">
                  {{ localTargets.length }}
                  {{ countLabel(localTargets.length, 'meta cadastrada', 'metas cadastradas') }}
                </p>
                <p class="mt-1 text-xs leading-5 text-slate-500">
                  Localize uma meta existente ou crie uma nova prioridade municipal.
                </p>
              </div>
              <div class="vc-target-toolbar-actions">
                <q-input
                  v-model="targetSearch"
                  class="vc-target-search"
                  outlined
                  dense
                  clearable
                  debounce="180"
                  placeholder="Buscar meta"
                  aria-label="Buscar meta local"
                >
                  <template #prepend><q-icon name="search" size="18px" /></template>
                </q-input>
                <q-select
                  v-model="targetGoalFilter"
                  class="vc-target-filter"
                  :options="targetGoalOptions"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  clearable
                  outlined
                  dense
                  label="Filtrar por ODS"
                />
                <q-btn
                  color="green-9"
                  icon="add"
                  label="Nova meta"
                  no-caps
                  unelevated
                  @click="openCreateTarget"
                />
              </div>
            </article>

            <div class="space-y-5">
              <section
                v-for="group in groupedLocalTargets"
                :key="group.goalId"
                class="vc-target-group"
                :style="{ '--goal-accent': getGoalAccent(group.goalId) }"
              >
                <header class="vc-target-group-header">
                  <div class="flex min-w-0 items-center gap-3">
                    <span class="vc-target-group-marker" aria-hidden="true" />
                    <p class="vc-target-group-number">ODS {{ group.goalId }}</p>
                    <span class="vc-target-group-separator" aria-hidden="true">&middot;</span>
                    <p role="heading" aria-level="3" class="vc-target-group-title">{{ group.goalTitle }}</p>
                  </div>
                  <span class="vc-target-group-count">
                    {{ group.targets.length }}
                    {{ countLabel(group.targets.length, 'meta', 'metas') }}
                  </span>
                </header>

                <div
                  class="mt-3 grid gap-3"
                  :class="group.targets.length > 1 ? 'lg:grid-cols-2' : 'grid-cols-1'"
                >
                  <article
                    v-for="target in group.targets"
                    :key="target.id || target.code"
                    class="vc-local-target-card"
                    :style="{ '--goal-accent': getGoalAccent(target.goalId) }"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <span class="vc-local-target-code">Meta {{ target.code }}</span>
                      <div class="flex shrink-0 items-center gap-1">
                        <span class="vc-admin-status">{{ target.priority }}</span>
                        <q-btn
                          v-if="target.id"
                          flat
                          round
                          dense
                          icon="more_vert"
                          color="grey-7"
                          :aria-label="`Ações da meta ${target.code}`"
                        >
                          <q-menu auto-close anchor="bottom right" self="top right">
                            <q-list class="min-w-[170px]" padding dense>
                              <q-item clickable @click="openEditTarget(target)">
                                <q-item-section avatar><q-icon name="edit" size="18px" /></q-item-section>
                                <q-item-section>Editar meta</q-item-section>
                              </q-item>
                              <q-item clickable class="text-red-7" @click="openDeleteTarget(target)">
                                <q-item-section avatar><q-icon name="delete_outline" size="18px" /></q-item-section>
                                <q-item-section>Excluir meta</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-btn>
                      </div>
                    </div>
                    <p class="mt-4 text-sm font-bold text-slate-950">{{ target.title }}</p>
                    <p class="mt-2 text-sm leading-6 text-slate-600">{{ target.text }}</p>
                    <div class="vc-local-target-meta">
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
            </div>

            <article v-if="!groupedLocalTargets.length" class="vc-target-empty">
              <span class="vc-admin-section-icon"><q-icon name="search_off" size="20px" /></span>
              <p class="mt-3 text-sm font-bold text-slate-950">Nenhuma meta encontrada</p>
              <p class="mt-1 text-xs leading-5 text-slate-500">
                Revise o termo pesquisado ou cadastre uma nova meta local.
              </p>
              <q-btn
                v-if="targetSearch || targetGoalFilter"
                class="mt-4"
                outline
                color="green-9"
                icon="filter_alt_off"
                label="Limpar filtros"
                no-caps
                @click="clearTargetFilters"
              />
              <q-btn v-else class="mt-4" outline color="green-9" icon="add" label="Nova meta" no-caps @click="openCreateTarget" />
            </article>

            <q-dialog v-model="targetDialogOpen" persistent>
              <q-card class="vc-target-dialog">
                <q-card-section class="vc-target-dialog-header">
                  <div class="min-w-0">
                    <p class="text-[11px] font-bold uppercase tracking-[0.06em] text-green-9">
                      Metas locais
                    </p>
                    <p class="mt-1.5 text-xl font-bold leading-tight text-slate-950">
                      {{ editingTargetId ? 'Editar meta local' : 'Cadastrar meta local' }}
                    </p>
                    <p class="mt-2 max-w-xl text-sm leading-5 text-slate-500">
                      Informe o resultado esperado, o prazo e a área responsável pelo acompanhamento.
                    </p>
                  </div>
                  <q-btn class="vc-target-dialog-close" flat round dense icon="close" aria-label="Fechar formulário" @click="closeTargetDialog" />
                </q-card-section>

                <q-separator />

                <q-form class="vc-target-dialog-form" @submit="saveTarget">
                  <q-card-section class="vc-target-dialog-body">
                    <section class="vc-target-form-section">
                      <div class="vc-target-form-section-heading">
                        <p>Identificação</p>
                        <span>* Campos obrigatórios</span>
                      </div>
                      <div class="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
                        <q-select
                          v-model="targetForm.goalId"
                          :options="targetGoalOptions"
                          label="ODS vinculado *"
                          option-label="label"
                          option-value="value"
                          emit-value
                          map-options
                          outlined
                          dense
                          autofocus
                          :rules="[requiredRule]"
                        />
                        <q-input
                          v-model.trim="targetForm.code"
                          label="Código da meta *"
                          hint="Exemplo: 3.1 VC"
                          maxlength="40"
                          outlined
                          dense
                          :rules="[requiredRule]"
                        />
                        <q-input
                          v-model.trim="targetForm.title"
                          class="sm:col-span-2"
                          label="Título da meta *"
                          maxlength="180"
                          outlined
                          dense
                          :rules="[requiredRule]"
                        />
                        <q-input
                          v-model.trim="targetForm.description"
                          class="sm:col-span-2"
                          label="Descrição do resultado esperado *"
                          type="textarea"
                          rows="3"
                          maxlength="700"
                          outlined
                          dense
                          :rules="[requiredRule]"
                        />
                      </div>
                    </section>

                    <section class="vc-target-form-section">
                      <div class="vc-target-form-section-heading">
                        <p>Planejamento e responsabilidade</p>
                      </div>
                      <div class="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
                        <q-input
                          v-model.trim="targetForm.deadline"
                          label="Prazo *"
                          hint="Exemplo: 2030 ou Contínuo"
                          maxlength="40"
                          outlined
                          dense
                          :rules="[requiredRule]"
                        />
                        <q-select
                          v-model="targetForm.priority"
                          :options="targetPriorityOptions"
                          label="Prioridade *"
                          option-label="label"
                          option-value="value"
                          emit-value
                          map-options
                          outlined
                          dense
                          :rules="[requiredRule]"
                        />
                        <q-select
                          v-model="targetForm.departmentId"
                          class="sm:col-span-2"
                          :options="targetDepartmentOptions"
                          label="Secretaria responsável"
                          option-label="label"
                          option-value="value"
                          emit-value
                          map-options
                          clearable
                          outlined
                          dense
                          hint="Opcional. Identifica a área responsável pela política."
                        />
                      </div>
                    </section>
                  </q-card-section>

                  <q-separator />

                  <q-card-actions align="right" class="vc-target-dialog-actions">
                    <q-btn flat color="grey-8" label="Cancelar" no-caps @click="closeTargetDialog" />
                    <q-btn
                      color="green-9"
                      icon="check"
                      :label="editingTargetId ? 'Salvar alterações' : 'Cadastrar meta'"
                      no-caps
                      unelevated
                      type="submit"
                      :loading="adminSaving"
                    />
                  </q-card-actions>
                </q-form>
              </q-card>
            </q-dialog>

            <q-dialog v-model="deleteTargetDialogOpen" persistent>
              <q-card class="w-full max-w-md rounded-lg">
                <q-card-section class="flex gap-4">
                  <span class="vc-target-delete-icon"><q-icon name="delete_outline" size="22px" /></span>
                  <div class="min-w-0">
                    <p class="text-base font-bold text-slate-950">Excluir meta local?</p>
                    <p class="mt-2 text-sm leading-6 text-slate-600">
                      A meta <strong>{{ targetPendingDelete?.code }}</strong> será removida. Indicadores vinculados permanecerão cadastrados, mas perderão esse vínculo.
                    </p>
                  </div>
                </q-card-section>
                <q-card-actions align="right" class="gap-2 border-t border-slate-100 p-4">
                  <q-btn flat color="grey-8" label="Cancelar" no-caps @click="deleteTargetDialogOpen = false" />
                  <q-btn color="red-7" icon="delete" label="Excluir meta" no-caps unelevated :loading="adminSaving" @click="deleteTarget" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </section>

          <section v-else-if="activeSection === 'acoes'" key="acoes" class="space-y-5">
            <AdminSectionHeader
              eyebrow="A&ccedil;&otilde;es"
              title="Criar a&ccedil;&atilde;o vinculada a indicadores"
              text="Registre a iniciativa, selecione o ODS e informe quais indicadores ela pretende influenciar. A evolu&ccedil;&atilde;o ser&aacute; medida pelos lan&ccedil;amentos peri&oacute;dicos."
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
                  <q-select
                    v-model="actionForm.weight"
                    :options="actionWeightOptions"
                    label="Relevância da contribuição"
                    emit-value
                    map-options
                    outlined
                    dense
                    options-dense
                    :hint="selectedActionWeight.description"
                    persistent-hint
                  />
                  <q-select
                    v-model="actionForm.indicatorIds"
                    :options="actionIndicatorOptions"
                    class="md:col-span-2"
                    label="Indicadores que a ação pretende influenciar"
                    emit-value
                    map-options
                    multiple
                    use-chips
                    outlined
                    dense
                    :disable="!actionIndicatorOptions.length"
                    :hint="actionIndicatorOptions.length ? 'Selecione um ou mais indicadores do ODS escolhido.' : 'Cadastre um indicador para este ODS antes de publicar a ação.'"
                  />
                </div>

                <div v-if="selectedActionIndicators.length" class="vc-action-influence-editor mt-4">
                  <div class="mb-3">
                    <p class="text-sm font-bold text-slate-950">Efeito esperado sobre cada indicador</p>
                    <p class="mt-1 text-xs leading-5 text-slate-500">
                      Informe a direção e o novo valor associado à ação. A série histórica oficial continua sendo consolidada pelos lançamentos do indicador.
                    </p>
                  </div>
                  <div
                    v-for="indicator in selectedActionIndicators"
                    :key="indicator.id"
                    class="vc-action-influence-row"
                  >
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-slate-950">{{ indicator.name }}</p>
                      <p class="mt-1 text-xs text-slate-500">{{ polarityFromApi[indicator.polarity] ?? indicator.polarity }}</p>
                    </div>
                    <div class="vc-action-influence-controls">
                      <q-select
                        :model-value="actionForm.indicatorEffects[indicator.id]"
                        :options="expectedEffectOptions"
                        emit-value
                        map-options
                        outlined
                        dense
                        label="Efeito esperado"
                        @update:model-value="setActionIndicatorEffect(indicator.id, $event)"
                      />
                      <q-input
                        v-if="requiresNewIndicatorValue(actionForm.indicatorEffects[indicator.id])"
                        v-model="actionForm.indicatorValues[indicator.id]"
                        outlined
                        dense
                        inputmode="decimal"
                        label="Novo valor do indicador"
                        :suffix="indicator.unit || undefined"
                        hint="Obrigatório ao publicar a ação."
                        :rules="[optionalNumberRule]"
                      />
                    </div>
                  </div>
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
                        {{ actionForm.department }} &middot; {{ selectedActionWeight.label }}
                      </p>
                      <p v-if="selectedActionIndicators.length" class="mt-2 text-xs font-semibold leading-5 text-emerald-800">
                        {{ selectedActionIndicators.length }} {{ selectedActionIndicators.length === 1 ? 'indicador relacionado' : 'indicadores relacionados' }}
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
                        <span class="vc-admin-status">{{ actionWeightLabel(action.weight) }}</span>
                      </div>
                      <p class="mt-3 text-xs leading-5 text-slate-600">
                        {{ action.description }}
                      </p>
                      <div v-if="action.indicators.length" class="mt-3 flex flex-wrap gap-1.5">
                        <span v-for="indicator in action.indicators" :key="indicator" class="vc-admin-status">
                          {{ indicator }}
                        </span>
                      </div>
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
                    outline
                    color="green-9"
                    icon="fact_check"
                    label="Enviar para valida&ccedil;&atilde;o"
                    no-caps
                    :loading="adminSaving"
                    @click="saveObservation('REVIEW')"
                  />
                  <q-btn
                    color="green-9"
                    icon="publish"
                    label="Publicar lan&ccedil;amento"
                    no-caps
                    :loading="adminSaving"
                    @click="saveObservation('PUBLISHED')"
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
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth-store';

type AdminSection =
  | 'visao'
  | 'triagem'
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

const route = useRoute();
const initialSection = typeof route.query.section === 'string' ? route.query.section : 'visao';
const activeSection = ref<AdminSection>(initialSection === 'triagem' ? 'triagem' : 'visao');
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
    label: 'Monitoramento ODS',
    caption: 'Faixas de desempenho',
    icon: 'traffic',
  },
  {
    id: 'triagem',
    label: 'Triagem',
    caption: 'Notícias para ações',
    icon: 'fact_check',
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
    label: 'Desempenho satisfat\u00f3rio',
    color: '#1d6d13',
    text: 'Pontua\u00e7\u00e3o igual ou superior a 60 pontos, indicando resultado comparativamente favor\u00e1vel.',
  },
  atencao: {
    label: 'Acompanhamento priorit\u00e1rio',
    color: '#d99b16',
    text: 'Pontua\u00e7\u00e3o entre 50 e 59,99 pontos, recomendando monitoramento e medidas de aprimoramento.',
  },
  alerta: {
    label: 'Situa\u00e7\u00e3o cr\u00edtica',
    color: '#d64545',
    text: 'Pontua\u00e7\u00e3o inferior a 50 pontos, demandando an\u00e1lise aprofundada e resposta priorit\u00e1ria.',
  },
};

const semaphoreRules = [
  { ...semaphoreMeta.tranquilo, label: 'Verde \u2014 desempenho satisfat\u00f3rio', status: 'tranquilo' },
  { ...semaphoreMeta.atencao, label: 'Amarelo \u2014 acompanhamento priorit\u00e1rio', status: 'atencao' },
  { ...semaphoreMeta.alerta, label: 'Vermelho \u2014 situa\u00e7\u00e3o cr\u00edtica', status: 'alerta' },
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
  semaphoreLoaded.value ? 'Dados atualizados pelo IDSC' : 'Dados demonstrativos locais',
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

interface ManagedIndicator {
  id: string;
  name: string;
  goal: string;
  target: string;
  frequency: string;
  status: string;
  description: string;
  unit: string;
  polarity: string;
  lastValue: string;
  lastPeriod: string | null;
  observationCount: number;
}

const indicators = ref<ManagedIndicator[]>([
  {
    id: 'demonstrative-indicator-1',
    name: 'Fam\u00edlias em situa\u00e7\u00e3o de vulnerabilidade acompanhadas',
    goal: 'ODS 1',
    target: 'Meta local 1.2',
    frequency: 'Mensal',
    status: 'Em revis\u00e3o',
    unit: '%',
    polarity: 'Quanto maior, melhor',
    lastValue: 'Sem valores',
    lastPeriod: null,
    observationCount: 0,
    description:
      'Percentual de fam\u00edlias cadastradas e acompanhadas pela rede socioassistencial.',
  },
  {
    id: 'demonstrative-indicator-2',
    name: 'Cobertura da aten\u00e7\u00e3o b\u00e1sica',
    goal: 'ODS 3',
    target: 'Meta local 3.8',
    frequency: 'Quadrimestral',
    status: 'Publicado',
    unit: '%',
    polarity: 'Quanto maior, melhor',
    lastValue: '78,4%',
    lastPeriod: '2026.1',
    observationCount: 1,
    description:
      'Cobertura estimada das equipes de sa\u00fade da fam\u00edlia por territ\u00f3rio.',
  },
  {
    id: 'demonstrative-indicator-3',
    name: 'Taxa de perman\u00eancia escolar',
    goal: 'ODS 4',
    target: 'Meta local 4.1',
    frequency: 'Anual',
    status: 'Rascunho',
    unit: '%',
    polarity: 'Quanto maior, melhor',
    lastValue: '91,2%',
    lastPeriod: '2025',
    observationCount: 1,
    description:
      'Indicador de perman\u00eancia de estudantes na rede municipal ao longo do ano letivo.',
  },
]);

const indicatorSearch = ref<string | null>('');
const indicatorGoalFilter = ref<string | null>(null);
const indicatorGoalFilterOptions = computed(() =>
  [...new Set(indicators.value.map((indicator) => indicator.goal))]
    .sort((current, next) => current.localeCompare(next, 'pt-BR', { numeric: true }))
    .map((goal) => ({ label: goal, value: goal })),
);
const filteredIndicators = computed(() => {
  const query = normalizeSearch(indicatorSearch.value);

  return indicators.value
    .filter((indicator) => {
      if (indicatorGoalFilter.value && indicator.goal !== indicatorGoalFilter.value) return false;
      if (!query) return true;

      return normalizeSearch(
        `${indicator.name} ${indicator.goal} ${indicator.target} ${indicator.frequency} ${indicator.status} ${indicator.description} ${indicator.unit} ${indicator.polarity} ${indicator.lastValue} ${indicator.lastPeriod ?? ''}`,
      ).includes(query);
    })
    .sort(
      (current, next) =>
        current.goal.localeCompare(next.goal, 'pt-BR', { numeric: true }) ||
        current.name.localeCompare(next.name, 'pt-BR'),
    );
});
const indicatorPageSize = 5;
const indicatorPage = ref(1);
const indicatorTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredIndicators.value.length / indicatorPageSize)),
);
const paginatedIndicators = computed(() => {
  const start = (indicatorPage.value - 1) * indicatorPageSize;

  return filteredIndicators.value.slice(start, start + indicatorPageSize);
});
const indicatorPageStart = computed(() =>
  filteredIndicators.value.length ? (indicatorPage.value - 1) * indicatorPageSize + 1 : 0,
);
const indicatorPageEnd = computed(() =>
  Math.min(indicatorPage.value * indicatorPageSize, filteredIndicators.value.length),
);

watch([indicatorSearch, indicatorGoalFilter], () => {
  indicatorPage.value = 1;
});

watch(indicatorTotalPages, (totalPages) => {
  if (indicatorPage.value > totalPages) indicatorPage.value = totalPages;
});

function clearIndicatorFilters() {
  indicatorSearch.value = '';
  indicatorGoalFilter.value = null;
}

type TargetPriority = 'HIGH' | 'MEDIUM' | 'CONTINUOUS';

interface LocalTarget {
  id: string;
  goalId: number;
  code: string;
  title: string;
  text: string;
  owner: string;
  deadline: string;
  priority: string;
  priorityValue: TargetPriority;
  departmentId: string | null;
}

interface TargetFormState {
  goalId: number | null;
  code: string;
  title: string;
  description: string;
  deadline: string;
  priority: TargetPriority;
  departmentId: string | null;
}

const localTargets = ref<LocalTarget[]>([
  {
    id: '',
    goalId: 1,
    code: '1.2 VC',
    title: 'Reduzir vulnerabilidades sociais priorit\u00e1rias',
    text: 'Monitorar renda, moradia, seguran\u00e7a alimentar e acesso a servi\u00e7os essenciais por territ\u00f3rio.',
    owner: 'Desenvolvimento Social',
    deadline: '2030',
    priority: 'Alta',
    priorityValue: 'HIGH',
    departmentId: null,
  },
  {
    id: '',
    goalId: 4,
    code: '4.1 VC',
    title: 'Ampliar perman\u00eancia e aprendizagem',
    text: 'Acompanhar fluxo escolar, frequ\u00eancia, alfabetiza\u00e7\u00e3o e indicadores de qualidade da educa\u00e7\u00e3o.',
    owner: 'Educa\u00e7\u00e3o',
    deadline: '2028',
    priority: 'Alta',
    priorityValue: 'HIGH',
    departmentId: null,
  },
  {
    id: '',
    goalId: 11,
    code: '11.3 VC',
    title: 'Qualificar planejamento urbano',
    text: 'Integrar habita\u00e7\u00e3o, mobilidade, infraestrutura e participa\u00e7\u00e3o social no acompanhamento urbano.',
    owner: 'Infraestrutura',
    deadline: '2030',
    priority: 'M\u00e9dia',
    priorityValue: 'MEDIUM',
    departmentId: null,
  },
  {
    id: '',
    goalId: 16,
    code: '16.6 VC',
    title: 'Fortalecer transpar\u00eancia institucional',
    text: 'Publicar evid\u00eancias, fontes e s\u00e9ries hist\u00f3ricas de forma acess\u00edvel e rastre\u00e1vel.',
    owner: 'Administra\u00e7\u00e3o',
    deadline: 'Cont\u00ednuo',
    priority: 'M\u00e9dia',
    priorityValue: 'MEDIUM',
    departmentId: null,
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
    indicators: [] as string[],
    description:
      'Mapeia fam\u00edlias em maior vulnerabilidade para priorizar acesso a benef\u00edcios, servi\u00e7os e acompanhamento territorial.',
  },
  {
    name: 'Plano de perman\u00eancia escolar',
    department: 'Secretaria Municipal de Educa\u00e7\u00e3o',
    goal: 'ODS 4',
    weight: 4,
    indicators: [] as string[],
    description:
      'Acompanha frequ\u00eancia e fluxo escolar para reduzir abandono e fortalecer aprendizagem na rede municipal.',
  },
  {
    name: 'Monitoramento de saneamento por territ\u00f3rio',
    department: 'Secretaria Municipal de Infraestrutura Urbana',
    goal: 'ODS 6',
    weight: 4,
    indicators: [] as string[],
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

type ObservationStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED';

interface IndicatorFormState {
  goal: string | undefined;
  name: string;
  unit: string;
  frequency: string;
  polarity: string;
  description: string;
  includeInitialValue: boolean;
  initialValue: string;
  initialPeriod: string;
  initialSourceId: string | null;
  initialTerritory: string;
  initialStatus: ObservationStatus;
}

interface IndicatorValueFormState {
  unit: string;
  period: string;
  value: string;
  sourceId: string | null;
  territory: string;
  note: string;
  status: ObservationStatus;
}

const observationStatusOptions: Array<{ label: string; value: ObservationStatus }> = [
  { label: 'Publicado', value: 'PUBLISHED' },
  { label: 'Em revis\u00e3o', value: 'REVIEW' },
  { label: 'Rascunho', value: 'DRAFT' },
];

const indicatorForm = ref<IndicatorFormState>({
  goal: goalOptions.value[0],
  name: 'Taxa de acesso a servi\u00e7os essenciais',
  unit: '%',
  frequency: 'Anual',
  polarity: 'Quanto maior, melhor',
  description: 'Descreve como o indicador ser\u00e1 calculado e quais recortes ser\u00e3o aceitos.',
  includeInitialValue: false,
  initialValue: '',
  initialPeriod: String(new Date().getFullYear()),
  initialSourceId: null,
  initialTerritory: 'Vit\u00f3ria da Conquista',
  initialStatus: 'PUBLISHED',
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
  indicatorIds: [] as string[],
  indicatorEffects: {} as Record<string, 'INCREASE' | 'DECREASE' | 'MAINTAIN'>,
  indicatorValues: {} as Record<string, string>,
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
interface ApiTarget { id: string; code: string; title: string; description: string; deadline: string; priority: TargetPriority; goalId: number; departmentId?: string | null; department?: ApiDepartment | null }
interface ApiIndicator { id: string; name: string; description: string; unit: string; frequency: string; polarity: 'HIGHER_IS_BETTER' | 'LOWER_IS_BETTER' | 'CONTEXTUAL'; status: string; goalId: number; createdAt?: string; target?: { code: string } | null; goal: ApiGoal; _count?: { observations: number } }
interface ApiSource { id: string; name: string; description?: string | null; frequency: string; status: string }
interface ApiObservation { id: string; period: string; displayValue?: string | null; value: string; territory: string; note?: string | null; status: ObservationStatus | 'ARCHIVED'; indicatorId: string; sourceId: string; indicator: { name: string; goalId: number }; source: ApiSource }
interface ApiAction { id: string; name: string; description: string; weight: number; goalId: number; department: ApiDepartment; indicatorLinks: Array<{ expectedEffect: 'INCREASE' | 'DECREASE' | 'MAINTAIN'; newValue?: string | number | null; indicator: ApiIndicator }> }
type NewsTriageStatus = 'PENDING' | 'CONVERTED' | 'DISMISSED';
interface ApiTriageNews {
  id: string;
  title: string;
  imageUrl?: string | null;
  source: string;
  publishedAt?: string | null;
  publishedLabel?: string | null;
  primaryGoalId?: number | null;
  triageStatus: NewsTriageStatus;
  action?: { id: string; name: string; status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED' } | null;
}

const apiDepartments = ref<ApiDepartment[]>([]);
const apiIndicators = ref<ApiIndicator[]>([]);
const apiSources = ref<ApiSource[]>([]);
const apiObservations = ref<ApiObservation[]>([]);
const triageNews = ref<ApiTriageNews[]>([]);
const indicatorValueDialogOpen = ref(false);
const selectedValueIndicatorId = ref<string | null>(null);
const editingObservationId = ref<string | null>(null);
const indicatorValueForm = ref<IndicatorValueFormState>(emptyIndicatorValueForm());
const sourceSelectOptions = computed(() =>
  apiSources.value.map((source) => ({ label: source.name, value: source.id })),
);
const selectedValueIndicator = computed(() =>
  apiIndicators.value.find((indicator) => indicator.id === selectedValueIndicatorId.value) ?? null,
);
const targetSearch = ref<string | null>('');
const targetGoalFilter = ref<number | null>(null);
const targetDialogOpen = ref(false);
const deleteTargetDialogOpen = ref(false);
const editingTargetId = ref<string | null>(null);
const targetPendingDelete = ref<LocalTarget | null>(null);
const targetForm = ref<TargetFormState>(emptyTargetForm());
const targetPriorityOptions: Array<{ label: string; value: TargetPriority }> = [
  { label: 'Alta', value: 'HIGH' },
  { label: 'M\u00e9dia', value: 'MEDIUM' },
  { label: 'Cont\u00ednua', value: 'CONTINUOUS' },
];
const expectedEffectOptions = [
  { label: 'Aumentar o valor', value: 'INCREASE' as const },
  { label: 'Reduzir o valor', value: 'DECREASE' as const },
  { label: 'Manter o valor', value: 'MAINTAIN' as const },
];
const actionWeightOptions = [
  { label: '1 · Complementar', value: 1, description: 'Contribuição pequena ou indireta para o resultado.' },
  { label: '2 · Apoio', value: 2, description: 'Ajuda o indicador, mas possui alcance limitado.' },
  { label: '3 · Relevante', value: 3, description: 'Contribuição perceptível e com alcance municipal.' },
  { label: '4 · Estruturante', value: 4, description: 'Ação importante, contínua ou de grande abrangência.' },
  { label: '5 · Prioritária', value: 5, description: 'Uma das principais ações para produzir o resultado esperado.' },
];
const selectedActionWeight = computed(() =>
  actionWeightOptions.find((option) => option.value === actionForm.value.weight) ?? actionWeightOptions[2]!,
);

function actionWeightLabel(weight: number) {
  return actionWeightOptions.find((option) => option.value === weight)?.label ?? `${weight} de 5`;
}
const actionIndicatorOptions = computed(() => {
  const goalId = selectedGoalId(actionForm.value.goal);
  return apiIndicators.value
    .filter((indicator) => indicator.goalId === goalId)
    .map((indicator) => ({ label: indicator.name, value: indicator.id }));
});
const selectedActionIndicators = computed(() =>
  actionForm.value.indicatorIds.flatMap((id) => {
    const indicator = apiIndicators.value.find((item) => item.id === id);
    return indicator ? [indicator] : [];
  }),
);

function defaultExpectedEffect(polarity?: ApiIndicator['polarity']) {
  if (polarity === 'LOWER_IS_BETTER') return 'DECREASE' as const;
  if (polarity === 'CONTEXTUAL') return 'MAINTAIN' as const;
  return 'INCREASE' as const;
}

type ExpectedIndicatorEffect = 'INCREASE' | 'DECREASE' | 'MAINTAIN';

function requiresNewIndicatorValue(effect?: ExpectedIndicatorEffect) {
  return effect === 'INCREASE' || effect === 'DECREASE';
}

function setActionIndicatorEffect(indicatorId: string, effect: ExpectedIndicatorEffect | null) {
  if (!effect) return;
  actionForm.value.indicatorEffects[indicatorId] = effect;
  if (!requiresNewIndicatorValue(effect)) delete actionForm.value.indicatorValues[indicatorId];
}

watch(() => actionForm.value.goal, () => {
  const validIds = new Set(actionIndicatorOptions.value.map((option) => option.value));
  actionForm.value.indicatorIds = actionForm.value.indicatorIds.filter((id) => validIds.has(id));
});

watch(() => [...actionForm.value.indicatorIds], (ids) => {
  const selectedIds = new Set(ids);
  for (const id of Object.keys(actionForm.value.indicatorEffects)) {
    if (!selectedIds.has(id)) delete actionForm.value.indicatorEffects[id];
  }
  for (const id of Object.keys(actionForm.value.indicatorValues)) {
    if (!selectedIds.has(id)) delete actionForm.value.indicatorValues[id];
  }
  for (const id of ids) {
    if (!actionForm.value.indicatorEffects[id]) {
      const polarity = apiIndicators.value.find((indicator) => indicator.id === id)?.polarity;
      actionForm.value.indicatorEffects[id] = defaultExpectedEffect(polarity);
    }
  }
});
const targetGoalOptions = computed(() =>
  managedGoals.value.map((goal) => ({ label: `ODS ${goal.id} - ${goal.title}`, value: goal.id })),
);
const targetDepartmentOptions = computed(() =>
  apiDepartments.value.map((department) => ({ label: department.name, value: department.id })),
);
const filteredLocalTargets = computed(() => {
  const query = normalizeSearch(targetSearch.value);
  return localTargets.value.filter((target) => {
    if (targetGoalFilter.value && target.goalId !== targetGoalFilter.value) return false;
    if (!query) return true;

    return normalizeSearch(
      `ODS ${target.goalId} ${target.code} ${target.title} ${target.text} ${target.owner} ${target.deadline} ${target.priority}`,
    ).includes(query);
  });
});
const groupedLocalTargets = computed(() => {
  const groups = new Map<number, LocalTarget[]>();
  const sortedTargets = [...filteredLocalTargets.value].sort((current, next) =>
    current.code.localeCompare(next.code, 'pt-BR', { numeric: true }),
  );

  for (const target of sortedTargets) {
    const targets = groups.get(target.goalId) ?? [];
    targets.push(target);
    groups.set(target.goalId, targets);
  }

  return [...groups.entries()]
    .sort(([currentGoalId], [nextGoalId]) => currentGoalId - nextGoalId)
    .map(([goalId, targets]) => ({
      goalId,
      goalTitle: managedGoals.value.find((goal) => goal.id === goalId)?.title ?? `Objetivo ${goalId}`,
      targets,
    }));
});
const triageFilters = ref<NewsTriageStatus[]>([]);
const filteredTriageNews = computed(() => !triageFilters.value.length
  ? triageNews.value
  : triageNews.value.filter((item) => triageFilters.value.includes(item.triageStatus)));
const triageCounts = computed(() => triageNews.value.reduce((counts, item) => {
  counts[item.triageStatus] += 1;
  return counts;
}, { PENDING: 0, CONVERTED: 0, DISMISSED: 0 } as Record<NewsTriageStatus, number>));

function toggleTriageFilter(status: NewsTriageStatus) {
  triageFilters.value = triageFilters.value.includes(status)
    ? triageFilters.value.filter((item) => item !== status)
    : [...triageFilters.value, status];
}

function isTriageFilterActive(status: NewsTriageStatus) {
  return triageFilters.value.includes(status);
}

function clearTriageFilters() {
  triageFilters.value = [];
}

const frequencyToApi: Record<string, string> = { Mensal: 'MONTHLY', Bimestral: 'BIMONTHLY', Quadrimestral: 'FOUR_MONTHLY', Semestral: 'SEMIANNUAL', Anual: 'ANNUAL', 'Contínua': 'CONTINUOUS' };
const frequencyFromApi: Record<string, string> = { MONTHLY: 'Mensal', BIMONTHLY: 'Bimestral', QUARTERLY: 'Trimestral', FOUR_MONTHLY: 'Quadrimestral', SEMIANNUAL: 'Semestral', ANNUAL: 'Anual', CONTINUOUS: 'Contínua' };
const statusFromApi: Record<string, string> = { DRAFT: 'Rascunho', REVIEW: 'Em revisão', PUBLISHED: 'Publicado', ARCHIVED: 'Arquivado' };
const priorityFromApi: Record<TargetPriority, string> = { HIGH: 'Alta', MEDIUM: 'Média', CONTINUOUS: 'Contínua' };
const polarityToApi: Record<string, string> = { 'Quanto maior, melhor': 'HIGHER_IS_BETTER', 'Quanto menor, melhor': 'LOWER_IS_BETTER', Contextual: 'CONTEXTUAL' };
const polarityFromApi: Record<string, string> = { HIGHER_IS_BETTER: 'Quanto maior, melhor', LOWER_IS_BETTER: 'Quanto menor, melhor', CONTEXTUAL: 'Indicador contextual' };

async function loadAdminData() {
  try {
    const [goals, departments, targets, indicatorRows, sourceRows, observations, actions, newsRows] = await Promise.all([
      auth.request<ApiGoal[]>('/goals'), auth.request<ApiDepartment[]>('/departments'), auth.request<ApiTarget[]>('/targets'),
      auth.request<ApiIndicator[]>('/indicators'), auth.request<ApiSource[]>('/sources'), auth.request<ApiObservation[]>('/observations'), auth.request<ApiAction[]>('/actions'), auth.request<ApiTriageNews[]>('/news/triage'),
    ]);
    apiDepartments.value = departments;
    apiIndicators.value = indicatorRows;
    apiSources.value = sourceRows;
    apiObservations.value = observations;
    departmentOptions.value = departments.map((item) => item.name);
    managedGoals.value = goals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      focus: goal.localFocus,
      targets: targets.filter((item) => item.goalId === goal.id).length,
      indicators: indicatorRows.filter((item) => item.goalId === goal.id).length,
      sources: new Set(
        observations
          .filter((item) => item.indicator.goalId === goal.id)
          .map((item) => item.source.id),
      ).size,
    }));
    indicators.value = indicatorRows.map((item) => {
      const indicatorObservations = observations.filter((observation) => observation.indicatorId === item.id);
      const latestObservation = indicatorObservations[0];

      return {
        id: item.id,
        name: item.name,
        goal: `ODS ${item.goalId}`,
        target: item.target?.code ? `Meta local ${item.target.code}` : 'Sem meta vinculada',
        frequency: frequencyFromApi[item.frequency] ?? item.frequency,
        status: statusFromApi[item.status] ?? item.status,
        description: item.description,
        unit: item.unit,
        polarity: polarityFromApi[item.polarity] ?? item.polarity,
        lastValue: latestObservation
          ? formatObservedValue(latestObservation.displayValue ?? String(latestObservation.value), item.unit)
          : 'Sem valores',
        lastPeriod: latestObservation?.period ?? null,
        observationCount: indicatorObservations.length,
      };
    });
    localTargets.value = targets.map((item) => ({
      id: item.id,
      goalId: item.goalId,
      code: item.code,
      title: item.title,
      text: item.description,
      owner: item.department?.name ?? 'ObservaODS',
      deadline: item.deadline,
      priority: priorityFromApi[item.priority],
      priorityValue: item.priority,
      departmentId: item.departmentId ?? item.department?.id ?? null,
    }));
    sources.value = sourceRows.map((item) => ({ name: item.name, description: item.description ?? '', frequency: frequencyFromApi[item.frequency] ?? item.frequency, status: statusFromApi[item.status] ?? item.status }));
    recentEntries.value = observations.slice(0, 8).map((item) => ({ indicator: item.indicator.name, goal: `ODS ${item.indicator.goalId}`, period: item.period, value: item.displayValue ?? String(item.value), status: statusFromApi[item.status] ?? item.status }));
    municipalActions.value = actions.map((item) => ({ name: item.name, department: item.department.name, goal: `ODS ${item.goalId}`, weight: item.weight, description: item.description, indicators: item.indicatorLinks.map((link) => link.indicator.name) }));
    triageNews.value = newsRows;
  } catch (error) { $q.notify({ type: 'negative', message: error instanceof Error ? error.message : 'Falha ao carregar o painel.' }); }
}

async function runSave(callback: () => Promise<unknown>, message: string) {
  adminSaving.value = true;
  try {
    await callback();
    $q.notify({ type: 'positive', message });
    await loadAdminData();
    return true;
  } catch (error) {
    $q.notify({ type: 'negative', message: error instanceof Error ? error.message : 'Não foi possível salvar.' });
    return false;
  } finally {
    adminSaving.value = false;
  }
}
function selectedGoalId(value?: string) { return Number(value?.match(/^ODS (\d+)/)?.[1]); }
function countLabel(value: number, singular: string, plural: string) {
  return value === 1 ? singular : plural;
}
function normalizeSearch(value: string | null | undefined = '') {
  return (value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
function emptyTargetForm(): TargetFormState {
  return {
    goalId: null,
    code: '',
    title: '',
    description: '',
    deadline: '',
    priority: 'MEDIUM',
    departmentId: null,
  };
}
function requiredRule(value: unknown) {
  return (value !== null && value !== undefined && String(value).trim().length > 0) || 'Campo obrigatório.';
}
function parseLocalizedNumber(value: string) {
  const compactValue = value.trim().replace(/\s/g, '').replace(/[^\d,.\-+]/g, '');
  if (!/\d/.test(compactValue)) return Number.NaN;
  const lastComma = compactValue.lastIndexOf(',');
  const lastDot = compactValue.lastIndexOf('.');
  let normalized = compactValue;

  if (lastComma >= 0 && lastDot >= 0) {
    normalized = lastComma > lastDot
      ? compactValue.replace(/\./g, '').replace(',', '.')
      : compactValue.replace(/,/g, '');
  } else if (lastComma >= 0) {
    normalized = compactValue.replace(',', '.');
  }

  return Number(normalized);
}
function validNumberRule(value: unknown) {
  return Number.isFinite(parseLocalizedNumber(String(value ?? ''))) || 'Informe um valor numérico válido.';
}
function optionalNumberRule(value: unknown) {
  return !String(value ?? '').trim() || validNumberRule(value);
}
function formatObservedValue(value: string, unit: string) {
  const normalizedValue = value.trim();
  const normalizedUnit = unit.trim();
  if (!normalizedValue) return 'Sem valores';
  if (!normalizedUnit || normalizedValue.toLocaleLowerCase('pt-BR').includes(normalizedUnit.toLocaleLowerCase('pt-BR'))) {
    return normalizedValue;
  }
  return `${normalizedValue} ${normalizedUnit}`;
}
function stripUnitFromValue(value: string, ...units: string[]) {
  let normalizedValue = value.trim();

  for (const unit of new Set(units.map((item) => item.trim()).filter(Boolean))) {
    const normalizedUnit = unit.toLocaleLowerCase('pt-BR');
    let unitIndex = normalizedValue.toLocaleLowerCase('pt-BR').indexOf(normalizedUnit);

    while (unitIndex >= 0) {
      normalizedValue = (
        normalizedValue.slice(0, unitIndex)
        + normalizedValue.slice(unitIndex + unit.length)
      ).trim();
      unitIndex = normalizedValue.toLocaleLowerCase('pt-BR').indexOf(normalizedUnit);
    }
  }

  return normalizedValue;
}
function emptyIndicatorForm(): IndicatorFormState {
  return {
    goal: goalOptions.value[0],
    name: '',
    unit: '',
    frequency: 'Anual',
    polarity: 'Quanto maior, melhor',
    description: '',
    includeInitialValue: false,
    initialValue: '',
    initialPeriod: String(new Date().getFullYear()),
    initialSourceId: apiSources.value[0]?.id ?? null,
    initialTerritory: 'Vitória da Conquista',
    initialStatus: 'PUBLISHED',
  };
}
function emptyIndicatorValueForm(unit = ''): IndicatorValueFormState {
  return {
    unit,
    period: String(new Date().getFullYear()),
    value: '',
    sourceId: apiSources.value[0]?.id ?? null,
    territory: 'Vitória da Conquista',
    note: '',
    status: 'PUBLISHED',
  };
}
function editableObservationStatus(status: ApiObservation['status']): ObservationStatus {
  return status === 'DRAFT' || status === 'REVIEW' ? status : 'PUBLISHED';
}
function openIndicatorValue(indicatorId: string) {
  const indicator = apiIndicators.value.find((item) => item.id === indicatorId);
  if (!indicator) {
    $q.notify({ type: 'info', message: 'Conecte o backend para lançar valores neste indicador demonstrativo.' });
    return;
  }

  selectedValueIndicatorId.value = indicatorId;
  const latestObservation = apiObservations.value.find((item) => item.indicatorId === indicatorId);
  if (latestObservation) {
    editingObservationId.value = latestObservation.id;
    indicatorValueForm.value = {
      unit: indicator.unit,
      period: latestObservation.period,
      value: latestObservation.displayValue ?? String(latestObservation.value),
      sourceId: latestObservation.sourceId ?? latestObservation.source.id,
      territory: latestObservation.territory,
      note: latestObservation.note ?? '',
      status: editableObservationStatus(latestObservation.status),
    };
  } else {
    editingObservationId.value = null;
    indicatorValueForm.value = emptyIndicatorValueForm(indicator.unit);
  }
  indicatorValueDialogOpen.value = true;
}
function startNewIndicatorPeriod() {
  editingObservationId.value = null;
  indicatorValueForm.value = emptyIndicatorValueForm(selectedValueIndicator.value?.unit);
}
function closeIndicatorValueDialog() {
  if (adminSaving.value) return;
  indicatorValueDialogOpen.value = false;
  selectedValueIndicatorId.value = null;
  editingObservationId.value = null;
  indicatorValueForm.value = emptyIndicatorValueForm();
}
function openCreateTarget() {
  editingTargetId.value = null;
  targetForm.value = emptyTargetForm();
  targetDialogOpen.value = true;
}
function clearTargetFilters() {
  targetSearch.value = '';
  targetGoalFilter.value = null;
}
function openEditTarget(target: LocalTarget) {
  editingTargetId.value = target.id;
  targetForm.value = {
    goalId: target.goalId,
    code: target.code,
    title: target.title,
    description: target.text,
    deadline: target.deadline,
    priority: target.priorityValue,
    departmentId: target.departmentId,
  };
  targetDialogOpen.value = true;
}
function closeTargetDialog() {
  if (adminSaving.value) return;
  targetDialogOpen.value = false;
  editingTargetId.value = null;
  targetForm.value = emptyTargetForm();
}
function openDeleteTarget(target: LocalTarget) {
  targetPendingDelete.value = target;
  deleteTargetDialogOpen.value = true;
}
async function saveTarget() {
  const form = targetForm.value;
  if (!form.goalId) return;
  const payload = {
    goalId: form.goalId,
    code: form.code,
    title: form.title,
    description: form.description,
    deadline: form.deadline,
    priority: form.priority,
    departmentId: form.departmentId,
  };
  const targetId = editingTargetId.value;
  const saved = await runSave(
    () => auth.request(targetId ? `/targets/${targetId}` : '/targets', {
      method: targetId ? 'PATCH' : 'POST',
      body: JSON.stringify(payload),
    }),
    targetId ? 'Meta atualizada com sucesso.' : 'Meta cadastrada com sucesso.',
  );
  if (saved) closeTargetDialog();
}
async function deleteTarget() {
  const target = targetPendingDelete.value;
  if (!target?.id) return;
  const deleted = await runSave(
    () => auth.request(`/targets/${target.id}`, { method: 'DELETE' }),
    'Meta excluída com sucesso.',
  );
  if (deleted) {
    deleteTargetDialogOpen.value = false;
    targetPendingDelete.value = null;
  }
}
function formatTriageDate(value?: string | null) {
  if (!value) return 'Data não informada';
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
}
function formatIndicatorCreationDate(value?: string | null) {
  if (!value) return 'Não informada';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}
function actionLaunchLabel(item: ApiTriageNews) {
  if (!item.action) return 'Não';
  if (item.action.status === 'PUBLISHED') return 'Sim · Publicada';
  if (item.action.status === 'DRAFT') return 'Sim · Rascunho';
  if (item.action.status === 'REVIEW') return 'Sim · Em revisão';
  return 'Sim · Arquivada';
}
async function saveIndicator() {
  const form = indicatorForm.value;
  const initialValue = parseLocalizedNumber(form.initialValue);
  if (form.includeInitialValue && (!form.initialSourceId || !form.initialPeriod || !Number.isFinite(initialValue))) {
    $q.notify({ type: 'warning', message: 'Preencha valor, período e fonte para registrar o primeiro lançamento.' });
    return;
  }

  adminSaving.value = true;
  let savedIndicator: ApiIndicator | null = null;
  try {
    savedIndicator = await auth.request<ApiIndicator>('/indicators', {
      method: 'POST',
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        unit: form.unit,
        frequency: frequencyToApi[form.frequency],
        polarity: polarityToApi[form.polarity],
        status: 'PUBLISHED',
        goalId: selectedGoalId(form.goal),
      }),
    });

    if (form.includeInitialValue) {
      await auth.request('/observations', {
        method: 'POST',
        body: JSON.stringify({
          indicatorId: savedIndicator.id,
          sourceId: form.initialSourceId,
          territory: form.initialTerritory,
          period: form.initialPeriod,
          value: initialValue,
          displayValue: formatObservedValue(form.initialValue, form.unit),
          note: 'Valor inicial registrado no cadastro do indicador.',
          status: form.initialStatus,
        }),
      });
    }

    $q.notify({
      type: 'positive',
      message: form.includeInitialValue
        ? 'Indicador e primeiro valor cadastrados com sucesso.'
        : 'Indicador cadastrado. Agora você pode iniciar a série pelo card.',
    });
    indicatorForm.value = emptyIndicatorForm();
    await loadAdminData();
  } catch (error) {
    if (savedIndicator) {
      $q.notify({
        type: 'warning',
        message: 'O indicador foi criado, mas o valor inicial não pôde ser salvo. Use o card para tentar novamente.',
      });
      await loadAdminData();
    } else {
      $q.notify({
        type: 'negative',
        message: error instanceof Error ? error.message : 'Não foi possível cadastrar o indicador.',
      });
    }
  } finally {
    adminSaving.value = false;
  }
}
async function saveIndicatorValue() {
  const indicator = selectedValueIndicator.value;
  const form = indicatorValueForm.value;
  const numericValue = parseLocalizedNumber(form.value);
  if (!indicator || !form.unit || !form.sourceId || !form.period || !form.territory || !Number.isFinite(numericValue)) {
    $q.notify({ type: 'warning', message: 'Preencha os campos obrigatórios do lançamento.' });
    return;
  }

  const matchingObservation = apiObservations.value.find((observation) =>
    observation.indicatorId === indicator.id
    && observation.sourceId === form.sourceId
    && observation.period === form.period
    && observation.territory.trim() === form.territory.trim(),
  );
  if (editingObservationId.value && matchingObservation && matchingObservation.id !== editingObservationId.value) {
    $q.notify({
      type: 'warning',
      message: 'Já existe outro valor para este indicador, fonte, período e território. Edite o lançamento correspondente ou escolha outro período.',
    });
    return;
  }
  const observationId = editingObservationId.value ?? matchingObservation?.id ?? null;
  const normalizedUnit = form.unit.trim();
  const payload = {
    indicatorId: indicator.id,
    sourceId: form.sourceId,
    territory: form.territory,
    period: form.period,
    value: numericValue,
    displayValue: formatObservedValue(
      stripUnitFromValue(form.value, indicator.unit, normalizedUnit),
      normalizedUnit,
    ),
    note: form.note || undefined,
    status: form.status,
  };
  const unitChanged = normalizedUnit !== indicator.unit.trim();
  const saved = await runSave(
    async () => {
      if (unitChanged) {
        await auth.request(`/indicators/${indicator.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ unit: normalizedUnit }),
        });
      }
      await auth.request(observationId ? `/observations/${observationId}` : '/observations', {
        method: observationId ? 'PATCH' : 'POST',
        body: JSON.stringify(payload),
      });
    },
    unitChanged
      ? 'Unidade de medida e valor atualizados com sucesso.'
      : observationId
        ? 'Valor atualizado sem perder os demais períodos da série.'
        : 'Novo valor registrado e incluído no gráfico do indicador.',
  );
  if (saved) closeIndicatorValueDialog();
}
async function saveSource() {
  await runSave(() => auth.request('/sources', { method: 'POST', body: JSON.stringify({ name: sourceForm.value.name, url: sourceForm.value.url, frequency: frequencyToApi[sourceForm.value.frequency], technicalOwner: sourceForm.value.owner, publicReusable: sourceForm.value.publicReusable, status: 'PUBLISHED' }) }), 'Fonte salva.');
}
async function saveAction(status: 'DRAFT' | 'PUBLISHED') {
  const department = apiDepartments.value.find((item) => item.name === actionForm.value.department);
  if (status === 'PUBLISHED' && !actionForm.value.indicatorIds.length) {
    $q.notify({ type: 'warning', message: 'Relacione ao menos um indicador antes de publicar a ação.' });
    return;
  }
  const invalidValueIndicator = selectedActionIndicators.value.find((indicator) => {
    const effect = actionForm.value.indicatorEffects[indicator.id] ?? defaultExpectedEffect(indicator.polarity);
    if (!requiresNewIndicatorValue(effect)) return false;
    const rawValue = actionForm.value.indicatorValues[indicator.id]?.trim() ?? '';
    return (status === 'PUBLISHED' && !rawValue) || (Boolean(rawValue) && !Number.isFinite(parseLocalizedNumber(rawValue)));
  });
  if (invalidValueIndicator) {
    $q.notify({
      type: 'warning',
      message: `Informe um novo valor válido para o indicador “${invalidValueIndicator.name}”.`,
    });
    return;
  }
  const indicatorLinks = actionForm.value.indicatorIds.map((indicatorId) => {
    const effect = actionForm.value.indicatorEffects[indicatorId]
      ?? defaultExpectedEffect(apiIndicators.value.find((item) => item.id === indicatorId)?.polarity);
    const rawValue = actionForm.value.indicatorValues[indicatorId]?.trim() ?? '';
    return {
      indicatorId,
      expectedEffect: effect,
      newValue: requiresNewIndicatorValue(effect) && rawValue
        ? parseLocalizedNumber(rawValue)
        : undefined,
    };
  });
  await runSave(() => auth.request('/actions', { method: 'POST', body: JSON.stringify({ name: actionForm.value.name, description: actionForm.value.description, weight: actionForm.value.weight, status, goalId: selectedGoalId(actionForm.value.goal), departmentId: department?.id, indicatorLinks }) }), status === 'DRAFT' ? 'Rascunho salvo.' : 'Ação criada e relacionada aos indicadores.');
}
async function saveObservation(status: ObservationStatus) {
  const indicator = apiIndicators.value.find((item) => item.name === entryForm.value.indicator);
  const source = apiSources.value.find((item) => item.name === entryForm.value.source);
  const normalized = parseLocalizedNumber(entryForm.value.value);
  const message = status === 'DRAFT'
    ? 'Rascunho salvo.'
    : status === 'REVIEW'
      ? 'Lançamento enviado para revisão.'
      : 'Lançamento publicado e incluído no gráfico do indicador.';
  await runSave(() => auth.request('/observations', { method: 'POST', body: JSON.stringify({ indicatorId: indicator?.id, sourceId: source?.id, territory: entryForm.value.territory, period: entryForm.value.period, value: normalized, displayValue: entryForm.value.value, note: entryForm.value.note, status }) }), message);
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
      'A consulta ao IDSC est\u00e1 temporariamente indispon\u00edvel. Os dados demonstrativos locais est\u00e3o sendo exibidos.';
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
