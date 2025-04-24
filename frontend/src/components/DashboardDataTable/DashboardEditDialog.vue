<template>
  <v-dialog
    v-model="isOpen"
    max-width="550px"
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ item ? 'Edit ' : 'New ' }}
        <slot name="title">
          Element
        </slot>
      </v-card-title>
      <v-card-text class="!p-0">
        <v-form
          ref="form"
          @submit.prevent="$emit('edit', values)"
        >
          <v-container>
            <v-row
              v-for="(row, index) in fields"
              :key="index"
              no-gutters
            >
              <v-col
                v-for="(field, fieldIndex) in row"
                :key="fieldIndex"
                v-bind="field.colProps"
              >
                <DashboardDynamicField
                  v-if="field.permission ? field.permission >= getPermission : true"
                  v-model="values[field.key]"
                  :type="field.type"
                  :wrapper="field.type === 'date' || field.type === 'time' ? 'menu' : ''"
                  :props="field.props"
                  :label="field.label"
                  :label-icon="field.labelIcon"
                  :required="field.required"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="text"
          @click="isOpen = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="text"
          @click="confirm"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DashboardDynamicField from '@/components/DashboardDataTable/DashboardDynamicField.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'DashboardEditDialog',
  components: { DashboardDynamicField },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      default: null
    },
    fields: {
      type: Array,
      required: true
    },
    onInitialization: { type: Function, default: (item) => {} },
  },
  emits: ['update:modelValue', 'edit'],
  data: () => ({
    values: null,
  }),
  computed: {
    isOpen: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    ...mapGetters('user', ['getPermission']),
  },
  watch: {
    modelValue(newValue) {
      if(this.item == null || !newValue) {
        this.initializeEmpty();
      } else {
        this.values = this.onInitialization(this.item);
      }
    }
  },
  mounted() {
    this.initializeEmpty();
  },
  methods: {
    confirm() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$emit('edit', this.item, this.values);
      } finally {
        this.isOpen = false;
      }
    },
    initializeEmpty() {
      this.values = {};
      for(const row of this.fields) {
        for (const field of row) {
          this.values[field.key] = field.default ?? null;
        }
      }
    }
  },
};
</script>