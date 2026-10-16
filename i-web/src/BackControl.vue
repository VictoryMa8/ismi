<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue';

defineProps<{ href?: string; disabled?: boolean }>();
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    class="back-control"
    :href="href"
    :type="href ? undefined : 'button'"
    :disabled="href ? undefined : disabled"
  >
    <ArrowLeft :size="20" aria-hidden="true" />
    <span><slot /></span>
  </component>
</template>

<style scoped>
.back-control {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  align-self: flex-start;
  width: fit-content;
  min-width: 48px;
  min-height: 48px;
  max-width: 100%;
  padding: 11px 14px;
  border: 1px solid #678a77;
  border-radius: 12px;
  background: #fff;
  color: #244b3a;
  font: inherit;
  font-size: .875rem;
  font-weight: 650;
  line-height: 1.5;
  text-align: left;
  text-decoration: none;
  direction: ltr;
  cursor: pointer;
}
.back-control svg { flex: 0 0 auto; }
.back-control span { min-width: 0; overflow-wrap: anywhere; }
@media (hover: hover) {
  .back-control:hover { background: #edf5f0; border-color: #17684e; }
}
.back-control:active { background: #dcece2; }
.back-control:focus-visible { outline: 3px solid #087456; outline-offset: 3px; }
.back-control:disabled { opacity: .55; cursor: default; }
@media (forced-colors: active) {
  .back-control { border-color: ButtonText; }
  .back-control:focus-visible { outline-color: Highlight; }
}
</style>
