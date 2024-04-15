<script lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import { RouterView } from 'vue-router';

export default {
  components: {
    AppHeader
  }
};
</script>

<template>
  <div class="app">
    <AppHeader class="header" />
    <RouterView />
  </div>
</template>

<style scoped>
.app {
  width: 85vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 2rem 4rem 2rem 4rem;
  gap: 3rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.header {
  align-self: flex-start;
}
</style>
