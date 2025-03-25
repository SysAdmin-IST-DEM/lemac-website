<template>
  <v-tabs grow>
    <v-tab key="1">
      Registration
    </v-tab>
    <v-tab key="2">
      Occurences
    </v-tab>
    <v-tab key="3">
      Visualisation
    </v-tab>
  </v-tabs>

  <v-window>
    <v-window-item>
      <v-container>
        <EntriesList />
      </v-container>
    </v-window-item>
    <v-window-item>
      <v-container>
        <Occurences />
      </v-container>
    </v-window-item>
    <v-window-item>
      <v-container>
        <WorkstationData />
      </v-container>
    </v-window-item>
  </v-window>
</template>

<script>
import EntriesList from '@/components/Entries/EntriesList.vue';
import Occurences from '@/components/Entries/Occurences.vue';
import WorkstationData from '@/components/Entries/WorkstationData.vue';

export default {
  components: { EntriesList, Occurences, WorkstationData },
};
</script>

<style></style>
