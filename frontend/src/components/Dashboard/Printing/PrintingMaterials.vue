<template>
  <DashboardTable
    title="Materials"
    :headers="headers"
    :items="materials"
    :new-button="getPermission === 1 ? 'New Material' : undefined"
    :edit-initialization="editInitialization"
    :edit-fields="editFields"
    @edit="editItem"
    @delete="deleteItem"
  >
    <template #[`item.active`]="{ item }">
      <v-chip
        :color="(states.find((v) => v.value === item.active) || {}).color"
        variant="elevated"
        class="capitalized"
      >
        {{ (states.find((v) => v.value === item.active) || {}).title }}
      </v-chip>
    </template>
  </DashboardTable>
</template>

<script lang="ts">
import DashboardTable, {
  type TableHeader,
} from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue';
import {
  addPrintingMaterial,
  deletePrintingMaterial,
  getPrintingMaterials,
  updatePrintingMaterial,
} from '@/api/printingMaterials.api.ts';
import type { EditField } from '@/components/Dashboard/DashboardDataTable/DashboardEditDialog.vue';
import type { PrintMaterial } from '@lemac/data-model/browser';
import { mapState } from 'pinia';
import { useUserStore } from '@/stores/user.ts';

export default {
  name: 'PrintingMaterials',
  components: { DashboardTable },
  data: (): {
    headers: TableHeader[];
    materials: PrintMaterial[];
    states: { title: string, value: boolean, color: string }[];
  } => ({
    headers: [
      { title: 'Name', key: 'name' },
      { title: 'Price Multiplier', key: 'priceMultiplier' },
      { title: 'State', key: 'active', filterable: false },
      { title: 'Short Description', key: 'description' },
      { title: 'Actions', key: 'actions', sortable: false, filterable: false, permission: 1 },
    ],
    materials: [],
    states: [
      { title: 'Active', value: true, color: 'success' },
      { title: 'Inactive', value: false, color: 'error' },
    ]
  }),
  computed: {
    editFields(): EditField[][] {
      return [
        [
          { label: 'Name', key: 'name', type: 'text', required: true },
          {
            label: 'Price Multiplier',
            key: 'priceMultiplier',
            type: 'number',
            required: true,
            props: { precision: 5 },
          },
        ],
        [{ key: 'active', type: 'select', required: true, props: { items: this.states }}],
        [{ label: 'Description', key: 'description', type: 'textarea' }],
      ];
    },
    ...mapState(useUserStore, ['getPermission']),
  },
  async mounted() {
    this.materials = (await getPrintingMaterials()).data;
  },
  methods: {
    editInitialization(item: PrintMaterial) {
      return Object.assign({}, item);
    },
    async editItem(item: PrintMaterial, values: PrintMaterial) {
      if (item) {
         const response = await updatePrintingMaterial(item.id, {
          ...values,
        });

        this.materials.splice(this.materials.indexOf(item), 1, response.data);
        this.$notify({
          type: 'success',
          title: 'Material updated',
          text: `You have updated material ${response.data.name}`,
        });
      } else {
        const response = await addPrintingMaterial({
          ...values,
        });

        this.materials.push(response.data);
        this.$notify({
          type: 'success',
          title: 'Material created',
          text: `You have created material ${response.data.name}`,
        });
      }
    },
    async deleteItem(item: PrintMaterial) {
      await deletePrintingMaterial(item.id);
      const deleted = this.materials.splice(this.materials.indexOf(item), 1);
      this.$notify({
        type: 'success',
        title: 'Material deleted',
        text: `You have deleted material ${deleted[0]!.name}`,
      });
    },
  },
};
</script>