<template>

</template>

<script lang="ts">
import { Unit } from '@lemac/data-model/browser';

export default {
  name: 'HomePrinting',
  components: {
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
      units: Object.values(Unit),
      materials: ['Grey', 'T1500'],
      chosen_material: 'Grey',
      notes: '',
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
  mounted() {},

};
</script>
