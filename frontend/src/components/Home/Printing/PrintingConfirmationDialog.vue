<template>
  <v-dialog :model-value="modelValue" max-width="500">
    <v-card>
      <v-card-title>Confirmation Step</v-card-title>
      <v-card-text>
        <p>Please confirm the information you have entered is correct:</p>
        <p>Full Name: {{ values.studentName }}</p>
        <p>IST ID: {{ values.studentId }}</p>
        <p>Técnico Webmail: {{ values.email }}</p>
        <p>Model STL: {{ file ? file.name : '-' }}</p>
        <p>Unit of file: {{ values.unit }}</p>
        <p>Volume (cm³): {{ volume?.toFixed(2) ?? 0 }}</p>
        <p>Material: {{ materialTitle }}</p>
        <p class="font-bold">
          Price (€): {{ values.price?.toFixed(2) ?? 0 }}
        </p>
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
import type { AddPrintTaskBody, PrintMaterial } from '@lemac/data-model/browser';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'PrintingConfirmationDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    values: {
      type: Object as PropType<AddPrintTaskBody>,
      required: true,
    },
    file: {
      type: [File, null] as PropType<File | null>,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
    materials: {
      type: Array as PropType<PrintMaterial[]>,
      required: true,
    },
  },
  emits: ['update:modelValue', 'confirm'],
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    materialTitle() {
      return (
        this.materials.find((material) => material.id === this.values.materialId)?.name || ''
      );
    },
  },
  methods: {
    close() {
      this.$emit('update:modelValue', false);
    },
    confirm() {
      this.loading = true;
      // Handle confirmation logic here
      this.$emit('confirm');
      this.$emit('update:modelValue', false);
    },
  },
});
</script>
