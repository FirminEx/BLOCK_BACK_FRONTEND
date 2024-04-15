<script lang="ts">
import { getClientAddress } from '@/lib/config';
import { ElMessage } from 'element-plus';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      name: undefined,
      address: undefined,
      email: undefined,
      phone: undefined,
      rules: {
        name: [
          { required: true, message: 'Please input the name', trigger: 'blur' },
          { min: 1, max: 20, message: 'Name must have a length between 1 and 20', trigger: 'blur' }
        ],
        address: [
          {
            min: 42,
            max: 42,
            message: 'Please enter a valid address',
            required: true,
            trigger: 'blur'
          }
        ],
        email: [
          {
            pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: 'Please enter a valid email address',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    clear() {
      this.name = undefined;
      this.address = undefined;
      this.email = undefined;
      this.phone = undefined;
    },
    async submitForm() {
      const formRef = this.$refs.formRef as any;
      if (!formRef) return;

      const address = await getClientAddress();

      if (address === this.address) {
        ElMessage.error("Can't add your address as a guardian!");
        return;
      }

      formRef.validate((valid: boolean) => {
        if (valid) {
          this.$emit('addGuardian', {
            name: this.name,
            address: this.address,
            email: this.email,
            phone: this.phone
          });
          this.clear();
        } else {
          ElMessage.error('Enter an address and a name.');
        }
      });
    }
  }
});
</script>

<template>
  <el-form ref="formRef" :model="this" :rules="rules" class="form">
    <h2 class="title">Add Guardian</h2>
    <el-form-item prop="name">
      <el-input placeholder="Name" v-model="name" />
    </el-form-item>
    <el-form-item prop="address">
      <el-input placeholder="Address" v-model="address" />
    </el-form-item>
    <el-form-item prop="email">
      <el-input placeholder="Email" v-model="email" type="email" />
    </el-form-item>
    <el-form-item>
      <el-input placeholder="Phone" v-model="phone" />
    </el-form-item>
    <el-form-item>
      <el-button @click="clear">Clear</el-button>
      <el-button type="primary" @click="submitForm">Add</el-button>
    </el-form-item>
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
