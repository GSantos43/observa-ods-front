<template>
  <div class="display-viewport" :class="{ 'theme-light': !isDarkTheme }">
    <div class="display-page" :style="displaySurfaceStyle">
    <header class="display-header">
      <div class="brand">
        <img :src="brandImageUrl" alt="ObservaODS" />
      </div>

      <div class="header-actions">
        <div class="weather" :title="weatherDescription">
          <q-icon :name="weatherIcon" class="weather-icon" />
          <div class="weather-copy">
            <strong>{{ weatherTemperature }}</strong>
            <span>{{ weatherDescription }}</span>
          </div>
        </div>
        <div class="clock">
          <strong>{{ currentTime }}</strong>
          <span>{{ currentDate }}</span>
        </div>
        <q-btn
          flat round
          class="header-control"
          :icon="isDarkTheme ? 'light_mode' : 'dark_mode'"
          :aria-label="isDarkTheme ? 'Ativar tema claro' : 'Ativar tema escuro'"
          :aria-pressed="!isDarkTheme"
          @click="toggleTheme"
        >
          <q-tooltip>{{ isDarkTheme ? 'Tema claro' : 'Tema escuro' }}</q-tooltip>
        </q-btn>
        <q-btn
          flat round class="header-control"
          :icon="isFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          :aria-label="isFullscreen ? 'Sair da tela cheia' : 'Ativar tela cheia'"
          @click="toggleFullscreen"
        >
          <q-tooltip>{{ isFullscreen ? 'Sair da tela cheia' : 'Tela cheia' }}</q-tooltip>
        </q-btn>
        <q-btn flat round class="header-control" icon="close" aria-label="Voltar ao painel" to="/admin">
          <q-tooltip>Voltar ao painel</q-tooltip>
        </q-btn>
      </div>
    </header>

    <Transition name="display-slide" mode="out-in">
    <main :key="slideIndex" class="display-content">
      <template v-if="slideIndex === 0">
      <section class="intro">
        <div>
          <p class="eyebrow">Desenvolvimento sustent&aacute;vel no territ&oacute;rio</p>
          <h1>Panorama do desenvolvimento municipal</h1>
          <p class="intro-copy">Indicadores estrat&eacute;gicos revelam avan&ccedil;os, desafios e prioridades para o futuro de Vit&oacute;ria da Conquista.</p>
        </div>
        <div class="city-badge"><q-icon name="location_on" /> Vit&oacute;ria da Conquista &mdash; BA</div>
      </section>

      <section class="metric-grid">
        <article v-for="metric in metrics" :key="metric.label" class="metric-card">
          <div class="metric-icon"><q-icon :name="metric.icon" /></div>
          <div>
            <strong>{{ metric.value }}</strong>
            <p>{{ metric.label }}</p>
            <span>{{ metric.caption }}</span>
          </div>
        </article>
      </section>

      <section class="dashboard-grid">
        <article class="panel progress-panel">
          <div class="panel-heading">
            <div><span>Leitura do territ&oacute;rio</span><h2>Evolu&ccedil;&atilde;o municipal por ODS</h2></div>
            <div class="legend"><i class="good" /> Avan&ccedil;o <i class="attention" /> Aten&ccedil;&atilde;o</div>
          </div>
          <div class="goals-grid">
            <div v-for="goal in goals" :key="goal.id" class="goal-row">
              <img :src="goalImage(goal.id)" :alt="`ODS ${goal.id}`" />
              <div class="goal-info">
                <div><span>{{ goal.title }}</span><strong>{{ goal.score }}%</strong></div>
                <div class="progress-track"><i :class="goal.score >= 60 ? 'good' : 'attention'" :style="{ width: `${goal.score}%` }" /></div>
              </div>
            </div>
          </div>
        </article>

        <article class="panel highlight-panel">
          <div class="highlight-top">
            <span>Evid&ecirc;ncia em destaque</span>
            <q-icon name="campaign" />
          </div>
          <Transition name="slide" mode="out-in">
            <div :key="activeHighlight.title" class="highlight-body">
              <div class="highlight-icon"><q-icon :name="activeHighlight.icon" /></div>
              <p>{{ activeHighlight.tag }}</p>
              <h2>{{ activeHighlight.title }}</h2>
              <strong>{{ activeHighlight.value }}</strong>
              <span>{{ activeHighlight.description }}</span>
            </div>
          </Transition>
          <div class="dots">
            <button v-for="(_, index) in highlights" :key="index" :class="{ active: index === highlightIndex }" :aria-label="`Exibir destaque ${index + 1}`" @click="highlightIndex = index" />
          </div>
        </article>
      </section>
      </template>

      <template v-else-if="slideIndex === 1">
        <section class="intro">
          <div>
            <p class="eyebrow">Resultados para a popula&ccedil;&atilde;o conquistense</p>
            <h1>Indicadores que traduzem o munic&iacute;pio</h1>
            <p class="intro-copy">Uma leitura objetiva dos resultados que orientam o planejamento e qualificam as pol&iacute;ticas p&uacute;blicas locais.</p>
          </div>
          <div class="city-badge"><q-icon name="insights" /> Dados municipais</div>
        </section>

        <section class="feature-grid">
          <article v-for="(item, index) in highlights" :key="item.title" class="feature-card" :class="`feature-card--${index + 1}`">
            <div class="feature-card-top">
              <span class="feature-icon"><q-icon :name="item.icon" /></span>
              <span class="feature-tag">{{ item.tag }}</span>
            </div>
            <strong>{{ item.value }}</strong>
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
            <div class="feature-line" />
          </article>
        </section>

        <section class="message-panel">
          <q-icon name="format_quote" />
          <p>Conhecer o territ&oacute;rio por meio de dados qualificados permite reconhecer desigualdades, orientar prioridades e aprimorar a gest&atilde;o municipal.</p>
        </section>
      </template>

      <template v-else-if="slideIndex === 2">
        <section class="intro">
          <div>
            <p class="eyebrow">Gest&atilde;o municipal em a&ccedil;&atilde;o</p>
            <h1>Pol&iacute;ticas p&uacute;blicas conectadas aos ODS</h1>
            <p class="intro-copy">A atua&ccedil;&atilde;o integrada da Prefeitura converte os compromissos da Agenda 2030 em respostas concretas para o territ&oacute;rio.</p>
          </div>
          <div class="city-badge"><q-icon name="groups" /> Trabalho integrado</div>
        </section>

        <section class="actions-layout">
          <div class="actions-list">
            <article v-for="action in municipalUpdates" :key="action.title" class="action-card">
              <span class="action-icon"><q-icon :name="action.icon" /></span>
              <div>
                <span>{{ action.department }}</span>
                <h2>{{ action.title }}</h2>
                <p>{{ action.description }}</p>
              </div>
              <strong>{{ action.goal }}</strong>
            </article>
          </div>
          <article class="ods-wall panel">
            <div class="panel-heading"><div><span>Agenda 2030 no munic&iacute;pio</span><h2>Objetivos relacionados</h2></div></div>
            <div class="ods-wall-grid">
              <div v-for="goal in actionGoals" :key="goal.id">
                <img :src="goalImage(goal.id)" :alt="`ODS ${goal.id}`" />
                <span>{{ goal.label }}</span>
              </div>
            </div>
          </article>
        </section>
      </template>

      <template v-else-if="slideIndex === 3">
        <section class="intro news-intro">
          <div>
            <p class="eyebrow">Acontece em Vit&oacute;ria da Conquista</p>
            <h1>Not&iacute;cias do munic&iacute;pio</h1>
            <p class="intro-copy">Informa&ccedil;&otilde;es oficiais sobre servi&ccedil;os, iniciativas e a&ccedil;&otilde;es da Prefeitura Municipal.</p>
          </div>
          <div class="city-badge"><q-icon name="newspaper" /> Portal oficial da Prefeitura</div>
        </section>

        <section v-if="featuredNews" class="news-layout">
          <a class="news-featured" :href="featuredNews.url" target="_blank" rel="noopener noreferrer">
            <div class="news-featured-image">
              <img v-if="featuredNews.imageUrl" :src="featuredNews.imageUrl" :alt="featuredNews.title" @error="hideBrokenImage" />
              <div class="news-image-fallback"><q-icon name="account_balance" /></div>
              <div class="news-image-overlay" />
              <span class="news-category">{{ featuredNews.category }}</span>
            </div>
            <div class="news-featured-copy">
              <span><q-icon name="schedule" /> {{ featuredNews.publishedLabel || 'Publicação recente' }}</span>
              <h2>{{ featuredNews.title }}</h2>
              <p>Confira esta e outras informa&ccedil;&otilde;es no portal oficial da Prefeitura de Vit&oacute;ria da Conquista.</p>
              <strong>Not&iacute;cia em destaque <q-icon name="north_east" /></strong>
            </div>
          </a>

          <div class="news-list">
            <a v-for="item in secondaryNews" :key="item.id" :href="item.url" target="_blank" rel="noopener noreferrer" class="news-card">
              <div class="news-card-image">
                <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" @error="hideBrokenImage" />
                <q-icon name="newspaper" />
              </div>
              <div>
                <span>{{ item.category }} <i /> {{ item.publishedLabel || 'Publicação recente' }}</span>
                <h3>{{ item.title }}</h3>
              </div>
            </a>
          </div>
        </section>

        <section v-else class="news-empty panel">
          <q-icon name="sync" />
          <h2>Atualizando o notici&aacute;rio municipal</h2>
          <p>As informa&ccedil;&otilde;es oficiais estar&atilde;o dispon&iacute;veis em instantes.</p>
        </section>
      </template>

      <template v-else>
        <section class="goal-detail-hero">
          <img :src="goalImage(featuredGoal.id)" :alt="`ODS ${featuredGoal.id} — ${featuredGoal.title}`" />
          <div>
            <p class="eyebrow">ODS em evid&ecirc;ncia &bull; desempenho favor&aacute;vel</p>
            <h1>{{ featuredGoal.title }}</h1>
            <p>{{ featuredGoal.summary }}</p>
          </div>
          <div class="goal-score-seal">
            <span>Pontua&ccedil;&atilde;o municipal</span>
            <strong>{{ featuredGoal.score }}</strong>
            <small>de 100 pontos</small>
          </div>
        </section>

        <section class="goal-explanation-grid">
          <article class="goal-reading panel">
            <div class="panel-heading">
              <div><span>Como interpretar</span><h2>Um resultado acima do patamar favor&aacute;vel</h2></div>
              <span class="favorable-badge"><q-icon name="check_circle" /> Situa&ccedil;&atilde;o favor&aacute;vel</span>
            </div>
            <p class="goal-reading-copy">A pontua&ccedil;&atilde;o de {{ featuredGoal.score }} supera em {{ featuredGoal.margin }} pontos o limite de 60 adotado para a faixa favor&aacute;vel. O resultado indica uma base municipal consistente, embora o acompanhamento permanente continue indispens&aacute;vel.</p>
            <div class="score-scale">
              <div class="score-scale-labels"><span>0</span><span>Alerta</span><span>Aten&ccedil;&atilde;o</span><span>Favor&aacute;vel</span><span>100</span></div>
              <div class="score-scale-track">
                <i class="scale-alert" /><i class="scale-attention" /><i class="scale-good" />
                <strong :style="{ left: `${featuredGoal.score}%` }"><span>{{ featuredGoal.score }}</span></strong>
              </div>
            </div>
          </article>

          <article class="goal-dimensions panel">
            <div class="panel-heading"><div><span>Dimens&otilde;es observadas</span><h2>O que comp&otilde;e esta leitura</h2></div></div>
            <div class="dimension-list">
              <div v-for="dimension in featuredGoal.dimensions" :key="dimension.label">
                <span><q-icon :name="dimension.icon" /></span>
                <div><strong>{{ dimension.label }}</strong><p>{{ dimension.description }}</p></div>
              </div>
            </div>
          </article>
        </section>

        <aside class="goal-context-note">
          <q-icon name="info" />
          <p><strong>Leitura responsável:</strong> um bom desempenho n&atilde;o encerra o desafio. O munic&iacute;pio deve preservar os avan&ccedil;os, reduzir desigualdades entre territ&oacute;rios e manter a atualiza&ccedil;&atilde;o dos indicadores.</p>
          <span>Refer&ecirc;ncia: leitura municipal do IDSC e ObservaODS</span>
        </aside>
      </template>
    </main>
    </Transition>

    <footer class="display-footer">
      <span><q-icon name="public" /> observaods.vitoriadaconquista.ba.gov.br</span>
      <nav class="carousel-nav" aria-label="P&aacute;ginas da exibi&ccedil;&atilde;o">
        <button v-for="(slide, index) in displaySlides" :key="slide" class="slide-indicator" :class="{ active: slideIndex === index }" :aria-label="`Exibir página: ${slide}`" :title="slide" @click="showSlide(index)">
          <i v-if="slideIndex === index && !carouselPaused" :key="slideIndex" />
        </button>
        <button class="carousel-control pause-button" :aria-label="carouselPaused ? 'Continuar reprodução' : 'Pausar reprodução'" :title="carouselPaused ? 'Continuar reprodução' : 'Pausar reprodução'" @click="toggleCarousel">
          <q-icon :name="carouselPaused ? 'play_arrow' : 'pause'" />
        </button>
        <button class="carousel-control next-button" aria-label="Avançar para a próxima página" title="Próxima página" @click="nextSlide">
          <q-icon name="arrow_forward" />
        </button>
      </nav>
      <span>Fonte: ObservaODS &bull; 2026</span>
    </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth-store';
