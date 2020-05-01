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
        :items="$store.state.users"
        :search.sync="search"
        :sort-by="['name', 'email']"
        :sort-desc="[false, true]"
        multi-sort
      >
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editProfile(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
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
          text: 'Company',
          value: 'profile.company_name',
        },
        {
          text: 'Approved',
          value: 'is_approved',
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
      userWithCompany: [],
    }),

    async mounted () {
      this.$store.dispatch('getCallrailCompanies')
      this.$store.dispatch('getUsers')

      // const userWithCompany = []
      // this.$store.state.users.forEach(user => {
      //   // return Object.assign(user, state.callrail.companies.find(company => company.id === user.profile.id))
      //   this.$store.state.callrail.companies.forEach(company => {
      //     // if (company.id === user.profile.id) {
      //     //   userWithCompany.push(Object.assign(user, { company: company.name }))
      //     // }
      //     // if (user.profile && company.id === user.profile.id) {
      //     //   this.userWithCompany.push(Object.assign(user, { company: company.name }))
      //     // } else {
      //     //   this.userWithCompany.push(user)
      //     // }
      //     this.userWithCompany.push(JSON.stringify(company).name)
      //   })
      //   // this.userWithCompany.push(user)
      // })
      this.userWithCompany = await this.$store.state.users
    },

    methods: {
      editProfile (user) {
        this.$store.dispatch('getProfile', user)
        this.$router.push({ name: 'User Profile', params: { user: user.id } })
      },
    },
  }
</script>
