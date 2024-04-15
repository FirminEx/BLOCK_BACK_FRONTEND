<script lang="ts">
import { ElMessage } from 'element-plus';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    name: String,
    address: String,
    email: String,
    phone: Number,
    newGuardian: { values: [Boolean, undefined] },
    isMarkedForDeletion: Boolean
  },
  methods: {
    async copy() {
      await navigator.clipboard.writeText(this.address ?? '');
      ElMessage({ message: 'Copied!' });
    },
    deleteGuardian() {
      this.$emit('deleteGuardian', { address: this.address });
    }
  }
});
</script>

<template>
  <div class="card">
    <h2 class="name">{{ name + (newGuardian ? ' (not saved)' : '') }}</h2>
    <button class="address copy-button" @click="copy">
      {{ address }}
      <el-icon><CopyDocument /></el-icon>
    </button>
    <div class="infos-container">
      <a :href="`mailto:${email}`" class="guardian-info" target="_blank">
        <el-icon><Message /></el-icon> {{ email ?? 'no email' }}
      </a>
      <a :href="`tel:${phone}`" class="guardian-info" target="_blank">
        <el-icon><Cellphone /></el-icon> {{ phone ?? 'no phone' }}
      </a>
    </div>

    <el-button type="danger" plain class="delete-button" @click="deleteGuardian">{{
      isMarkedForDeletion ? 'Revert' : 'Delete'
    }}</el-button>
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

.name {
  color: #6c63ff;
}

.address {
  font-size: 1em;
  font-weight: bolder;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.guardian-info {
  border: 0;
  cursor: pointer;
  background: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: inherit;
  font-size: 1.1em;
}

.copy-button {
  background: none;
  border: 0;
  cursor: pointer;
  padding: 0;
}

.delete-button {
  margin: auto;
  align-self: flex-end;
}

.infos-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
