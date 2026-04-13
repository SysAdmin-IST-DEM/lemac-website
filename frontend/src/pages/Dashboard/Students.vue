<template>
  <v-tabs
    v-model="tab"
    color="primary"
    bg-color="white"
    slider-color="primary"
    grow
  >
    <v-tab value="1">
      Assign
    </v-tab>
    <v-tab value="2">
      Students (WIP)
    </v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="1">
      <v-container
        v-if="students"
        class="mt-6 bg-white"
      >
        <CardAssigner :students="students" />
      </v-container>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script>
import CardAssigner from '@/components/Dashboard/Students/CardAssigner.vue';
import { getStudents } from '@/api/students.api.ts';

export default {
  name: 'StudentsPage',
  components: { CardAssigner },
  data: () => ({
    tab: null,
    students: null,
  }),
  async mounted() {
    this.$loading.show();
    this.students = (await getStudents()).data;
    this.$loading.hide();
  }
};
</script>