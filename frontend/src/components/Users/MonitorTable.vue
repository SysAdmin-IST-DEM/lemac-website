<template>
  <DashboardTable
    title="Users"
    :headers="headers"
    :items="users"
    search
    :sort-by="[{ key: 'name'}]"
    :new-button="getPermission === 1 ? 'New User' : undefined"
    :edit-initialization="editInitialization"
    :edit-fields="editFields"
    @edit="editItem"
    @delete="deleteItemConfirm"
  >
    <template #[`item.admin`]="{ item }">
      <v-chip
        :color="roleColors[item.admin]"
        variant="elevated"
        class="capitalized"
      >
        {{ (roles.find((v) => v.value === item.admin) || {}).title }}
      </v-chip>
    </template>
    <template #[`item.active`]="{ item }">
      <v-chip
        :color="stateColors[item.active]"
        variant="elevated"
        class="capitalized"
      >
        {{ (states.find((v) => v.value === item.active) || {}).title }}
      </v-chip>
    </template>
  </DashboardTable>
</template>

<script>
import { createUser, deleteUser, updateUser } from '@/api/user.api';
import { mapGetters } from 'vuex';
import DashboardTable from '@/components/DashboardDataTable/DashboardTable.vue';

export default {
  name: 'MonitorTable',
  components: { DashboardTable },
  props: {
    members: {
      type: Array,
      default() {
        return [
          {
            id: Number,
            name: String,
            istId: String,
            active: Number,
            admin: Number,
          },
        ];
      },
    },
  },
  data: () => ({
    users: [],
    headers: [
      { title: 'Member', key: 'name' },
      { title: 'IST Id', key: 'istId' },
      { title: 'Role', key: 'admin', filterable: false },
      { title: 'State', key: 'active', filterable: false },
      { title: 'Actions', key: 'actions', sortable: false, filterable: false, permission: 1 },
    ],
    roleColors: ['yellow-darken-4', 'blue'],
    stateColors: ['error', 'success'],
    roles: [
      { title: 'Admin', value: 1 },
      { title: 'User', value: 0 },
    ],
    states: [
      { title: 'Active', value: 1 },
      { title: 'Inactive', value: 0 },
    ],
  }),
  computed: {
    editFields() {
      return [
        [
          { key: 'name', label: 'Name', required: true, props: { variant: 'filled' }},
        ],
        [
          { key: 'istId', label: 'Id', required: true, props: { variant: 'filled' } },
          { key: 'admin', type: 'select', items: 'roles', required: true, props: { items: this.roles, variant: 'filled' } },
          { key: 'active', type: 'select', items: 'states', required: true, props: { items: this.states, variant: 'filled' } },
        ],
      ];
    },
    ...mapGetters('user', ['getPermission']),
  },
  mounted() {
    this.users = this.members;
  },
  methods: {
    editInitialization(item) {
      return Object.assign({}, item);
    },
    async editItem(item, values) {
      if (item) {
        const response = await updateUser(item.id, values);
        this.users.splice(this.users.indexOf(item), 1, response.data);
        this.$notify({
          type: 'success',
          title: 'User updated',
          text: `You have updated user ${response.data.name}`,
        });
      } else {
        const response = await createUser(values);
        this.users.push(response.data);
        this.$notify({
          type: 'success',
          title: 'User created',
          text: `You have created user ${response.data.name}`,
        });
      }
    },
    async deleteItemConfirm(item) {
      await deleteUser(item.id);
      const deleted = this.users.splice(this.users.indexOf(item), 1);
      this.$notify({
        type: 'success',
        title: 'User deleted',
        text: `You have deleted user ${deleted[0].name}`,
      });
    },
  },
};
</script>
