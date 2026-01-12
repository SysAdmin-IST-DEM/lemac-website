<template>
  <v-dialog
    v-model="isOpen"
    :max-width="maxWidth"
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
                      v-model="valuesAny[field.key]"
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
              </v-col>

              <slot name="after-row" />
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
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

<script setup lang="ts">
import DashboardDynamicField from '@/components/Dashboard/DashboardDataTable/DashboardDynamicField.vue';
import { useUserStore } from '@/stores/user.js';
import { computed, onMounted, type Ref, ref, watch } from 'vue';
import { useNotification } from '@kyvg/vue3-notification';
import { VCol, VForm } from 'vuetify/components';
import type { DynamicFieldProps, DynamicModelValue } from '@/types/Dashboard/DashboardDynamicField';

export type EditField = {
  key: string,
  permission?: number,
  default?: DynamicModelValue,
  colProps?: PropsOf<typeof VCol>
} & Omit<DynamicFieldProps, 'modelValue'>;

export type EditItem = any;

const { notify } = useNotification();

defineOptions({
  name: 'DashboardEditDialog',
});

const props = withDefaults(
  defineProps<{
    modelValue: boolean,
    item: EditItem | null,
    fields: EditField[][],
    onInitialization?: (item: EditItem) => EditItem,
    maxWidth?: string | number,
    shouldDisableCancel?: boolean
    cancelText?: string,
    cancelColor?: string,
    cancelAction?: () => void,
    saveText?: string,
    saveColor?: string,
    onSaveError?: (e: unknown) => void,
  }>(),
  {
    onInitialization: () => {return {} as EditItem},
    maxWidth: '550px',
    shouldDisableCancel: false,
    cancelText: 'Cancel',
    cancelColor: 'primary',
    cancelAction: undefined,
    saveText: 'Save',
    saveColor: 'primary',
    onSaveError: undefined
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
  (e: 'edit', item: EditItem | null, values: EditItem): void
}>()

const values = ref<EditItem>({} as EditItem);
const valuesAny = values as unknown as Ref<Record<string, unknown>>;
const form = ref<InstanceType<typeof VForm> | null>(null);

const isOpen = computed({
  get: () => {
    return props.modelValue
  },
  set: (value: boolean) => {
    emit('update:modelValue', value)
  }
})

const handleCancel = () => {
  if (props.cancelAction) {
    props.cancelAction();
  } else {
    isOpen.value = false;
  }
}

const cancelDisabled = computed(() => {
  if(props.shouldDisableCancel) {
    for(const row of props.fields) {
      for (const field of row) {
        if(field.required && (values.value[field.key] == null || values.value[field.key] === '')) {
          return true;
        }
        for(const rule of field.rules ?? []) {
          if (rule(values.value[field.key]) !== true) {
            return true;
          }
        }
      }
    }
  }
  return false;
})

const getPermission = computed(() => useUserStore().getPermission);

onMounted(() => {
  initializeEmpty();
});

function handleSaveError(e: unknown) {
  if(props.onSaveError) {
    props.onSaveError(e);
  } else {
    console.error(e);
    notify({
      type: 'error',
      title: 'Server error',
      text: 'The server threw an error while handling the request',
    });
  }
}

async function confirm() {
  if(!form.value) return;
  const { valid } = await form.value.validate()
  if (!valid) return
  try {
    emit('edit', props.item, values.value);
  } catch(e) {
    console.error(e);
    notify({
      type: 'error',
      title: 'Server error',
      text: 'The server threw an error while handling the request',
    })
    handleSaveError(e);
  } finally {
    isOpen.value = false;
  }
}

function initializeEmpty() {
  values.value = {};
  for(const row of props.fields) {
    for (const field of row) {
      values.value[field.key] = field.default ?? null;
    }
  }
}

watch(() => props.modelValue,
  (newValue) => {
    if(props.item === null || !newValue) {
      initializeEmpty();
    } else {
      values.value = props.onInitialization(props.item);
    }
  }
)
</script>