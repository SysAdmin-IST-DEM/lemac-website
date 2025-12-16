<template>
  <DashboardTable
    title="Materials"
    :headers="headers"
    :items="materials"
    new-button="New Material"
    :edit-initialization="editInitialization"
    :edit-fields="editFields"
    :loading="loading"
    @edit="editItem"
    @delete="deleteItem"
  />
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
import { deleteUser } from '@/api/user.api.ts';

export default {
  name: 'PrintingMaterials',
  components: { DashboardTable },
  data: (): {
    headers: TableHeader[];
    editFields: EditField[][];
    materials: PrintMaterial[];
    loading: boolean;
  } => ({
    headers: [
      { title: 'Name', key: 'name' },
      { title: 'Price Multiplier', key: 'priceMultiplier' },
      { title: 'Description', key: 'description' },
      { title: 'Actions', key: 'actions', sortable: false, filterable: false },
    ],
    editFields: [
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
      [{ label: 'Description', key: 'description', type: 'textarea' }],
    ],
    materials: [],
    loading: true,
  }),
  async mounted() {
    this.materials = (await getPrintingMaterials()).data;
    this.loading = false;
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