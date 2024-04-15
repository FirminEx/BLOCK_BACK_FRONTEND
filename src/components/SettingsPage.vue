<script lang="ts">
import { allowContract, getClientAddress } from '@/lib/config';
import { ElNotification } from 'element-plus';
import { defineComponent } from 'vue';

export default defineComponent({
  methods: {
    async approveContract() {
      const address = await getClientAddress();

      allowContract(address)
        .then(() => {
          this.$router.push('/safeguarded-dashboard');
        })
        .catch(() => {
          ElNotification({
            title: 'Error',
            message: 'Could not approve the contract',
            type: 'error'
          });
        });
    }
  }
});
</script>

<template>
  <div class="approve-container">
    <h1>You need to approve the contract</h1>
    <p>In order to use the app, you need to approve the smart contract. If you already approved, the validation can take a while</p>
    <el-button class="approve-button" @click="approveContract" type="primary">Approve</el-button>
  </div>
</template>

<style>
.approve-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  padding: 2rem;
  max-width: 20vw;
}
.approve-button {
  width: 100%;
}

@media (max-width: 1150px) {
  .login-container {
    max-width: 30vw;
  }
}

@media (max-width: 700px) {
  .login-container {
    max-width: 50vw;
  }
}
</style>
