import { ref } from 'vue';

export const routeLoading = ref(true);

let startedAt = Date.now();
let finishTimer: ReturnType<typeof globalThis.setTimeout> | undefined;

export function startRouteLoading() {
  if (finishTimer) globalThis.clearTimeout(finishTimer);
  finishTimer = undefined;
  startedAt = Date.now();
  routeLoading.value = true;
}

export function finishRouteLoading() {
  const minimumVisibleTime = 280;
  const remainingTime = Math.max(0, minimumVisibleTime - (Date.now() - startedAt));
  if (finishTimer) globalThis.clearTimeout(finishTimer);
  finishTimer = globalThis.setTimeout(() => {
    routeLoading.value = false;
    finishTimer = undefined;
  }, remainingTime);
}
