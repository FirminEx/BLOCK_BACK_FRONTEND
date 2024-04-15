<script lang="ts">
import { getClientAddress } from '@/lib/config';
import { isTokenValid } from '@/router/index';
import { ElNotification } from 'element-plus';
import { defineComponent } from 'vue';
import { login } from '@/shared/api.client';
 
export default defineComponent({
  created() {
    if (isTokenValid()) this.$router.push('/safeguarded-dashboard');
  },

  methods: {
    async getSignedMessage(): Promise<{ message: string; signature: any }> {
      const address = await getClientAddress();

      const message = `block_back_${Math.random()}`;
      const signature = await window?.ethereum?.request({
        method: 'personal_sign',
        params: [message, address]
      });

      return { signature, message };
    },

    async connect() {
      try {
        const messages = await this.getSignedMessage();
        const { data } = await login(messages);

        window.localStorage.setItem('token', data.token);
        this.$router.push('/safeguarded-dashboard');
      } catch (err) {
        console.log(err);
        ElNotification({
          title: 'Error',
          message: 'Sorry, could not connect',
          type: 'error'
        });
      }
    }
  }
});
</script>

<template>
  <div class="login-container">
    <h1>Welcome to BLOCK BACK!</h1>
    <p>
      We use metamask signatures to authenticate you to the app. Click below to sign and get access!
    </p>
    <el-button class="login-button" @click="connect" type="primary">Connect</el-button>
  </div>
</template>

<style>
.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  padding: 2rem;
  max-width: 20vw;
}
.login-button {
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
