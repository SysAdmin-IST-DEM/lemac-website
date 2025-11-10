<template>
  <v-menu location="bottom right">
    <template #activator="{ props }">
      <v-btn color="secondary" variant="elevated" class="mr-4" v-bind="props">
        <span>{{ value ?? defaultLabel }}</span>
        <v-icon end> mdi-menu-down </v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(o, index) in objects" :key="index" @click="value = o.value">
        <v-list-item-title>{{ o.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'DashboardSelect',
  props: {
    modelValue: {
      type: [String, null, undefined],
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    defaultLabel: {
      type: String,
      default: ""
    },
  },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() { return this.modelValue },
      set(v) { this.$emit('update:modelValue', v) }
    },
    objects: {
      get() {
        return this.items.map((item) => {
          if(typeof item === 'object') {
            return item;
          } else {
            return { label: item, value: item };
          }
        });
      }
    },
    labels: {
      get() {
        return this.items.map((item) => {
          if(typeof item === 'object') {
            return item.label;
          } else {
            return item;
          }
        });
      },
    },
  },
};
</script>

<style scoped></style>