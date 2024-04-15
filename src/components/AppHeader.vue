<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<template>
  <div class="header-container">
    <a href="/guardian-dashboard" class="header-container">
      <img src="@/assets/logo.svg" alt="App logo" class="logo" />
      <p>BLOCK BACK</p>
    </a>
    <a class="link" href="/guardian-dashboard">Guardian</a>
    <a class="link" href="/safeguarded-dashboard">Safeguarded</a>
    <a class="link" href="/settings">Settings</a>
  </div>
</template>

<style>
a {
  text-decoration: none;
  color: #6c63ff;
  font-size: x-large;
}

.link {
  font-size: medium;
}

.logo {
  width: 36px;
  height: 36px;
}

.header-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
