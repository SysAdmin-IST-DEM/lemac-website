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
      <v-btn
        color="primary"
        size="small"
        @click="loginFenix"
      >
        Authenticate
      </v-btn>
    </v-row>
    <HomeSoftware
      v-if="userComputed"
      :person-data="userComputed"
    />
  </v-container>
</template>

<script>
import HomeHeader from '@/components/Home/HomeHeader.vue';
import { getFenixInfo } from '@/api/auth.api';
import HomeSoftware from '@/components/Home/HomeSoftware.vue';

export default {
  name: 'Software',
  components: {
    HomeHeader,
    HomeSoftware,
  },
  data: () => ({
    loading: false,
    loadingOut: false,
    personKey: 0,
    userData: null,
  }),
  computed: {
    userComputed() {
      return this.userData;
    },
  },
  mounted() {
    const fenixCode = this.$route.query.code;
    if (fenixCode) this.getFenixInfo(fenixCode);
  },
  methods: {
    loginFenix() {
      window.location = `${import.meta.env.VITE_FENIX_BASE_URL}oauth/userdialog?client_id=${import.meta.env.VITE_FENIX_CLIENT_SOFTWARE_ID}&redirect_uri=${import.meta.env.VITE_FENIX_REDIRECT_URL_SOFTWARE}`;
    },
    async getFenixInfo(code) {
      this.loading = true;
      try {
        const { data } = await getFenixInfo(code);

        if (JSON.stringify(data) == '{}') {
          window.location = `${import.meta.env.VITE_FENIX_REDIRECT_URL_SOFTWARE}`;
          return;
        }

        this.userData = data;
        this.personKey++;
      } catch (e) {
        console.log(e);
        this.$notify({
          type: 'error',
          title: 'Unauthorized user',
          text: "You don't have permission to access this ",
          duration: -1,
        });
      }
      this.loading = false;
    }
  },
};
</script>
