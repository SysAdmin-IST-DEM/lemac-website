<template>
  <v-btn
    color="primary"
    size="small"
    @click="loginFenix"
  >
    Authenticate
  </v-btn>

  <v-dialog
    v-model="dialog"
    max-width="500"
  >
    <v-card>
      <v-card-title>Authentication Error</v-card-title>

      <v-card-text
        v-if="error === 'not_dem'"
        class="card-text"
      >
        <p class="mb-0"><b class="text-error">Attention:</b> You are not an active student, teacher or researcher in one of
          these courses:</p>

        <ul class="mb-4">
          <li>- Aerospace Engineering</li>
          <li>- Mechanical Engineering</li>
          <li>- Naval Architecture and Ocean Engineering</li>
          <li>- Materials Engineering</li>
          <li>- Environmental Engineering</li>
          <li>- Biomedical Engineering</li>
        </ul>

        <p>This service is restricted only to DEM students.</p>

        <p>If this information is wrong contact via
          <a href="mailto:suporte@dem.tecnico.ulisboa.pt">suporte@dem.tecnico.ulisboa.pt</a>.</p>
      </v-card-text>

      <v-card-text
        v-else-if="error === 'access_token'"
        class="card-text"
      >
        <p>There was an error during the authentication process.</p>

        <p>
          <b>Reason:</b>

          Could not retrieve access token from FénixEdu.
        </p>

        <p>Please try again or contact support at
          <a href="mailto:suporte@dem.tecnico.ulisboa.pt">suporte@dem.tecnico.ulisboa.pt</a>.</p>
      </v-card-text>

      <v-card-text
        v-else-if="error === 'not_found'"
        class="card-text"
      >
        <p>There was an error during the authentication process.</p>

        <p>
          <b>Reason:</b> You are currently not registered in the LEMAC's system.
        </p>

        <p>Please register at <RouterLink to="/student-registration">Student Registration</RouterLink>.</p>
      </v-card-text>

      <v-card-text
        v-else-if="error === 'renewal_required'"
        class="card-text"
      >
        <p>There was an error during the authentication process.</p>

        <p>
          <b>Reason:</b> Your registration in the LEMAC's system has expired.
        </p>

        <p>Please renew at <RouterLink to="/student-registration">Student Registration</RouterLink>.</p>
      </v-card-text>

      <v-card-text
        v-else
        class="card-text"
      >
        <p>There was an error during the authentication process.</p>

        <p>
          <b>Reason:</b> Unknown error occurred.

        </p>

        <p>Please try again or contact support at
          <a href="mailto:suporte@dem.tecnico.ulisboa.pt">suporte@dem.tecnico.ulisboa.pt</a>.</p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import type { LocationQueryValue } from 'vue-router'
  import { defineComponent } from 'vue'

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
    data: (): {
      dialog: boolean
      error: string | null
      student: { name: string, istId: string, email: string } | null
    } => ({
      dialog: false,
      error: null,
      student: null,
    }),
    mounted () {
      const error = this.$route.query.error
      if (error) {
        this.error = this.$route.query.error as LocationQueryValue
        this.$router.replace({ query: {} })
        this.dialog = true
      } else {
        if (this.$route.query.name && this.$route.query.istId) {
          try {
            this.student = {
              name: decodeURIComponent(this.$route.query.name as string),
              istId: decodeURIComponent(this.$route.query.istId as string),
              email: decodeURIComponent(this.$route.query.email as string),
            }
            this.$emit("authenticated", this.student, this.$route.query)
            this.$router.replace({ query: {} })
          } catch (error_: unknown) {
            console.error(error_)
            this.student = null
            this.error = "unknown"
            this.$router.replace({ query: {} })
            this.dialog = true
          }
        }
      }
    },
    methods: {
      loginFenix () {
        sessionStorage.setItem('authenticatePage', this.page)
        window.location.href = `${import.meta.env.VITE_FENIX_BASE_URL}oauth/userdialog?client_id=${import.meta.env.VITE_FENIX_CLIENT_STUDENT_ID}&redirect_uri=${import.meta.env.VITE_FENIX_REDIRECT_URL_STUDENT}&state=${this.page}`
      },
    },
  })
</script>

<style scoped>
.card-text p {
  margin-bottom: 15px;
}
</style>
