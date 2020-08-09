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
    </v-row>
  </v-container>
</template>

<script>
  import { DonutChart, LineChart } from 'vue-morris'
  export default {
    name: 'UserDashboard',
    components: {
      DonutChart,
      LineChart,
    },
    data () {
      return {
        sourceLineChartData2: [
          { year: '2011', a: 100, b: 150 },
          { year: '2012', a: 140, b: 220 },
          { year: '2013', a: 300, b: 160 },
          { year: '2014', a: 200, b: 230 },
        ],
        sourceLineChartDataKeys: ['Google Ads', 'Google My Business', 'Organic & Local Search', 'Organic Search', 'Google Organic'],
        cityDonutData: [],
        sourceLineChartData: [],
        sourceLineChartsDataLabel: ['Google Ads', 'Google My Business', 'Organic & Local Search', 'Organic Search', 'Google Organic'],
        countryData: {
          US: 2920,
          DE: 1390,
          AU: 760,
          GB: 690,
          RO: 600,
          BR: 550,
        },
        colouredLine: {
          data: {
            labels: ["'06", "'07", "'08", "'09", "'10", "'11", "'12", "'13", "'14", "'15"],
            series: [
              [275, 500, 290, 55, 700, 700, 500, 750, 630, 900, 930],
            ],
          },
          options: {
            low: 0,
            high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
        dailySalesChart: {
          data: {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            series: [
              [12, 17, 7, 17, 23, 18, 38],
            ],
          },
          options: {
            low: 0,
            high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
            showPoint: false,
          },
        },
        dataCompletedTasksChart: {
          data: {
            labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
            series: [
              [230, 750, 450, 300, 280, 240, 200, 190],
            ],
          },
          options: {
            low: 0,
            high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
        emailsSubscriptionChart: {
          data: {
            labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Mai', 'Ju', 'Jul', 'Au', 'Se', 'Oc', 'No', 'De'],
            series: [
              [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],

            ],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.none(),
            axisX: {
              showGrid: false,
            },
            low: 0,
            high: 1000,
            chartPadding: {
              top: 0,
              right: 5,
              bottom: 0,
              left: 0,
            },
          },
          responsiveOptions: [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0]
                },
              },
            }],
          ],
        },
        multipleBar: {
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: [
              [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
              [400, 200, 250, 575, 450, 300, 285, 370, 370, 410, 620, 690],
            ],
          },
          options: {
            seriesBarDistance: 10,
            lineSmooth: this.$chartist.Interpolation.none(),
            axisX: {
              showGrid: false,
            },
            low: 0,
            high: 900,
            chartPadding: {
              top: 0,
              right: 5,
              bottom: 0,
              left: 0,
            },
          },
          responsiveOptions: [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0]
                },
              },
            }],
          ],
        },
        multipleLine: {
          data: {
            // labels: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            // series: [20, 60, 120, 200, 180, 20, 10],
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: [
              [275, 500, 290, 55, 700, 700, 500, 750, 630, 900, 930, 343],
              [575, 600, 490, 75, 300, 400, 700, 450, 130, 200, 330, 322],
              [575, 300, 890, 155, 640, 540, 800, 250, 230, 400, 630, 844],
            ],
          },
          distributeSeries: true,
          options: {
            // distributeSeries: true,
            low: 0,
            high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
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
            // labels: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            // series: [
            //   [20, 60, 120, 200, 180, 20, 10],
            // ],
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
        pie: {
          data: {
            labels: [],
            series: [],
          },
          options: {
            labelInterpolationFnc: (value) => `${value}%`,
            width: '600px',
            height: '450px',
            donut: true,
          },
          options2: {
            labelInterpolationFnc: (value) => `${value}%`,
            width: '600px',
            height: '450px',
          },
        },
        sourcePie: {
          data: {
            series: [],
          },
          options: {
            labelInterpolationFnc: (value) => `${value}%`,
            width: '600px',
            height: '450px',
            chartPadding: 30,
            labelOffset: 100,
            labelDirection: 'explode',
          },
          options2: {
            labelInterpolationFnc: (value) => `${value}%`,
            width: '600px',
            height: '450px',
            donut: true,
          },
        },
        headers: [
          {
            sortable: false,
            text: 'ID',
            value: 'id',
          },
          {
            sortable: false,
            text: 'Name',
            value: 'name',
          },
          {
            sortable: false,
            text: 'Salary',
            value: 'salary',
            align: 'right',
          },
          {
            sortable: false,
            text: 'Country',
            value: 'country',
            align: 'right',
          },
          {
            sortable: false,
            text: 'City',
            value: 'city',
            align: 'right',
          },
        ],
        items: [
          {
            id: 1,
            name: 'Dakota Rice',
            country: 'Niger',
            city: 'Oud-Tunrhout',
            salary: '$35,738',
          },
          {
            id: 2,
            name: 'Minerva Hooper',
            country: 'Curaçao',
            city: 'Sinaai-Waas',
            salary: '$23,738',
          },
          {
            id: 3,
            name: 'Sage Rodriguez',
            country: 'Netherlands',
            city: 'Overland Park',
            salary: '$56,142',
          },
          {
            id: 4,
            name: 'Philip Chanley',
            country: 'Korea, South',
            city: 'Gloucester',
            salary: '$38,735',
          },
          {
            id: 5,
            name: 'Doris Greene',
            country: 'Malawi',
            city: 'Feldkirchen in Kārnten',
            salary: '$63,542',
          },
        ],
        sales: [
          {
            country: 'USA',
            flag: 'https://demos.creative-tim.com/vue-material-dashboard-pro/img/flags/US.png',
            salesInM: 2920,
          },
          {
            country: 'Germany',
            flag: 'https://demos.creative-tim.com/vue-material-dashboard-pro/img/flags/DE.png',
            salesInM: 1300,
          },
          {
            country: 'Australia',
            flag: 'https://demos.creative-tim.com/vue-material-dashboard-pro/img/flags/AU.png',
            salesInM: 760,
          },
          {
            country: 'United Kingdom',
            flag: 'https://demos.creative-tim.com/vue-material-dashboard-pro/img/flags/GB.png',
            salesInM: 690,
          },
          {
            country: 'Romania',
            flag: 'https://demos.creative-tim.com/vue-material-dashboard-pro/img/flags/RO.png',
            salesInM: 600,
          },
          {
            country: 'Brasil',
            flag: 'https://demos.creative-tim.com/vue-material-dashboard-pro/img/flags/BR.png',
            salesInM: 550,
          },
        ],
        tabs: 0,
        list: {
          0: false,
          1: false,
          2: false,
        },
        citiesGraph: [],
        sourceGraph: [],
        cityNames: [],
        otherCityNames: [],
        totalPctOfTopFive: null,
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
      // console.log('Group by city', groupByCity)
      // this.citiesGraph.map(city => {
      //   // this.multipleLineCities.data.labels.push(city[0])
      //   this.multipleLineCities.data.series.push(city[2])
      // })

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

      // Object.entries(groupByFormattedSource).forEach(source => {
      //   const sourcePercentage = source[1] / this.$store.getters.getParseJsonLeads.length * 100
      //   source[2] = sourcePercentage
      //   source[3] = this.getRandomColor()
      //   this.sourceGraph.push(source)
      // })

      // this.sourceGraph.map(source => {
      //   // this.sourcePie.data.labels.push(source[0])
      //   this.sourcePie.data.series.push(source[1].toFixed(1))
      // })

      const groupByFormattedByDate = this.$store.getters.getParseJsonLeads.reduce((groups, game) => {
        const date = game.start_time.split('T')[0]
        // const date = game.formatted_tracking_source
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(game)
        return groups
      }, {})

      // console.log('object entries, ', groupByFormattedByDate)
      // flatten array of date
      // const flattenGroupByFormattedByDate = groupByFormattedByDate.map(formattedSourceByDate => {
      //   return [].concat(...formattedSourceByDate)
      // })

      // console.log('flattened ', flattenGroupByFormattedByDate)
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
      // console.log('flattened', flattenedFormattedDateGroupByCity)

      Object.keys(groupByFormattedSource).forEach(source => {
        // console.log(source)
      })
      // this.sourceGraph.forEach(source => {
      //   this.sourcePie.data
      // })
      // console.log('source data ', groupByFormattedSource)
      // console.log('date data ', groupByFormattedByDate)

      // console.log('Object entries', Object.entries(groupByFormattedByDate))

      // Object.keys(groupByFormattedSource).forEach(source => {
      //   Object.entries(groupByFormattedByDate).forEach(byDate => {
      //     this.multipleLineCitiesBar.data.labels.push(byDate[0])
      //     byDate[1].forEach(byd => {
      //       console.log(byd.formatted_tracking_source)
      //       if (byd.formatted_tracking_source === source) {
      //         this.multipleLineCitiesBar.data.series.push(byd)
      //         console.log(byDate)
      //       }
      //     })
      //   })
      // })
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
