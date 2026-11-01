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

    <v-row v-if="student && software">
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
            <AuthenticateButton page="software" @authenticated="onAuthentication" />
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
      student: { name: string, istId: string, email: string } | null
      software: { [name: string]: { url: string, license?: string, password?: string } } | null
    } => ({
      error: null,
      student: null,
      software: null,
    }),
    methods: {
      onAuthentication (student: { name: string, istId: string, email: string } | null, query: any) {
        if (student) {
          this.student = student
          this.software = JSON.parse(decodeURIComponent(query.software as string))
        }
      },
    },
  }
</script>
