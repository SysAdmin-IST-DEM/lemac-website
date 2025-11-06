<template>
  <v-tabs
    v-model="tab"
    color="primary"
    bg-color="white"
    slider-color="primary"
    grow
  >
    <v-tab value="1">
      Tasks
    </v-tab>
    <v-tab value="2">
      Materials
    </v-tab>
  </v-tabs>
</template>

<script>
export default {
  name: "PrintingTasks",
  data: () => ({
    tab: null,
  }),
}
</script>