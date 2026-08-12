<template>
  <q-page class="min-h-screen bg-[#f4f5f3]">
    <section
      id="inicio"
      class="relative bg-cover bg-[center_62%]"
      :style="{ backgroundImage: `url(${heroImageUrl})` }"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-[#061f12]/92 via-[#061f12]/68 to-[#061f12]/18"
      />
      <div
        class="relative mx-auto flex min-h-[330px] max-w-6xl items-center px-4 py-12 sm:min-h-[410px] sm:px-6"
      >
        <div class="vc-hero-content">
          <div class="max-w-3xl pb-8 sm:pb-12">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="rounded-md border border-lime-200/25 bg-lime-200/12 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-lime-100"
              >
                Agenda 2030 municipal
              </span>
              <button type="button" @click="scrollToAboutOds" class="vc-hero-ods-button">
                Entenda os ODS
                <q-icon name="south" size="14px" />
              </button>
            </div>

            <p role="heading" aria-level="1" class="vc-hero-title text-lime-50">
              Dados abertos para acompanhar os ODS da cidade
            </p>
            <p class="vc-hero-subtitle text-white/84">
              O ObservaODS organiza indicadores, metas públicas e fontes de transparência para
              facilitar o acompanhamento da Agenda 2030 em Vitória da Conquista.
            </p>
          </div>

          <img
            :src="prefsImageUrl"
            alt="Selo ODS de Vitória da Conquista"
            class="vc-hero-prefeitura-image"
          />
        </div>
      </div>
    </section>

    <nav class="border-b border-slate-200 bg-[#f4f5f3]">
      <div
        class="mx-auto grid max-w-6xl gap-2 px-4 py-3 sm:grid-cols-3 sm:px-6 lg:relative lg:z-10 lg:-mt-9 lg:rounded-md lg:border lg:border-slate-200 lg:bg-white lg:p-2 lg:shadow-sm"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="vc-nav-card group flex min-h-[64px] items-center gap-3 rounded-md px-3 text-left text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/60"
        >
          <span class="vc-nav-icon grid h-9 w-9 shrink-0 place-items-center rounded-md">
            <q-icon :name="item.icon" size="20px" />
          </span>
          <span class="min-w-0">
            <span class="block font-semibold leading-tight text-slate-950">{{ item.label }}</span>
            <span class="mt-1 block text-xs leading-snug text-slate-500">{{ item.caption }}</span>
          </span>
        </RouterLink>
      </div>
    </nav>

    <main class="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-8 lg:py-10">
      <section id="ods" class="space-y-6">
        <div class="vc-ods-section-head">
          <p role="heading" aria-level="2" class="vc-content-title text-[#687179]">
            Vinculação aos ODS (Objetivos do Desenvolvimento Sustentável)
          </p>
          <p class="vc-section-lead text-slate-600">
            Cada card conecta um objetivo a leituras possíveis para políticas públicas locais. Passe
            o mouse para uma descrição rápida ou clique para fixar o detalhe.
          </p>
        </div>

        <div
          ref="goalInfoCard"
          class="vc-ods-guide-header scroll-mt-24 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div class="flex gap-4">
              <span class="vc-goal-guide-icon">
                <q-icon name="touch_app" size="22px" />
              </span>
              <div class="min-w-0">
                <p role="heading" aria-level="3" class="vc-ods-guide-title text-slate-950">
                  Explore os ODS do observatório
                </p>
                <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  Os cards abaixo organizam os Objetivos de Desenvolvimento Sustentável adotados
                  para leitura municipal. Passe o mouse para uma prévia ou clique para ver a
                  aplicação local neste painel.
                </p>
              </div>
            </div>

            <q-btn
              class="vc-goal-detail-action vc-goal-detail-action--header w-fit lg:mt-1"
              icon="south"
              label="Entender a agenda ODS"
              no-caps
              @click="scrollToAboutOds"
            />
          </div>

          <Transition name="vc-detail" mode="out-in">
            <div
              v-if="isGoalLoading"
              key="loading"
              class="vc-ods-guide-body vc-ods-guide-loading mt-5 border-t border-slate-100 pt-4"
            >
              <div
                class="vc-ods-guide-loading-card grid gap-4 rounded-md border border-slate-100 bg-slate-50 p-4 sm:grid-cols-[auto_1fr] sm:items-center"
              >
                <q-spinner color="green-9" size="38px" />
                <div class="min-w-0">
                  <p class="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Carregando detalhe
                  </p>
                  <p class="mt-1 text-sm font-semibold leading-tight text-slate-950">
                    Preparando leitura do ODS selecionado
                  </p>
                  <div class="mt-3 grid gap-2 sm:grid-cols-3">
                    <div class="vc-detail-skeleton h-3 rounded" />
                    <div class="vc-detail-skeleton h-3 rounded" />
                    <div class="vc-detail-skeleton h-3 rounded" />
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else-if="selectedGoal"
              key="selected"
              class="vc-ods-guide-body vc-selected-goal-panel mt-5 grid gap-4 border-t border-slate-100 pt-4 lg:grid-cols-[auto_minmax(0,1fr)_minmax(230px,280px)] lg:items-stretch"
            >
              <div
                class="vc-selected-goal-thumb h-24 w-24 shrink-0 overflow-hidden rounded-md shadow-sm sm:h-28 sm:w-28"
                :style="{ backgroundColor: selectedGoal.color }"
              >
                <img
                  :src="getGoalImage(selectedGoal.id)"
                  :alt="`ODS ${selectedGoal.id} - ${selectedGoal.title}`"
                  class="h-full w-full object-cover"
                />
              </div>

              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="vc-selected-goal-badge">ODS {{ selectedGoal.id }}</span>
                  <span class="text-xs font-semibold text-slate-400">Objetivo selecionado</span>
                </div>
                <p
                  role="heading"
                  aria-level="3"
                  class="vc-goal-detail-title vc-goal-detail-title--inline text-slate-950"
                >
                  {{ selectedGoal.title }}
                </p>
                <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {{ selectedGoal.description }}
                </p>
              </div>

              <div
                class="vc-selected-goal-aside rounded-md border border-slate-100 bg-slate-50 p-4"
              >
                <div class="flex items-center gap-2 text-slate-500">
                  <span class="vc-selected-goal-pin">
                    <q-icon name="location_on" size="16px" />
                  </span>
                  <p class="text-[11px] font-bold uppercase tracking-wide">Aplicação local</p>
                </div>
                <p class="mt-2 text-sm leading-6 text-slate-700">
                  {{ selectedGoal.localFocus }}
                </p>

                <q-btn
                  class="vc-goal-detail-action mt-4 w-full whitespace-nowrap"
                  color="green-9"
                  icon="open_in_new"
                  label="Abrir dados vinculados"
                  no-caps
                  :to="`/ods/${selectedGoal.id}`"
                />
              </div>
            </div>

            <div
              v-else
              key="guide"
              class="vc-ods-guide-body mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4"
            >
              <div
                v-for="item in guideSteps"
                :key="item.label"
                class="vc-guide-chip flex min-w-[220px] flex-1 gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2.5"
              >
                <span class="vc-goal-guide-step-icon">
                  <q-icon :name="item.icon" size="16px" />
                </span>
                <div>
                  <p class="text-sm font-semibold leading-tight text-slate-950">
                    {{ item.label }}
                  </p>
                  <p class="mt-1 text-xs leading-5 text-slate-600">{{ item.text }}</p>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="grid items-start gap-5 lg:gap-5 rounded-md overflow-hidden">
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <button
              v-for="goal in goals"
              :key="goal.id"
              type="button"
              class="ods-goal-card group relative aspect-square cursor-pointer overflow-hidden rounded-none bg-white text-left text-white shadow-sm transition duration-200 hover:z-10 hover:scale-[1.02] hover:shadow-lg focus:z-10 focus:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-lime-300"
              :class="
                selectedGoal?.id === goal.id || loadingGoalId === goal.id
                  ? 'z-10 ring-4 ring-lime-300'
                  : ''
              "
              :aria-pressed="selectedGoal?.id === goal.id"
              :aria-busy="loadingGoalId === goal.id"
              @click="selectGoal(goal)"
            >
              <img
                :src="getGoalImage(goal.id)"
                :alt="`ODS ${goal.id} - ${goal.title}`"
                class="h-full w-full object-cover"
              />

              <div
                class="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/20 group-focus:bg-black/20"
              />

              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                :offset="[0, 10]"
                max-width="340px"
                class="vc-ods-tooltip bg-[#06230f] px-4 py-3 text-sm text-white"
              >
                {{ goal.description }}
              </q-tooltip>
            </button>
          </div>
        </div>
      </section>

      <section
        id="sobre-ods"
        ref="aboutOdsSection"
        class="vc-ods-about-card mt-10 scroll-mt-24"
      >
        <div class="vc-ods-about-ribbon" aria-hidden="true" />

        <div class="relative">
          <div class="grid gap-7 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-stretch">
          <div>
            <p class="vc-ods-about-eyebrow">
              Objetivos de Desenvolvimento Sustentável
            </p>
            <p role="heading" aria-level="2" class="vc-about-title text-slate-950">
              Uma agenda comum para conectar indicadores, políticas públicas e território
            </p>
            <div class="vc-about-copy text-slate-600">
              <p>
                Os ODS são uma agenda global proposta pela ONU para orientar ações sociais,
                econômicas, ambientais e institucionais até 2030. No município, eles ajudam a
                organizar indicadores, comparar territórios e aproximar decisões públicas das metas
                de desenvolvimento sustentável.
              </p>
              <p>
                No ObservaODS, cada objetivo funciona como uma porta de entrada para dados públicos,
                permitindo enxergar onde há avanço, onde existem lacunas e quais temas precisam de
                atenção integrada entre secretarias, conselhos e sociedade civil.
              </p>
            </div>

            <div class="vc-ods-about-tags mt-6">
              <span><q-icon name="public" size="16px" /> Agenda global</span>
              <span><q-icon name="location_on" size="16px" /> Leitura municipal</span>
              <span><q-icon name="groups" size="16px" /> Participação social</span>
            </div>
          </div>

          <aside class="vc-ods-about-flow">
            <p class="text-xs font-black uppercase tracking-wide text-lime-200">Como funciona</p>
            <p class="mt-3 text-xl font-black leading-tight text-white">Da agenda global à decisão no território</p>
            <div class="mt-6 space-y-3">
              <div v-for="(step, index) in odsFlow" :key="step" class="vc-ods-about-flow-step">
                <span>{{ String(index + 1).padStart(2, '0') }}</span>
                <strong>{{ step }}</strong>
              </div>
            </div>
          </aside>
          </div>

          <div class="mt-7 grid gap-3 sm:grid-cols-3">
            <div
              v-for="item in odsSummary"
              :key="item.value"
              class="vc-ods-summary-card"
              :style="{ '--summary-accent': item.color }"
            >
              <p class="text-2xl font-black leading-none text-slate-950">{{ item.value }}</p>
              <p class="mt-2 text-xs leading-5 text-slate-600">{{ item.label }}</p>
            </div>
          </div>

          <div class="mt-3 grid gap-3 md:grid-cols-3">
            <article
              v-for="item in odsHighlights"
              :key="item.label"
              class="vc-ods-highlight-card"
              :style="{ '--highlight-accent': item.color }"
            >
              <div class="flex items-start gap-3">
                <span class="vc-ods-highlight-icon">
                  <q-icon :name="item.icon" size="18px" />
                </span>
                <div>
                  <p class="text-sm font-bold text-slate-950">{{ item.label }}</p>
                  <p class="mt-2 text-xs leading-5 text-slate-600">{{ item.text }}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="noticias" class="mt-12">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.16em] text-[#1d6d13]">
              Atualidades do munic&iacute;pio
            </p>
            <p role="heading" aria-level="2" class="vc-content-title mt-2 text-[#687179]">
              Not&iacute;cias relacionadas aos ODS
            </p>
            <p class="vc-section-lead mt-2 max-w-3xl text-slate-600">
              Iniciativas e servi&ccedil;os p&uacute;blicos de Vit&oacute;ria da Conquista classificados conforme
              sua contribui&ccedil;&atilde;o para o desenvolvimento municipal sustent&aacute;vel.
            </p>
          </div>
          <a
            href="https://www.pmvc.ba.gov.br/categoria/noticias/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-white px-4 py-2.5 text-sm font-bold text-[#1d6d13] shadow-sm hover:border-emerald-300 hover:bg-emerald-50"
          >
            Ver todas no portal <q-icon name="open_in_new" size="17px" />
          </a>
        </div>

        <div v-if="newsLoading" class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div v-for="index in 6" :key="index" class="h-[330px] animate-pulse rounded-lg bg-slate-200" />
        </div>

        <div v-else-if="news.length" class="vc-news-grid mt-6">
          <a
            v-for="item in news"
            :key="item.id"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="vc-news-card group"
          >
            <div class="vc-news-media">
              <div class="absolute inset-0 grid place-items-center text-5xl text-white/20">
                <q-icon name="account_balance" />
              </div>
              <img
                v-if="item.imageUrl"
                :src="item.imageUrl"
                :alt="item.title"
                class="vc-news-image"
                @error="hideBrokenNewsImage"
              />
              <div class="vc-news-shade" />
              <span class="vc-news-category">
                {{ item.category }}
              </span>
            </div>
            <div class="vc-news-content">
              <div class="vc-news-meta">
                <span><q-icon name="calendar_today" /> {{ item.publishedLabel || 'Publica&ccedil;&atilde;o recente' }}</span>
                <span v-if="item.primaryGoalId" class="vc-news-primary">ODS {{ item.primaryGoalId }}</span>
              </div>
              <h3 class="vc-news-title">
                {{ item.title }}
              </h3>
              <div class="vc-news-footer">
                <div v-if="item.goalIds?.length" class="vc-news-goals">
                  <span v-for="goalId in item.goalIds" :key="goalId">ODS {{ goalId }}</span>
                </div>
                <span class="vc-news-read">
                  Ler notícia <q-icon name="arrow_forward" />
                </span>
              </div>
            </div>
          </a>
        </div>

        <div v-else class="mt-6 rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          <q-icon name="newspaper" size="38px" class="text-emerald-700" />
          <p class="mt-3 text-sm font-semibold">As not&iacute;cias municipais est&atilde;o sendo atualizadas.</p>
        </div>
      </section>

      <section id="secretarias" class="mt-10 grid gap-4 md:grid-cols-3">
        <article
          v-for="metric in metrics"
          :key="metric.label"
          class="rounded-md border border-slate-200 bg-white p-5"
        >
          <q-icon :name="metric.icon" class="text-3xl text-[#1d6d13]" />
          <p class="mt-4 text-3xl font-black text-slate-950">{{ metric.value }}</p>
          <p class="mt-1 text-sm font-semibold text-slate-600">{{ metric.label }}</p>
        </article>
      </section>

      <p id="fontes" class="pt-8 pl-1 text-xs text-slate-500/60">
        Foto: Saulo luz, CC BY 4.0, via Wikimedia Commons.
      </p>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { apiRequest } from '@/services/api';

interface Goal {
  id: number;
  title: string;
  description: string;
  localFocus: string;
  icon: string;
  color: string;
}

interface NewsItem {
  id: string;
  title: string;
  url: string;
  imageUrl?: string | null;
  category: string;
  publishedLabel?: string | null;
  primaryGoalId?: number | null;
  goalIds?: number[];
}

const heroImageUrl = new URL('../assets/vca.jpeg', import.meta.url).href;
const prefsImageUrl = new URL('../assets/prefs2.png', import.meta.url).href;
const goalImageUrls = import.meta.glob('../assets/*.{jpg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const navItems = [
  {
    label: 'Objetivos ODS',
    caption: 'Metas, temas e prioridades',
    to: '/ods',
    icon: 'flag',
  },
  {
    label: 'Secretarias',
    caption: 'Áreas responsáveis e ações',
    to: '/secretarias',
    icon: 'account_balance',
  },
  {
    label: 'Transparência',
    caption: 'Fontes, dados e evidências',
    to: '/transparencia',
    icon: 'dataset',
  },
];

const odsHighlights = [
  {
    label: 'Agenda integrada',
    text: 'Reúne temas sociais, econômicos, ambientais e institucionais em uma mesma lógica de acompanhamento.',
    icon: 'hub',
    color: '#1d6d13',
  },
  {
    label: 'Dados comparáveis',
    text: 'Facilita observar evolução histórica, desigualdades territoriais e prioridades por indicador.',
    icon: 'query_stats',
    color: '#dda63a',
  },
  {
    label: 'Gestão transparente',
    text: 'Aproxima metas públicas, secretarias municipais e sociedade para prestação de contas contínua.',
    icon: 'verified',
    color: '#c5192d',
  },
];

const odsSummary = [
  {
    value: '2030',
    label: 'horizonte global para acompanhamento das metas de desenvolvimento sustentável.',
    color: '#1d6d13',
  },
  {
    value: '18',
    label: 'objetivos organizados no observatório para leitura municipal integrada.',
    color: '#dda63a',
  },
  {
    value: '3',
    label: 'camadas de análise: indicador, política pública e impacto no território.',
    color: '#c5192d',
  },
];

const odsFlow = ['Organizar os ODS', 'Conectar evidências', 'Acompanhar o território'];

const guideSteps = [
  {
    label: 'Passe o mouse',
    text: 'Veja uma descrição rápida de cada objetivo sem sair da grade.',
    icon: 'ads_click',
  },
  {
    label: 'Clique em um card',
    text: 'Fixe o detalhe da ODS e leia sua aplicação para políticas públicas locais.',
    icon: 'touch_app',
  },
  {
    label: 'Compare os temas',
    text: 'Observe como objetivos sociais, ambientais e institucionais se conectam no território.',
    icon: 'compare_arrows',
  },
];

const fallbackGoals: Goal[] = [
  {
    id: 1,
    title: 'Erradicação da pobreza',
    description: 'Acabar com a pobreza em todas as suas formas, em todos os lugares.',
    localFocus: 'Mapear famílias vulneráveis, renda, moradia e acesso aos serviços essenciais.',
    icon: 'family_restroom',
    color: '#e5243b',
  },
  {
    id: 2,
    title: 'Fome zero e agricultura sustentável',
    description:
      'Acabar com a fome, alcançar segurança alimentar e promover agricultura sustentável.',
    localFocus: 'Acompanhar segurança alimentar, agricultura familiar e abastecimento municipal.',
    icon: 'restaurant',
    color: '#dda63a',
  },
  {
    id: 3,
    title: 'Saúde e bem-estar',
    description: 'Assegurar uma vida saudável e promover o bem-estar para todos.',
    localFocus:
      'Monitorar atenção básica, vigilância em saúde e qualidade de vida nos territórios.',
    icon: 'monitor_heart',
    color: '#4c9f38',
  },
  {
    id: 4,
    title: 'Educação de qualidade',
    description: 'Assegurar educação inclusiva, equitativa e de qualidade.',
    localFocus: 'Observar aprendizagem, permanência escolar, creches e ensino integral.',
    icon: 'school',
    color: '#c5192d',
  },
  {
    id: 5,
    title: 'Igualdade de gênero',
    description: 'Alcançar igualdade de gênero e empoderar todas as mulheres e meninas.',
    localFocus: 'Acompanhar políticas de proteção, autonomia econômica e participação social.',
    icon: 'female',
    color: '#ff3a21',
  },
  {
    id: 6,
    title: 'Água potável e saneamento',
    description: 'Garantir disponibilidade e manejo sustentável da água e saneamento.',
    localFocus: 'Medir abastecimento, esgotamento sanitário, drenagem e segurança hídrica.',
    icon: 'water_drop',
    color: '#26bde2',
  },
  {
    id: 7,
    title: 'Energia acessível e limpa',
    description: 'Garantir acesso confiável, sustentável, moderno e a preço acessível à energia.',
    localFocus: 'Mapear eficiência energética, iluminação pública e iniciativas de energia limpa.',
    icon: 'bolt',
    color: '#fcc30b',
  },
  {
    id: 8,
    title: 'Trabalho decente e crescimento',
    description: 'Promover crescimento econômico sustentado, emprego pleno e trabalho decente.',
    localFocus: 'Acompanhar emprego formal, empreendedorismo local e inclusão produtiva.',
    icon: 'trending_up',
    color: '#a21942',
  },
  {
    id: 9,
    title: 'Indústria, inovação e infraestrutura',
    description: 'Construir infraestrutura resiliente e fomentar inovação.',
    localFocus: 'Observar conectividade, infraestrutura urbana, tecnologia e ambiente de negócios.',
    icon: 'hub',
    color: '#fd6925',
  },
  {
    id: 10,
    title: 'Redução das desigualdades',
    description: 'Reduzir as desigualdades dentro dos países e entre eles.',
    localFocus: 'Comparar indicadores por território, renda, gênero, raça e faixa etária.',
    icon: 'balance',
    color: '#dd1367',
  },
  {
    id: 11,
    title: 'Cidades sustentáveis',
    description: 'Tornar cidades e comunidades inclusivas, seguras, resilientes e sustentáveis.',
    localFocus: 'Acompanhar mobilidade, habitação, planejamento urbano e resiliência municipal.',
    icon: 'location_city',
    color: '#fd9d24',
  },
  {
    id: 12,
    title: 'Consumo e produção responsáveis',
    description: 'Assegurar padrões de produção e de consumo sustentáveis.',
    localFocus: 'Monitorar resíduos, compras públicas sustentáveis e economia circular.',
    icon: 'all_inclusive',
    color: '#bf8b2e',
  },
  {
    id: 13,
    title: 'Ação contra a mudança do clima',
    description: 'Tomar medidas urgentes para combater a mudança do clima e seus impactos.',
    localFocus: 'Registrar riscos climáticos, arborização, defesa civil e mitigação de emissões.',
    icon: 'public',
    color: '#3f7e44',
  },
  {
    id: 14,
    title: 'Vida na água',
    description: 'Conservar e usar de forma sustentável oceanos, mares e recursos marinhos.',
    localFocus: 'Relacionar educação ambiental, recursos hídricos e impactos em bacias locais.',
    icon: 'waves',
    color: '#0a97d9',
  },
  {
    id: 15,
    title: 'Vida terrestre',
    description: 'Proteger, recuperar e promover o uso sustentável dos ecossistemas terrestres.',
    localFocus: 'Acompanhar unidades verdes, cobertura vegetal, biodiversidade e áreas degradadas.',
    icon: 'forest',
    color: '#56c02b',
  },
  {
    id: 16,
    title: 'Paz, justiça e instituições eficazes',
    description: 'Promover sociedades pacíficas, acesso à justiça e instituições eficazes.',
    localFocus: 'Monitorar transparência, controle social, segurança cidadã e acesso a direitos.',
    icon: 'gavel',
    color: '#00689d',
  },
  {
    id: 17,
    title: 'Parcerias e meios de implementação',
    description:
      'Fortalecer meios de implementação e parcerias para o desenvolvimento sustentável.',
    localFocus: 'Integrar governo, universidades, sociedade civil, empresas e cooperação técnica.',
    icon: 'diversity_3',
    color: '#19486a',
  },
  {
    id: 18,
    title: 'Todas as metas',
    description: 'Visão integrada das metas priorizadas pelo município no observatório.',
    localFocus:
      'Consolidar os indicadores transversais e a leitura integrada da Agenda 2030 local.',
    icon: 'apps',
    color: '#123c19',
  },
];

const goals = ref<Goal[]>(fallbackGoals);
const news = ref<NewsItem[]>([]);
const newsLoading = ref(true);

const selectedGoal = ref<Goal | null>(null);
const isGoalLoading = ref(false);
const loadingGoalId = ref<number | null>(null);
const goalInfoCard = ref<HTMLElement | null>(null);
const aboutOdsSection = ref<HTMLElement | null>(null);
let goalLoadingTimer: number | undefined;

function getGoalImage(id: number) {
  const extension = id === 18 ? 'png' : 'jpg';

  return goalImageUrls[`../assets/${id}.${extension}`] as string | undefined;
}

function selectGoal(goal: Goal) {
  selectedGoal.value = null;
  isGoalLoading.value = true;
  loadingGoalId.value = goal.id;

  window.requestAnimationFrame(() => {
    goalInfoCard.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  if (goalLoadingTimer) {
    window.clearTimeout(goalLoadingTimer);
  }

  goalLoadingTimer = window.setTimeout(() => {
    selectedGoal.value = goal;
    isGoalLoading.value = false;
    loadingGoalId.value = null;
  }, 360);
}

function scrollToAboutOds() {
  aboutOdsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideBrokenNewsImage(event: Event) {
  (event.currentTarget as HTMLImageElement).style.display = 'none';
}

onBeforeUnmount(() => {
  if (goalLoadingTimer) {
    window.clearTimeout(goalLoadingTimer);
  }
});

onMounted(async () => {
  const [goalsResult, newsResult] = await Promise.allSettled([
    apiRequest<Goal[]>('/goals'),
    apiRequest<NewsItem[]>('/news?limit=6'),
  ]);
  goals.value = goalsResult.status === 'fulfilled' ? goalsResult.value : fallbackGoals;
  news.value = newsResult.status === 'fulfilled' ? newsResult.value : [];
  newsLoading.value = false;
});

const metrics = [
  {
    label: 'ODS e metas no painel',
    value: '18',
    icon: 'flag',
  },
  {
    label: 'Eixos de acompanhamento',
    value: '6',
    icon: 'account_tree',
  },
  {
    label: 'Fontes de dados previstas',
    value: '12',
    icon: 'dataset',
  },
];
</script>

<style scoped>
.vc-news-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.35rem;
}

.vc-news-card {
  display: flex;
  min-width: 0;
  min-height: 390px;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #dfe7e3;
  border-radius: 14px;
  background: #fff;
  color: inherit;
  text-decoration: none;
  box-shadow: 0 5px 18px rgb(15 48 35 / 7%);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.vc-news-card:hover {
  transform: translateY(-5px);
  border-color: #9dd5b3;
  box-shadow: 0 16px 34px rgb(15 76 48 / 14%);
}

.vc-news-media {
  position: relative;
  height: 190px;
  flex: 0 0 190px;
  overflow: hidden;
  background: linear-gradient(135deg, #063d28, #0b6b42);
}

.vc-news-image {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms ease;
}

.vc-news-card:hover .vc-news-image { transform: scale(1.045); }

.vc-news-shade {
  position: absolute;
  z-index: 2;
  inset: 45% 0 0;
  background: linear-gradient(transparent, rgb(0 28 18 / 75%));
  pointer-events: none;
}

.vc-news-category {
  position: absolute;
  z-index: 3;
  bottom: 14px;
  left: 14px;
  max-width: calc(100% - 28px);
  overflow: hidden;
  padding: 6px 10px;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 6px;
  background: rgb(19 112 59 / 92%);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0.025em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
  backdrop-filter: blur(5px);
}

.vc-news-content {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  padding: 1.2rem 1.25rem 1.1rem;
}

.vc-news-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  color: #718096;
  font-size: 0.72rem;
  line-height: 1.2;
}

.vc-news-meta > span { display: inline-flex; align-items: center; gap: 0.35rem; }
.vc-news-primary { flex-shrink: 0; color: #19713f; font-weight: 800; }

.vc-news-title {
  display: -webkit-box;
  overflow: hidden;
  margin: 0.85rem 0 0;
  color: #13251d;
  font-size: 1.08rem !important;
  font-weight: 750 !important;
  line-height: 1.38 !important;
  letter-spacing: -0.012em;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  transition: color 180ms ease;
}

.vc-news-card:hover .vc-news-title { color: #176b3c; }

.vc-news-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1.15rem;
}

.vc-news-goals { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.vc-news-goals span {
  border-radius: 999px;
  background: #eaf7ef;
  padding: 0.28rem 0.55rem;
  color: #176b3c;
  font-size: 0.65rem;
  font-weight: 800;
}

.vc-news-read {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.25rem;
  color: #176b3c;
  font-size: 0.73rem;
  font-weight: 800;
}

@media (max-width: 1023px) {
  .vc-news-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 639px) {
  .vc-news-grid { grid-template-columns: 1fr; }
  .vc-news-card { min-height: 370px; }
  .vc-news-media { height: 180px; flex-basis: 180px; }
}
</style>
