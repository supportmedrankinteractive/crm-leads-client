<template>
  <v-stepper
    v-model="e1"
    width="75%"
  >
    <v-stepper-header>
      <v-stepper-step
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
      <v-stepper-content step="1">
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
                          :items="$store.state.callrail.companies"
                          return-object
                        />
                      </v-col>

                      <v-col
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
                      </v-col>
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
                      class="headline"
                      v-text="item.title"
                    />

                    <v-card-subtitle
                      class="mt-5"
                      v-text="item.description"
                    />
                    <v-card-actions>
                      <v-btn
                        text
                        @click="interval(i)"
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
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  export default {
    data: () => ({
      profile: {},
      user: {},
      valid: true,
      success_message: '',
      e1: 1,
      items: [
        {
          color: '#388aed',
          src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          title: 'CallRail Leads',
          description: 'You have 100 Leads from API',
          progress_percentage: 0,
        },
        {
          color: '#3b5998',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title: 'Facebook Leads',
          description: 'You have 100 Leads from API',
          progress_percentage: 0,
        },
        {
          color: '#385F73',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title: 'Website Leads',
          description: 'You have 100 Leads from API',
          progress_percentage: 0,
        },
      ],
    }),

    async mounted () {
      // this.$store.dispatch('getCallrailCompanies')
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

      interval (index) {
        setInterval(() => {
          if (this.items[index].progress_percentage === 100) {
            return
          }
          // Call CallRail API
          // get the data array from Callrail then post it on the server
          this.items[index].progress_percentage += 10
        }, 1000)
      },

      register () {
        this.$refs.form.validate()
        this.$store.dispatch('userRegister', this.user)
          .then(() => {
            this.success_message = 'Registration request submitted. Please wait while admin is verifying your request. '
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
