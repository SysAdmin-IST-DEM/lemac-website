<template>
  <v-dialog
    v-model="isOpen"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="text-h5">
        Are you sure you want to delete this item?
      </v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="text"
          @click="isOpen = false;"
        >
          Cancel
        </v-btn>
        <v-btn
          color="error"
          variant="text"
          @click="confirm"
        >
          OK
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DashboardDeleteDialog',
  components: {},
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      default: null
    },
  },
  emits: ['update:modelValue', 'delete'],
  data: () => ({}),
  computed: {
    isOpen: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  mounted() {
  },
  methods: {
    confirm() {
      this.$emit('delete', this.item);
      this.isOpen = false;
    },
  },
};
</script>
