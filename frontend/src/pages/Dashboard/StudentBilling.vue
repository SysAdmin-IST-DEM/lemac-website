<template>
  <v-tabs
    v-model="tab"
    bg-color="white"
    color="primary"
    grow
    slider-color="primary"
  >
    <v-tab value="1">
      Debtors
    </v-tab>

    <v-tab value="2">
      Student Balance Lookup
    </v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="1"></v-tabs-window-item>

    <v-tabs-window-item value="2">
      <StudentBalanceLookup />
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import StudentBalanceLookup from '@/components/Dashboard/StudentBilling/StudentBalanceLookup.vue';

  export default defineComponent({
    name: 'Billing',
    components: { StudentBalanceLookup },
    data: () => ({
      tab: null,
    }),
  })
</script>

<style scoped>

</style>