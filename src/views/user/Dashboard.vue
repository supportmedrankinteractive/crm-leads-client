<template>
  <v-container
    id="data-tables"
    tag="section"
  >
    <div
      v-if="$store.state.isUserApproved"
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
            DataTables
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
          :items="$store.state.callrail_calls.calls"
          :search.sync="search"
          :sort-by="['name', 'office']"
          :sort-desc="[false, true]"
          multi-sort
        />
      </base-material-card>
    </div>
    <div
      v-else
      class="mt-4"
    >
      <v-row justify="center">
        <v-slide-y-transition appear>
          <v-card
            class="mt-6 mt-md-0"
            light
            max-width="100%"
            width="250"
          >
            <v-card-text class="text-center">
              <v-avatar
                class="mt-n12 mb-6 elevation-12"
                color="grey"
                size="88"
              >
                <v-img src="https://demos.creative-tim.com/material-dashboard-pro/assets/img/faces/avatar.jpg" />
              </v-avatar>

              <div class="display-2 font-weight-light mb-3 text--darken-2 grey--text">
                Tania Andrew
              </div>

              <v-text-field
                class="mb-8"
                color="secondary"
                label="Enter Password"
              />

              <pages-btn>
                Unlock
              </pages-btn>
            </v-card-text>
          </v-card>
        </v-slide-y-transition>
      </v-row>
    </div>
  </v-container>
</template>

<script>
  export default {
    name: 'UserDashboard',
    components: {
      PagesBtn: () => import('../pages/components/Btn'),
    },
    data: () => ({
      headers: [
        {
          text: 'Name',
          value: 'customer_name',
        },
        {
          text: 'Customer Phone',
          value: 'customer_phone_number',
        },
        {
          text: 'Business Phone',
          value: 'business_phone_number',
        },
        {
          text: 'City',
          value: 'customer_city',
        },
        {
          text: 'State',
          value: 'customer_state',
        },
        {
          sortable: false,
          text: 'Country',
          value: 'customer_country',
        },
      ],
      items: [
        {
          name: 'Airi Satou',
          position: 'Accountant',
          office: 'Tokyo',
          age: 33,
          date: '2008/11/28',
        },
        {
          name: 'Angelica Ramos',
          position: 'Chief Executive Officer (CEO)',
          office: 'London',
          age: 47,
          date: '2009/10/09',
        },
        {
          name: 'Ashton Cox',
          position: 'Junior Technical Author',
          office: 'San Francisco',
          age: 66,
          date: '2009/01/12',
        },
        {
          name: 'Bradley Greer',
          position: 'Software Engineer',
          office: 'London',
          age: 41,
          date: '2012/10/13',
        },
        {
          name: 'Brenden Wagner',
          position: 'Software Engineer',
          office: 'San Francisco',
          age: 28,
          date: '2011/06/07',
        },
      ],
      callrails: [],
      search: undefined,
    }),
    mounted () {
      console.log(this.$store.state.user)
      // axios
      //   .get(`/profile`)
      //   .then(response => console.log(response.data))
      this.$store.dispatch('getProfileCallrail')
      // axios
      //   .get(`https://api.callrail.com/v3/a/ACCdd593e22d15c4854ad76da1c3395760b/calls.json?company_id=${this.$store.state.user.profile.callrail}`)
      //   .then(response => {
      //     this.callrails = response.data
      //   })
    },
  }
</script>
