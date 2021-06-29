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
          <div class="text-h3 font-weight-light">
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
          :items="callrail_forms"
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

              <div class="text-h3 font-weight-light mb-3 text--darken-2 grey--text">
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
    name: 'CallRailCalls',
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
      callrail_forms: [],
      search: undefined,
    }),
    mounted () {
      // this.$store.dispatch('getProfileCallrail')
    },
  }
</script>
