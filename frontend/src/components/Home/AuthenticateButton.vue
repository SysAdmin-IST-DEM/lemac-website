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
  import { defineComponent } from 'vue'
  import { getFenixInfo } from '@/api/auth.api.ts'

  export default defineComponent({
    name: 'AuthenticateButton',
    props: {
      page: {
        type: String,
        required: false,
        default: 'software',
      },
    },
    emits: ['authenticated'],
    methods: {
      loginFenix () {
        sessionStorage.setItem('authenticatePage', this.page)
        window.location.href = `${import.meta.env.VITE_FENIX_BASE_URL}oauth/userdialog?client_id=${import.meta.env.VITE_FENIX_CLIENT_STUDENT_ID}&redirect_uri=${import.meta.env.VITE_FENIX_REDIRECT_URL_STUDENT}&state=${this.page}`
      },
    },
  })
</script>

<style scoped></style>
