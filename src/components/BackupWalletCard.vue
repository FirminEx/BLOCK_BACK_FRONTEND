<script lang="ts">
import { ElMessage } from 'element-plus';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    previousAddress: String
  },
  data() {
    return {
      address: undefined,
      email: undefined,
      phone: undefined,
      rules: {
        address: [
          {
            min: 42,
            max: 42,
            message: 'Please enter a valid address',
            required: true,
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    async submitForm() {
      const formRef = this.$refs.formRef as any;
      if (!formRef) return;

      formRef.validate((valid: boolean) => {
        if (valid) {
          this.$emit('updateBackup', this.address);
        } else {
          ElMessage.error('Enter a valid address.');
        }
      });
    }
  }
});
</script>

<template>
  <el-form ref="formRef" :model="this" :rules="rules" class="form">
    <h2 class="title">Edit backup</h2>
    <el-form-item prop="address">
      <el-input :placeholder="previousAddress ?? 'Address'" v-model="address" />
    </el-form-item>
    <el-button type="primary" @click="submitForm">Add</el-button>
  </el-form>
</template>

<style>
.form {
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  padding: 12px;
}

.title {
  margin-bottom: 0.5rem;
}
</style>
