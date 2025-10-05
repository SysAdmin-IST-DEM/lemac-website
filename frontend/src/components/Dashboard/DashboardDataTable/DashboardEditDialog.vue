<template>
  <v-dialog
    v-model="isOpen"
    max-width="550px"
  >
    <v-card>
      <v-card-title class="text-h5">
        <slot name="prepend-title">
          {{ item ? 'Edit ' : 'New ' }}
        </slot>
        <slot name="title">
          Element
        </slot>
      </v-card-title>
      <v-card-subtitle class="whitespace-normal! overflow-visible! [text-overflow:unset]!">
        <slot name="subtitle" />
      </v-card-subtitle>
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
                  :rules="field.rules"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :color="cancelColor"
          variant="text"
          @click="cancelAction"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="saveColor"
          variant="text"
          :disabled="cancelDisabled"
          @click="confirm"
        >
          {{ saveText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DashboardDynamicField from '@/components/Dashboard/DashboardDataTable/DashboardDynamicField.vue';
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
    shouldDisableCancel: { type: Boolean, default: false },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    cancelColor: {
      type: String,
      default: 'primary'
    },
    cancelAction: { type: Function, default: () => { this.isOpen = false } },
    saveText: {
      type: String,
      default: 'Save'
    },
    saveColor: {
      type: String,
      default: 'primary'
    },
    handleSaveError: { type: Function, default: (e) => {
        console.error(e);
        this.$notify({
          type: 'error',
          title: 'Server error',
          text: 'The server threw an error while handling the request',
        });
    }},
  },
  emits: ['update:modelValue', 'edit'],
  data: () => ({
    values: null
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
    cancelDisabled() {
      if(this.shouldDisableCancel) {
        for(const row of this.fields) {
          for (const field of row) {
            if(field.required && (this.values[field.key] == null || this.values[field.key] === '')) {
              return true;
            }
            for(const rule of field.rules ?? []) {
              if (rule(this.values[field.key]) !== true) {
                return true;
              }
            }
          }
        }
      }
      return false;
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
    async confirm() {
      const { valid } = await this.$refs.form.value.validate()
      if (!valid) return
      try {
        this.$emit('edit', this.item, this.values);
      } catch(e) {
        console.error(e);
        this.$notify({
          type: 'error',
          title: 'Server error',
          text: 'The server threw an error while handling the request',
        })
        this.handleSaveError(e);
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