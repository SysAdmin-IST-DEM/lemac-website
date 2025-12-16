<template>
  <component
    :is="type"
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
      <v-toolbar
        v-if="!hideHeader"
        flat
      >
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
            @click="openEditDialog(null)"
          >
            {{ newButton }}
          </v-btn>
        </slot>

        <slot name="toolbar-append" />
      </v-toolbar>

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
          @edit="(item: EditItem | null, values: EditItem) => { $emit('edit', selectedItem, values) }"
        >
          <template #title>
            {{ title }}
          </template>
        </DashboardEditDialog>
      </slot>

      <slot name="dialogs-append" />
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
  </component>
</template>

<script lang="ts">
import { VDataTable, type VDataTableServer } from 'vuetify/components';
import DashboardDeleteDialog from '@/components/Dashboard/DashboardDataTable/DashboardDeleteDialog.vue';
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user.js';
import type { PropType } from 'vue';
import type { DynamicModelValue } from '@/types/Dashboard/DashboardDynamicField';
import DashboardEditDialog, {
  type EditField,
  type EditItem,
} from '@/components/Dashboard/DashboardDataTable/DashboardEditDialog.vue';

export type TableHeader = {
  readonly title: string,
  readonly key: string,
  readonly sortable?: boolean,
  readonly filterable?: boolean,
  readonly permission?: number
}

export default {
  name: 'DashboardTable',
  components: { DashboardEditDialog, DashboardDeleteDialog },
  props: {
    type : {
      type: Object as PropType<VDataTable | VDataTableServer>,
      default: VDataTable,
    },
    title: {
      type: String,
      default: "Dashboard Table",
    },
    items: {
      type: Array as PropType<EditItem[]>,
      required: true,
    },
    headers: {
      type: Array as PropType<readonly TableHeader[]>,
      required: true,
    },
    hideHeader: {
      type: Boolean,
      default: false,
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
      type: Array as PropType<EditField[][]>,
      default: () => [],
    },
    editInitialization: {
      type: Function as PropType<(item: EditItem) => EditItem>,
      default: () => {},
    },
    expand: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['delete', 'edit'],
  data(): {
    searchQuery: string,
    selectedItem: EditItem | null,
    deleteDialog: boolean,
    editDialog: boolean
  } {
    return {
        searchQuery: '',
        selectedItem: null,
        deleteDialog: false,
        editDialog: false
    }
  },
  computed: {
    filterSlotHeaders() {
      return this.headers.filter((header) => this.$slots[`item.${header.key}`]);
    },
    actionHeader() {
      return this.headers.find((header) => header.key === 'actions');
    },
    ...mapState(useUserStore, ['getPermission'])
  },
  mounted() {},
  methods: {
    openDeleteDialog(item: typeof this.items[number]) {
      this.selectedItem = item;
      this.deleteDialog = true;
    },
    openEditDialog(item: typeof this.items[number] | null) {
      this.selectedItem = item;
      this.editDialog = true;
    },
  },
};
</script>