import { apiRequest } from '@/services/api';

interface DashboardPayload {
  metrics: { goals: number; indicators: number; sources: number; pending: number };
}

interface WeatherPayload {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
    is_day?: number;
  };
}

interface NewsItem {
  id: string;
  title: string;
  url: string;
  imageUrl?: string | null;
  category: string;
  publishedLabel?: string | null;
  source: string;
}

const auth = useAuthStore();
const brandImageUrl = new URL('../assets/logo.png', import.meta.url).href;
const THEME_STORAGE_KEY = 'observaods-display-theme';
const DISPLAY_WIDTH = 1920;
const DISPLAY_HEIGHT = 1080;
const CAROUSEL_DURATION_MS = 7500;
const now = ref(new Date());
const isFullscreen = ref(Boolean(document.fullscreenElement));
const isDarkTheme = ref(readInitialTheme());
const displayScale = ref(Math.min(
  window.innerWidth / DISPLAY_WIDTH,
  window.innerHeight / DISPLAY_HEIGHT,
));
const highlightIndex = ref(0);
const slideIndex = ref(0);
const carouselPaused = ref(false);
const weather = ref<WeatherPayload['current']>();
const news = ref<NewsItem[]>([]);
const dashboard = ref<DashboardPayload['metrics']>({ goals: 18, indicators: 43, sources: 12, pending: 7 });
let clockTimer: number | undefined;
let rotationTimer: number | undefined;
let weatherTimer: number | undefined;
let newsTimer: number | undefined;
let carouselTimer: number | undefined;

const displaySlides = ['Panorama', 'Destaques', 'Ações', 'Notícias', 'ODS em evidência'];

const currentTime = computed(() => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(now.value));
const currentDate = computed(() => new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(now.value));
const weatherTemperature = computed(() => weather.value?.temperature_2m == null ? '--°' : `${Math.round(weather.value.temperature_2m)}°`);
const weatherDescription = computed(() => describeWeather(weather.value?.weather_code));
const weatherIcon = computed(() => iconForWeather(weather.value?.weather_code, weather.value?.is_day !== 0));
const displaySurfaceStyle = computed(() => ({
  width: `${DISPLAY_WIDTH}px`,
  height: `${DISPLAY_HEIGHT}px`,
  transform: `translate(-50%, -50%) scale(${displayScale.value})`,
  '--carousel-duration': `${CAROUSEL_DURATION_MS}ms`,
}));
const metrics = computed(() => [
  { label: 'ODS monitorados', value: dashboard.value.goals, caption: 'Objetivos acompanhados no município', icon: 'flag' },
  { label: 'Indicadores ativos', value: dashboard.value.indicators, caption: 'Evidências sobre a realidade local', icon: 'query_stats' },
  { label: 'Fontes integradas', value: dashboard.value.sources, caption: 'Bases institucionais consolidadas', icon: 'web' },
  { label: 'Dados publicados', value: '84%', caption: 'Indicadores tecnicamente validados', icon: 'verified' },
]);

