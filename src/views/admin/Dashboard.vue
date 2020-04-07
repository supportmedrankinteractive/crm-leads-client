<template>
  <v-container
    id="data-tables"
    tag="section"
  >
    <base-v-component
      heading="Data Tables"
      link="components/data-tables"
    />

    <base-material-card
      color="indigo"
      icon="mdi-vuetify"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          List of Clients
        </div>
      </template>

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        label="Search"
        hide-details
        single-line
        style="max-width: 250px;"
      />

      <v-divider class="mt-3" />

      <v-data-table
        :headers="headers"
        :items="$store.getters.getUsers"
        :search.sync="search"
        :sort-by="['name', 'office']"
        :sort-desc="[false, true]"
        multi-sort
      />
    </base-material-card>
  </v-container>
</template>

<script>
  export default {
    name: 'AdminDashboard',

    data: () => ({
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Approved',
          value: 'is_approvedd',
        },
        {
          sortable: false,
          text: 'Actions',
          value: 'actions',
        },
      ],
      items: [
      ],
      search: undefined,
    }),
    mounted () {
      this.$store.dispatch('getUsers')
    },
  }
</script>
