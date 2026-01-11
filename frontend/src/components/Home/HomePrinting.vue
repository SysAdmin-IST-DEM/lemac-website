<template>
  <v-card class="px-4 mx-auto">
    <v-form @submit.prevent>
      <h1 class="w-full text-4xl font-medium text-center m-6!">3D Printing submission form:</h1>

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
          v-model="values.studentName"
          label="Full Name"
          required
          prepend-icon="mdi-account"
          variant="underlined"
          class="m-1!"
        />
      </v-row>

      <v-row>
        <v-text-field
          v-model="values.studentId"
          label="IST-ID"
          :rules="[(v: string) => (/^ist[12]\d{5,6}$/.test(v) ? true : '')]"
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
          item-title="name"
          item-value="id"
          label="Material"
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

      <v-row>
        <v-col>
          <span class="text-base">
            <b class="text-xl">Volume (cm³):</b> {{ volume.toFixed(3) }}
          </span>
          <span class="text-base ml-3">
            <b class="text-xl">Bounding box size (cm):</b>
            ({{ boundingBoxSize.x.toFixed(3) }}, {{ boundingBoxSize.y.toFixed(3) }},
            {{ boundingBoxSize.z.toFixed(3) }})
          </span>
          <span class="text-base ml-3">
            <b class="text-xl">Price (€):</b> {{ values.price.toFixed(2) }}
          </span>
        </v-col>
        <v-col cols="auto">
          <v-btn
            type="submit"
            class="mb-6"
            color="primary"
            @click="submitDialog = true"
          >
            Submit
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>

  <PrintingConfirmationDialog
    ref="printingDialog"
    v-model="submitDialog"
    :values="values"
    :file="modelFile"
    :volume="volume"
    :materials="materials"
    @confirm="submit"
  />
</template>

<script lang="ts">
import PrintingConfirmationDialog from '@/components/Home/Printing/PrintingConfirmationDialog.vue';
import { Unit, type AddPrintTaskBody, type PrintMaterial } from '@lemac/data-model/browser';
import AuthenticateButton from '@/components/Home/AuthenticateButton.vue';
import { addPrintTask } from '@/api/printingTasks.api.ts';
import { getPrintingMaterials } from '@/api/printingMaterials.api.ts';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

const METERS_PER_UNIT: { [key in Unit]: number } = {
  MILIMETERS: 1e-3,
  CENTIMETERS: 1e-2,
  METERS: 1,
};

const initialData: AddPrintTaskBody = {
  studentName: '',
  studentId: '',
  email: '',
  unit: Unit.CENTIMETERS,
  price: 0,
  materialId: 0,
};

