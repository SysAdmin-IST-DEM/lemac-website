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
import type { DateTime } from 'luxon';
import { IconValue } from 'vuetify/lib/composables/icons';

type PropsOf<C> =
  C extends new (...args: never[]) => { $props: infer P } ? P : never;

export type AllowedComponent =
  | typeof VTimePicker
  | typeof VDatePicker
  | typeof VTextField
  | typeof VAutocomplete
  | typeof VSwitch
  | typeof VTextarea
  | typeof VSelect
  | typeof VNumberInput;

type TimePickerCase = {
  type?: "time"
  modelValue: string | null | undefined
  rules?: ((v: DynamicModelValue | undefined) => boolean)[]
  props?: Partial<PropsOf<typeof VTimePicker>>
}

type DatePickerCase = {
  type?: "date"
  modelValue: DateTime | DateTime[] | null | undefined
  rules?: ((v: DynamicModelValue | undefined) => boolean)[]
  props?: Partial<PropsOf<typeof VDatePicker>>
}

type TextFieldCase = {
  type?: "text"
  modelValue: string | null | undefined
  rules?: ((v: DynamicModelValue | undefined) => boolean)[]
  props?: Partial<PropsOf<typeof VTextField>>
}

type AutoCompleteCase = {
  type?: "autocomplete"
  modelValue: string | string[] | null | undefined
  rules?: ((v: DynamicModelValue | undefined) => boolean)[]
  props?: Partial<PropsOf<typeof VAutocomplete>>
}

type SwitchCase = {
  type: "switch"
  modelValue: boolean
  rules?: ((v: DynamicModelValue | undefined) => boolean)[]
  props?: Partial<PropsOf<typeof VSwitch>>
}

type TextAreaCase = {
  type: "textarea"
  modelValue: string
  rules?: ((v: DynamicModelValue | undefined) => boolean)[]
  props?: Partial<PropsOf<typeof VTextarea>>
}

type SelectCase = {
  type: "select"
  modelValue: string | string[] | null | undefined
  rules?: ((v: DynamicModelValue | undefined) => boolean)[]
  props?: Partial<PropsOf<typeof VSelect>>
}

type NumberInputCase = {
  type: "number"
  modelValue: number | null | undefined
  rules?: ((v: DynamicModelValue | undefined) => boolean)[]
  props?: Partial<PropsOf<typeof VNumberInput>>
}

type Common = {
  wrapper?: 'menu' | 'dialog' | '',
  label?: string,
  labelIcon?: IconValue,
  required?: boolean
}

export type DynamicFieldProps =
  (TimePickerCase |
    DatePickerCase |
    TextFieldCase |
    AutoCompleteCase |
    SwitchCase |
    TextAreaCase |
    SelectCase |
    NumberInputCase
    ) & Common

export type DynamicModelValue = DynamicFieldProps['modelValue'];