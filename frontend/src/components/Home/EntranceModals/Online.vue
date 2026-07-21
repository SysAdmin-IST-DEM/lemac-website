<template>
  <v-dialog
    v-model="localEntryModal"
    max-width="400px"
    persistent
  >
    <v-card>
      <v-form
        ref="formAdd"
        class="my-4"
        @submit.prevent="save"
      >
        <v-card-text>
          <span class="flex items-center justify-center">
            <v-btn
              class="flex flex-col items-center justify-center"
              color="primary"
              height="120px"
              theme="dark"
              width="320px"
              @click="save"
            >
              <p class="mb-0 text-2xl">Exit LEMAC</p>

              <v-icon
                class="ml-4"
                size="large"
              >mdi-exit-to-app</v-icon>
            </v-btn>
          </span>

          <span class="flex flex-row items-center justify-center gap-4 mt-4">
            <div>
              <v-btn
                class="flex flex-col items-center justify-center"
                color="orange"
                height="30px"
                theme="dark"
                width="152px"
                @click="start_break"
              >
                <p class="mb-0 text-sm">Enter Break</p>

                <v-icon
                  class="ml-4"
                  size="small"
                >mdi-pause-box-outline</v-icon>
              </v-btn>
            </div>

            <div>
              <v-btn
                class="flex flex-col items-center justify-center"
                color="light-gray"
                height="30px"
                theme="dark"
                width="152px"
                @click="close"
              >
                <p class="mb-0 text-sm">Cancel</p>

                <v-icon
                  class="ml-4"
                  size="small"
                >mdi-close</v-icon>
              </v-btn>
            </div>
          </span>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import { setLemacUser } from '@/api/lemacUsers.api'

  export default {
    name: 'OnlineModal',
    props: {
      close: Function,
      entryStations: Array | String,
      select: Function,
      userData: Object,
      entryModal: Boolean,
    },
    emits: ['update:entryModal'],
    computed: {
      localEntryModal: {
        get () {
          return this.entryModal
        },
        set (value) {
          this.$emit('update:entryModal', value)
        },
      },
    },
    async mounted () {},
    methods: {
      async save () {
        if (!this.$refs.formAdd.validate()) return

        const newUserData = this.userData

        newUserData.state = "offline"

        try {
          await setLemacUser(newUserData)
          this.close("close")
        } catch {}
      },
      async start_break () {
        if (!this.$refs.formAdd.validate()) return

        const newUserData = this.userData

        newUserData.state = "in_break"

        try {
          console.log(newUserData)
          await setLemacUser(newUserData)
          this.close("")
        } catch (error) {
          console.log(error)
        }
      },
    },
  }
</script>