export default {
  name: 'HomePrinting',
  components: { AuthenticateButton, PrintingConfirmationDialog },
  data(): {
    values: AddPrintTaskBody;
    modelFile: File | null;
    units: Unit[];
    materials: PrintMaterial[];
    volume: number;
    boundingBoxSize: THREE.Vector3;
    submitDialog: boolean;
  } {
    return {
      values: initialData,
      modelFile: null,
      units: Object.values(Unit),
      materials: [],
      volume: 0,
      boundingBoxSize: new THREE.Vector3(0, 0, 0),
      submitDialog: false,
    };
  },
  computed: {
    selectedMaterial() {
      return this.materials.find((material) => material.id === this.values.materialId);
    },
  },
  watch: {
    async modelFile() {
      if (!this.modelFile) {
        this.boundingBoxSize = new THREE.Vector3(0, 0, 0);
        this.volume = 0;
        this.values.price = 0;
        return;
      }
      const { rawVolume, boundingBoxSize } = await this.calculateVolume(this.modelFile);
      this.boundingBoxSize = new THREE.Vector3(
        this.convertDistance(boundingBoxSize.x, this.values.unit, Unit.CENTIMETERS),
        this.convertDistance(boundingBoxSize.y, this.values.unit, Unit.CENTIMETERS),
        this.convertDistance(boundingBoxSize.z, this.values.unit, Unit.CENTIMETERS)
      );
      this.volume = this.convertVolume(rawVolume, this.values.unit, Unit.CENTIMETERS);
      this.values.price = this.volume * (this.selectedMaterial?.priceMultiplier || 0);
    },
    'values.materialId'() {
      if (!this.modelFile) {
        this.boundingBoxSize = new THREE.Vector3(0, 0, 0);
        this.volume = 0;
        this.values.price = 0;
        return;
      }
      this.values.price = this.volume * (this.selectedMaterial?.priceMultiplier || 0);
    },
    async 'values.unit'() {
      if (!this.modelFile) {
        this.boundingBoxSize = new THREE.Vector3(0, 0, 0);
        this.volume = 0;
        this.values.price = 0;
        return;
      }
      const { rawVolume, boundingBoxSize } = await this.calculateVolume(this.modelFile);
      console.log('RV:', rawVolume);
      this.boundingBoxSize = new THREE.Vector3(
        this.convertDistance(boundingBoxSize.x, this.values.unit, Unit.CENTIMETERS),
        this.convertDistance(boundingBoxSize.y, this.values.unit, Unit.CENTIMETERS),
        this.convertDistance(boundingBoxSize.z, this.values.unit, Unit.CENTIMETERS)
      );
      this.volume = this.convertVolume(rawVolume, this.values.unit, Unit.CENTIMETERS);
      this.values.price = this.volume * (this.selectedMaterial?.priceMultiplier || 0);
    },
  },
  async mounted() {
    this.materials = (await getPrintingMaterials()).data;
    initialData.materialId = this.materials[0]?.id || 0;
  },
  methods: {
    async submit() {
      const task = (await addPrintTask(this.modelFile!, this.values)).data;
      this.submitDialog = false;
      (this.$refs.printingDialog as typeof PrintingConfirmationDialog).loading = false;
      this.values = initialData;
      this.modelFile = null;
      this.$notify({
        type: 'success',
        title: 'Submission Successful',
        text: `Your printing task (ID: ${task.id}) has been submitted successfully!`,
      });
    },
    fillForm(data: { name: string; username: string; institutionalEmail: string }) {
      this.values.studentName = data.name;
      this.values.studentId = data.username;
      this.values.email = data.institutionalEmail;
    },
    // Volume calculation from STL
    convertVolume(volume: number, fromUnit: Unit, toUnit: Unit) {
      const from = METERS_PER_UNIT[fromUnit];
      const to = METERS_PER_UNIT[toUnit];
      return volume * Math.pow(from / to, 3);
    },
    // Unit calculation from STL
    convertDistance(volume: number, fromUnit: Unit, toUnit: Unit) {
      const from = METERS_PER_UNIT[fromUnit];
      const to = METERS_PER_UNIT[toUnit];
      return volume * Math.pow(from / to, 1);
    },
    async calculateVolume(file: File) {
      const arrayBuffer = await file.arrayBuffer();

      const loader = new STLLoader();
      const geometry = loader.parse(arrayBuffer);

      const geo = geometry.index ? geometry.toNonIndexed() : geometry;
      const pos = geo.attributes.position!.array;

      let rawVolume = 0; // in (modelUnit)^3
      const a = new THREE.Vector3();
      const b = new THREE.Vector3();
      const c = new THREE.Vector3();
      const cross = new THREE.Vector3();

      for (let i = 0; i < pos.length; i += 9) {
        a.fromArray(pos, i);
        b.fromArray(pos, i + 3);
        c.fromArray(pos, i + 6);

        cross.crossVectors(b, c);
        rawVolume += a.dot(cross) / 6;
      }

      rawVolume = Math.abs(rawVolume);

      geometry.computeBoundingBox();
      const bbox = geometry.boundingBox;
      const boundingBoxSize = new THREE.Vector3();
      if (bbox) bbox.getSize(boundingBoxSize);

      return { rawVolume, boundingBoxSize };
    },
  },
};
</script>
