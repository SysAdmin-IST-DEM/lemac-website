<template>
  <v-card class="max-w-6xl px-4 mx-auto">
    <v-form @submit.prevent>
      <h1 class="w-full text-4xl font-medium text-center m-6!">
        3D Printing submission form:
      </h1>

      <v-row>
        <div class="m-auto!">
          <span>Automatic Fill Form</span>
          <AuthenticateButton
            page="printing"
            class="ml-3"
            @authenticated="fillForm"
          />
        </div>
      </v-row>

      <!-- Form Fields -->
      <v-row>
        <v-text-field
          v-model="values.name"
          label="Full Name"
          required
          prepend-icon="mdi-account"
          variant="underlined"
          class="m-1!"
        />
      </v-row>

      <v-row>
        <v-text-field
          v-model="values.istId"
          label="IST-ID"
          :rules="[(v: string) => /^ist[12]\d{5,6}$/.test(v) ? true : '']"
          required
          prepend-icon="mdi-id-card"
          variant="underlined"
          class="m-1!"
        />

        <v-text-field
          v-model="values.email"
          label="Técnico Webmail"
          required
          prepend-icon="mdi-at"
          variant="underlined"
          class="m-1!"
        />
      </v-row>

      <v-row>
        <v-select
          v-model="values.unit"
          :items="units"
          label="Unit of file"
          required
          prepend-icon="mdi-map-marker-distance"
          variant="underlined"
          class="m-1!"
        />

        <v-file-input
          v-model="modelFile"
          label="Model STL"
          required
          prepend-icon="mdi-paperclip"
          variant="underlined"
          class="m-1!"
        />

        <v-select
          v-model="values.materialId"
          :items="materials"
          label="Unit of file"
          required
          prepend-icon="mdi-palette-swatch"
          variant="underlined"
          class="m-1!"
        />
      </v-row>

      <v-row>
        <v-textarea
          v-model="values.observations"
          label="Additional Notes"
          required
          prepend-icon="mdi-text"
          variant="outlined"
          class="m-1!"
        />
      </v-row>

      <v-btn
        type="submit"
        block
        class="mt-5 mb-2"
        color="primary"
        @click="submitDialog = true;"
      >
        Submit
      </v-btn>
    </v-form>
  </v-card>

  <PrintingDialog
    ref="printingDialog"
    v-model="submitDialog"
    :values="values"
    :file="modelFile"
    :materials="materials"
    @confirm="submit"
    @close="submitDialog = false"
  />
</template>

<script lang="ts">
import PrintingDialog from '@/components/Home/Printing/PrintingDialog.vue';
import { Unit, type AddPrintTaskBody } from '@lemac/data-model/browser';
import AuthenticateButton from '@/components/Home/AuthenticateButton.vue';
import { addPrintTask } from '@/api/printingTasks.api.ts';
import { getPrintingMaterials } from '@/api/printingMaterials.api.ts';

export default {
  name: 'HomePrinting',
  components: { AuthenticateButton, PrintingDialog },
  data(): {
    values: AddPrintTaskBody;
    modelFile: File | null;
    units: Unit[];
    materials: { title: string; value: number }[];
    submitDialog: boolean;
  } {
    const initial: AddPrintTaskBody = {
      name: '',
      email: '',
      istId: '',
      unit: Unit.MILIMETERS,
      materialId: 0,
    };
    return {
      values: initial,
      modelFile: null,
      units: Object.values(Unit),
      materials: [],
      submitDialog: false,
    };
  },
  watch: {
    /*chosen_material() {
      this.calculatePrice(this.volume);
    },
    chosen_unit() {
      this.calculatePrice(this.volume);
    },*/
  },
  async mounted() {
    this.materials = (await getPrintingMaterials()).data.map((material) => ({
      title: material.name,
      value: material.id,
    }));
  },
  methods: {
    async submit() {
      const task = (await addPrintTask(this.modelFile!, this.values)).data;
      this.submitDialog = false;
      (this.$refs.printingDialog as never).loading = false;
      this.values = {
        name: '',
        email: '',
        istId: '',
        unit: Unit.MILIMETERS,
        materialId: 0,
      };
      this.modelFile = null;
      this.$notify({
        type: 'success',
        title: 'Submission Successful',
        text: `Your printing task (ID: ${task.id}) has been submitted successfully!`,
      })
    },
    fillForm(data: { name: string; username: string; institutionalEmail: string }) {
      this.values.name = data.name;
      this.values.istId = data.username;
      this.values.email = data.institutionalEmail;
    }
  }
};
</script>
