<template>
  <v-menu location="bottom right">
    <template #activator="{ props }">
      <v-btn
        :class="css"
        color="secondary"
        variant="elevated"
        v-bind="props"
      >
        <span>{{ valueRaw ? valueRaw[itemLabel] : defaultLabel }}</span>

        <v-icon end>
          mdi-menu-down
        </v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="(o, index) in objects"
        :key="index"
        @click="value = o[itemValue]"
      >
        <v-list-item-title>{{ o[itemLabel] }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    name: 'DashboardSelect',
    props: {
      modelValue: {
        type: [String, Number],
        default: null,
        required: false,
      },
      items: {
        type: Array,
        required: true,
      },
      defaultLabel: {
        type: String,
        default: '',
      },
      itemLabel: {
        type: String,
        default: 'label',
      },
      itemValue: {
        type: String,
        default: 'value',
      },
      css: {
        type: String,
        default: 'mr-4',
      },
    },
    emits: ['update:modelValue'],
    computed: {
      value: {
        get () {
          return this.modelValue
        },
        set (v) {
          this.$emit('update:modelValue', v)
        },
      },
      valueRaw () {
        const found = this.objects.find(
          o => o[this.itemValue] === this.value,
        )
        return found || null
      },
      objects: {
        get () {
          return this.items.map(item => {
            if (typeof item === 'object') {
              return item
            } else {
              const obj = { [this.itemLabel]: item, [this.itemValue]: item }
              return obj
            }
          })
        },
      },
      labels: {
        get () {
          return this.items.map(item => {
            return typeof item === 'object' ? item[this.itemLabel] : item
          })
        },
      },
    },
  }
</script>

<style scoped></style>
