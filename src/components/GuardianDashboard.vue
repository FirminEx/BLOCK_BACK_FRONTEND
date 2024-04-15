<script lang="ts">
import SafeguardedCard from '@/components/SafeguardedCard.vue';
import { sendContractTx } from '@/lib/config';
import { deleteSafeguarded } from '@/shared/api.client';
import axios from 'axios';
import { ElNotification } from 'element-plus';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    SafeguardedCard
  },
  data() {
    return {
      safeguardedList: [] as string[]
    };
  },
  created() {
    this.fetchSafeGuarded();
  },
  methods: {
    async fetchSafeGuarded() {
      const { data } = await axios.get('http://localhost:9000/guardians/safeguarded', {
        headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
      });
      this.safeguardedList = (data.safeguarded as { safeguarded: string }[]).map(
        ({ safeguarded }) => safeguarded
      );
    },
    async withdraw(address: string) {
      try {
        await sendContractTx('withdraw', [address]);

        await deleteSafeguarded(address);
      } catch (err) {
        console.log(err);
        ElNotification({
          title: 'Error',
          message: 'Could not withdraw',
          type: 'error'
        });
      }
    }
  }
});
</script>

<template>
  <div class="grid-container">
    <SafeguardedCard
      v-for="safeguarded in safeguardedList"
      :key="safeguarded"
      :address="safeguarded"
      @withdraw="withdraw(safeguarded)"
    />
  </div>
  <div v-if="!safeguardedList.length">No one to watch ! (for now ...)</div>
</template>

<style>
.grid-container {
  max-width: 100%;
  align-self: center;
  display: grid;
  grid-template-columns: 30% 30% 30%;
  grid-auto-rows: 1fr;
  gap: 2rem 2rem;
  padding: 2rem 0 2rem 0;
  justify-content: center;
}
</style>
