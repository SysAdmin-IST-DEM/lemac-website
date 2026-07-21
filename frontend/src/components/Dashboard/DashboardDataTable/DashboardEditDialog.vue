<template>
  <v-dialog
    v-model="isOpen"
    :max-width="maxWidth"
    :persistent="persistent"
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
          @submit.prevent="confirm"
        >
          <v-container>
            <v-row dense>
              <v-col
                cols="12"
                :md="$slots['after-row'] ? 8 : 12"
              >
                <v-row
                  v-for="(row, index) in fields"
                  :key="index"
                  dense
                >
                  <v-col
                    v-for="(field, fieldIndex) in row"
                    :key="fieldIndex"
                    v-bind="field.colProps"
                  >
                    <DashboardDynamicField
                      v-if="field.permission ? field.permission >= getPermission : true"
                      :label="field.label"
                      :label-icon="field.labelIcon"
                      :model-value="getNestedValue(valuesAny, field.key)"
                      :props="field.props"
                      :readonly="readonly"
                      :required="field.required"
                      :rules="field.rules"
                      :type="field.type"
                      :wrapper="field.type === 'date' || field.type === 'time' ? 'menu' : ''"
                      @update:model-value="setNestedValue(valuesAny, field.key, $event)"
                    />
                  </v-col>
                </v-row>
              </v-col>

              <slot name="after-row" />
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <slot name="footer" />
        <v-spacer />

        <v-btn
          :color="cancelColor"
          variant="text"
          @click="handleCancel"
        >
          {{ cancelText }}
        </v-btn>

        <v-btn
          :color="saveColor"
          :disabled="saveDisabled"
          variant="text"
          @click="confirm"
        >
          {{ saveText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { DynamicFieldProps, DynamicModelValue } from '@/types/Dashboard/DashboardDynamicField'
  import { useNotification } from '@kyvg/vue3-notification'
  import { computed, onMounted, type Ref, ref, watch } from 'vue'
  import { VCol, VForm } from 'vuetify/components'
  import DashboardDynamicField from '@/components/Dashboard/DashboardDataTable/DashboardDynamicField.vue'
  import { useUserStore } from '@/stores/user.js'

  export type EditField = {
    key: string
    permission?: number
    default?: DynamicModelValue
    colProps?: PropsOf<typeof VCol>
  } & Omit<DynamicFieldProps, 'modelValue'>

  export type EditItem = any

  const { notify } = useNotification()

  defineOptions({
    name: 'DashboardEditDialog',
  })

  const props = withDefaults(
    defineProps<{
      modelValue: boolean
      item: EditItem | null
      fields: EditField[][]
      onInitialization?: (item: EditItem) => EditItem
      maxWidth?: string | number
      shouldDisableSave?: boolean
      cancelText?: string
      cancelColor?: string
      cancelAction?: () => void
      saveText?: string
      saveColor?: string
      onSaveError?: (e: unknown) => void
      readonly?: boolean
      persistent?: boolean
    }>(),
    {
      onInitialization: () => {
        return {} as EditItem
      },
      maxWidth: '550px',
      shouldDisableSave: false,
      cancelText: 'Cancel',
      cancelColor: 'primary',
      cancelAction: undefined,
      saveText: 'Save',
      saveColor: 'primary',
      onSaveError: undefined,
      readonly: false,
      persistent: false,
    },
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'edit', item: EditItem | null, values: EditItem): void
  }>()

  const values = ref<EditItem>({} as EditItem)
  const valuesAny = values as unknown as Ref<Record<string, unknown>>
  const form = ref<InstanceType<typeof VForm> | null>(null)

  const isOpen = computed({
    get: () => {
      return props.modelValue
    },
    set: (value: boolean) => {
      emit('update:modelValue', value)
    },
  })

  function handleCancel () {
    if (props.cancelAction) {
      props.cancelAction()
    } else {
      isOpen.value = false
    }
  }

  const saveDisabled = computed(() => {
    if (props.shouldDisableSave) {
      for (const row of props.fields) {
        for (const field of row) {
          if (field.required && (values.value[field.key] == null || values.value[field.key] === '')) {
            return true
          }
          for (const rule of field.rules ?? []) {
            if (!rule(values.value[field.key])) {
              return true
            }
          }
        }
      }
    }
    return false
  })

  const getPermission = computed(() => useUserStore().getPermission)

  onMounted(() => {
    initializeEmpty()
  })

  function handleSaveError (e: unknown) {
    if (props.onSaveError) {
      props.onSaveError(e)
    } else {
      console.error(e)
      notify({
        type: 'error',
        title: 'Server error',
        text: 'The server threw an error while handling the request',
      })
    }
  }

  async function confirm () {
    if (!form.value) return
    const { valid } = await form.value.validate()
    if (!valid) return
    try {
      emit('edit', props.item, values.value)
    } catch (error) {
      console.error(error)
      notify({
        type: 'error',
        title: 'Server error',
        text: 'The server threw an error while handling the request',
      })
      handleSaveError(error)
    } finally {
      isOpen.value = false
    }
  }

  function initializeEmpty () {
    values.value = {}
    for (const row of props.fields) {
      for (const field of row) {
        values.value[field.key] = field.default ?? null
      }
    }
  }

  watch(() => props.modelValue,
        newValue => {
          if (props.item === null || !newValue) {
            initializeEmpty()
          } else {
            values.value = props.onInitialization(props.item)
          }
        },
  )

  defineExpose({ values })

  function getNestedValue (obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  function setNestedValue (obj: any, path: string, value: any) {
    const parts = path.split('.')
    const lastPart = parts.pop()

    const target = parts.reduce((acc, part) => {
      if (!acc[part]) acc[part] = {}
      return acc[part]
    }, obj)

    if (lastPart) target[lastPart!] = value
  }
</script>
