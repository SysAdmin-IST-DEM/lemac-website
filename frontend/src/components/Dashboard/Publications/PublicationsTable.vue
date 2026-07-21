<template>
  <DashboardTable
    :edit-fields="editFields"
    :edit-initialization="editInitialization"
    :headers="headers"
    :items="publications"
    new-button="New Announcement"
    search
    :sort-by="[{ key: 'id', order: 'desc' }]"
    title="Announcements"
    @delete="deleteItem"
    @edit="editItem"
  >
    <template #[`item.title`]="{ item }">
      {{ item.title.length > 30 ? item.title.slice(0, 30) + '...' : item.title }}
    </template>

    <template #[`item.text`]="{ item }">
      {{ item.text.length > 50 ? item.text.slice(0, 50) + '...' : item.text }}
    </template>

    <template #[`item.active`]="{ item }">
      <v-chip
        class="capitalized"
        :color="item.active ? 'success' : 'error'"
        variant="elevated"
      >
        {{ item.active ? 'Active' : 'Inactive' }}
      </v-chip>
    </template>

    <template #[`item.createdAt`]="{ item }">
      {{ new Date(item.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short', timeZone: 'UTC', }) }}
    </template>
  </DashboardTable>
</template>

<script>
  import { addPublication, deletePublications, updatePublications } from '@/api/publications.api'
  import DashboardTable from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue'

  export default {
    name: 'PublicationsTable',
    components: { DashboardTable },
    props: {
      passedData: {
        type: Array,
        default () {
          return [
            {
              id: Number,
              title: String,
              text: String,
              active: Number,
              createdAt: String,
            },
          ]
        },
      },
    },
    data: () => ({
      publications: [],
      headers: [
        { title: 'Title', key: 'title' },
        { title: 'Text', key: 'text', sortable: false },
        { title: 'Active', key: 'active', filterable: false },
        { title: 'Date', key: 'createdAt', filterable: false },
        { title: 'Actions', key: 'actions', sortable: false, filterable: false },
      ],
      editFields: [
        [
          { key: 'title', label: "Title", required: true, props: { counter: 255, variant: "filled" }, colProps: { cols: 10 } },
          { key: 'active', type: "switch", props: { inset: true, color: 'secondary' }, colProps: { cols: 2, class: "flex justify-center" } },
        ],
        [
          { key: 'text', label: "Body", type: "textarea", required: true, props: { counter: true, variant: "filled" } },
        ],
      ],
    }),
    mounted () {
      this.publications = this.passedData
    },
    methods: {
      editInitialization (item) {
        return Object.assign({}, item)
      },
      async editItem (item, values) {
        if (item) {
          const response = await updatePublications(item.id, {
            ...values,
            active: values.active,
          })

          this.publications.splice(this.publications.indexOf(item), 1, response.data)
          this.$notify({
            type: 'success',
            title: 'Announcement updated',
            text: `You have updated announcement ${response.data.title}`,
          })
        } else {
          const response = await addPublication({
            ...values,
            active: values.active,
          })

          this.publications.push(response.data)
          this.$notify({
            type: 'success',
            title: 'Announcement created',
            text: `You have created announcement ${response.data.title}`,
          })
        }
      },
      async deleteItem (item) {
        await deletePublications(item.id)
        const deleted = this.publications.splice(this.publications.indexOf(item), 1)
        this.$notify({
          type: 'success',
          title: 'Announcement deleted',
          text: `You have deleted announcement ${deleted[0].title}`,
        })
      },
    },
  }
</script>
