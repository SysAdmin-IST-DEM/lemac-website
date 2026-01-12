<template>
  <v-dialog>
    <v-card>
      <v-card-title>Print Task Details</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <DashboardDynamicField v-model="values.name" />
            <DashboardDynamicField v-model="values.name" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="$emit('close')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { PrintTask } from '@lemac/data-model/browser';
import DashboardDynamicField from '@/components/Dashboard/DashboardDataTable/DashboardDynamicField.vue';

export default defineComponent({
  name: 'PrintTaskDetails',
  components: { DashboardDynamicField },
  props: {
    modelValue: {
      type: Object as PropType<PrintTask>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data(): {
    values: PrintTask;
  } {
    return {
      values: { ...this.item } as PrintTask
    };
  }
});
</script>
<style scoped></style>
