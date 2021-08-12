<template>
  <v-app-bar
    id="app-bar"
    absolute
    app
    color="transparent"
    flat
    height="75"
  >
    <v-progress-linear
      :active="$store.state.loading"
      :indeterminate="$store.state.loading"
      absolute
      bottom
      color="deep-purple accent-4"
    ></v-progress-linear>
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="$vuetify.breakpoint.smAndDown ? setDrawer(!drawer) : $emit('input', !value)"
    >
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$route.name"
    />

    <v-spacer />

    <!-- <v-text-field
      :label="$t('search')"
      color="secondary"
      hide-details
      style="max-width: 165px;"
    >
      <template
        v-if="$vuetify.breakpoint.mdAndUp"
        v-slot:append-outer
      >
        <v-btn
          class="mt-n2"
          elevation="1"
          fab
          small
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field> -->

    <div class="mx-3" />

    <v-btn
      class="ml-2"
      min-width="0"
      text
    >
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>

    <!-- <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-badge
            color="red"
            overlap
            bordered
          >
            <template v-slot:badge>
              <span>5</span>
            </template>

            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list
        :tile="false"
        nav
      >
        <div>
          <app-bar-item
            v-for="(n, i) in notifications"
            :key="`item-${i}`"
          >
            <v-list-item-title v-text="n" />
          </app-bar-item>
        </div>
      </v-list>
    </v-menu> -->

    <v-menu
      bottom
      left
      min-width="200"
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list
        :tile="false"
        flat
        nav
      >
        <template v-for="(p, i) in profile">
          <v-divider
            v-if="p.divider"
            :key="`divider-${i}`"
            class="mb-2 mt-2"
          />

          <app-bar-item
            v-else
            :key="`item-${i}`"
          >
            <v-list-item-title
              @click="goTo(p)"
              v-text="p.title"
            />
          </app-bar-item>
        </template>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
  // import axios from 'axios'
  // Components
  import moment from 'moment'
  import { VHover, VListItem } from 'vuetify/lib'

  // Utilities
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'DashboardCoreAppBar',

    components: {
      AppBarItem: {
        render (h) {
          return h(VHover, {
            scopedSlots: {
              default: ({ hover }) => {
                return h(VListItem, {
                  attrs: this.$attrs,
                  class: {
                    'black--text': !hover,
                    'white--text secondary elevation-12': hover,
                  },
                  props: {
                    activeClass: '',
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                }, this.$slots.default)
              },
            },
          })
        },
      },
    },

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      loading: true,
      notifications: [
        'Mike John Responded to your email',
        'You have 5 new tasks',
        'You\'re now friends with Andrew',
        'Another Notification',
        'Another one',
      ],
      profile: [
        { title: 'Profile', url: '' },
        { title: 'Settings', url: '' },
        { divider: true },
        { title: 'Log out', url: 'logout' },
      ],
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

    computed: {
      ...mapState(['drawer']),
    },

    mounted () {
      // this.getFilteredDate()
      // console.log(`today ${moment(new Date('2020-10-07')).format('YYYY-MM-DD')}`)
    },

    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),
      goTo (data) {
        if (data.url === 'logout') {
          this.$store.dispatch('userLogout').then(() => this.$router.push({ name: 'User Login' }))
        } else {
          this.$router.push()
        }
      },
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
        // console.log('filtered', filtered)
        // console.log(`filtered date is ${noOfDays}`)
        // console.log(moment().subtract(1, 'years').calendar())
      },
    },
  }
</script>
