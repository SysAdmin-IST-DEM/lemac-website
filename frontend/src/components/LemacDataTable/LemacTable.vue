<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :search="searchQuery"
    :sort-by="sortBy"
    class="elevation-1"
  >
    <!-- Forward all the item.<> slots -->
    <template v-for="col in filterSlotHeaders" #[`item.${col.key}`]="slotProps" :key="col.key">
      <slot v-if="$slots[`item.${col.key}`]" :name="`item.${col.key}`" v-bind="slotProps" />
    </template>

    <template #top>
      <!-- Table toolbar -->
      <v-toolbar flat>
        <v-toolbar-title class="flex-0-0">
          {{ title }}
        </v-toolbar-title>
        <v-divider class="mx-4 border-opacity-100" vertical />
        <v-text-field
          v-if="search"
          v-model="searchQuery"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
        <v-spacer />
        <v-btn
          v-if="newButton"
          color="secondary"
          variant="elevated"
          class="mb-2 mr-4"
          @click="
            selectedItem = null;
            editDialog = true;
          "
        >
          {{ newButton }}
        </v-btn>

        <!-- Custom slot for dialogs -->
        <slot name="dialogs">
          <!-- Delete dialog -->
          <LemacDeleteDialog
            v-model="deleteDialog"
            :item="selectedItem"
            @delete="$emit('delete', selectedItem)"
          />

          <!-- Edit dialog -->
          <LemacEditDialog
            v-model="editDialog"
            :item="selectedItem"
            :fields="editFields"
            :on-initialization="editInitialization"
            @edit="(item, values) => $emit('edit', selectedItem, values)"
          >
            <template #title>
              {{ title }}
            </template>
          </LemacEditDialog>
        </slot>
      </v-toolbar>
    </template>

    <template #[`item.actions`]="{ item }">
      <v-icon size="small" class="mr-2" @click="openEditDialog(item)"> mdi-pencil </v-icon>
      <v-icon size="small" @click="openDeleteDialog(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import LemacEditDialog from '@/components/LemacDataTable/LemacEditDialog.vue';
import LemacDeleteDialog from '@/components/LemacDataTable/LemacDeleteDialog.vue';

export default {
  name: 'LemacDataTable',
  components: { LemacEditDialog, LemacDeleteDialog },
  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    sortBy: {
      type: Array,
      default: () => [],
    },
    search: Boolean,
    newButton: {
      type: String,
      default: null,
    },
    editFields: {
      type: Array,
      default: null,
    },
    editInitialization: {
      type: Function,
      default: () => {},
    },
  },
  emits: ['delete', 'edit'],
  data: () => ({
    searchQuery: '',
    selectedItem: null,
    deleteDialog: false,
    editDialog: false,
  }),
  computed: {
    filterSlotHeaders() {
      return this.headers.filter((header) => this.$slots[`item.${header.key}`]);
    },
  },
  mounted() {},
  methods: {
    openDeleteDialog(item) {
      this.selectedItem = item;
      this.deleteDialog = true;
    },
    openEditDialog(item) {
      this.selectedItem = item;
      this.editDialog = true;
    },
  },
};
</script>
