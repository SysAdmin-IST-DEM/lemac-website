<template>
  <!-- Menu wrapper -->
  <v-menu
    v-if="wrapper === 'menu'"
    ref="menu"
    v-model="menu"
    v-model:return-value="internalValue"
    :close-on-content-click="false"
    persistent
    :offset="40"
    transition="scale-transition"
    offset-y
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="formattedInternalValue"
        v-bind="props"
        :label="label"
        :prepend-icon="labelIcon"
        variant="underlined"
        readonly
        :required="required"
        :rules="validationRules"
      />
    </template>

    <component
      :is="resolvedComponent"
      v-model="internalValue"
      v-bind="props"
      color="secondary"
      format="24hr"
      :landscape="true"
      :reactive="true"
      full-width
    >
      <template #actions>
        <v-btn
          variant="text"
          color="success"
          @click="internalValue = undefined; menu = false"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="text"
          color="secondary"
          @click="menu = false"
        >
          OK
        </v-btn>
      </template>
    </component>
  </v-menu>

  <component
    :is="resolvedComponent"
    v-if="wrapper !== 'menu'"
    v-model="internalValue"
    v-bind="props"
    :label="label"
    :prepend-icon="labelIcon"
    :variant="props.variant ? props.variant : 'underlined'"
    :required="required"
    :rules="validationRules"
  />
</template>
<script>
import { VTimePicker } from 'vuetify/labs/components';
import { VDatePicker, VTextField, VAutocomplete, VSwitch, VTextarea, VSelect } from 'vuetify/components';
import moment from 'moment';

export default {
  name: 'DashboardDynamicField',
  props: {
    type: { type: String, default: 'text' },
    wrapper: { type: String, default: '' }, // e.g. 'menu' | 'dialog' | '',
    label: { type: String, default: '' },
    labelIcon: { type: String, default: '' },
    modelValue: [String, Number, Object, Array, Date, Boolean],
    required: { type: Boolean, default: false },
    props: { type: Object, default: () => ({}), },
  },
  emits: ['update:modelValue'],
  data: () => ({
    menu: false,
  }),
  computed: {
    internalValue: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    },
    formattedInternalValue() {
      if (this.type === 'date') {
        return this.internalValue ? moment(this.internalValue).format('YYYY-MM-DD') : '';
      }
      return this.internalValue
    },
    resolvedComponent() {
      if (this.type === 'date') {
        return VDatePicker;
      } else if(this.type === 'time') {
        return VTimePicker;
      } else if(this.type === 'autocomplete') {
        return VAutocomplete;
      } else if(this.type === 'switch') {
        return VSwitch;
      } else if(this.type === 'textarea') {
        return VTextarea;
      } else if(this.type === 'select') {
        return VSelect;
      }
      return VTextField;
    },
    validationRules() {
      const rules = []

      if (this.required) {
        rules.push(v => !!v || 'This field is required')
      }

      return rules
    }
  }
}
</script>