<template>
  <div class="flex flex-col items-start justify-start w-full">
    <h2 class="m-6 text-4xl font-semibold">SOLIDEDGE 2024 Update 4</h2>
    <span class="indent-12">
      <span class="text-xl font-medium">Download URL: </span>
      <a :href="url">{{ url }}</a>
    </span>
    <span class="indent-12">
      <span class="text-xl font-medium">Password: </span>
      {{ pass }}
    </span>
    <h3 class="m-4 text-3xl font-medium">Installation Steps:</h3>
    <div class="grid w-full grid-cols-5 grid-rows-1 h-[40vh]">
      <div class="flex flex-col items-center justify-start col-span-2">
        <p class="my-auto text-lg indent-4">
          <span v-html="installInstructions[currentPlace]" />
        </p>
        <div class="flex items-center justify-start w-full align-bottom max-h-12">
          <v-icon
            v-if="currentPlace > 0"
            class="transition-transform duration-200 scale-100 hover:scale-125 active:scale-95"
            large
            @click="() => this.currentPlace--"
            >mdi-menu-left</v-icon
          >
          <v-icon
            disabled
            v-if="currentPlace <= 0"
            class="transition-transform duration-200 scale-100 hover:scale-125 active:scale-95"
            large
            >mdi-menu-left</v-icon
          >

          <v-icon
            v-if="currentPlace < installInstructions.length - 1"
            class="transition-transform duration-200 scale-100 hover:scale-125 active:scale-95"
            large
            @click="() => this.currentPlace++"
            >mdi-menu-right</v-icon
          >

          <v-icon
            v-if="currentPlace >= installInstructions.length - 1"
            class="transition-transform duration-200 scale-100 hover:scale-125 active:scale-95"
            large
            disabled
            >mdi-menu-right</v-icon
          >
        </div>
      </div>
      <div class="flex items-center col-span-3 p-2">
        <img
          class="object-contain mx-auto rounded-md shadow-md max-h-[40vh]"
          :src="installPhotos[currentPlace]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import photo1 from '@/../public/SolidEdge/SolidEdge_Step_1.png';
import photo2 from '@/../public/SolidEdge/SolidEdge_Step_2.png';
import photo3 from '@/../public/SolidEdge/SolidEdge_Step_3.png';

export default {
  name: 'SolidEdge',
  components: {},
  props: {},
  data: () => ({
    url: null,
    pass: null,
    currentPlace: 0,
    installInstructions: [''],
    installPhotos: [photo1, photo2, photo3],
  }),
  mounted() {
    this.test();
  },
  methods: {
    test() {
      this.url = process.env.VUE_APP_SOLIDEDGE4_URL;
      this.pass = process.env.VUE_APP_SOLIDEDGE4_PASS;

      this.installInstructions = [
        `<p>Go to the <a href='${process.env.VUE_APP_SOLIDEDGE4_URL}'>Download URL</a> and insert the password an install the password. (images shown ahead might be sujected to change)</p>`,
        `<p>After the page finish loading, open the "UDP04" folder and select the "Solid_Edge_MSI_Update0004.exe" file.</p> <p>This will start the download of the update automatically.</p>`,
      ];
    },
  },
};
</script>
