<template>
  <v-tabs v-model="tab" color="primary" bg-color="white" slider-color="primary" grow>
    <v-tab value="1"> Tasks </v-tab>
    <v-tab value="2"> Materials </v-tab>
    <v-tab href="/dashboard/drive" target="_blank" rel="noopener"> Drive </v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="1">
      <v-container>
        <PrintingTasks />
      </v-container>
    </v-tabs-window-item>
    <v-tabs-window-item value="2">
      <v-container>
        <PrintingMaterials />
      </v-container>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script>
import PrintingTasks from '@/components/Dashboard/Printing/PrintingTasks.vue';
import PrintingMaterials from '@/components/Dashboard/Printing/PrintingMaterials.vue';

export default {
  name: 'Printing',
  components: { PrintingMaterials, PrintingTasks },
  data: () => ({
    tab: null,
  }),
};
</script>