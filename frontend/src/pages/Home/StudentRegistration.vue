<script lang="ts">
import { defineComponent } from 'vue';
import HomeHeader from '@/components/Home/HomeHeader.vue';

export default defineComponent({
  name: 'StudentRegistration',
  components: { HomeHeader },
});
</script>

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
          <v-btn
            color="secondary"
          >
            Start Now
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row class="mt-10">
      <v-col>
        <h3><b>How to register?</b></h3>

        <v-list>
          <v-list-item>
            <template #prepend>
              <v-chip
                color="secondary"
                variant="elevated"
              >
                1
              </v-chip>
            </template>
            <div class="ml-2">Make sure you are registered in the FénixEdu system.</div>
          </v-list-item>
          <v-list-item>
            <template #prepend>
              <v-chip
                color="secondary"
                variant="elevated"
              >
                2
              </v-chip>
            </template>
            <div class="ml-2">Click the Start Now button and login with your IST-ID.</div>
          </v-list-item>
          <v-list-item>
            <template #prepend>
              <v-chip
                color="secondary"
                variant="elevated"
              >
                3
              </v-chip>
            </template>
            <div class="ml-2">
              You are now registered! This process must be repeated
              at the start of every school year.
            </div>
          </v-list-item>
          <v-list-item>
            <template #prepend>
              <v-chip
                color="secondary"
                variant="elevated"
              >
                4
              </v-chip>
            </template>
            <div class="ml-2">
              Check the registration by using the card reader in the
              LEMAC laboratory room entrance.
            </div>
          </v-list-item>
          <v-list-item>
            <template #prepend>
              <v-chip
                color="secondary"
                variant="elevated"
              >
                5
              </v-chip>
            </template>
            <div class="ml-2">
              If you have any issues you can contact the LEMAC support at
              <a href="mailto:monitores.lemac@tecnico.ulisboa.pt">monitores.lemac@tecnico.ulisboa.pt</a>.
            </div>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col>
        <h3><b>Why is this needed?</b></h3>
        <br>
        <p>
          This registration is necessary to link your student
          card with the automatic room entrance system of LEMAC.
          By registering, you enable seamless access to the LEMAC
          laboratory room using your student card.
        </p>
        <br>

        <h3><b>Why do I need to renew it every year?</b></h3>
        <br>
        <p>
          To make sure you are still an active student at IST
          and have the right to access the LEMAC laboratory room,
          the registration needs to be renewed at the start of
          every academic year. This helps maintain the security
          and integrity of the laboratory access system.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.hero {
  background-image: url("@/assets/lemac.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
