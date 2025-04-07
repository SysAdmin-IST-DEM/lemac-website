<template>
  <v-tabs
    v-model="tab"
    color="primary"
    bg-color="white"
    slider-color="primary"
    grow
  >
    <v-tab value="1">
      Registration
    </v-tab>
    <v-tab value="2">
      Occurences
    </v-tab>
    <v-tab value="3">
      Visualisation
    </v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="1">
      <v-container>
        <EntriesList />
      </v-container>
    </v-tabs-window-item>
    <v-tabs-window-item value="2">
      <v-container>
        <Occurences />
      </v-container>
    </v-tabs-window-item>
    <v-tabs-window-item value="3">
      <v-container>
        <WorkstationData />
      </v-container>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script>
import EntriesList from '@/components/Entries/EntriesList.vue';
import Occurences from '@/components/Entries/Occurences.vue';
import WorkstationData from '@/components/Entries/WorkstationData.vue';

export default {
  components: { EntriesList, Occurences, WorkstationData },
  data: () => ({
    tab: null,
  }),
};
</script>

<style></style>
