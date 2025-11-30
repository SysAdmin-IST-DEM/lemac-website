<template>
  <v-btn
    color="primary"
    size="small"
    @click="loginFenix"
  >
    Authenticate
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getFenixInfo } from '@/api/auth.api.ts';

export default defineComponent({
  name: 'AuthenticateButton',
  emits: ['authenticated'],
  mounted() {
    const fenixCode = this.$route.query.code as string;
    if (fenixCode) this.getFenixInfo(fenixCode);
  },
  methods: {
    loginFenix() {
      window.location.href = `${import.meta.env.VITE_FENIX_BASE_URL}oauth/userdialog?client_id=${import.meta.env.VITE_FENIX_CLIENT_SOFTWARE_ID}&redirect_uri=${import.meta.env.VITE_FENIX_REDIRECT_URL_SOFTWARE}`;
    },
    async getFenixInfo(code: string) {
      this.$loading.show();
      try {
        const { data } = await getFenixInfo(code);

        if (JSON.stringify(data) == '{}') {
          window.location.href = `${import.meta.env.VITE_FENIX_REDIRECT_URL_SOFTWARE}`;
          return;
        }

        this.$emit('authenticated', data);
      } catch (e) {
        console.error(e);
        this.$notify({
          type: 'error',
          title: 'Unauthorized user',
          text: "You don't have permission to access this ",
          duration: -1,
        });
      }
      this.$loading.hide();
    }
  }
});
</script>

<style scoped></style>
