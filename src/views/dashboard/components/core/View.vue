<template>
  <v-content>
    <v-rows>
      <v-col
        cols="12"
      >
        <v-select
          v-if="$store.state.isUser"
          v-model="date_range"
          :rules="[v => !!v || 'You must choose to continue!']"
          label="Filter Date"
          class="purple-input mt-3 mr-3"
          style="max-width: 250px; margin-left: 50px;"
          item-text="text"
          item-value="value"
          :items="items_date_range"
          return-object
          @change="getFilteredDate"
        />
      </v-col>
    </v-rows>
    <router-view />

    <dashboard-core-footer />
  </v-content>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'DashboardCoreView',
    data: () => ({
      date_range: '',
      items_date_range: [
        {
          text: 'Today',
          value: 'today',
        },
        {
          text: 'Yesterday',
          value: 'yesterday',
        },
        {
          text: 'Last 7 Days',
          value: 'last_7_days',
        },
        {
          text: 'Last 30 Days',
          value: 'last_30_days',
        },
        {
          text: 'This Month',
          value: 'this_month',
        },
        {
          text: 'Last Month',
          value: 'last_month',
        },
        {
          text: 'This Year',
          value: 'this_year',
        },
        {
          text: 'Last Year',
          value: 'last_year',
        },
        {
          text: 'All Time',
          value: 'all_time',
        },
      ],
    }),
    components: {
      DashboardCoreFooter: () => import('./Footer'),
    },
    methods: {
      async getFilteredDate () {
        var filtered = []
        var noOfDays
        var today = moment(new Date()).format('L')

        // await this.$store.dispatch('getProfileCallrail')
        // await this.$store.dispatch('getProfileCallrail')
        if (typeof (this.$store.state.callrail_calls.calls) === 'undefined') {
          await this.$store.dispatch('getProfileCallrail')
          // this.filterData()
        }

        if (this.date_range.value === 'today') {
          noOfDays = moment(new Date()).format('YYYY-MM-DD')
          filtered = this.$store.state.callrail_calls.filter(call => {
            if (moment(JSON.parse(call.content).start_time).format('YYYY-MM-DD') === noOfDays) {
              return true
            }
          })
        } else if (this.date_range.value === 'yesterday') {
          noOfDays = moment().subtract(1, 'days').calendar()
          filtered = this.$store.state.callrail_calls.filter(call => {
            if (moment(JSON.parse(call.content).start_time).format('L') >= noOfDays && moment(JSON.parse(call.content).start_time).format('L') <= today) {
              return true
            }
          })
        } else if (this.date_range.value === 'last_7_days') {
          noOfDays = moment().subtract(7, 'days').calendar()
          filtered = this.$store.state.callrail_calls.filter(call => {
            if (moment(JSON.parse(call.content).start_time).format('L') >= noOfDays && moment(JSON.parse(call.content).start_time).format('L') <= today) {
              return true
            }
          })
        } else if (this.date_range.value === 'last_30_days') {
          noOfDays = moment().subtract(30, 'days').calendar()
          filtered = this.$store.state.callrail_calls.filter(call => {
            if (moment(JSON.parse(call.content).start_time).format('L') >= noOfDays && moment(JSON.parse(call.content).start_time).format('L') <= today) {
              return true
            }
          })
        } else if (this.date_range.value === 'this_month') {
          noOfDays = moment().startOf('month').calendar()
          filtered = this.$store.state.callrail_calls.filter(call => {
            if (moment(JSON.parse(call.content).start_time).format('L') >= noOfDays && moment(JSON.parse(call.content).start_time).format('L') <= today) {
              return true
            }
          })
        } else if (this.date_range.value === 'last_month') {
          noOfDays = moment().subtract(30, 'days').calendar()
          filtered = this.$store.state.callrail_calls.filter(call => {
            if (moment(JSON.parse(call.content).start_time).format('L') >= noOfDays && moment(JSON.parse(call.content).start_time).format('L') <= today) {
              return true
            }
          })
        } else if (this.date_range.value === 'this_year') {
          noOfDays = moment().startOf('year').calendar()
          filtered = this.$store.state.callrail_calls.filter(call => {
            if (moment(JSON.parse(call.content).start_time).format('L') >= noOfDays && moment(JSON.parse(call.content).start_time).format('L') <= today) {
              return true
            }
          })
        } else if (this.date_range.value === 'last_year') {
          noOfDays = moment().subtract(1, 'years').calendar()
          filtered = this.$store.state.callrail_calls.filter(call => {
            if (moment(JSON.parse(call.content).start_time).format('L') >= noOfDays && moment(JSON.parse(call.content).start_time).format('L') <= today) {
              return true
            }
          })
        } else if (this.date_range.value === 'all_time') {
          noOfDays = moment('2000-01-01').format('L')
          filtered = this.$store.state.callrail_calls.filter(call => {
            if (moment(JSON.parse(call.content).start_time).format('L') >= noOfDays && moment(JSON.parse(call.content).start_time).format('L') <= today) {
              return true
            }
          })
        }
        this.$store.commit('GET_CALLRAIL_CALLS', filtered)
        console.log('filtered', filtered)
        console.log(`filtered date is ${noOfDays}`)
        // console.log(moment().subtract(1, 'years').calendar())
      },
    },
  }
</script>
