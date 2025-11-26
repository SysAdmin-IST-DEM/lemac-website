<template>
  <!-- Menu wrapper -->
  <v-menu
    v-if="wrapper === 'menu'"
    v-model="menu"
    v-model:return-value="internalValue"
    :close-on-content-click="false"
    persistent
    :offset="40"
    transition="scale-transition"
  >
    <template #activator="{ props: activatorProps }">
      <v-text-field
        v-model="formattedInternalValue"
        v-bind="activatorProps"
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
      v-bind="props.props"
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
    v-bind="props.props"
    :label="label"
    :prepend-icon="labelIcon"
    :variant="(props.props as any).variant ? (props.props as any).variant : 'underlined'"
    :required="required"
    :rules="validationRules"
  />
</template>

<script lang="ts" setup>
import { computed, type ComputedRef, ref } from 'vue';
import { DateTime } from 'luxon';
import type { DynamicFieldProps, DynamicModelValue } from '@/types/Dashboard/DashboardDynamicField';
import {
  VAutocomplete,
  VDatePicker,
  VNumberInput,
  VSelect,
  VSwitch,
  VTextarea,
  VTextField,
  VTimePicker,
} from 'vuetify/components';

defineOptions({
  name: 'DashboardDynamicField',
})

const props = withDefaults(
  defineProps<DynamicFieldProps>(),
  {
    type: "text",
    wrapper: '',
    label: '',
    labelIcon: '',
    required: false,
    rules: () => [],
    props: () => ({}),
  }
)

const resolvedComponent = computed(() => {
  switch (props.type) {
    case 'time':
      return VTimePicker;
    case 'date':
      return VDatePicker;
    case 'text':
      return VTextField;
    case 'autocomplete':
      return VAutocomplete;
    case 'switch':
      return VSwitch;
    case 'textarea':
      return VTextarea;
    case 'select':
      return VSelect;
    case 'number':
      return VNumberInput;
    default:
      return VTextField;
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void
}>()

const menu = ref(false);

const internalValue: ComputedRef<DynamicModelValue> = computed({
  get: () => {
    return props.modelValue as DynamicModelValue
  },
  set: (value) => {
    emit('update:modelValue', value)
  }
});
const formattedInternalValue = computed(() => {
  const value = internalValue.value;
  if (props.type === 'date') {
    const dateProps = props.props as PropsOf<typeof VDatePicker>;

    if(dateProps.multiple === 'range' && Array.isArray(value)) {
      const dateValue = value as DateTime[];
      const start = dateValue[0] ? dateValue[0].toFormat('yyyy-MM-dd') : '';
      const end = dateValue[dateValue.length - 1] ? dateValue[dateValue.length - 1]?.toFormat('yyyy-MM-dd') : '';
      return start && end ? `${start} to ${end}` : '';
    }
    return value ? (value as DateTime).toFormat('yyyy-MM-dd') : '';
  }
  return value;
})

const validationRules = computed(() => {
  const rules = []

  if (props.required) {
    rules.push((v: unknown) => (v !== null && v !== undefined && v !== '') || 'This field is required')
  }

  rules.push(...props.rules);

  return rules
})
</script>