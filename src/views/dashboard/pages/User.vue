<template>
  <v-stepper
    v-model="e1"
    width="75%"
  >
    <v-stepper-header>
      <v-stepper-step
        editable
        :complete="e1 > 1"
        step="1"
      >
        User Details
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="e1 > 2"
        step="2"
      >
        Import Leads From API and Export to MED RANK Database
      </v-stepper-step>

      <v-divider />

      <v-stepper-step step="3">
        Success
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content
        step="1"
      >
        <v-container
          id="user-profile"
          fluid
          tag="section"
        >
          <v-row justify="center">
            <v-col
              cols="12"
              md="8"
            >
              <base-material-card icon="mdi-account-outline">
                <template v-slot:after-heading>
                  <div class="font-weight-light card-title mt-2">
                    Add User
                  </div>
                </template>

                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                >
                  <v-container class="py-0">
                    <v-row>
                      <v-col
                        cols="12"
                      >
                        <v-text-field
                          v-model="user.name"
                          :rules="$store.state.nameRules"
                          class="purple-input"
                          label="Full Name"
                        />
                      </v-col>

                      <v-col
                        cols="12"
                      >
                        <v-text-field
                          v-model="user.email"
                          :rules="$store.state.emailRules"
                          label="Email Address"
                          class="purple-input"
                        />
                      </v-col>

                      <v-col
                        cols="12"
                      >
                        <v-text-field
                          v-model="user.password"
                          label="Password"
                          class="purple-input"
                        />
                      </v-col>

                      <v-col cols="12">
                        <v-textarea
                          v-model="user.notes"
                          class="purple-input"
                          label="Registration Notes"
                        />
                      </v-col>

                      <v-col
                        cols="12"
                      >
                        <v-select
                          v-model="user.company"
                          :rules="[v => !!v || 'You must choose to continue!']"
                          label="Companies"
                          class="purple-input"
                          item-text="name"
                          item-value="id"
                          :items="$store.getters.getCompanies"
                          return-object
                          @change="fetchFirstInstanceOfLeads"
                        />
                      </v-col>

                      <!-- <v-col
                        cols="12"
                      >
                        <v-btn
                          :disabled="!valid"
                          color="success"
                          class="mr-4"
                          @click="register"
                        >
                          Register
                        </v-btn>
                      </v-col> -->
                    </v-row>
                  </v-container>
                </v-form>
              </base-material-card>
            </v-col>
          </v-row>
        </v-container>

        <v-btn
          color="primary"
          @click="e1 = 2"
        >
          Continue
        </v-btn>

        <v-btn
          text
          @click="e1 - 1"
        >
          Cancel
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-container>
          <h1> {{ user.company ? user.company.name: '' }} </h1>
          <v-row dense>
            <v-col
              v-for="(item, i) in items"
              :key="i"
              cols="xs12 sm12 md4"
            >
              <v-card
                :color="item.color"
                dark
              >
                <div class="d-flex flex-no-wrap justify-space-between">
                  <div>
                    <v-card-title
                      class="text-h5"
                      v-text="item.title"
                    />

                    <v-card-subtitle
                      class="mt-5"
                      v-text="item.description"
                    />
                    <v-card-actions>
                      <v-btn
                        text
                        @click="migrateLeads(i)"
                      >
                        Migrate Now
                      </v-btn>
                    </v-card-actions>
                  </div>

                  <v-avatar
                    class="ma-3"
                    size="125"
                    tile
                  >
                    <v-progress-circular
                      :rotate="360"
                      :size="100"
                      :width="15"
                      :value="item.progress_percentage"
                      color="white"
                    >
                      {{ item.progress_percentage }} %
                    </v-progress-circular>
                  </v-avatar>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <v-btn
          color="primary"
          @click="e1 = 3"
        >
          Continue
        </v-btn>

        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card
          class="mb-12"
          color="grey lighten-1"
          height="200px"
        />

        <v-btn
          color="primary"
          @click="e1 = 1"
        >
          Continue
        </v-btn>

        <v-btn text>
          Cancel
        </v-btn>

        <v-snackbar
          v-model="created_user"
          :timeout="timeout"
        >
          {{ success_message }}

          <template v-slot:action="{ attrs }">
            <v-btn
              color="blue"
              text
              v-bind="attrs"
              @click="created_user = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  import { siteUrlAPI } from '@/axios-instances'

  export default {
    data: () => ({
      profile: {},
      user: {},
      valid: true,
      success_message: '',
      e1: 1,
      items: [
        {
          id: 1,
          color: '#388aed',
          src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          title: 'CallRail Leads',
          description: 'You have 0 Leads from API',
          progress_percentage: 0,
          url: '',
        },
        {
          id: 2,
          color: '#3b5998',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title: 'Facebook Leads',
          description: 'You have 0 Leads from API',
          progress_percentage: 0,
          url: '',
        },
        {
          id: 3,
          color: '#385F73',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title: 'Website Leads',
          description: 'You have 0 Leads from API',
          progress_percentage: 0,
          url: '',
        },
      ],
      leads: {},
      date_range: [
        {
          text: 'Recent (Prior 30 Days)',
          value: 'recent',
        },
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
      created_user: false,
      timeout: 2000,
    }),

    async mounted () {
      this.$store.dispatch('getCallrailCompanies')
      // this.profile = this.$store.state.profile
    },

    methods: {
      updateProfile () {
        this.$refs.form.validate()
        // console.log(this.profile.company.name)
        this.$store.dispatch('updateProfile', this.profile)
          .then(() => {
            this.success_message = `You have successfully approved the user and assigned to ${this.profile.company.name}`
          })
      },

      async fetchFirstInstanceOfLeads () {
        // Call CallRail API
        this.$store.dispatch('getUserCallrail', { companyId: this.user.company.id, currentPage: 1 })
          .then(callrails => {
            this.leads.callrail = callrails
            // Index 0 is Callrail
            this.items[0].description = `${callrails.data.total_records} new calls from Callrail`
          })
          .catch()
      },

      migrateLeads (index) {
        // this.register()
        this.$refs.form.validate()
        this.$store.dispatch('userRegister', this.user)
          .then(user => {
            this.profile = user.data.profile
            // console.log(user.data.profile)
            this.created_user = true
            this.success_message = 'You have created a new user and assigned leads to his/her account.'
            // console.log('migrateLeads executes....')
            // const status = 1
            // let progressBar = 0
            const page = 1

            // Call CallRail API
            // this.$store.dispatch('getUserCallrail', { companyId: this.user.company.id, currentPage: 1 })
            //   .then(callrails => this.recursiveLeads(callrails, page, index))
            //   .catch()
            this.recursiveLeads(this.leads.callrail, page, index)
          })
      },

      async recursiveLeads (callrails, page, index) {
        const status = 'New Patient'
        // let progressBar = 0
        // let page = 1
        // console.log(callrails.data)
        let callRailData = []
        // progressBar = Math.ceil(callrails.data.page / callrails.data.total_pages)

        // if (page === 1) {
        //   callRailData = callrails.data.calls
        // }
        callRailData = callrails.data.calls
        // console.log('first call of getUserCallrail')
        // console.log(`total pages is ${callrails.data.total_pages}`)
        if (callrails.data.total_pages > 0) {
          // console.log('total pages > 0')
          // console.log(`progressBar is ${progressBar}`)

          // console.log('while running.......')
          // get the data array from Callrail then post it on the server's leads api endpoint
          // const postData = { callrailResponse: callRailData, profile_id: this.user.company.id, platform_id: this.items[index].id, status }

          // const postToServer = await axios.post('http://crm-leads.test/api/lead', postData)
          // postToServer.then(result => console.log(result))

          siteUrlAPI.get('/sanctum/csrf-cookie')
            .then(response => {
              siteUrlAPI
                .post('/api/leads', {
                  callrailResponse: JSON.stringify(callRailData),
                  profile_id: this.profile.id,
                  platform_id: this.items[index].id,
                  status,
                })
                .then(result => {
                  // console.log(result)
                  page++
                  if (result.status === 201 && callrails.data.page <= callrails.data.total_pages) {
                    this.$store.dispatch('getUserCallrail', { companyId: this.user.company.id, currentPage: page })
                      .then(newCallrails => {
                        // this.items[index].progress_percentage += progressBar
                        this.items[index].progress_percentage = (callrails.data.page / callrails.data.total_pages) * 100
                        // set the progress bar
                        // progressBar = newCallrails.data.page
                        this.recursiveLeads(newCallrails, page, index)
                        // console.log(`${page} calls of getUserCallrail`)
                        // callRailData = newCallrails.data.calls
                      })
                  }
                })
                // .catch()
            })
        }
        // console.log('total pages > 0 is false')
      },

      async register () {
        this.$refs.form.validate()
        await this.$store.dispatch('userRegister', this.user)
          .then(user => {
            // console.log('user profile '.user.data)
            // this.profile = user.data.profile
            this.success_message = 'You have created a new user and assigned leads to his/her account.'
            this.created_user = true
          })
          .catch(errors => {
            this.$store.commit('GET_ERROR_REGISTRATION', errors.errorInfo)
            // errors.forEach(error => {
            //   this.$state.validation_rules[error] = error[0]
            // })
            // console.log(error)
          })
      },

    },
  }
</script>
<style scoped>

</style>
