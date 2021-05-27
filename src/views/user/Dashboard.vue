<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
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
          @change="filterData"
        />
      </v-col>
    </v-rows>
    <v-row>
      <v-col
        cols="12"
        lg="12"
      >
        <base-material-card
          id="pie"
          color="success"
          icon="mdi-chart-pie"
          title="Source"
          class="px-4 py-3"
        >
          <line-chart
            id="sourceLineChart"
            :data="sourceLineChartData"
            xkey="year"
            :ykeys="sourceLineChartDataKeys"
            :data-colors="lineColors"
            :line-colors="lineColors"
            :pointFillColors="lineColors"
            :labels="sourceLineChartsDataLabel"
            behave-like-line="true"
            resize="true"
            :hideOver="auto"
            :hoverCallback="hoverCallback"
            :trendLine="true"
            :trendLineColors="lineColors"
          />
          <!-- <line-chart-js
            :sourceData="sourceData"
            :sourceLabel="sourceLabel"
          /> -->
        </base-material-card>
      </v-col>

      <v-col
        cols="12"
        lg="6"
      >
        <base-material-card
          id="pie"
          color="success"
          icon="mdi-chart-pie"
          title="Cities"
          class="px-4 py-3"
        >
          <donut-chart
            id="donut"
            :data="cityDonutData"
            :colors="getCityColor"
            :formatter="value => value + '%'"
            resize="true"
          />

          <v-divider class="ma-3" />

          <div class="px-3">
            <div class="body-2 text-uppercase grey--text font-weight-bold mb-3">
              Other Cities - {{ (100 - totalPctOfTopFive).toFixed(1) }}%
            </div>

            <v-row
              align="center"
              class="ma-0"
            >
              <template
                v-for="source in cityDonutData"
              >
                <v-avatar
                  :key="source.label"
                  class="mr-1"
                  :color="source.color"
                  size="12"
                />

                <span
                  :key="source.label"
                  class="mr-3 font-weight-light"
                >
                  {{ source.label }}
                </span>
              </template>
            </v-row>
          </div>
        </base-material-card>
      </v-col>

      <v-col
        cols="12"
        lg="12"
      >
        <base-material-card
          id="pie"
          color="success"
          icon="mdi-chart-pie"
          title="New vs Existing Phone Calls"
          class="px-4 py-3"
        >
          <bar-chart
            id="bar"
            :data="statusBarChart.data"
            xkey="year"
            :ykeys="statusBarChart.ykeys"
            :labels="statusBarChart.labels"
            resize="true"
            grid="true"
            stacked="true"
            grid-text-weigth="bold"
          />
        </base-material-card>
      </v-col>

      <v-col
        cols="12"
        lg="12"
      >
        <base-material-card
          id="pie3"
          color="success"
          icon="mdi-chart-pie"
          title="Status Data Summary"
          class="px-4 py-3"
        >
          <bar-chart
            id="bar2"
            :data="newStatusBarChart.data"
            xkey="year"
            :ykeys="newStatusBarChart.ykeys"
            :labels="newStatusBarChart.labels"
            resize="true"
            grid="true"
            stacked="true"
            grid-text-weigth="bold"
          />
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { DonutChart, LineChart, BarChart } from 'vue-morris'
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  // import lodash from 'lodash'
  import { _ } from 'vue-underscore'
  // import LineChartJs from '../chart-js/LineChart'

  export default {
    name: 'UserDashboard',
    components: {
      DonutChart,
      LineChart,
      BarChart,
    },
    data () {
      return {
        date_range: {
          text: 'This Year',
          value: 'this_year',
        },
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
        lineColors: [],
        sourceLineChartDataKeys: ['Google Ads', 'Google My Business', 'Organic & Local Search', 'Organic Search', 'Google Organic'],
        cityDonutData: [],
        sourceLineChartData: [],
        GoogleAdsLineChartData: [],
        GoogleMyBusinessLineChartData: [],
        LocalSearchLineChartData: [],
        OrganicSearchLineChartData: [],
        GoogleOrganicLineChartData: [],
        sourceGoogleAdsLineChartData: [],
        sourceLineChartsDataLabel: ['Google Ads', 'Google My Business', 'Organic & Local Search', 'Organic Search', 'Google Organic'],
        multipleLineCitiesBar: {
          data: {
            labels: [],
            series: [],
          },
        },
        multipleLineCities: {
          data: {
            labels: [],
            series: [],
          },
          options: {
            colors: 'red',
            lineSmooth: this.$chartist.Interpolation.none(),
            axisX: {
              showGrid: false,
            },
            low: 0,
            high: 200,
            chartPadding: {
              top: 0,
              right: 5,
              bottom: 0,
              left: 0,
            },
          },
          options2: {
            labelInterpolationFnc: (value) => `${value}%`,
            width: '600px',
            height: '450px',
            chartPadding: 30,
            labelOffset: 30,
            // labelDirection: 'explode',
          },
        },
        citiesGraph: [],
        sourceGraph: [],
        cityNames: [],
        otherCityNames: [],
        totalPctOfTopFive: null,
        statusBarChart: {
          data: [
            // { year: '2011', new: '5', existing: '6' },
            // { year: '2012', new: '9', existing: '8' },
            // { year: '2013', new: '5', existing: '7' },
            // { year: '2014', new: '4', existing: '5' },
            // { year: '2015', new: '8', existing: '11' },
            // { year: '2016', new: '15', existing: '8' },
          ],
          ykeys: ['New Patient', 'Existing Patient'],
          colors: ['green', 'blue'],
          labels: ['New Patient', 'Existing Patient'],
        },
        newStatusBarChart: {
          // ykeys: ['New Patient', 'Existing Patient', 'Not Interested', 'Price Shopping', 'Invalid Phone Number', 'Voicemail'],
          ykeys: ['New Patient', 'Existing Patient', 'Not Interested', 'Voicemail', 'Price Shopping', 'Invalid Phone Number'],
          colors: ['green', 'blue', 'red', 'yellow', 'grey', 'black'],
          // labels: ['New Patient', 'Existing Patient', 'Not Interested', 'Price Shopping', 'Invalid Phone Number', 'Voicemail'],
          labels: ['New Patient', 'Existing Patient', 'Not Interested', 'Voicemail', 'Price Shopping', 'Invalid Phone Number'],
          data: [],
        },
        tagsBarChart: {
          data: [
            // { year: '2011', new: '5', existing: '6' },
            // { year: '2012', new: '9', existing: '8' },
            // { year: '2013', new: '5', existing: '7' },
            // { year: '2014', new: '4', existing: '5' },
            // { year: '2015', new: '8', existing: '11' },
            // { year: '2016', new: '15', existing: '8' },
          ],
          ykeys: ['New Patient', 'Existing Patient'],
          colors: ['green', 'blue'],
          labels: ['New Patient', 'Existing Patient'],
        },
        sourceData: [],
        sourceLabel: [],
        filtered: null,
      }
    },
    computed: {
      totalCalls () {
        return this.citiesGraph.reduce((acc, val) => acc + val[1], 0)
      },
      ...mapGetters({
        getParsedCallrails: 'getParseJsonLeads',
      }),
    },
    watch: {
      getParsedCallrails (val) {
        this.citiesGraph = []
        this.otherCityNames = []
        this.totalPctOfTopFive = null
        this.cityDonutData = []
        this.sourceData = []
        this.GoogleAdsLineChartData = []
        this.GoogleMyBusinessLineChartData = []
        this.LocalSearchLineChartData = []
        this.OrganicSearchLineChartData = []
        this.GoogleOrganicLineChartData = []
        this.getParsedCallrails = val
        // this.filterData()
        this.getCityColor()
        // this.callrails = val
        // console.log(`from watcher ${val}`)
      },
    },
    async mounted () {
      // console.log('outside undefined')
      // await this.$store.dispatch('getProfileCallrail')
      if (typeof (this.$store.state.callrail_calls.calls) === 'undefined') {
        // if (_.isEmpty(this.$store.state.callrail_calls)) {
        // await this.$store.dispatch('getProfileCallrail')
        this.filterData()
        // console.log('inside undefined', lodash.isEmpty(this.$store.state.callrail_calls))
      }
    },
    methods: {
      hoverCallback (index, options, content, row) {
        // console.log(content, row)
        const source = Object.entries(row).map((src, idx) => {
          if (idx !== 0) {
            return `<div class="morris-hover-point" style='color: ${this.lineColors[idx - 1]}'>
                      ${src.join().replace(',', ': ')}
                    </div>`
          }
        })
        return `<div class="morris-hover-row-label">${row.year}</div>
                  ${source.toString().replace(',', '').toString().replace(',', '').toString().replace(',', '').toString().replace(',', '')}`.toString().replace(',', '')
      },
      getCityColor () {
        return this.cityDonutData.map(city => city.color)
      },
      getRandomColor () {
        const letters = '0123456789ABCDEF'
        let color = '#'
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)]
        }
        return color
      },
      complete (index) {
        this.list[index] = !this.list[index]
      },
      groupBy (gby) {
        return gby
      },
      async getFilteredDate () {
        this.citiesGraph = []
        this.otherCityNames = []
        this.totalPctOfTopFive = null
        this.cityDonutData = []
        this.sourceData = []
        this.GoogleAdsLineChartData = []
        this.GoogleMyBusinessLineChartData = []
        this.LocalSearchLineChartData = []
        this.OrganicSearchLineChartData = []
        this.GoogleOrganicLineChartData = []
        var filtered = []
        var noOfDays
        var today = moment(new Date()).format('L')

        await this.$store.dispatch('getProfileCallrail', this.date_range.value)
        this.filterData()
        // if (typeof (this.$store.state.callrail_calls.calls) === 'undefined') {
        //   await this.$store.dispatch('getProfileCallrail')
        //   // this.filterData()
        // }

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
        this.filtered = filtered
        // this.$store.commit('GET_CALLRAIL_CALLS', filtered)
        // console.log('filtered', filtered)
        // console.log(`filtered date is ${noOfDays}`)
        // console.log(moment().subtract(1, 'years').calendar())
      },
      async filterData () {
        this.citiesGraph = []
        this.otherCityNames = []
        this.totalPctOfTopFive = null
        this.cityDonutData = []
        this.sourceData = []
        this.GoogleAdsLineChartData = []
        this.GoogleMyBusinessLineChartData = []
        this.LocalSearchLineChartData = []
        this.OrganicSearchLineChartData = []
        this.GoogleOrganicLineChartData = []

        await this.$store.dispatch('getProfileCallrail', this.date_range)
        // console.log('parsed json leads ', await this.$store.getters.getParseJsonLead)
        const groupByCity = this.getParsedCallrails.reduce((acc, it) => {
          acc[it.customer_city] = acc[it.customer_city] + 1 || 1
          return acc
        }, {})
        // console.log('group by city', groupByCity)

        Object.entries(groupByCity).forEach(city => {
          const cityPercentage = city[1] / this.getParsedCallrails.length * 100
          city[2] = cityPercentage
          city[3] = this.getRandomColor()
          this.citiesGraph.push(city)
        })

        // Get Others except Top 5 %
        this.citiesGraph
          .sort((a, b) => b[2] - a[2]).slice(6, this.citiesGraph.length)
          .reduce((acc, pct) => {
            return acc + pct[1]
          }, 0)

        // GET Others City names except Top 5
        this.otherCityNames = this.citiesGraph
          .sort((a, b) => b[2] - a[2]).slice(6, this.citiesGraph.length)

        // Get Top 5
        this.citiesGraph
          .sort((a, b) => b[2] - a[2]).slice(0, 5)
          .forEach(city => {
            const labelColor = this.getRandomColor()
            this.cityNames.push([labelColor, city[0]])
            // this.cityNames.labels.push(city[0])
            // this.multipleLineCities.data.series.push({ value: city[2].toFixed(1), className: city[0] })
            this.multipleLineCities.data.series.push(city[2].toFixed(1))
            this.cityDonutData.push({ label: city[0], value: city[2].toFixed(1), color: labelColor })
            // this.cityDonutDataColors.push(labelColor)
          })

        // Get Total % of Top 5
        // this.totalPctOfTopFive = this.multipleLineCities.data.series.reduce((acc, val) => acc + parseFloat(val), 0)
        this.totalPctOfTopFive = this.cityDonutData.map(city => city.value).reduce((acc, val) => acc + parseFloat(val), 0)

        const groupByFormattedSource = this.getParsedCallrails.reduce((acc, it) => {
          acc[it.formatted_tracking_source] = acc[it.formatted_tracking_source] + 1 || 1
          return acc
        }, {})

        const groupByFormattedByDate = this.getParsedCallrails.reduce((groups, game) => {
          const date = game.start_time.split('T')[0]
          // const date = game.formatted_tracking_source
          if (!groups[date]) {
            groups[date] = []
          }
          groups[date].push(game)
          return groups
        }, {})
        // console.log('date', groupByFormattedByDate)
        this.sourceLabel = Object.keys(groupByFormattedByDate)
        const allSource = []
        const flattenedFormattedDateGroupByCity = Object.entries(groupByFormattedByDate).map(formattedDate => {
          const fDate = formattedDate[1].reduce((acc, it) => {
            // acc[it.formatted_tracking_source] = acc[it.formatted_tracking_source] + 1 || 1
            this.sourceLineChartDataKeys.forEach(dataKeys => {
              if (dataKeys !== it.formatted_tracking_source) {
                acc[dataKeys] = acc[dataKeys] + 0 || 0
              } else {
                acc[it.formatted_tracking_source] = acc[it.formatted_tracking_source] + 1 || 1
                allSource.push(acc[it.formatted_tracking_source])
              }
            })

            return acc
            // return allSource
          }, {})
          const stringFDate = fDate
          // this.sourceLineChartDataKeys = Object.keys(fDate)
          // this.sourceLineChartsDataLabel = Object.keys(fDate)
          return { year: formattedDate[0], ...stringFDate }
        })
        // const finalFlattenedData = flattenedFormattedDateGroupByCity.forEach(fd => {
        //   return [...fd.label, ...fd.value]
        // })
        this.sourceLineChartData = flattenedFormattedDateGroupByCity

        // const newLineChartData = this.sourceLineChartData.

        // const bySource = []

        const GoogleAds = Object.entries(groupByFormattedByDate).map(formattedDate => {
          const fDate = formattedDate[1].reduce((acc, it) => {
            if (it.formatted_tracking_source === 'Google Ads') {
              acc['Google Ads'] = acc['Google Ads'] + 1 || 1
            } else {
              acc['Google Ads'] = acc['Google Ads'] + 0 || 0
            }
            // bySource.push(acc)
            return acc
            // return { year: formattedDate[0], ...acc }
          }, {})
          const stringFDate = fDate
          // return { label: 'Google Ads', year: formattedDate[0], ...stringFDate }
          return Object.values(stringFDate)
        })

        let newArr = []
        for (let i = 0; i < GoogleAds.length; i++) {
          newArr = newArr.concat(GoogleAds[i])
          // newArr.push(GoogleAds[i])
        }
        this.sourceData.push({
          label: 'Google Ads',
          data: newArr,
          fill: false,
          borderColor: '#4caf50',
          backgroundColor: '#4caf50',
          borderWidth: 1,
        })
        // console.log(this.sourceData)
        this.GoogleAdsLineChartData = GoogleAds
        // console.log('per date group by source', newArr)

        const GoogleMyBusiness = Object.entries(groupByFormattedByDate).map(formattedDate => {
          const fDate = formattedDate[1].reduce((acc, it) => {
            if (it.formatted_tracking_source === 'Google My Business') {
              acc['Google My Business'] = acc['Google My Business'] + 1 || 1
            } else {
              acc['Google My Business'] = acc['Google My Business'] + 0 || 0
            }
            // bySource.push(acc)
            return acc
            // return { year: formattedDate[0], ...acc }
          }, {})
          const stringFDate = fDate
          // return { label: 'Google My Business', year: formattedDate[0], ...stringFDate }
          return Object.values(stringFDate)
        })

        let newArrGoogleMyBusiness = []
        for (let i = 0; i < GoogleMyBusiness.length; i++) {
          newArrGoogleMyBusiness = newArrGoogleMyBusiness.concat(GoogleMyBusiness[i])
          // newArrGoogleMyBusiness.push(GoogleAds[i])
        }
        this.sourceData.push({
          label: 'Google My Business',
          data: newArrGoogleMyBusiness,
          fill: false,
          borderColor: '#9C27b0',
          backgroundColor: '#9C27b0',
          borderWidth: 1,
        })
        // console.log(this.sourceData)
        this.GoogleMyBusinessLineChartData = GoogleMyBusiness

        const GoogleOrganic = Object.entries(groupByFormattedByDate).map(formattedDate => {
          const fDate = formattedDate[1].reduce((acc, it) => {
            if (it.formatted_tracking_source === 'Google Organic') {
              acc['Google Organic'] = acc['Google Organic'] + 1 || 1
            } else {
              acc['Google Organic'] = acc['Google Organic'] + 0 || 0
            }
            // bySource.push(acc)
            return acc
            // return { year: formattedDate[0], ...acc }
          }, {})
          const stringFDate = fDate
          // return { label: 'Google Organic', year: formattedDate[0], ...stringFDate }
          return Object.values(stringFDate)
        })

        let newArrGoogleOrganic = []
        for (let i = 0; i < GoogleOrganic.length; i++) {
          newArrGoogleOrganic = newArrGoogleOrganic.concat(GoogleOrganic[i])
          // newArrGoogleOrganic.push(GoogleAds[i])
        }
        this.sourceData.push({
          label: 'Google Organic',
          data: newArrGoogleOrganic,
          fill: false,
          borderColor: '#7a92a3',
          backgroundColor: '#7a92a3',
          borderWidth: 1,
        })
        // console.log(this.sourceData)
        this.GoogleOrganicLineChartData = GoogleOrganic

        const OrganicSearch = Object.entries(groupByFormattedByDate).map(formattedDate => {
          const fDate = formattedDate[1].reduce((acc, it) => {
            if (it.formatted_tracking_source === 'Organic Search') {
              acc['Organic Search'] = acc['Organic Search'] + 1 || 1
            } else {
              acc['Organic Search'] = acc['Organic Search'] + 0 || 0
            }
            // bySource.push(acc)
            return acc
            // return { year: formattedDate[0], ...acc }
          }, {})
          const stringFDate = fDate
          // return { label: 'Google Organic', year: formattedDate[0], ...stringFDate }
          return Object.values(stringFDate)
        })

        let newArrOrganicSearch = []
        for (let i = 0; i < OrganicSearch.length; i++) {
          newArrOrganicSearch = newArrOrganicSearch.concat(OrganicSearch[i])
          // newArrOrganicSearch.push(GoogleAds[i])
        }
        this.sourceData.push({
          label: 'Organic Search',
          data: newArrOrganicSearch,
          fill: false,
          borderColor: '#00CAE3',
          backgroundColor: '#00CAE3',
          borderWidth: 1,
        })
        // console.log(this.sourceData)
        this.OrganicSearchLineChartData = OrganicSearch

        const LocalSearch = Object.entries(groupByFormattedByDate).map(formattedDate => {
          const fDate = formattedDate[1].reduce((acc, it) => {
            if (it.formatted_tracking_source === 'Organic & Local Search') {
              acc['Organic & Local Search'] = acc['Organic & Local Search'] + 1 || 1
            } else {
              acc['Organic & Local Search'] = acc['Organic & Local Search'] + 0 || 0
            }
            // bySource.push(acc)
            return acc
            // return { year: formattedDate[0], ...acc }
          }, {})
          const stringFDate = fDate
          // return { label: 'Local Search', year: formattedDate[0], ...stringFDate }
          return Object.values(stringFDate)
        })

        let newArrLocalSearch = []
        for (let i = 0; i < LocalSearch.length; i++) {
          newArrLocalSearch = newArrLocalSearch.concat(LocalSearch[i])
          // newArrLocalSearch.push(GoogleAds[i])
        }
        this.sourceData.push({
          label: 'Organic & Local Search',
          data: newArrLocalSearch,
          fill: false,
          borderColor: '#FF5252',
          backgroundColor: '#FF5252',
          borderWidth: 1,
        })
        // console.log(this.sourceData)
        this.LocalSearchLineChartData = LocalSearch

        Object.keys(groupByFormattedSource).forEach(source => {
          // console.log(source)
        })

        // const groupByStatus = this.getParsedCallrails.reduce((acc, it) => {
        //   acc[it.status] = acc[it.status] + 1 || 1
        //   return acc
        // }, {})

        const flattenedFormattedStatusGroupByCity = Object.entries(groupByFormattedByDate).map(formattedDate => {
          const fDate = formattedDate[1].reduce((acc, it) => {
            acc[it.status] = acc[it.status] + 1 || 1
            return acc
          }, {})
          const stringFDate = fDate
          // this.sourceLineChartDataKeys = Object.keys(fDate)
          // this.sourceLineChartsDataLabel = Object.keys(fDate)
          return { year: formattedDate[0], ...stringFDate }
        })
        this.statusBarChart.data = _.sortBy(flattenedFormattedStatusGroupByCity, 'year')

        const flattenedFormattedNewStatusGroupByCity = Object.entries(groupByFormattedByDate).map(formattedDate => {
          const fDate = formattedDate[1].reduce((acc, it) => {
            this.newStatusBarChart.ykeys.forEach(dataKeys => {
              if (dataKeys === it.status) {
                acc[dataKeys] = acc[dataKeys] + 1 || 1
              } else {
                acc[dataKeys] = acc[dataKeys] + 0 || 0
                // allSource.push(acc[it.formatted_tracking_source])
              }
            })
            return acc
          }, {})
          const stringFDate = fDate
          // this.sourceLineChartDataKeys = Object.keys(fDate)
          // this.sourceLineChartsDataLabel = Object.keys(fDate)
          return { year: formattedDate[0], ...stringFDate }
        })
        // console.log('new status bar chart data', this.newStatusBarChart.data)
        this.newStatusBarChart.data = _.sortBy(flattenedFormattedNewStatusGroupByCity, 'year') // flattenedFormattedNewStatusGroupByCity

        // const flattenedFormattedByTags = Object.entries(groupByFormattedByDate).map(formattedDate => {
        //   const fDate = formattedDate[1].reduce((acc, it) => {
        //     acc[dataKeys] = acc[it.status] + 1 || 1
        //     return acc
        //   }, {})
        //   const stringFDate = fDate
        //   // this.sourceLineChartDataKeys = Object.keys(fDate)
        //   // this.sourceLineChartsDataLabel = Object.keys(fDate)
        //   return { year: formattedDate[0], ...stringFDate }
        // })
        // this.statusBarChart.data = flattenedFormattedStatusGroupByCity
        // console.log('group by status', flattenedFormattedStatusGroupByCity)
        // console.log(this.getCityColor())
        // this.lineColors = this.getCityColor()
        this.lineColors = ['#4caf50', '#9C27b0', 'blue', '#00CAE3', '#FF5252']
      },
    },
  }
</script>

<style scoped>
.morris-hover.morris-default-style .morris-hover-point:nth-child(1) {
  color: red !important;
}
.morris-hover.morris-default-style .morris-hover-point:nth-child(2) {
  color: red !important;
}
.morris-hover.morris-default-style .morris-hover-point:nth-child(3) {
  color: red !important;
}
/* .ct-series-a .ct-slice-pie {
  fill: blue !important;
}
.ct-slice-pie:nth-child(1){
    fill: #379683 !important;
}

.ct-slice-pie:nth-child(2){
    fill: red !important;
}

.ct-slice-pie:nth-child(3){
    fill: #EFB200 !important;
} */
</style>
