<template>
  <v-dialog :value="dialogVisible" max-width="500">
    <v-card>
      <v-card-title>Confirmation Step</v-card-title>
      <v-card-text>
        <p>Please confirm the information you have entered is correct:</p>
        <p>First Name: {{ firstName }}</p>
        <p>Last Name: {{ lastName }}</p>
        <p>IST ID: {{ tecnicoId }}</p>
        <p>Técnico Webmail: {{ webmail }}</p>
        <p>Model STL: {{ fileName }}</p>
        <p>Unit of file: {{ chosenUnit }}</p>
        <p>Volume: {{ volume?.toFixed(2) ?? 0 }}</p>
        <p>Material: {{ material }}</p>
        <p class="font-bold">Price (€): {{ price?.toFixed(2) ?? 0 }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="close">Cancel</v-btn>
        <v-btn color="primary" :loading="loading" @click="confirm">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmationDialog',
  props: {
    dialogVisible: Boolean,
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    tecnicoId: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    chosenUnit: {
      type: String,
      default: 'Milimeter',
    },
    volume: {
      type: Number,
      default: null,
    },
    material: {
      type: String,
      default: 'Grey',
    },
    price: {
      type: Number,
      default: null,
    },
    webmail: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
    };
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
};
</script>
