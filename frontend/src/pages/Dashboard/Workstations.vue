<template>
  <div>
    <v-container
      v-if="workstations"
      class="mt-6"
    >
      <WorkstationsTable :passed-data="workstations" />
    </v-container>
  </div>
</template>

<script>
  import { mapState } from 'pinia'
  import { getWorkstations } from '@/api/workstations.api'
  import WorkstationsTable from '@/components/Dashboard/Workstations/WorkstationsTable.vue'
  import { useUserStore } from '@/stores/user.js'

  export default {
    name: 'WorkstationsPage',
    components: { WorkstationsTable },
    data () {
      return {
        workstations: null,
      }
    },
    computed: {
      ...mapState(useUserStore, ['getPermission']),
    },
    async mounted () {
      this.$loading.show()
      const response = await getWorkstations()
      this.workstations = response.data
      this.$loading.hide()
    },
  }
</script>
