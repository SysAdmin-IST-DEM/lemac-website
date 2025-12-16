<template>
  <v-dialog :model-value="dialogVisible" max-width="500">
    <v-card>
      <v-card-title>Confirmation Step</v-card-title>
      <v-card-text>
        <p>Please confirm the information you have entered is correct:</p>
        <p>Full Name: {{ values.name }}</p>
        <p>IST ID: {{ values.istId }}</p>
        <p>Técnico Webmail: {{ values.email }}</p>
        <p>Model STL: {{ file ? file.name : '-' }}</p>
        <p>Unit of file: {{ values.unit }}</p>
        <!-- <p>Volume: {{ volume?.toFixed(2) ?? 0 }}</p> -->
        <p>Material: {{ materialTitle }}</p>
        <!-- <p class="font-bold">
          Price (€): {{ price?.toFixed(2) ?? 0 }}
        </p> -->
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="close"> Cancel </v-btn>
        <v-btn color="primary" :loading="loading" @click="confirm"> Confirm </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { AddPrintTaskBody } from '@lemac/data-model/browser';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'ConfirmationDialog',
  props: {
    dialogVisible: Boolean,
    values: {
      type: Object as PropType<AddPrintTaskBody>,
      required: true,
    },
    file: {
      type: [Object as PropType<File>, null],
      required: true,
    },
    materials: {
      type: Array as PropType<{ title: string; value: number }[]>,
      required: true,
    },
  },
  emits: ['close', 'confirm'],
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    materialTitle: {
      get(): string {
        return (
          this.materials.find(
            (v: { title: string; value: number }) => v.value === this.values.materialId
          )?.title || ''
        );
      },
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    confirm() {
      this.loading = true;
      // Handle confirmation logic here
      this.$emit('confirm');
    },
  },
});
</script>
