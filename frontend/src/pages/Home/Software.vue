<template>
  <HomeHeader disable-login />

  <v-container class="bg-white mt-4 p-8! rounded mb-4">
    <v-row>
      <v-col>
        <div class="mx-auto text-center">
          <h1 class="text-3xl">Software DEM</h1>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-alert
          class="mx-auto"
          color="primary"
          icon="$info"
          variant="tonal"
        >
          All softwares provided here are for educational uses only.
          If you encounter any technical issue with this page or licenses please contact
          Systems Administraton of DEM
          (<a class="font-bold" href="mailto:suporte@dem.tecnico.ulisboa.pt">suporte@dem.tecnico.ulisboa.pt</a>)
          and not LEMAC.
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-if="error">
      <v-col>
        <div v-if="error === 'not_dem'" class="mx-auto w-50">
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

          <p>Softwares provided by DEM are restricted only to DEM students. If you think this is an error
            please contact System Administration and not LEMAC.</p>
        </div>
      </v-col>
    </v-row>

    <v-row v-else-if="student && software">
      <HomeSoftware
        :software="software"
        :student="student"
      />
    </v-row>

    <v-row
      v-else
      class="flex items-center justify-center gap-4 m-4"
    >
      <v-col>
        <div>
          <div class="mx-auto text-center mt-4">
            <p class="mb-1">Please authenticate to check for softwares:</p>
            <AuthenticateButton page="software" />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import type { LocationQueryValue } from 'vue-router'
  import AuthenticateButton from '@/components/Home/AuthenticateButton.vue'
  import HomeHeader from '@/components/Home/HomeHeader.vue'
  import HomeSoftware from '@/components/Home/HomeSoftware.vue'

  export default {
    name: 'Software',
    components: {
      AuthenticateButton,
      HomeHeader,
      HomeSoftware,
    },
    data: (): {
      error: string | null
      student: { name: string, istId: string } | null
      software: { [name: string]: { url: string, license?: string, password?: string } } | null
    } => ({
      error: null,
      student: null,
      software: null,
    }),
    mounted () {
      const error = this.$route.query.error
      if (error) {
        this.error = this.$route.query.error as LocationQueryValue
        this.$router.replace({ query: {} })
      } else {
        if (this.$route.query.name && this.$route.query.istId) {
          try {
            this.student = {
              name: decodeURIComponent(this.$route.query.name as string),
              istId: decodeURIComponent(this.$route.query.istId as string),
            }
            console.log(decodeURIComponent(this.$route.query.software as string))
            this.software = JSON.parse(decodeURIComponent(this.$route.query.software as string))
            this.$router.replace({ query: {} })
          } catch (error_: unknown) {
            console.error(error_)
            this.student = null
            this.software = null
            this.$router.replace({ query: {} })
          }
        }
      }
    },
  }
</script>
