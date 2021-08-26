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
            CallRail
          </div>
        </template>

        <v-rows>
          <v-col
            cols="12"
          >
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              class="ml-auto"
              label="Search"
              hide-details
              single-line
              style="max-width: 250px;"
            />
          </v-col>
        </v-rows>

        <v-divider class="mt-3" />

        <v-data-table
          :headers="headers"
          :items="getParsedCallrails.sort((a,b) => new Date(b.start_time) - new Date(a.start_time))"
          :search.sync="search"
          :items-per-page="10"
          :page-count="page_count"
          :sort-by="['name', 'office']"
          :sort-desc="[false, true]"
          multi-sort
          class="text-caption"
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
          <!--<template v-slot:item.tags="{ item }">
            <div class="blue--text">
              {{ item.tags[0].name }}
            </div>
          </template>-->
          <template v-slot:item.follow_ups="{ item }">
            <follow-ups
              v-if="item.follow_ups.length > 0"
              :source="item.follow_ups"
            />
            <add-follow-up
              v-else
              :lead_id="item.lead_id"
              @add-follow-up="pushToFollowUp"
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
  import moment from 'moment'
  import { mapGetters } from 'vuex'
  import { _ } from 'vue-underscore'

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
      callrailsUnFiltered: [],
      pagination_options: {},
      search: undefined,
      page_count: '',
      expanded: [],
      singleExpand: true,
      status: ['New Patient', 'Existing Patient'],
      leadStatus: '',
    }),
    computed: {
      ...mapGetters({
        getParsedCallrails: 'getParseJsonLeads',
      }),
    },
    watch: {
      getParsedCallrails (val) {
        this.getParsedCallrails = val
        // this.callrails = val
        // console.log(`from watcher ${val}`)
      },
    },
    async mounted () {
      // var startDate = new Date('2020-10-07')
      // this.callrails = this.$store.getters.getParseJsonLeads
      // var filtered = this.callrails.filter(call => {
      //   if (moment(call.start_time).format('YYYY-MM-DD') === moment(new Date('2020-10-07')).format('YYYY-MM-DD')) {
      //     return true
      //   }
      //   // console.log(`${moment(call.start_time).format('YYYY-MM-DD')}`)
      // })
      // console.log(`today ${moment(new Date('2020-10-07')).format('YYYY-MM-DD')}`)
      // .filter(call => new Date(call.created_at) === startDate)
      // this.callrailsUnFiltered = this.$store.getters.getParseJsonLeads
      // this.callrails = this.$store.getters.filterDate

      this.page_count = this.$store.state.callrail_calls.total_records

      this.pagination_options = {
        page: this.$store.state.callrail_calls.page,
        itemsPerPage: this.$store.state.callrail_calls.per_page,
        pageStart: 1,
        pageStop: this.$store.state.callrail_calls.total_records / this.$store.state.callrail_calls.per_page,
        pageCount: this.$store.state.callrail_calls.total_pages,
        itemsLength: this.$store.state.callrail_calls.total_records,
      }
      // alert(moment().startOf('month'))
      var ourDate = new Date()

      // Change it so that it is 7 days in the past.
      var pastDate = ourDate.getDate() - 7
      ourDate.setDate(pastDate)

      // Log the date to our web console.
      var date = new Date()
      date.setDate(date.getDate() - 30)

      // console.log(moment().subtract(10, 'days').calendar('YYYY-MM-DD'))
      // alert(moment(date).format())
 
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
