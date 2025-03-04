<template>
  <div class="w-full h-full">
    <v-card class="max-w-6xl px-4 mx-auto" @submit.prevent>
      <h1 class="w-full m-6 text-4xl font-medium text-center">3D Printing submission form:</h1>
      <v-row class="gap-4 mx-0">
        <v-text-field v-model="firstName" :rules="rules" label="First name"></v-text-field>
        <v-text-field v-model="lastName" :rules="rules" label="Last Name"></v-text-field>
      </v-row>
      <v-row class="gap-4 mx-0">
        <v-text-field v-model="tecnicoId" :rules="rules" label="IST ID"></v-text-field>
        <v-text-field v-model="webmail" :rules="rules" label="Técnico Webmail"></v-text-field>
      </v-row>
      <v-row class="gap-4 mx-0">
        <div class="w-48">
          <v-select v-model="chosen_unit" :items="units" label="Unit of file"></v-select>
        </div>
        <v-file-input
          v-model="file"
          label="Model STL"
          accept=".stl,.step,.stp"
          @change="test"
        ></v-file-input>
        <div>
          <v-select v-model="chosen_material" :items="materials" label="Material"></v-select>
        </div>
      </v-row>
      <v-row class="gap-4 mx-0">
        <div class="w-full">
          <v-textarea
            v-model="notes"
            label="Additional Notes"
            rows="3"
            variant="outlined"
            maxlength="350"
            counter
          ></v-textarea>
        </div>
      </v-row>
      <div class="flex flex-col items-start justify-start gap-4 mx-0 my-4">
        <span class="text-base"><b class="text-xl">Volume:</b> {{ volume?.toFixed(2) ?? 0 }}</span>
        <span class="text-base"
          ><b class="text-xl">Bounding box size:</b> ({{ boundingBoxSize?.x.toFixed(2) ?? 0 }},
          {{ boundingBoxSize?.y.toFixed(2) ?? 0 }}, {{ boundingBoxSize?.z.toFixed(2) ?? 0 }})</span
        >
        <span class="text-base"
          ><b class="text-xl">Price (€):</b> {{ price?.toFixed(2) ?? 0 }}</span
        >
      </div>
      <v-btn type="submit" block class="mt-2" @click="submitDialog">Submit</v-btn>
    </v-card>
    <print-dialog
      ref="printDialog"
      :dialog-visible="confirmPrint"
      :first-name="firstName"
      :last-name="lastName"
      :tecnico-id="tecnicoId"
      :file-name="fileName"
      :webmail="webmail"
      :chosen-unit="chosen_unit"
      :material="chosen_material"
      :volume="volume"
      :price="price"
      @close="onCloseConfirmationDialog"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import * as THREE from 'three';
import axios from 'axios';
import PrintingDialog from '@/components/Printing/PrintingDialog.vue';

