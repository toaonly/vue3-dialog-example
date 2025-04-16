<script setup lang="ts">
import { ref } from 'vue';
import { VConfirm } from './components/ui';

const visible = ref(false)
</script>

<template>
  <div>
    <button @click="visible = true">open modal</button>
  </div>
  <VConfirm v-model:visible="visible" position="top">
    <template #header>
      <div>Test Modal Header</div>
    </template>

    <template #contents>
      <div>Test Modal Contents</div>
    </template>
  </VConfirm>
</template>

<style scoped></style>
