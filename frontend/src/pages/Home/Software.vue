<template>
  <HomeHeader disable-login />
  <v-container>
    <v-row
      v-if="userData == null"
      class="flex items-center justify-center gap-4 m-4"
    >
      <p class="mb-0 text-xl">
        Please login in order to request a software:
      </p>
      <AuthenticateButton @authenticated="onAuthenticated" />
    </v-row>
    <HomeSoftware
      v-if="userComputed"
      :person-data="userComputed"
    />
  </v-container>
</template>

<script>
import HomeHeader from '@/components/Home/HomeHeader.vue';
import HomeSoftware from '@/components/Home/HomeSoftware.vue';
import AuthenticateButton from '@/components/Home/AuthenticateButton.vue';

export default {
  name: 'Software',
  components: {
    AuthenticateButton,
    HomeHeader,
    HomeSoftware,
  },
  data: () => ({
    loading: false,
    loadingOut: false,
    userData: null,
  }),
  computed: {
    userComputed() {
      return this.userData;
    },
  },
  methods: {
    onAuthenticated(data) {
      this.userData = data;
    },
  },
};
</script>