export default {
  name: 'HomePrinting',
  components: {
    'print-dialog': PrintingDialog,
  },
  data() {
    return {
      rules: [
        (value) => {
          if (value) return true;

          return "Field can't be left empty";
        },
      ],
      confirmPrint: false,
      firstName: '',
      lastName: '',
      tecnicoId: '',
      file: null,
      fileName: '',
      webmail: '',
      volume: 0,
      boundingBoxSize: null,
      price: 0,
      chosen_unit: 'Milimeter',
      units: ['Millimeter', 'Meter'],
      materials: ['Grey', 'T1500'],
      chosen_material: 'Grey',
      notes: '',
    };
  },
  watch: {
    chosen_material() {
      this.calculatePrice(this.volume);
    },
    chosen_unit() {
      this.calculatePrice(this.volume);
    },
  },
  mounted() {},
  methods: {
    test(e) {
      if (!e) return;
      this.fileName = e.name;
      const read = new FileReader();
      read.readAsBinaryString(e);

      read.onloadend = () => {
        if (read.result) {
          const binaryContents = read.result; // Your binary contents here
          const arrayBuffer = this.binaryStringToArrayBuffer(binaryContents);
          this.parseBinarySTL(arrayBuffer);

          const res = 0.1;
          const layerTime = 16;

          const volume = this.volume * 10e-4;
          const base = Math.ceil((this.boundingBoxSize.x * this.boundingBoxSize.y) / 100);
          const printHours = ((this.boundingBoxSize.z / res) * layerTime) / 3600;

          this.calculatePrice(this.volume);

          this.$forceUpdate();

          console.log({ volume, base, printHours, layers: this.boundingBoxSize.z / res });
        }
      };
    },
    parseBinarySTL(data) {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];

      const dv = new DataView(data);
      let offset = 80; // Skip the header (80 bytes)

      // Read the number of triangles (faces)
      const numTriangles = dv.getUint32(offset, true);
      offset += 4;

      for (let i = 0; i < numTriangles; i++) {
        // Skip the normal vector (12 bytes)
        offset += 12;

        // Read the vertices (3 * 12 bytes)
        for (let j = 0; j < 3; j++) {
          const x = dv.getFloat32(offset, true);
          const y = dv.getFloat32(offset + 4, true);
          const z = dv.getFloat32(offset + 8, true);

          vertices.push(x, y, z);
          offset += 12;
        }

        // Skip the attribute byte count (2 bytes)
        offset += 2;
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

      // Calculate volume
      this.volume = this.calculateVolume(mesh);

      // Calculate bounding box size
      const boundingBox = new THREE.Box3().setFromObject(mesh);
      this.boundingBoxSize = boundingBox.getSize(new THREE.Vector3());
    },
    calculateVolume(mesh) {
      const geometry = mesh.geometry;
      const position = geometry.attributes.position.array;
      const indices = geometry.index ? geometry.index.array : null;

      let volume = 0;
      let vA, vB, vC;
      const pA = new THREE.Vector3();
      const pB = new THREE.Vector3();
      const pC = new THREE.Vector3();

      if (indices) {
        let iA, iB, iC;
        for (let i = 0; i < indices.length; i += 3) {
          iA = indices[i];
          iB = indices[i + 1];
          iC = indices[i + 2];

          vA = this.getVertex(iA, position, pA);
          vB = this.getVertex(iB, position, pB);
          vC = this.getVertex(iC, position, pC);

          volume += this.signedVolumeOfTriangle(vA, vB, vC);
        }
      } else {
        for (let i = 0; i < position.length; i += 9) {
          vA = this.getVertex(i, position, pA);
          vB = this.getVertex(i + 3, position, pB);
          vC = this.getVertex(i + 6, position, pC);

          volume += this.signedVolumeOfTriangle(vA, vB, vC);
        }
      }

      return Math.abs(volume);
    },
    calculatePrice(volume) {
      if (this.chosen_material === 'Grey') {
        this.price = volume * 0.0004;
      } else if (this.chosen_material === 'T1500') {
        this.price = volume * 0.0005;
      } else {
        this.price = 0;
      }
    },
    getVertex(index, position, target) {
      target.x = position[index];
      target.y = position[index + 1];
      target.z = position[index + 2];
      return target;
    },
    signedVolumeOfTriangle(p1, p2, p3) {
      return p1.dot(p2.cross(p3)) / 6;
    },
    binaryStringToArrayBuffer(binaryString) {
      const buffer = new ArrayBuffer(binaryString.length);
      const bufferView = new Uint8Array(buffer);
      for (let i = 0; i < binaryString.length; i++) {
        bufferView[i] = binaryString.charCodeAt(i);
      }
      return buffer;
    },
    convertHeaderToHex(binaryContents) {
      var headerBytes = binaryContents.slice(0, 80);
      console.log(headerBytes);
      var hex = '';

      for (var i = 0; i < headerBytes.length; i++) {
        var byte = headerBytes[i];
        var hexValue = byte.toString(16).padStart(2, '0');
        hex += hexValue;
      }

      return hex;
    },
    submitDialog() {
      // Set confirmPrint to true to show the confirmation dialog
      this.confirmPrint = true;
    },

    onCloseConfirmationDialog() {
      this.confirmPrint = false;
    },

    async onConfirm() {
      try {
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('fileName', this.fileName);
        formData.append('firstName', this.firstName);
        formData.append('lastName', this.lastName);
        formData.append('tecnicoId', this.tecnicoId);
        formData.append('webmail', this.webmail);
        formData.append('unit', this.chosen_unit);
        formData.append('volume', this.volume);
        formData.append('material', this.chosen_material);
        formData.append('price', this.price.toFixed(2));
        formData.append('notes', this.notes);

        const response = await axios.post(
          'https://lemac.dem.tecnico.ulisboa.pt/submit',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.status == 200)
          this.$notify({
            type: 'success',
            title: 'Submission successful',
            text: `Your submission has been successfully received. You must now wait for a response from LEMAC staff.`,
          });
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'Submission failed',
          text: `An error occurred while submitting please contact support or LEMAC staff.`,
        });
      } finally {
        this.$refs.printDialog.loading = false;
        this.confirmPrint = false;
      }
    },
  },
};
</script>
