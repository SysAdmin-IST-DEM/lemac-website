<template>
  <HomeHeader />

  <v-container class="bg-white mt-4">
    <v-row>
      <v-col>
        <div>
          <div class="mx-auto text-center mt-4">
            <h1 class="text-3xl">Student Registration</h1>
            <h2 class="text-xl">Automatic Room Entrance</h2>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-spacer />
    <v-row>
      <v-col>
        <div class="mx-auto text-center mt-3">
          <v-btn color="primary" :href="studentLink"> Start Now </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row class="mt-10">
      <v-col cols="12" md="6">
        <h3><b>How to register?</b></h3>

        <v-list>
          <v-list-item>
            <template #prepend>
              <v-chip color="primary" variant="elevated"> 1 </v-chip>
            </template>
            <div class="ml-2">Make sure you are registered in the FénixEdu system.</div>
          </v-list-item>
          <v-list-item>
            <template #prepend>
              <v-chip color="primary" variant="elevated"> 2 </v-chip>
            </template>
            <div class="ml-2">Click the Start Now button and login with your IST-ID.</div>
          </v-list-item>
          <v-list-item>
            <template #prepend>
              <v-chip color="primary" variant="elevated"> 3 </v-chip>
            </template>
            <div class="ml-2">
              You are now registered! This process must be repeated at the start of every school
              year.
            </div>
          </v-list-item>
          <v-list-item>
            <template #prepend>
              <v-chip color="primary" variant="elevated"> 4 </v-chip>
            </template>
            <div class="ml-2">
              Check the registration by using the card reader in the LEMAC laboratory room entrance.
            </div>
          </v-list-item>
          <v-list-item>
            <template #prepend>
              <v-chip color="primary" variant="elevated"> 5 </v-chip>
            </template>
            <div class="ml-2">
              If you have any issues you can contact the LEMAC support at
              <a href="mailto:monitores.lemac@tecnico.ulisboa.pt">
                monitores.lemac@tecnico.ulisboa.pt </a
              >.
            </div>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12" md="6">
        <h3><b>Why is this needed?</b></h3>
        <br />
        <p>
          This registration is necessary to link your student card with the automatic room entrance
          system of LEMAC. By registering, you enable seamless access to the LEMAC laboratory room
          using your student card.
        </p>
        <br />

        <h3><b>Why do I need to renew it every year?</b></h3>
        <br />
        <p>
          To make sure you are still an active student at IST and have the right to access the LEMAC
          laboratory room, the registration needs to be renewed at the start of every academic year.
          This helps maintain the security and integrity of the laboratory access system.
        </p>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog
    v-model="dialog"
    max-width="500"
  >
    <v-card>
      <v-card-title>{{ error ? "Registration Error" : "Registration Successful" }}</v-card-title>
      <v-card-text v-if="student">
        Thank you for your registration in the Automatic Room Entrance system.<br>
        <br>
        <b>Registered Student:</b> {{ student }}<br>
        <br>
        You can now use your student card to access the LEMAC laboratory room.<br>
        <br>
        If you encounter any issues, please contact support at
        <a href="mailto:monitores.lemac@dem.tecnico.ulisboa.pt">monitores.lemac@dem.tecnico.ulisboa.pt</a>.
      </v-card-text>
      <v-card-text v-if="error">
        There was an error during the registration process.<br>
        <br>
        <b>Reason:</b>
        <div
          v-if="error === 'access_token'"
        >
          Could not retrieve access token from FénixEdu.
        </div>
        <div
          v-else-if="error === 'not_dem'"
        >
          You are not registered as a student in the DEM department.<br>
          <br>
          You must be an active student in one of these courses:
          <ul>
            <li>- Aerospace Engineering</li>
            <li>- Mechanical Engineering</li>
            <li>- Naval Architecture and Ocean Engineering</li>
            <li>- Materials Engineering</li>
            <li>- Environmental Engineering</li>
            <li>- Biomedical Engineering</li>
          </ul>
          <br>
          In alternative, you can also be a teacher or researcher in the DEM department.
        </div>
        <div v-else>
          Unknown error occurred.
        </div>
        <br>
        Please try again or contact support at
        <a href="mailto:monitores.lemac@dem.tecnico.ulisboa.pt">monitores.lemac@dem.tecnico.ulisboa.pt</a>.
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HomeHeader from '@/components/Home/HomeHeader.vue';
import type { LocationQueryValue } from 'vue-router';

export default defineComponent({
  name: 'StudentRegistration',
  components: { HomeHeader },
  data(): {
    studentLink: string,
    error: string | null | undefined,
    student: string | null | undefined
  } {
    return {
      studentLink: `${import.meta.env.VITE_FENIX_BASE_URL}oauth/userdialog?client_id=${import.meta.env.VITE_FENIX_CLIENT_STUDENT_ID}&redirect_uri=${import.meta.env.VITE_FENIX_REDIRECT_URL_STUDENT}`,
      error: null,
      student: null
    };
  },
  computed: {
    dialog: {
      get() {
        return !!this.error || !!this.student;
      },
      set(value: boolean) {
        if (!value) {
          this.error = null;
          this.student = null;
          this.$router.replace({ query: {} });
        }
      }
    }
  },
  mounted() {
    const error = this.$route.query.error;
    if (!error) {
      if (this.$route.query.name && this.$route.query.istId) {
        this.student = `${this.$route.query.name} (${this.$route.query.istId})`;
      }
    } else {
      this.error = this.$route.query.error as LocationQueryValue;
    }
  },
});
</script>