<template>
  <div
    class="flex flex-col items-start justify-start w-full divide-y divide-gray-500"
  >
    <div class="flex flex-row items-start justify-start w-full my-6">
      <div class="flex flex-col items-start justify-start">
        <div>
          <span class="text-xl font-medium">Name</span>:
          {{
            student.name
              ?.toLowerCase()
              ?.replace(/\b\w/g, (match: string) => match.toUpperCase()) ?? ''
          }}
        </div>

        <div>
          <span class="text-xl font-medium">Técnico ID</span>:
          {{student.istId }}
        </div>
      </div>

      <div class="ml-auto place-content-center w-45">
        <v-select
          v-model="selected_software"
          :items="items"
          label="Software"
          variant="outlined"
        />
      </div>
    </div>

    <Solidworks v-if="selected_software == 'Solidworks'" :software="software.solidworks" />
    <Siemens_NX v-else-if="selected_software == 'Siemens NX'" :software="software.nx" />
    <SolidEdge v-else-if="selected_software == 'SolidEdge'" :software="software.solidedge" />
    <ManualSoftware v-else :software="selected_software" />
  </div>
</template>

<script lang="ts">
  import type { PropType } from 'vue'
  import ManualSoftware from '@/components/Home/Softwares/ManualSoftware.vue'
  import Siemens_NX from '@/components/Home/Softwares/Siemens_NX.vue'
  import SolidEdge from '@/components/Home/Softwares/SolidEdge.vue'
  import Solidworks from '@/components/Home/Softwares/Solidworks.vue'

  export default {
    name: 'HomeSoftware',
    components: {
      ManualSoftware,
      Solidworks,
      Siemens_NX,
      SolidEdge,
    },
    props: {
      student: {
        type: Object as PropType<{ name: string, istId: string }>,
        required: true,
      },
      software: {
        type: Object as PropType<{ [name: string]: { url: string, license?: string, password?: string } }>,
        required: true,
      },
    },
    data: () => ({
      items: ['Solidworks', 'Siemens NX', 'SolidEdge', 'Abaqus', 'Altair Softwares', 'Star-CCM+', 'Simcenter 3D', 'Simcenter Amesim', 'HEEDS', 'Granta'],
      selected_software: 'Solidworks',
    }),
  }
</script>
