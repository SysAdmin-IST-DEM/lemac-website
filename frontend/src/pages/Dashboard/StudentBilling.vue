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
    <v-tabs-window-item value="1">
      <StudentDebtors />
    </v-tabs-window-item>

    <v-tabs-window-item value="2">
      <StudentBalanceLookup />
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import StudentBalanceLookup from '@/components/Dashboard/StudentBilling/StudentBalanceLookup.vue'
  import StudentDebtors from '@/components/Dashboard/StudentBilling/StudentDebtors.vue'

  const tab = ref<number>(1)
</script>

<style scoped>

</style>
