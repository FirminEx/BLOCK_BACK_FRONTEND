<script lang="ts">
import AddGuardianCard from '@/components/AddGuardianCard.vue';
import BackupWalletCard from '@/components/BackupWalletCard.vue';
import GuardianCard from '@/components/GuardianCard.vue';
import { getClientAddress, readContract, sendContractTx } from '@/lib/config';
import { deleteGuardian, saveGuardian, getGuardians } from '@/shared/api.client';
import type { DbGuardian, Guardian } from '@/shared/guardian.interface';
import { ElNotification } from 'element-plus';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    AddGuardianCard,
    GuardianCard,
    BackupWalletCard
  },
  created() {
    this.fetchGuardians();
    this.fetchAddress();
  },
  data() {
    return {
      guardians: [] as Guardian[],
      backupAddress: ''
    };
  },
  methods: {
    checkGuardiansSync(
      contractAddresses: string[],
      dbGuardians: DbGuardian[]
    ): { missingDbGuardians: string[]; missingContractGuardians: string[] } {
      const dbAddresses = dbGuardians.map(({ guardian }) => guardian);

      const missingDbGuardians = contractAddresses.filter(
        (address) => !dbAddresses.includes(address)
      );

      const missingContractGuardians = dbAddresses.filter(
        (address) => !contractAddresses.includes(address)
      );

      return { missingDbGuardians, missingContractGuardians };
    },

    generateDesynchronizedErrorMessage(
      missingDbGuardians: string[],
      missingContractGuardians: string[]
    ): string {
      const missingContractGuardiansMessage = missingContractGuardians.length
        ? `, missing contract guardians: ${missingContractGuardians.join(', ')}`
        : '';

      const missingDbGuardiansMessage = missingDbGuardians.length
        ? `, missing server guardians: ${missingDbGuardians.join(', ')}`
        : '';

      return missingDbGuardiansMessage + missingContractGuardiansMessage;
    },

    async displaySyncError(contractAddresses: string[], dbGuardians: DbGuardian[]) {
      const { missingDbGuardians, missingContractGuardians } = this.checkGuardiansSync(
        contractAddresses,
        dbGuardians
      );
      console.log(missingDbGuardians, missingContractGuardians)

      if (missingDbGuardians.length || missingContractGuardians.length)
        return ElNotification({
          title: 'Error',
          message: `Contract and DB guardians not synced (yet)`,
          type: 'info'
        });
    },

    async fetchGuardians() {
      const address = await getClientAddress();

      const contractAddresses = await readContract('getGuardians', [address]);

      const { data } = await getGuardians();
      const dbGuardians = data.guardians as DbGuardian[];

      await this.displaySyncError(contractAddresses as string[], dbGuardians);

      this.guardians = dbGuardians.map(({ guardian, name, phone, email }) => ({
        address: guardian,
        name,
        phone: +phone,
        email,
        isNewGuardian: false,
        isMarkedForDeletion: false
      }));
    },
    async updateGuardians(guardian: {
      name: string;
      address: string;
      email: string;
      phone: number;
    }) {
      this.guardians.unshift({ ...guardian, isNewGuardian: true, isMarkedForDeletion: false });
    },
    async saveChanges() {
      if (!this.backupAddress) {
        ElNotification({
          title: 'Error',
          message: 'Please make sure you entered a valid back up address',
          type: 'error'
        });

        return;
      }
      try {
        await sendContractTx('setupBlockback', [
          this.guardians.map(({ address }) => address),
          this.backupAddress
        ]);

        await Promise.all(
          this.guardians
            .filter(({ isNewGuardian }) => isNewGuardian)
            .map((guardian) => saveGuardian(guardian))
        );

        await Promise.all(
          this.guardians
            .filter(({ isMarkedForDeletion }) => isMarkedForDeletion)
            .map((guardian) => deleteGuardian(guardian))
        );

        ElNotification({ title: 'Success', message: 'Updated the guardians', type: 'success' });
      } catch (err) {
        console.log(err);
        ElNotification({
          title: 'Error',
          message: 'Could not save the changes, have you approved the contract in the settings ?',
          type: 'error'
        });
      }
    },
    async changeDeletionState(deleteAddress: string) {
      this.guardians = this.guardians.filter(
        ({ address, isNewGuardian }) => address !== deleteAddress || !isNewGuardian
      );

      this.guardians = this.guardians.map(({ address, isMarkedForDeletion, ...guardian }) =>
        deleteAddress === address
          ? {
              address,
              isMarkedForDeletion: !isMarkedForDeletion,
              ...guardian
            }
          : { address, isMarkedForDeletion, ...guardian }
      );
    },
    async fetchAddress() {
      try {
        const address = await getClientAddress();

        const fetchedAddress = await readContract('getBackUpWallet', [address]);

        if (fetchedAddress === '0x0000000000000000000000000000000000000000') {
          ElNotification({
            title: 'Info',
            message: 'It does not seem like you have a backup wallet address',
            type: 'info'
          });
          return;
        }

        this.backupAddress = fetchedAddress as string;
      } catch (err) {
        ElNotification({
          title: 'Error',
          message: 'Could not fetch the backup wallet address',
          type: 'error'
        });
      }
    },
    updateBackup(address: string) {
      this.backupAddress = address;
    }
  }
});
</script>

<template>
  <div class="grid-container">
    <div class="save-card">
      <h2>Confirm your changes</h2>
      <p>
        Once you are done editing the people in the list, please click the button below. It will
        launch the metamask transaction. If you allowed the contract recently, please wait for the
        transaction to pass.
      </p>
      <div class="buttons-container">
        <el-button @click="fetchGuardians">Reload</el-button>
        <el-button type="success" @click="saveChanges">Save</el-button>
      </div>
    </div>
    <BackupWalletCard :previousAddress="backupAddress" @updateBackup="updateBackup" />

    <AddGuardianCard @addGuardian="updateGuardians" />
    <GuardianCard
      v-for="guardian in guardians"
      :key="guardian.address"
      :name="guardian.name"
      :address="guardian.address"
      :email="guardian.email"
      :phone="guardian.phone"
      :newGuardian="guardian.isNewGuardian"
      :isMarkedForDeletion="guardian.isMarkedForDeletion"
      @deleteGuardian="changeDeletionState(guardian.address)"
    />
  </div>
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

.save-card {
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
}

.buttons-container {
  position: absolute;
  bottom: 12px;
  right: 12px;
}
</style>
