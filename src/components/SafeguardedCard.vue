<script lang="ts">
import { ElMessage } from 'element-plus';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    address: String
  },
  methods: {
    withdraw() {
      this.$emit('withdraw');
    },
    async copy() {
      await navigator.clipboard.writeText(this.address ?? '');
      ElMessage({ message: 'Copied!' });
    }
  }
});
</script>

<template>
  <div class="card">
    <div class="address-container">
      <h2 class="name">{{ address }}</h2>
    </div>
    <el-button type="primary" plain class="delete-button" @click="withdraw">Withdraw</el-button>
  </div>
</template>

<style>
.card {
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.copy-button {
  background: none;
  border: 0;
  cursor: pointer;
  padding: 0;
}

.name {
  color: #6c63ff;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
}

.delete-button {
  margin: auto;
  align-self: flex-end;
}

@media (max-width: 1860px) {
  .address {
    font-size: 0.75em;
  }
}

@media (max-width: 1450px) {
  .address {
    font-size: 0.6em;
  }
}
</style>
