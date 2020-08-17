<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
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
            :colors="getCityColor"
            :labels="sourceLineChartsDataLabel"
            resize="true"
          />
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
          title="Status"
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
            grid-text-weigth="bold"
          />
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { DonutChart, LineChart, BarChart } from 'vue-morris'
  export default {
    name: 'UserDashboard',
    components: {
      DonutChart,
      LineChart,
      BarChart,
    },
    data () {
      return {
        sourceLineChartDataKeys: ['Google Ads', 'Google My Business', 'Organic & Local Search', 'Organic Search', 'Google Organic'],
        cityDonutData: [],
        sourceLineChartData: [],
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
      }
    },
    computed: {
      totalCalls () {
        return this.citiesGraph.reduce((acc, val) => acc + val[1], 0)
      },
    },
    async mounted () {
      if (typeof (this.$store.state.callrail_calls.calls) === 'undefined') {
        await this.$store.dispatch('getProfileCallrail')
      }
      // console.log('parsed json leads ', await this.$store.getters.getParseJsonLead)
      const groupByCity = this.$store.getters.getParseJsonLeads.reduce((acc, it) => {
        acc[it.customer_city] = acc[it.customer_city] + 1 || 1
        return acc
      }, {})

      Object.entries(groupByCity).forEach(city => {
        const cityPercentage = city[1] / this.$store.getters.getParseJsonLeads.length * 100
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
      this.totalPctOfTopFive = this.multipleLineCities.data.series.reduce((acc, val) => acc + parseFloat(val), 0)

      const groupByFormattedSource = this.$store.getters.getParseJsonLeads.reduce((acc, it) => {
        acc[it.formatted_tracking_source] = acc[it.formatted_tracking_source] + 1 || 1
        return acc
      }, {})

      const groupByFormattedByDate = this.$store.getters.getParseJsonLeads.reduce((groups, game) => {
        const date = game.start_time.split('T')[0]
        // const date = game.formatted_tracking_source
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(game)
        return groups
      }, {})

      const flattenedFormattedDateGroupByCity = Object.entries(groupByFormattedByDate).map(formattedDate => {
        const fDate = formattedDate[1].reduce((acc, it) => {
          acc[it.formatted_tracking_source] = acc[it.formatted_tracking_source] + 1 || 1
          return acc
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

      Object.keys(groupByFormattedSource).forEach(source => {
        // console.log(source)
      })

      // const groupByStatus = this.$store.getters.getParseJsonLeads.reduce((acc, it) => {
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
      this.statusBarChart.data = flattenedFormattedStatusGroupByCity
      console.log('group by status', flattenedFormattedStatusGroupByCity)
    },
    methods: {
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
    },
  }
</script>

<style scoped>
.ct-series-a .ct-slice-pie {
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
}
</style>
