<template>
  <v-dialog
    v-model="localEntryModal"
    persistent
  >
    <v-card>
      <v-form
        ref="formAdd"
        @submit.prevent="save"
      >
        <v-card-title>
          <span class="text-h5"> Entrance </span>
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="name"
            label="Name"
            required
            :rules="[(v) => !!v || 'Name is required']"
            type="string"
            variant="filled"
          />

          <v-text-field
            v-model="ist_id"
            label="Id"
            required
            :rules="[(v) => !!v || 'IST Id is required']"
            type="number"
            variant="filled"
          />

          <v-text-field
            v-model="email"
            label="Email"
            required
            :rules="[(v) => !!v || 'Contact email is required']"
            type="email"
            variant="filled"
          />

          <v-autocomplete
            v-model="choosenCourse"
            item-title="course"
            item-value="course"
            :items="possibleCourses"
            label="Course"
            required
            :rules="[(v) => !!v || 'Course is required']"
            variant="filled"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="primary"
            variant="text"
            @click="save"
          >
            Submit
          </v-btn>

          <v-btn
            color="primary"
            variant="text"
            @click="close"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import { createLemacUser } from '@/api/lemacUsers.api'

  export default {
    name: 'CreateUser',
    props: {
      close: Function,
      entryStations: Array,
      select: Function,
      mifare_id: String,
      entrySelected: Number,
      entryModal: Boolean,
    },
    emits: ['update:entryModal'],
    data: () => ({
      name: null,
      ist_id: null,
      email: null,
      choosenCourse: null,
      possibleCourses: [{ course: "Engenharia Aeroespacial" }, { course: "Engenharia Mecânica" }, { course: "Engenharia Naval" }, { course: "Engenharia de Materiais" }, { course: "Engenharia Ambiente" }, { course: "Outro" }],
    }),
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

        const userData = {
          name: this.name,
          ist_id: this.ist_id,
          mifare_id: this.mifare_id,
          email: this.email,
          course: this.choosenCourse,
        }

        createLemacUser(userData)

        try {
          this.close()
        } catch (error) {
          console.log(error)
        } finally {
          this.name = null
          this.ist_id = null
        }
      },
    },
  }
</script>