const goals = [
  { id: 3, title: 'Saúde e bem-estar', score: 78 },
  { id: 4, title: 'Educação de qualidade', score: 64 },
  { id: 6, title: 'Água e saneamento', score: 83 },
  { id: 8, title: 'Trabalho decente', score: 57 },
  { id: 11, title: 'Cidades sustentáveis', score: 72 },
  { id: 13, title: 'Ação climática', score: 61 },
];

const highlights = [
  { tag: 'Saúde pública', title: 'Cobertura municipal da atenção básica', value: '78,4%', description: 'da população alcançada pelos serviços de atenção primária à saúde.', icon: 'health_and_safety' },
  { tag: 'Educação municipal', title: 'Permanência na rede pública de ensino', value: '91,2%', description: 'dos estudantes com vínculo ativo ao longo do ano letivo.', icon: 'school' },
  { tag: 'Proteção social', title: 'Famílias acompanhadas no território', value: '12.480', description: 'famílias atendidas pelas políticas socioassistenciais do município.', icon: 'diversity_1' },
];
const municipalUpdates = [
  { department: 'Desenvolvimento Social', title: 'Busca ativa e proteção às famílias vulneráveis', description: 'A atuação territorial aproxima serviços, benefícios e acompanhamento continuado das famílias em maior vulnerabilidade.', goal: 'ODS 1', icon: 'diversity_1' },
  { department: 'Educação', title: 'Monitoramento da permanência escolar', description: 'A rede municipal acompanha frequência e aprendizagem para fortalecer trajetórias educacionais e prevenir o abandono.', goal: 'ODS 4', icon: 'school' },
  { department: 'Infraestrutura Urbana', title: 'Planejamento do saneamento por território', description: 'Evidências sobre abastecimento, drenagem e esgotamento qualificam as decisões e os investimentos municipais.', goal: 'ODS 6', icon: 'water_drop' },
];
const actionGoals = [
  { id: 1, label: 'Proteção social' },
  { id: 3, label: 'Saúde' },
  { id: 4, label: 'Educação' },
  { id: 6, label: 'Saneamento' },
  { id: 10, label: 'Equidade' },
  { id: 11, label: 'Cidade sustentável' },
];
const featuredGoal = {
  id: 6,
  title: 'Água potável e saneamento',
  score: 82.7,
  margin: 22.7,
  summary: 'O ODS 6 acompanha a garantia de água segura, saneamento adequado e gestão responsável dos recursos hídricos em Vitória da Conquista.',
  dimensions: [
    { label: 'Abastecimento de água', description: 'Acesso regular e seguro nos diferentes territórios do município.', icon: 'water_drop' },
    { label: 'Esgotamento sanitário', description: 'Cobertura, tratamento e destinação adequada dos efluentes.', icon: 'waves' },
    { label: 'Qualidade e segurança', description: 'Condições da água ofertada e prevenção de riscos à saúde.', icon: 'verified' },
    { label: 'Gestão dos recursos hídricos', description: 'Planejamento, uso responsável e resiliência diante de períodos críticos.', icon: 'compost' },
  ],
};
const activeHighlight = computed(() => highlights[highlightIndex.value] ?? highlights[0]!);
const featuredNews = computed(() => news.value[0]);
const secondaryNews = computed(() => news.value.slice(1, 4));

function goalImage(id: number) { return new URL(`../assets/${id}.jpg`, import.meta.url).href; }
function readInitialTheme() {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!savedTheme) return false;
    if (savedTheme === 'light') return false;
    if (savedTheme === 'dark') return true;
  } catch { /* A exibição continua com a preferência do sistema quando o armazenamento não está disponível. */ }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function updateDisplayScale() {
  displayScale.value = Math.min(
    window.innerWidth / DISPLAY_WIDTH,
    window.innerHeight / DISPLAY_HEIGHT,
  );
}
function updateFullscreenState() {
  isFullscreen.value = Boolean(document.fullscreenElement);
  window.requestAnimationFrame(updateDisplayScale);
}
function toggleTheme() {
  isDarkTheme.value = !isDarkTheme.value;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, isDarkTheme.value ? 'dark' : 'light');
  } catch { /* A alternância permanece ativa durante a sessão. */ }
}
function hideBrokenImage(event: Event) { (event.currentTarget as HTMLImageElement).style.display = 'none'; }
function describeWeather(code?: number) {
  if (code == null) return 'Clima indisponível';
  if (code === 0) return 'Céu limpo';
  if (code <= 3) return 'Parcialmente nublado';
  if (code <= 48) return 'Neblina';
  if (code <= 57) return 'Garoa';
  if (code <= 67) return 'Chuva';
  if (code <= 77) return 'Granizo';
  if (code <= 82) return 'Pancadas de chuva';
  if (code <= 86) return 'Chuva intensa';
  return 'Trovoadas';
}
function iconForWeather(code?: number, isDay = true) {
  if (code == null) return 'cloud_off';
  if (code === 0) return isDay ? 'wb_sunny' : 'nights_stay';
  if (code <= 3) return 'cloud';
  if (code <= 48) return 'blur_on';
  if (code <= 86) return 'grain';
  return 'flash_on';
}
async function loadWeather() {
  try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-14.8661&longitude=-40.8394&current=temperature_2m,apparent_temperature,weather_code,is_day&timezone=America%2FBahia');
    if (!response.ok) throw new Error('Falha ao consultar o clima');
    weather.value = (await response.json() as WeatherPayload).current;
  } catch {
    weather.value = undefined;
  }
}
async function loadNews() {
  try { news.value = await apiRequest<NewsItem[]>('/news?limit=8'); }
  catch { news.value = []; }
}
async function toggleFullscreen() {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await document.documentElement.requestFullscreen();
}
function startCarousel() {
  if (carouselTimer) window.clearInterval(carouselTimer);
  carouselTimer = window.setInterval(() => {
    slideIndex.value = (slideIndex.value + 1) % displaySlides.length;
  }, CAROUSEL_DURATION_MS);
}
function showSlide(index: number) {
  slideIndex.value = index;
  if (!carouselPaused.value) startCarousel();
}
function nextSlide() {
  showSlide((slideIndex.value + 1) % displaySlides.length);
}
function previousSlide() {
  showSlide((slideIndex.value - 1 + displaySlides.length) % displaySlides.length);
}
function handleCarouselKeyboard(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null;
  const isInteractive = target?.matches('input, textarea, select, button, [contenteditable="true"]');
  if (isInteractive || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    nextSlide();
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    previousSlide();
  }
}
function toggleCarousel() {
  carouselPaused.value = !carouselPaused.value;
  if (carouselPaused.value) {
    if (carouselTimer) window.clearInterval(carouselTimer);
    carouselTimer = undefined;
  } else {
    startCarousel();
  }
}

onMounted(async () => {
  document.addEventListener('fullscreenchange', updateFullscreenState);
  document.addEventListener('keydown', handleCarouselKeyboard);
  window.addEventListener('resize', updateDisplayScale);
  updateDisplayScale();
  clockTimer = window.setInterval(() => { now.value = new Date(); }, 1000);
  rotationTimer = window.setInterval(() => { highlightIndex.value = (highlightIndex.value + 1) % highlights.length; }, 8000);
  weatherTimer = window.setInterval(() => { void loadWeather(); }, 15 * 60 * 1000);
  newsTimer = window.setInterval(() => { void loadNews(); }, 15 * 60 * 1000);
  startCarousel();
  void loadWeather();
  void loadNews();
  try { dashboard.value = (await auth.request<DashboardPayload>('/dashboard')).metrics; } catch { /* Mantém a exibição demonstrativa se a API estiver indisponível. */ }
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', updateFullscreenState);
  document.removeEventListener('keydown', handleCarouselKeyboard);
  window.removeEventListener('resize', updateDisplayScale);
  if (clockTimer) window.clearInterval(clockTimer);
  if (rotationTimer) window.clearInterval(rotationTimer);
  if (weatherTimer) window.clearInterval(weatherTimer);
  if (newsTimer) window.clearInterval(newsTimer);
  if (carouselTimer) window.clearInterval(carouselTimer);
});
</script>

