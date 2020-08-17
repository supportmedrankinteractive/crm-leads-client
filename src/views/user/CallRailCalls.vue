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
            CallRail
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
          :items="callrails"
          :search.sync="search"
          :items-per-page="10"
          :page-count="page_count"
          :sort-by="['name', 'office']"
          :sort-desc="[false, true]"
          multi-sort
          class="caption"
        >
          <template v-slot:item.source_name="{ item }">
            <div>
              {{ item.source_name }}
            </div>
            <div class="blue--text">
              {{ item.formatted_tracking_phone_number }}
            </div>
          </template>
          <template v-slot:item.start_time="{ item }">
            {{ formatDate(item.start_time) }}
          </template>
          <template v-slot:item.duration="{ item }">
            {{ formatDuration(item.duration) }}
          </template>
          <template v-slot:item.customer_name="{ item }">
            <div>
              {{ item.customer_name }}
            </div>
            <div class="blue--text">
              {{ item.formatted_customer_phone_number }}
            </div>
          </template>
          <template v-slot:item.follow_ups="{ item }">
            <follow-ups
              :source="item.follow_ups"
              v-if="item.follow_ups.length > 0"
            />
            <add-follow-up
              :lead_id="item.lead_id"
              @add-follow-up="pushToFollowUp"
              v-else
            />
          </template>
          <template v-slot:item.status="{ item }">
            <!-- <v-select
              :items="status"
              v-model="leadStatus"
              :value="item.status"
              label="Status"
              min-height=20
              outlined
            ></v-select> -->
            <status-lead :lead="item" />
          </template>
        </v-data-table>
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
  import moment from 'moment'

  export default {
    name: 'CallRailCalls',
    components: {
      PagesBtn: () => import('../pages/components/Btn'),
      FollowUps: () => import('../utilities/FollowUps'),
      AddFollowUp: () => import('../utilities/AddFollowUp'),
      StatusLead: () => import('../utilities/StatusLead'),
    },
    data: () => ({
      headers: [
        {
          text: 'Tracking Number',
          value: 'source_name',
        },
        {
          text: 'Source',
          value: 'formatted_tracking_source',
        },
        {
          text: 'Start Time',
          value: 'start_time',
        },
        {
          text: 'Contact',
          value: 'customer_name',
        },
        {
          text: 'Duration',
          value: 'duration',
        },
        {
          text: 'Agent',
          value: 'formatted_business_phone_number',
        },
        {
          text: 'Location',
          value: 'formatted_customer_location',
        },
        {
          text: 'Follow Ups',
          value: 'follow_ups',
        },
        {
          text: 'Status',
          value: 'status',
        },
      ],
      callrails: [],
      pagination_options: {},
      search: undefined,
      page_count: '',
      expanded: [],
      singleExpand: true,
      status: ['New Patient', 'Existing Patient'],
      leadStatus: '',
    }),
    async mounted () {
      this.callrails = this.$store.getters.getParseJsonLeads

      this.page_count = this.$store.state.callrail_calls.total_records

      this.pagination_options = {
        page: this.$store.state.callrail_calls.page,
        itemsPerPage: this.$store.state.callrail_calls.per_page,
        pageStart: 1,
        pageStop: this.$store.state.callrail_calls.total_records / this.$store.state.callrail_calls.per_page,
        pageCount: this.$store.state.callrail_calls.total_pages,
        itemsLength: this.$store.state.callrail_calls.total_records,
      }
    },
    methods: {
      formatDate (value) {
        return moment(value).format('MMM DD h:mm:ss a')
      },
      formatDuration (secs) {
        return moment.utc(secs * 1000).format('mm.ss') + 's'
      },
      pushToFollowUp (e) {
        const followUp = { ...e, icon: 'mdi-clock', order: 1 }
        this.$store.commit('ADD_FOLLOW_UP', followUp)
      },
    },
  }
</script>
<style scoped>
.v-select__selections {
  min-height: 30px
}
</style>
