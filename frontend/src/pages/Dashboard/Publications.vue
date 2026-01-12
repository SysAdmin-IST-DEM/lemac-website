<template>
  <div v-if="getPermission === 1">
    <v-container
      v-if="publications"
      class="mt-6"
    >
      <PublicationsTable :passed-data="publications" />
    </v-container>
  </div>
</template>

<script>
import PublicationsTable from '@/components/Dashboard/Publications/PublicationsTable.vue';
import { getPublications } from '@/api/publications.api';
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user.js';

export default {
  name: 'PublicationsPage',
  components: { PublicationsTable },
  data() {
    return {
      publications: null,
    };
  },
  computed: {
    ...mapState(useUserStore, ['getPermission']),
  },
  async mounted() {
    this.$loading.show();
    const response = await getPublications();
    this.publications = response.data;
    this.$loading.hide();
  },
};
</script>
