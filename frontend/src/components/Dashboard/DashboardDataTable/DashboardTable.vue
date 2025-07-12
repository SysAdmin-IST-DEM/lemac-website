<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :search="searchQuery"
    :sort-by="sortBy"
    :single-expand="expand"
    :show-expand="expand"
  >
    <!-- Forward all the item.<> slots -->
    <template
      v-for="col in filterSlotHeaders"
      #[`item.${col.key}`]="slotProps"
      :key="col.key"
    >
      <slot
        v-if="$slots[`item.${col.key}`]"
        :name="`item.${col.key}`"
        v-bind="slotProps"
      />
    </template>

    <!-- Forward the expanded-row slot -->
    <template #expanded-row="{ columns, item }">
      <slot
        name="expanded-row"
        :columns="columns"
        :item="item"
      />
    </template>

    <template #top>
      <!-- Table toolbar -->
      <v-toolbar flat>
        <v-toolbar-title class="flex-0-0">
          {{ title }}
        </v-toolbar-title>
        <v-divider
          class="mx-4 border-opacity-100"
          vertical
          inset
        />
        <v-text-field
          v-if="search"
          v-model="searchQuery"
          class="mt-2"
          label="Search"
          variant="underlined"
          color="secondary"
        />
        <v-spacer />
        <slot name="button">
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
        </slot>

        <!-- Custom slot for dialogs -->
        <slot name="dialogs">
          <!-- Delete dialog -->
          <DashboardDeleteDialog
            v-model="deleteDialog"
            :item="selectedItem"
            @delete="$emit('delete', selectedItem)"
          />

          <!-- Edit dialog -->
          <DashboardEditDialog
            v-model="editDialog"
            :item="selectedItem"
            :fields="editFields"
            :on-initialization="editInitialization"
            @edit="(item, values) => $emit('edit', selectedItem, values)"
          >
            <template #title>
              {{ title }}
            </template>
          </DashboardEditDialog>
        </slot>

        <slot name="dialogs-append" />
      </v-toolbar>
    </template>

    <template
      v-if="actionHeader && actionHeader.permission ? getPermission >= actionHeader.permission : true"
      #[`item.actions`]="{ item }"
    >
      <v-icon
        size="small"
        class="mr-2"
        @click="openEditDialog(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="openDeleteDialog(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import DashboardEditDialog from '@/components/Dashboard/DashboardDataTable/DashboardEditDialog.vue';
import DashboardDeleteDialog from '@/components/Dashboard/DashboardDataTable/DashboardDeleteDialog.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'DashboardTable',
  components: { DashboardEditDialog, DashboardDeleteDialog },
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
      default: () => [],
    },
    editInitialization: {
      type: Function,
      default: () => {},
    },
    expand: {
      type: Boolean,
      default: false,
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
    actionHeader() {
      return this.headers.find((header) => header.key === 'actions');
    },
    ...mapGetters('user', ['getPermission'])
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
