<template>
  <q-page class="min-h-screen bg-[#eef2ee] px-4 py-6 sm:px-6">
    <main class="mx-auto max-w-[1320px]">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <q-btn flat color="green-9" icon="arrow_back" label="Voltar para a triagem" no-caps :to="{ name: 'admin', query: { section: 'triagem' } }" />
        <span v-if="news" class="vc-admin-status" :class="`vc-triage-status--${news.triageStatus.toLowerCase()}`">
          {{ statusLabels[news.triageStatus] }}
        </span>
      </div>

      <div v-if="loading" class="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <q-skeleton v-for="index in 2" :key="index" type="rect" height="520px" class="rounded-md" />
      </div>

      <div v-else-if="news" class="grid items-start gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <aside class="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm lg:sticky lg:top-20">
          <div class="relative h-64 bg-emerald-950">
            <q-icon name="newspaper" class="absolute inset-0 m-auto h-fit w-fit text-7xl text-white/15" />
            <img v-if="news.imageUrl" :src="news.imageUrl" :alt="news.title" class="relative h-full w-full object-cover" />
          </div>
          <div class="p-5">
            <div class="flex flex-wrap items-center gap-2">
              <span class="vc-admin-code">{{ news.category }}</span>
              <span v-for="goalId in news.goalIds" :key="goalId" class="vc-admin-status">ODS {{ goalId }}</span>
            </div>
            <h1 class="vc-triage-news-title">{{ news.title }}</h1>
            <p v-if="news.excerpt" class="vc-triage-news-excerpt">{{ news.excerpt }}</p>

            <div v-if="news.classificationReason" class="mt-5 rounded-md border border-emerald-100 bg-emerald-50 p-4">
              <p class="text-xs font-bold uppercase tracking-wide text-emerald-800">Justificativa da classificação</p>
              <p class="mt-2 text-sm leading-6 text-emerald-950">{{ news.classificationReason }}</p>
            </div>

            <div class="mt-5 border-t border-slate-100 pt-4 text-xs leading-6 text-slate-500">
              <p><strong>Fonte:</strong> {{ news.source }}</p>
              <p><strong>Publicação:</strong> {{ news.publishedLabel || formatDate(news.publishedAt) }}</p>
            </div>
            <q-btn class="mt-4" outline color="green-9" icon-right="open_in_new" label="Abrir notícia original" no-caps :href="news.url" target="_blank" />
          </div>
        </aside>

        <section class="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div class="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-[#1d6d13]">Registro institucional</p>
              <h2 class="vc-triage-form-title">Computar como ação contribuinte</h2>
              <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Confirme que a iniciativa produz contribuição concreta e mensurável para o ODS selecionado antes de incorporá-la ao observatório.
              </p>
            </div>
            <q-icon name="add_task" size="30px" class="text-green-9" />
          </div>

          <div v-if="news.action" class="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-5">
            <div class="flex items-start gap-3">
              <q-icon name="task_alt" size="26px" class="text-emerald-700" />
              <div>
                <p class="font-bold text-emerald-950">Esta notícia já originou uma ação</p>
                <p class="mt-1 text-sm text-emerald-900">{{ news.action.name }}</p>
                <p class="mt-2 text-xs text-emerald-800">ODS {{ news.action.goalId }} · {{ news.action.department.name }} · {{ actionWeightLabel(news.action.weight) }}</p>
              </div>
            </div>
          </div>

          <template v-else>
            <div class="mt-5 grid gap-4 md:grid-cols-2">
              <q-input v-model="form.name" outlined label="Nome institucional da ação" class="md:col-span-2" />
              <q-select v-model="form.departmentId" :options="departmentOptions" emit-value map-options outlined label="Secretaria responsável" />
              <q-select
                v-model="form.goalIds"
                :options="goalOptions"
                :option-disable="isGoalOptionDisabled"
                emit-value
                map-options
                multiple
                use-chips
                outlined
                label="ODS relacionados (até 3)"
                hint="O primeiro será considerado o ODS principal da ação."
              />
              <q-select
                v-model="form.indicatorIds"
                :options="indicatorOptions"
                class="md:col-span-2"
                emit-value
                map-options
                multiple
                use-chips
                outlined
                label="Indicadores que a ação pretende influenciar"
                hint="A evolução será medida pelos lançamentos destes indicadores."
              />
              <div v-if="selectedIndicators.length" class="vc-action-influence-editor md:col-span-2">
                <div
                  v-for="indicator in selectedIndicators"
                  :key="indicator.id"
                  class="vc-action-influence-row"
                >
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-slate-950">{{ indicator.name }}</p>
                    <p class="mt-1 text-xs text-slate-500">ODS {{ indicator.goalId }} · {{ polarityLabels[indicator.polarity] }}</p>
                  </div>
                  <div class="vc-action-influence-controls">
                    <q-select
                      :model-value="form.indicatorEffects[indicator.id]"
                      :options="expectedEffectOptions"
                      emit-value
                      map-options
                      outlined
                      dense
                      label="Efeito esperado"
                      @update:model-value="setIndicatorEffect(indicator.id, $event)"
                    />
                    <q-input
                      v-if="requiresNewIndicatorValue(form.indicatorEffects[indicator.id])"
                      v-model="form.indicatorValues[indicator.id]"
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
              <div class="rounded-md border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                <q-select
                  v-model="form.weight"
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
              </div>
              <q-input v-model="form.description" outlined type="textarea" autogrow label="Descrição e contribuição municipal" class="md:col-span-2" />
            </div>

            <div class="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              <q-icon name="policy" class="mr-1" />
              A notícia é uma evidência de origem. Revise o texto para que a ação descreva a iniciativa pública, e não apenas o fato jornalístico.
            </div>

            <div class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <q-btn flat color="grey-7" icon="block" label="Não é uma ação" no-caps :loading="saving" @click="dismissNews" />
              <div class="flex flex-wrap gap-2">
                <q-btn outline color="green-9" icon="drafts" label="Salvar como rascunho" no-caps :loading="saving" @click="convertNews('DRAFT')" />
                <q-btn color="green-9" icon="task_alt" label="Publicar e computar" no-caps :loading="saving" @click="convertNews('PUBLISHED')" />
              </div>
            </div>
          </template>
        </section>
      </div>

      <div v-else class="rounded-md border border-red-200 bg-white p-10 text-center">
        <q-icon name="error_outline" size="42px" class="text-red-700" />
        <p class="mt-3 font-bold text-slate-950">Não foi possível localizar esta notícia.</p>
      </div>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth-store';

type TriageStatus = 'PENDING' | 'CONVERTED' | 'DISMISSED';
interface Department { id: string; name: string }
interface Goal { id: number; title: string }
interface Indicator { id: string; name: string; unit: string; goalId: number; polarity: 'HIGHER_IS_BETTER' | 'LOWER_IS_BETTER' | 'CONTEXTUAL' }
interface TriageNews {
  id: string; title: string; url: string; imageUrl?: string | null; category: string;
  excerpt?: string | null; publishedAt?: string | null; publishedLabel?: string | null;
  source: string; primaryGoalId?: number | null; goalIds: number[];
  classificationReason?: string | null; triageStatus: TriageStatus;
  action?: { id: string; name: string; weight: number; goalId: number; department: Department } | null;
}

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const $q = useQuasar();
const loading = ref(true);
const saving = ref(false);
const news = ref<TriageNews | null>(null);
const departmentOptions = ref<{ label: string; value: string }[]>([]);
const goalOptions = ref<{ label: string; value: number }[]>([]);
const indicators = ref<Indicator[]>([]);
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
const polarityLabels = { HIGHER_IS_BETTER: 'Quanto maior, melhor', LOWER_IS_BETTER: 'Quanto menor, melhor', CONTEXTUAL: 'Contextual' };
const statusLabels: Record<TriageStatus, string> = { PENDING: 'Aguardando análise', CONVERTED: 'Convertida em ação', DISMISSED: 'Não aplicável' };
type ExpectedIndicatorEffect = 'INCREASE' | 'DECREASE' | 'MAINTAIN';
const form = reactive({
  name: '',
  description: '',
  departmentId: '',
  goalIds: [] as number[],
  weight: 3,
  indicatorIds: [] as string[],
  indicatorEffects: {} as Record<string, ExpectedIndicatorEffect>,
  indicatorValues: {} as Record<string, string>,
});
const indicatorOptions = computed(() => indicators.value
  .filter((indicator) => form.goalIds.includes(indicator.goalId))
  .map((indicator) => ({ label: `ODS ${indicator.goalId} · ${indicator.name}`, value: indicator.id })));
const selectedIndicators = computed(() => form.indicatorIds.flatMap((id) => {
  const indicator = indicators.value.find((item) => item.id === id);
  return indicator ? [indicator] : [];
}));
const selectedActionWeight = computed(() =>
  actionWeightOptions.find((option) => option.value === form.weight) ?? actionWeightOptions[2]!,
);

function actionWeightLabel(weight: number) {
  return actionWeightOptions.find((option) => option.value === weight)?.label ?? `${weight} de 5`;
}

function formatDate(value?: string | null) {
  return value ? new Intl.DateTimeFormat('pt-BR').format(new Date(value)) : 'Data não informada';
}

function validateForm(requireIndicator = false) {
  if (!form.name.trim() || !form.description.trim() || !form.departmentId || !form.goalIds.length) {
    $q.notify({ type: 'warning', message: 'Preencha nome, descrição, secretaria e selecione ao menos um ODS.' });
    return false;
  }
  if (requireIndicator && !form.indicatorIds.length) {
    $q.notify({ type: 'warning', message: 'Relacione ao menos um indicador antes de publicar a ação.' });
    return false;
  }
  const invalidValueIndicator = selectedIndicators.value.find((indicator) => {
    const effect = form.indicatorEffects[indicator.id] ?? defaultExpectedEffect(indicator.polarity);
    if (!requiresNewIndicatorValue(effect)) return false;
    const rawValue = form.indicatorValues[indicator.id]?.trim() ?? '';
    return (requireIndicator && !rawValue) || (Boolean(rawValue) && !Number.isFinite(parseLocalizedNumber(rawValue)));
  });
  if (invalidValueIndicator) {
    $q.notify({
      type: 'warning',
      message: `Informe um novo valor válido para o indicador “${invalidValueIndicator.name}”.`,
    });
    return false;
  }
  return true;
}

function defaultExpectedEffect(polarity?: Indicator['polarity']) {
  if (polarity === 'LOWER_IS_BETTER') return 'DECREASE' as const;
  if (polarity === 'CONTEXTUAL') return 'MAINTAIN' as const;
  return 'INCREASE' as const;
}

function requiresNewIndicatorValue(effect?: ExpectedIndicatorEffect) {
  return effect === 'INCREASE' || effect === 'DECREASE';
}

function setIndicatorEffect(indicatorId: string, effect: ExpectedIndicatorEffect | null) {
  if (!effect) return;
  form.indicatorEffects[indicatorId] = effect;
  if (!requiresNewIndicatorValue(effect)) delete form.indicatorValues[indicatorId];
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

function isGoalOptionDisabled(option: { value: number }) {
  return form.goalIds.length >= 3 && !form.goalIds.includes(option.value);
}

async function convertNews(status: 'DRAFT' | 'PUBLISHED') {
  if (!news.value || !validateForm(status === 'PUBLISHED')) return;
  saving.value = true;
  try {
    await auth.request(`/news/triage/${news.value.id}/action`, {
      method: 'POST',
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        departmentId: form.departmentId,
        goalIds: form.goalIds,
        goalId: form.goalIds[0],
        weight: form.weight,
        status,
        indicatorLinks: form.indicatorIds.map((indicatorId) => {
          const effect = form.indicatorEffects[indicatorId]
            ?? defaultExpectedEffect(indicators.value.find((item) => item.id === indicatorId)?.polarity);
          const rawValue = form.indicatorValues[indicatorId]?.trim() ?? '';
          return {
            indicatorId,
            expectedEffect: effect,
            newValue: requiresNewIndicatorValue(effect) && rawValue
              ? parseLocalizedNumber(rawValue)
              : undefined,
          };
        }),
      }),
    });
    $q.notify({ type: 'positive', message: status === 'PUBLISHED' ? 'Ação publicada e computada com sucesso.' : 'Ação salva como rascunho.' });
    await router.push({ name: 'admin', query: { section: 'triagem' } });
  } catch (error) {
    $q.notify({ type: 'negative', message: error instanceof Error ? error.message : 'Não foi possível converter a notícia.' });
  } finally { saving.value = false; }
}