<style scoped>
.display-page{min-height:100vh;background:radial-gradient(circle at 80% 0,rgba(87,180,91,.18),transparent 30%),#061b11;color:#fff;display:flex;flex-direction:column;overflow:hidden}.display-header{height:86px;padding:0 clamp(28px,4vw,72px);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.12);background:rgba(4,22,13,.68)}.brand,.header-actions,.clock,.updated,.city-badge,.display-footer span{display:flex;align-items:center}.brand img{width:auto;height:58px;max-width:210px;object-fit:contain}.clock span{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#a9c7b1}.header-actions{gap:18px}.updated{gap:8px;font-size:12px;color:#c5d8ca}.live-dot{width:8px;height:8px;border-radius:50%;background:#a3e635;box-shadow:0 0 0 5px rgba(163,230,53,.12)}.clock{flex-direction:column;align-items:flex-end}.clock strong{font-size:23px;line-height:1}.clock span{margin-top:5px}.display-content{flex:1;padding:clamp(22px,3vh,40px) clamp(28px,4vw,72px);display:flex;flex-direction:column;gap:clamp(18px,2.3vh,28px)}.intro{display:flex;align-items:end;justify-content:space-between}.eyebrow,.panel-heading span,.highlight-top span{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.15em;color:#a3e635}.intro h1{font-size:clamp(30px,3vw,52px);font-weight:800;line-height:1.1;margin:5px 0}.intro-copy{font-size:clamp(13px,1.05vw,17px);color:#b8ccc0}.city-badge{gap:7px;border:1px solid rgba(255,255,255,.13);border-radius:999px;padding:9px 14px;color:#c7d9cc;font-size:12px}.metric-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:15px}.metric-card{min-height:112px;display:flex;align-items:center;gap:16px;padding:18px 20px;border:1px solid rgba(255,255,255,.11);border-radius:14px;background:linear-gradient(145deg,rgba(255,255,255,.1),rgba(255,255,255,.035));box-shadow:0 15px 35px rgba(0,0,0,.13)}.metric-icon{width:48px;height:48px;display:grid;place-items:center;border-radius:12px;background:rgba(163,230,53,.13);color:#b6ed54;font-size:25px}.metric-card strong{font-size:clamp(24px,2.2vw,38px);line-height:1;font-weight:800}.metric-card p{font-size:13px;font-weight:700;margin:5px 0 1px}.metric-card span{font-size:10px;color:#8eaa97}.dashboard-grid{min-height:0;flex:1;display:grid;grid-template-columns:minmax(0,1.8fr) minmax(300px,.8fr);gap:16px}.panel{min-height:0;border:1px solid rgba(255,255,255,.11);border-radius:16px;background:rgba(255,255,255,.055);padding:clamp(18px,2vw,28px)}.panel-heading,.highlight-top{display:flex;align-items:flex-start;justify-content:space-between}.panel-heading h2{font-size:clamp(19px,1.7vw,27px);font-weight:750;margin-top:3px}.legend{font-size:10px;color:#a9bcb0;display:flex;align-items:center;gap:6px}.legend i{width:8px;height:8px;border-radius:50%;margin-left:8px}.good{background:#71cc5b!important}.attention{background:#f6bd48!important}.goals-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:clamp(12px,1.8vh,20px) clamp(20px,2vw,34px);margin-top:clamp(18px,2.4vh,30px)}.goal-row{display:flex;align-items:center;gap:13px}.goal-row img{width:48px;height:48px;border-radius:7px}.goal-info{flex:1;min-width:0}.goal-info>div:first-child{display:flex;justify-content:space-between;gap:10px;font-size:12px}.goal-info span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#d3dfd6}.goal-info strong{color:#fff}.progress-track{height:6px;background:rgba(255,255,255,.1);border-radius:99px;margin-top:8px;overflow:hidden}.progress-track i{display:block;height:100%;border-radius:99px}.highlight-panel{position:relative;background:linear-gradient(155deg,rgba(36,112,48,.48),rgba(255,255,255,.05));display:flex;flex-direction:column}.highlight-top{color:#b6ed54}.highlight-body{flex:1;display:flex;flex-direction:column;justify-content:center}.highlight-icon{width:52px;height:52px;display:grid;place-items:center;border-radius:50%;background:#a3e635;color:#14381c;font-size:27px}.highlight-body p{margin-top:20px;color:#b6ed54;text-transform:uppercase;letter-spacing:.15em;font-size:10px;font-weight:800}.highlight-body h2{font-size:clamp(18px,1.7vw,27px);font-weight:750;line-height:1.2;margin-top:7px}.highlight-body strong{font-size:clamp(40px,4.5vw,68px);color:#c8f36d;line-height:1.1;margin-top:10px}.highlight-body>span{font-size:12px;line-height:1.6;color:#b7cbbd;max-width:360px}.dots{display:flex;gap:7px}.dots button{border:0;width:22px;height:4px;border-radius:5px;background:rgba(255,255,255,.2)}.dots button.active{background:#a3e635;width:38px}.display-footer{height:48px;padding:0 clamp(28px,4vw,72px);border-top:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:space-between;font-size:10px;color:#819b89}.display-footer span{gap:6px}.slide-enter-active,.slide-leave-active{transition:opacity .4s,transform .4s}.slide-enter-from{opacity:0;transform:translateX(16px)}.slide-leave-to{opacity:0;transform:translateX(-16px)}
@media(max-width:900px){.display-page{overflow:auto}.display-header{height:auto;min-height:76px;padding:12px 20px}.brand img{width:auto;height:46px;max-width:150px}.updated,.clock span{display:none}.display-content{padding:24px 20px}.metric-grid{grid-template-columns:repeat(2,1fr)}.dashboard-grid{grid-template-columns:1fr}.goals-grid{grid-template-columns:1fr}.display-footer p{display:none}.intro{align-items:start}.city-badge{display:none}}@media(max-height:760px) and (min-width:901px){.display-header{height:70px}.brand img{width:auto;height:48px;max-width:170px}.display-content{padding-top:16px;padding-bottom:16px;gap:14px}.intro-copy{display:none}.metric-card{min-height:84px;padding:12px 16px}.metric-icon{width:40px;height:40px}.goal-row img{width:40px;height:40px}.goals-grid{margin-top:14px;gap:10px 24px}.display-footer{height:36px}}

/* Escala de exibição: dimensões e tipografia otimizadas para leitura à distância em TVs. */
@media (min-width: 901px) {
  .display-header { height: 98px; }
  .brand img { width: auto; height: 66px; max-width: 220px; }
  .clock span { font-size: 13px; }
  .updated { font-size: 14px; }
  .clock strong { font-size: 30px; }
  .display-content { gap: clamp(22px, 2.6vh, 34px); }
  .eyebrow, .panel-heading span, .highlight-top span { font-size: 14px; }
  .intro h1 { font-size: clamp(40px, 3.4vw, 60px); }
  .intro-copy { font-size: clamp(17px, 1.25vw, 21px); }
  .city-badge { padding: 11px 17px; font-size: 15px; }
  .metric-card { min-height: 132px; gap: 20px; padding: 22px 24px; }
  .metric-icon { width: 58px; height: 58px; font-size: 31px; }
  .metric-card strong { font-size: clamp(34px, 2.7vw, 46px); }
  .metric-card p { margin-top: 7px; font-size: 16px; }
  .metric-card span { font-size: 13px; }
  .panel { padding: clamp(22px, 2.2vw, 34px); }
  .panel-heading h2 { font-size: clamp(25px, 2vw, 33px); }
  .legend { font-size: 13px; gap: 8px; }
  .legend i { width: 10px; height: 10px; }
  .goals-grid { gap: clamp(17px, 2vh, 24px) clamp(24px, 2.4vw, 40px); }
  .goal-row { gap: 16px; }
  .goal-row img { width: 58px; height: 58px; }
  .goal-info > div:first-child { font-size: 15px; }
  .progress-track { height: 9px; margin-top: 10px; }
  .highlight-icon { width: 64px; height: 64px; font-size: 34px; }
  .highlight-body p { font-size: 13px; }
  .highlight-body h2 { font-size: clamp(25px, 2vw, 34px); }
  .highlight-body strong { font-size: clamp(52px, 5vw, 78px); }
  .highlight-body > span { font-size: 16px; line-height: 1.65; }
  .dots button { width: 28px; height: 6px; }
  .dots button.active { width: 48px; }
  .display-footer { height: 58px; font-size: 13px; }
}

@media (max-height: 800px) and (min-width: 901px) {
  .display-header { height: 78px; }
  .brand img { width: auto; height: 52px; max-width: 180px; }
  .display-content { padding-top: 16px; padding-bottom: 16px; gap: 15px; }
  .intro h1 { font-size: clamp(34px, 3vw, 48px); }
  .intro-copy { display: none; }
  .metric-card { min-height: 96px; padding: 14px 18px; }
  .metric-icon { width: 46px; height: 46px; font-size: 26px; }
  .metric-card strong { font-size: 31px; }
  .metric-card p { font-size: 14px; }
  .metric-card span { font-size: 11px; }
  .panel { padding: 18px 22px; }
  .goals-grid { margin-top: 14px; gap: 11px 28px; }
  .goal-row img { width: 44px; height: 44px; }
  .goal-info > div:first-child { font-size: 13px; }
  .highlight-icon { width: 48px; height: 48px; font-size: 27px; }
  .highlight-body p { margin-top: 12px; }
  .highlight-body strong { font-size: 48px; }
  .highlight-body > span { font-size: 13px; }
  .display-footer { height: 40px; font-size: 11px; }
}

.header-actions { gap: 28px; }
.weather { display: flex; align-items: center; gap: 15px; padding-right: 28px; border-right: 1px solid rgba(255, 255, 255, .16); }
.weather-icon { color: #c8f36d; font-size: 46px; }
.weather-copy { display: flex; min-width: 132px; flex-direction: column; }
.weather-copy strong { font-size: 40px; font-weight: 800; line-height: .95; }
.weather-copy span { max-width: 170px; margin-top: 7px; overflow: hidden; color: #afc6b6; font-size: 12px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.clock strong { font-size: 52px; font-weight: 800; letter-spacing: -.04em; line-height: .9; }
.clock span { margin-top: 11px; font-size: 13px; font-weight: 600; letter-spacing: .14em; }

@media (min-width: 901px) {
  .display-header { height: 120px; }
}

@media (max-height: 800px) and (min-width: 901px) {
  .display-header { height: 100px; }
  .weather-icon { font-size: 38px; }
  .weather-copy strong { font-size: 34px; }
  .clock strong { font-size: 46px; }
}

@media (max-width: 900px) {
  .header-actions { gap: 9px; }
  .weather { gap: 8px; padding-right: 9px; }
  .weather-icon { font-size: 28px; }
  .weather-copy { min-width: auto; }
  .weather-copy strong { font-size: 25px; }
  .weather-copy span, .clock span { display: none; }
  .clock strong { font-size: 30px; }
}

.display-slide-enter-active, .display-slide-leave-active { transition: opacity .65s ease, transform .65s ease; }
.display-slide-enter-from { opacity: 0; transform: translateX(34px); }
.display-slide-leave-to { opacity: 0; transform: translateX(-34px); }
.feature-grid { display: grid; flex: 1; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.feature-card { position: relative; display: flex; min-height: 0; flex-direction: column; justify-content: center; overflow: hidden; padding: clamp(26px, 3vw, 48px); border: 1px solid rgba(255,255,255,.12); border-radius: 18px; background: linear-gradient(150deg, rgba(39,126,56,.4), rgba(255,255,255,.045)); }
.feature-card--2 { background: linear-gradient(150deg, rgba(39,105,126,.38), rgba(255,255,255,.045)); }
.feature-card--3 { background: linear-gradient(150deg, rgba(112,80,39,.42), rgba(255,255,255,.045)); }
.feature-card-top { display: flex; align-items: center; justify-content: space-between; }
.feature-icon { display: grid; width: 64px; height: 64px; place-items: center; border-radius: 16px; background: #b8e85c; color: #14381c; font-size: 34px; }
.feature-tag { color: #b8d0bf; font-size: 14px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
.feature-card > strong { margin-top: clamp(24px, 4vh, 46px); color: #cdf476; font-size: clamp(58px, 5.5vw, 92px); font-weight: 800; letter-spacing: -.05em; line-height: .95; }
.feature-card h2 { max-width: 430px; margin-top: 18px; font-size: clamp(23px, 1.8vw, 32px); font-weight: 750; line-height: 1.18; }
.feature-card p { max-width: 430px; margin-top: 12px; color: #aec4b5; font-size: 16px; line-height: 1.6; }
.feature-line { position: absolute; right: 0; bottom: 0; left: 0; height: 6px; background: #a3e635; }
.message-panel { display: flex; align-items: center; gap: 20px; padding: 20px 28px; border: 1px solid rgba(255,255,255,.1); border-radius: 14px; background: rgba(255,255,255,.045); }
.message-panel .q-icon { color: #a3e635; font-size: 36px; }
.message-panel p { font-size: clamp(16px, 1.25vw, 21px); font-weight: 600; line-height: 1.5; }
.actions-layout { display: grid; min-height: 0; flex: 1; grid-template-columns: minmax(0,1.35fr) minmax(360px,.75fr); gap: 20px; }
.actions-list { display: grid; min-height: 0; gap: 14px; }
.action-card { display: grid; align-items: center; grid-template-columns: 72px minmax(0,1fr) auto; gap: 22px; padding: 22px 26px; border: 1px solid rgba(255,255,255,.11); border-radius: 15px; background: rgba(255,255,255,.055); }
.action-icon { display: grid; width: 66px; height: 66px; place-items: center; border-radius: 16px; background: rgba(163,230,53,.14); color: #b9ed59; font-size: 34px; }
.action-card div > span { color: #a3e635; font-size: 12px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.action-card h2 { margin-top: 5px; font-size: clamp(20px, 1.6vw, 29px); font-weight: 750; }
.action-card p { margin-top: 7px; color: #a9c0b0; font-size: 14px; line-height: 1.5; }
.action-card > strong { padding: 9px 13px; border: 1px solid rgba(163,230,53,.24); border-radius: 999px; color: #c9f477; font-size: 15px; white-space: nowrap; }
.ods-wall { display: flex; flex-direction: column; }
.ods-wall-grid { display: grid; flex: 1; align-content: center; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 16px; margin-top: 18px; }
.ods-wall-grid > div { display: flex; align-items: center; gap: 12px; min-width: 0; }
.ods-wall-grid img { width: clamp(58px, 5vw, 82px); height: clamp(58px, 5vw, 82px); border-radius: 9px; }
.ods-wall-grid span { color: #c2d3c7; font-size: 13px; font-weight: 650; }
.carousel-nav { display: flex; align-items: center; gap: 8px; }
.slide-indicator { position: relative; width: 48px; height: 9px; overflow: hidden; border: 0; border-radius: 99px; background: rgba(255,255,255,.22); cursor: pointer; }
.slide-indicator:hover, .slide-indicator:focus-visible { background: rgba(255,255,255,.38); outline: 2px solid rgba(163,230,53,.45); outline-offset: 3px; }
.slide-indicator.active { width: 82px; background: rgba(163,230,53,.22); }
.slide-indicator > i { position: absolute; inset: 0 auto 0 0; width: 100%; border-radius: inherit; background: #a3e635; animation: carousel-progress var(--carousel-duration) linear; }
.carousel-control { display: grid; width: 32px; height: 32px; place-items: center; border: 1px solid rgba(255,255,255,.22); border-radius: 50%; background: rgba(255,255,255,.04); color: #d4e3d8; cursor: pointer; }
.carousel-control:hover, .carousel-control:focus-visible { border-color: #a3e635; background: rgba(163,230,53,.14); color: #c9f477; outline: none; }
.pause-button { margin-left: 4px; }
.next-button { color: #c9f477; }
@keyframes carousel-progress { from { width: 0; } to { width: 100%; } }

@media (max-height: 800px) and (min-width: 901px) {
  .feature-card { padding: 24px 30px; }
  .feature-icon { width: 48px; height: 48px; font-size: 27px; }
  .feature-card > strong { margin-top: 16px; font-size: 52px; }
  .feature-card h2 { margin-top: 10px; font-size: 21px; }
  .feature-card p { margin-top: 7px; font-size: 13px; }
  .message-panel { padding: 12px 20px; }
  .action-card { grid-template-columns: 52px minmax(0,1fr) auto; gap: 16px; padding: 13px 18px; }
  .action-icon { width: 50px; height: 50px; font-size: 26px; }
  .action-card h2 { font-size: 19px; }
  .action-card p { font-size: 12px; }
  .ods-wall-grid { gap: 10px; }
}

@media (max-width: 900px) {
  .feature-grid, .actions-layout { grid-template-columns: 1fr; }
  .feature-card { min-height: 320px; }
  .action-card { grid-template-columns: 52px minmax(0,1fr); }
  .action-card > strong { display: none; }
  .display-footer > span:last-child { display: none; }
}

.goal-detail-hero { display: grid; align-items: center; grid-template-columns: auto minmax(0,1fr) auto; gap: clamp(24px,3vw,48px); }
.goal-detail-hero > img { width: clamp(112px,9vw,154px); height: clamp(112px,9vw,154px); border-radius: 16px; box-shadow: 0 18px 42px rgba(0,0,0,.28); }
.goal-detail-hero h1 { margin-top: 7px; font-size: clamp(34px,3.2vw,56px); font-weight: 800; line-height: 1.08; }
.goal-detail-hero > div > p:last-child { max-width: 850px; margin-top: 12px; color: #b3c8ba; font-size: clamp(15px,1.15vw,20px); line-height: 1.55; }
.goal-score-seal { display: flex; min-width: 210px; flex-direction: column; align-items: center; padding: 20px 28px; border: 1px solid rgba(163,230,53,.28); border-radius: 18px; background: rgba(163,230,53,.1); }
.goal-score-seal span { color: #bcd0c1; font-size: 11px; font-weight: 750; letter-spacing: .1em; text-transform: uppercase; }
.goal-score-seal strong { color: #c9f477; font-size: clamp(50px,4.4vw,72px); font-weight: 850; letter-spacing: -.05em; line-height: 1; }
.goal-score-seal small { color: #8ca394; font-size: 11px; }
.goal-explanation-grid { display: grid; min-height: 0; flex: 1; grid-template-columns: minmax(0,1.25fr) minmax(390px,.75fr); gap: 18px; }
.goal-reading, .goal-dimensions { display: flex; flex-direction: column; }
.favorable-badge { display: flex; align-items: center; gap: 7px; padding: 8px 12px; border-radius: 999px; background: rgba(113,204,91,.14); color: #bdeaaa!important; font-size: 12px!important; letter-spacing: 0!important; text-transform: none!important; white-space: nowrap; }
.goal-reading-copy { max-width: 850px; margin-top: clamp(18px,2.5vh,30px); color: #c1d0c5; font-size: clamp(16px,1.25vw,20px); line-height: 1.7; }
.score-scale { margin-top: auto; padding-top: 34px; }
.score-scale-labels { display: grid; grid-template-columns: 40px 1fr 1fr 1fr 40px; color: #90a598; font-size: 11px; font-weight: 700; text-align: center; }
.score-scale-labels span:first-child { text-align: left; }.score-scale-labels span:last-child { text-align: right; }
.score-scale-track { position: relative; display: grid; height: 18px; grid-template-columns: 5fr 1fr 4fr; margin-top: 10px; border-radius: 99px; }
.score-scale-track > i:first-child { border-radius: 99px 0 0 99px; }.score-scale-track > i:nth-child(3) { border-radius: 0 99px 99px 0; }
.scale-alert { background: #d65353; }.scale-attention { background: #e5ad38; }.scale-good { background: #71cc5b; }
.score-scale-track > strong { position: absolute; top: 50%; width: 4px; height: 34px; border-radius: 3px; background: #fff; box-shadow: 0 3px 10px rgba(0,0,0,.4); transform: translate(-50%,-50%); }
.score-scale-track > strong span { position: absolute; bottom: 38px; left: 50%; padding: 5px 8px; border-radius: 6px; background: #fff; color: #15351e; font-size: 12px; transform: translateX(-50%); }
.dimension-list { display: grid; flex: 1; align-content: center; gap: 16px; margin-top: 16px; }
.dimension-list > div { display: grid; align-items: center; grid-template-columns: 48px minmax(0,1fr); gap: 14px; }
.dimension-list > div > span { display: grid; width: 46px; height: 46px; place-items: center; border-radius: 12px; background: rgba(38,189,226,.14); color: #79ddf5; font-size: 24px; }
.dimension-list strong { font-size: 15px; }.dimension-list p { margin-top: 3px; color: #94aa9b; font-size: 12px; line-height: 1.45; }
.goal-context-note { display: flex; align-items: center; gap: 15px; padding: 14px 20px; border: 1px solid rgba(255,255,255,.1); border-radius: 12px; background: rgba(255,255,255,.045); }
.goal-context-note > .q-icon { color: #a3e635; font-size: 26px; }.goal-context-note p { flex: 1; color: #b9cbbf; font-size: 13px; line-height: 1.5; }.goal-context-note p strong { color: #e4ede7; }.goal-context-note > span { color: #809687; font-size: 10px; white-space: nowrap; }

@media (max-height: 800px) and (min-width: 901px) {
  .goal-detail-hero > img { width: 86px; height: 86px; }
  .goal-detail-hero h1 { font-size: 35px; }
  .goal-detail-hero > div > p:last-child { margin-top: 6px; font-size: 14px; }
  .goal-score-seal { min-width: 170px; padding: 12px 20px; }
  .goal-score-seal strong { font-size: 45px; }
  .goal-reading-copy { margin-top: 12px; font-size: 14px; }
  .score-scale { padding-top: 20px; }
  .dimension-list { gap: 9px; }
  .dimension-list > div { grid-template-columns: 39px minmax(0,1fr); gap: 10px; }
  .dimension-list > div > span { width: 38px; height: 38px; font-size: 20px; }
  .goal-context-note { padding: 9px 15px; }
}

@media (max-width: 900px) {
  .goal-detail-hero { grid-template-columns: 80px minmax(0,1fr); }
  .goal-detail-hero > img { width: 80px; height: 80px; }
  .goal-score-seal { grid-column: 1/-1; }
  .goal-explanation-grid { grid-template-columns: 1fr; }
  .goal-context-note > span { display: none; }
}

.news-layout { display: grid; min-height: 0; flex: 1 1 0; overflow: hidden; grid-template-columns: minmax(0,1.35fr) minmax(420px,.8fr); gap: 20px; }
.news-featured { display: grid; min-height: 0; height: 100%; overflow: hidden; border: 1px solid rgba(255,255,255,.12); border-radius: 18px; background: rgba(255,255,255,.055); color: inherit; grid-template-rows: minmax(180px,55%) minmax(0,45%); text-decoration: none; }
.news-featured-image { position: relative; min-height: 0; max-height: 100%; overflow: hidden; background: linear-gradient(145deg,#194b2a,#0a2415); }
.news-featured-image img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: cover; }
.news-image-fallback { position: absolute; inset: 0; display: grid; place-items: center; color: rgba(255,255,255,.12); font-size: 110px; }
.news-image-overlay { position: absolute; z-index: 2; inset: 0; background: linear-gradient(to top,rgba(3,18,10,.65),transparent 55%); }
.news-category { position: absolute; z-index: 3; bottom: 18px; left: 22px; padding: 8px 13px; border-radius: 999px; background: #a3e635; color: #15351e; font-size: 12px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
.news-featured-copy { min-height: 0; overflow: hidden; padding: clamp(18px,1.8vw,27px); }
.news-featured-copy > span { display: flex; align-items: center; gap: 7px; color: #9db3a4; font-size: 12px; font-weight: 650; }
.news-featured-copy h2 { display: -webkit-box; max-width: 900px; margin-top: 9px; overflow: hidden; font-size: clamp(22px,1.8vw,31px); font-weight: 780; line-height: 1.18; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
.news-featured-copy p { display: -webkit-box; margin-top: 8px; overflow: hidden; color: #9eb3a5; font-size: 13px; line-height: 1.45; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.news-featured-copy > strong { display: flex; align-items: center; gap: 7px; margin-top: 13px; color: #c8f36d; font-size: 12px; }
.news-list { display: grid; min-height: 0; height: 100%; overflow: hidden; grid-template-rows: repeat(3,minmax(0,1fr)); gap: 14px; }
.news-card { display: grid; align-items: center; min-height: 0; overflow: hidden; grid-template-columns: 155px minmax(0,1fr); gap: 18px; padding: 13px; border: 1px solid rgba(255,255,255,.1); border-radius: 15px; background: rgba(255,255,255,.05); color: inherit; text-decoration: none; }
.news-card-image { position: relative; display: grid; width: 100%; height: 100%; min-height: 100px; overflow: hidden; place-items: center; border-radius: 10px; background: rgba(163,230,53,.1); color: rgba(200,243,109,.3); font-size: 35px; }
.news-card-image img { position: absolute; z-index: 1; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.news-card span { color: #a3e635; font-size: 10px; font-weight: 750; letter-spacing: .06em; text-transform: uppercase; }
.news-card span i { display: inline-block; width: 3px; height: 3px; margin: 0 5px 2px; border-radius: 50%; background: #6f8977; }
.news-card h3 { display: -webkit-box; margin-top: 8px; overflow: hidden; font-size: clamp(15px,1.15vw,20px); font-weight: 720; line-height: 1.32; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
.news-featured:hover,.news-card:hover { border-color: rgba(163,230,53,.35); background: rgba(255,255,255,.08); }
.news-empty { display: grid; flex: 1; place-content: center; text-align: center; }.news-empty .q-icon { margin: auto; color: #a3e635; font-size: 60px; }.news-empty h2 { margin-top: 18px; font-size: 30px; }.news-empty p { margin-top: 8px; color: #9db3a4; }

@media (max-height: 800px) and (min-width: 901px) {
  .news-layout { grid-template-columns: minmax(0,1.25fr) minmax(390px,.85fr); }
  .news-featured { grid-template-rows: minmax(140px,54%) minmax(0,46%); }
  .news-featured-copy { padding: 13px 19px; }
  .news-featured-copy h2 { margin-top: 5px; font-size: 20px; -webkit-line-clamp: 2; }
  .news-featured-copy p { display: none; }
  .news-featured-copy > strong { margin-top: 7px; }
  .news-card { grid-template-columns: 125px minmax(0,1fr); gap: 13px; padding: 9px; }
  .news-card-image { min-height: 75px; }
  .news-card h3 { margin-top: 5px; font-size: 15px; -webkit-line-clamp: 2; }
}

@media (max-width: 900px) {
  .news-layout { grid-template-columns: 1fr; }
  .news-featured { min-height: 520px; }
  .news-card { grid-template-columns: 110px minmax(0,1fr); }
}

/* Superfície de exibição: mantém todo o painel dentro do viewport em qualquer proporção. */
.display-viewport {
  position: fixed;
  z-index: 0;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: #03120a;
  color-scheme: dark;
}

.display-page {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 0;
  min-height: 0;
  max-width: none;
  max-height: none;
  overflow: hidden;
  transform-origin: center;
  will-change: transform;
  transition: background-color 220ms ease, color 220ms ease;
}

.display-page,
.display-page * {
  box-sizing: border-box;
}

.display-header,
.display-footer {
  flex: 0 0 auto;
}

.display-content,
.display-content > section,
.display-content > aside {
  min-width: 0;
}

.display-content {
  min-height: 0;
  overflow: hidden;
}

.header-control {
  color: #fff !important;
}

.header-control:focus-visible {
  outline: 2px solid #a3e635;
  outline-offset: 2px;
}

/* Canvas canônico 1920x1080. Estas regras anulam breakpoints do viewport físico:
   o layout nunca reflui; somente o canvas completo é redimensionado. */
.display-header { height: 120px; min-height: 0; padding: 0 72px; }
.brand img { width: auto; height: 66px; max-width: 220px; }
.header-actions { gap: 28px; }
.weather { gap: 15px; padding-right: 28px; }
.weather-icon { font-size: 46px; }
.weather-copy { min-width: 132px; }
.weather-copy strong { font-size: 40px; }
.weather-copy span { display: block; font-size: 12px; }
.clock strong { font-size: 52px; }
.clock span { display: block; font-size: 13px; }
.display-content { padding: 32px 72px; gap: 28px; }
.intro { align-items: end; }
.eyebrow,
.panel-heading span,
.highlight-top span { font-size: 14px; }
.intro h1 { font-size: 52px; }
.intro-copy { display: block; font-size: 18px; line-height: 1.45; }
.city-badge { display: flex; padding: 11px 17px; font-size: 15px; }
.metric-grid { grid-template-columns: repeat(4, 1fr); gap: 15px; }
.metric-card { min-height: 132px; gap: 20px; padding: 22px 24px; }
.metric-icon { width: 58px; height: 58px; font-size: 31px; }
.metric-card strong { font-size: 46px; }
.metric-card p { margin-top: 7px; font-size: 16px; }
.metric-card span { font-size: 13px; }
.dashboard-grid { grid-template-columns: minmax(0,1.8fr) minmax(300px,.8fr); gap: 16px; }
.panel { padding: 34px; }
.panel-heading h2 { font-size: 30px; }
.legend { gap: 8px; font-size: 13px; }
.legend i { width: 10px; height: 10px; }
.goals-grid { grid-template-columns: repeat(2,1fr); gap: 20px 40px; margin-top: 30px; }
.goal-row { gap: 16px; }
.goal-row img { width: 58px; height: 58px; }
.goal-info > div:first-child { font-size: 15px; }
.progress-track { height: 9px; margin-top: 10px; }
.progress-panel .panel-heading > div > span,
.ods-wall .panel-heading > div > span { font-size: 18px; }
.progress-panel .panel-heading h2,
.ods-wall .panel-heading h2 { font-size: 34px; }
.progress-panel .legend { font-size: 16px; }
.progress-panel .legend i { width: 12px; height: 12px; }
.progress-panel .goals-grid { gap: 24px 44px; margin-top: 32px; }
.progress-panel .goal-row { gap: 18px; }
.progress-panel .goal-row img { width: 70px; height: 70px; }
.progress-panel .goal-info > div:first-child { font-size: 18px; }
.progress-panel .progress-track { height: 11px; margin-top: 12px; }
.highlight-icon { width: 64px; height: 64px; font-size: 34px; }
.highlight-body p { margin-top: 20px; font-size: 13px; }
.highlight-body h2 { font-size: 32px; }
.highlight-body strong { font-size: 72px; }
.highlight-body > span { font-size: 16px; line-height: 1.65; }
.dots button { width: 28px; height: 6px; }
.dots button.active { width: 48px; }
.feature-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
.feature-card { min-height: 0; padding: 42px; }
.feature-icon { width: 64px; height: 64px; font-size: 34px; }
.feature-tag { font-size: 14px; }
.feature-card > strong { margin-top: 36px; font-size: 78px; }
.feature-card h2 { margin-top: 18px; font-size: 30px; }
.feature-card p { display: block; margin-top: 12px; font-size: 16px; line-height: 1.6; }
.message-panel { padding: 20px 28px; }
.message-panel p { font-size: 21px; }
.actions-layout { grid-template-columns: minmax(0,1.35fr) minmax(360px,.75fr); gap: 20px; }
.actions-list { gap: 14px; }
.action-card { grid-template-columns: 72px minmax(0,1fr) auto; gap: 22px; padding: 22px 26px; }
.action-icon { width: 66px; height: 66px; font-size: 34px; }
.action-card h2 { font-size: 29px; }
.action-card p { display: block; font-size: 14px; }
.action-card > strong { display: block; }
.ods-wall-grid { gap: 18px 24px; margin-top: 24px; }
.ods-wall-grid > div { gap: 16px; }
.ods-wall-grid img { width: 100px; height: 100px; }
.ods-wall-grid span { font-size: 18px; font-weight: 750; line-height: 1.35; }
.display-footer { height: 58px; padding: 0 72px; font-size: 13px; }
.display-footer > span:last-child { display: flex; }
.goal-detail-hero { grid-template-columns: auto minmax(0,1fr) auto; gap: 48px; }
.goal-detail-hero > img { width: 154px; height: 154px; }
.goal-detail-hero h1 { font-size: 52px; }
.goal-detail-hero > div > p:last-child { margin-top: 12px; font-size: 18px; }
.goal-score-seal { min-width: 210px; grid-column: auto; padding: 20px 28px; }
.goal-score-seal strong { font-size: 72px; }
.goal-explanation-grid { grid-template-columns: minmax(0,1.25fr) minmax(390px,.75fr); gap: 18px; }
.goal-reading-copy { margin-top: 26px; font-size: 18px; }
.score-scale { padding-top: 34px; }
.dimension-list { gap: 16px; }
.dimension-list > div { grid-template-columns: 48px minmax(0,1fr); gap: 14px; }
.dimension-list > div > span { width: 46px; height: 46px; font-size: 24px; }
.goal-context-note { padding: 14px 20px; }
.goal-context-note > span { display: block; }
.news-layout { grid-template-columns: minmax(0,1.35fr) minmax(420px,.8fr); gap: 20px; }
.news-featured { min-height: 0; grid-template-rows: minmax(180px,55%) minmax(0,45%); }
.news-featured-copy { padding: 27px; }
.news-featured-copy h2 { margin-top: 9px; font-size: 31px; -webkit-line-clamp: 3; }
.news-featured-copy p { display: -webkit-box; margin-top: 8px; font-size: 13px; line-height: 1.45; -webkit-line-clamp: 2; }
.news-featured-copy > strong { margin-top: 13px; }
.news-list { gap: 14px; }
.news-card { grid-template-columns: 155px minmax(0,1fr); gap: 18px; padding: 13px; }
.news-card-image { min-height: 100px; }
.news-card h3 { margin-top: 8px; font-size: 20px; -webkit-line-clamp: 3; }

/* Tema claro */
.display-viewport.theme-light {
  background: #dce8de;
  color-scheme: light;
}

.theme-light .display-page {
  background: radial-gradient(circle at 80% 0,rgba(87,180,91,.16),transparent 32%),#edf4ee;
  color: #14241a;
}

.theme-light .display-header {
  border-bottom-color: rgba(24,67,39,.15);
  background: rgba(247,251,247,.9);
}

.theme-light .brand {
  padding: 5px 12px;
  border-radius: 12px;
  background: #082719;
  box-shadow: 0 8px 22px rgba(14,55,31,.14);
}

.theme-light .header-control { color: #214b2e !important; }
.theme-light .weather { border-right-color: rgba(24,67,39,.18); }
.theme-light .weather-icon,
.theme-light .eyebrow,
.theme-light .panel-heading span,
.theme-light .highlight-top span,
.theme-light .news-card span,
.theme-light .action-card div > span { color: #357d20; }
.theme-light .weather-copy span,
.theme-light .clock span,
.theme-light .intro-copy,
.theme-light .metric-card span,
.theme-light .legend,
.theme-light .highlight-body > span,
.theme-light .feature-tag,
.theme-light .feature-card p,
.theme-light .action-card p,
.theme-light .ods-wall-grid span,
.theme-light .goal-detail-hero > div > p:last-child,
.theme-light .goal-reading-copy,
.theme-light .dimension-list p,
.theme-light .news-featured-copy > span,
.theme-light .news-featured-copy p,
.theme-light .news-empty p { color: #526b59; }

.theme-light .city-badge,
.theme-light .metric-card,
.theme-light .panel,
.theme-light .feature-card,
.theme-light .message-panel,
.theme-light .action-card,
.theme-light .goal-context-note,
.theme-light .news-featured,
.theme-light .news-card {
  border-color: rgba(25,78,42,.15);
  background: rgba(255,255,255,.72);
  box-shadow: 0 14px 34px rgba(40,74,49,.08);
}

.theme-light .metric-card {
  background: linear-gradient(145deg,rgba(255,255,255,.96),rgba(230,240,232,.82));
}
.theme-light .metric-icon,
.theme-light .action-icon { background: rgba(64,133,39,.12); color: #397c25; }
.theme-light .city-badge { color: #365943; }
.theme-light .goal-info span { color: #294936; }
.theme-light .goal-info strong { color: #14241a; }
.theme-light .progress-track { background: rgba(28,70,41,.12); }
.theme-light .highlight-panel { background: linear-gradient(155deg,rgba(180,221,180,.8),rgba(255,255,255,.82)); }
.theme-light .highlight-icon,
.theme-light .feature-icon { background: #4e8d31; color: #fff; }
.theme-light .highlight-body p,
.theme-light .highlight-body strong,
.theme-light .feature-card > strong,
.theme-light .action-card > strong,
.theme-light .news-featured-copy > strong { color: #347820; }
.theme-light .feature-card--2 { background: linear-gradient(150deg,rgba(199,225,229,.8),rgba(255,255,255,.8)); }
.theme-light .feature-card--3 { background: linear-gradient(150deg,rgba(235,221,191,.76),rgba(255,255,255,.82)); }
.theme-light .message-panel .q-icon,
.theme-light .news-empty .q-icon { color: #357d20; }
.theme-light .ods-wall { background: rgba(255,255,255,.78); }
.theme-light .favorable-badge { background: rgba(64,133,39,.12); color: #32731f!important; }
.theme-light .goal-score-seal { border-color: rgba(64,133,39,.28); background: rgba(92,154,67,.1); }
.theme-light .goal-score-seal span,
.theme-light .goal-score-seal small { color: #526b59; }
.theme-light .goal-score-seal strong { color: #347820; }
.theme-light .dimension-list > div > span { background: rgba(25,126,153,.11); color: #17758d; }
.theme-light .goal-context-note > .q-icon { color: #357d20; }
.theme-light .goal-context-note p { color: #486150; }
.theme-light .goal-context-note p strong { color: #1d3324; }
.theme-light .goal-context-note > span { color: #687d6d; }
.theme-light .news-featured-image { background: linear-gradient(145deg,#bcd7c2,#e6efe8); }
.theme-light .news-image-fallback { color: rgba(32,80,45,.2); }
.theme-light .news-card-image { background: rgba(64,133,39,.1); color: rgba(52,120,32,.42); }
.theme-light .news-featured:hover,
.theme-light .news-card:hover { border-color: rgba(53,125,32,.34); background: rgba(255,255,255,.92); }
.theme-light .display-footer { border-top-color: rgba(24,67,39,.14); color: #58705f; }
.theme-light .slide-indicator { background: rgba(30,73,43,.2); }
.theme-light .slide-indicator:hover,
.theme-light .slide-indicator:focus-visible { background: rgba(30,73,43,.34); }
.theme-light .slide-indicator.active { background: rgba(69,133,45,.22); }
.theme-light .slide-indicator > i { background: #4b8b30; }
.theme-light .carousel-control { border-color: rgba(28,74,41,.24); background: rgba(255,255,255,.54); color: #355840; }
.theme-light .carousel-control:hover,
.theme-light .carousel-control:focus-visible { border-color: #4b8b30; background: rgba(75,139,48,.12); color: #347820; }
</style>