async function dismissNews() {
  if (!news.value) return;
  saving.value = true;
  try {
    await auth.request(`/news/triage/${news.value.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'DISMISSED' }) });
    $q.notify({ type: 'positive', message: 'Notícia marcada como não aplicável.' });
    await router.push({ name: 'admin', query: { section: 'triagem' } });
  } catch (error) {
    $q.notify({ type: 'negative', message: error instanceof Error ? error.message : 'Não foi possível concluir a triagem.' });
  } finally { saving.value = false; }
}

onMounted(async () => {
  try {
    const [item, departments, goals, indicatorRows] = await Promise.all([
      auth.request<TriageNews>(`/news/triage/${String(route.params.id)}`),
      auth.request<Department[]>('/departments'),
      auth.request<Goal[]>('/goals'),
      auth.request<Indicator[]>('/indicators?status=PUBLISHED'),
    ]);
    news.value = item;
    departmentOptions.value = departments.map((department) => ({ label: department.name, value: department.id }));
    goalOptions.value = goals.map((goal) => ({ label: `ODS ${goal.id} - ${goal.title}`, value: goal.id }));
    indicators.value = indicatorRows;
    form.name = item.title;
    form.description = item.excerpt || item.classificationReason || `Iniciativa municipal registrada a partir da notícia “${item.title}”.`;
    form.goalIds = [...new Set([
      ...(item.primaryGoalId ? [item.primaryGoalId] : []),
      ...item.goalIds,
    ])].slice(0, 3);
    form.departmentId = departments[0]?.id || '';
  } catch (error) {
    $q.notify({ type: 'negative', message: error instanceof Error ? error.message : 'Falha ao carregar a notícia.' });
  } finally { loading.value = false; }
});

watch(() => [...form.goalIds], (goalIds) => {
  const validIds = new Set(indicators.value.filter((indicator) => goalIds.includes(indicator.goalId)).map((indicator) => indicator.id));
  form.indicatorIds = form.indicatorIds.filter((id) => validIds.has(id));
});

watch(() => [...form.indicatorIds], (ids) => {
  const activeIds = new Set(ids);
  for (const id of Object.keys(form.indicatorEffects)) {
    if (!activeIds.has(id)) delete form.indicatorEffects[id];
  }
  for (const id of Object.keys(form.indicatorValues)) {
    if (!activeIds.has(id)) delete form.indicatorValues[id];
  }
  for (const id of ids) {
    if (!form.indicatorEffects[id]) {
      form.indicatorEffects[id] = defaultExpectedEffect(indicators.value.find((item) => item.id === id)?.polarity);
    }
  }
});
</script>

<style scoped>
.vc-triage-news-title {
  display: -webkit-box;
  overflow: hidden;
  margin: 1rem 0 0;
  color: #101d17;
  font-size: clamp(1.35rem, 1.7vw, 1.75rem) !important;
  font-weight: 800 !important;
  line-height: 1.28 !important;
  letter-spacing: -0.015em;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.vc-triage-news-excerpt {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 1rem;
  color: #58666d;
  font-size: 0.9rem !important;
  line-height: 1.65 !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
}

.vc-triage-form-title {
  margin-top: 0.35rem;
  color: #101d17;
  font-size: clamp(1.45rem, 2vw, 2rem) !important;
  font-weight: 850 !important;
  line-height: 1.16 !important;
  letter-spacing: -0.02em;
}

@media (max-width: 1023px) {
  .vc-triage-news-title { -webkit-line-clamp: 5; }
}
</style>
