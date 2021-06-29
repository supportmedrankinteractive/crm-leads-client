<template>
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
              Edit Profile
              <span class="text-body-1">— Complete your profile</span>
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
                  md="6"
                >
                  <v-text-field
                    v-model="profile.name"
                    :rules="$store.state.nameRules"
                    class="purple-input"
                    label="Full Name"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="profile.email"
                    :rules="$store.state.emailRules"
                    label="Email Address"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="profile.notes"
                    class="purple-input"
                    label="Registration Notes"
                    readonly
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="profile.profile.callrail"
                    :rules="[v => !!v || 'You must choose to continue!']"
                    :value="profile.profile.callrail"
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
                  md="12"
                >
                  <v-alert
                    v-if="success_message"
                    type="success"
                    :value="true"
                    class="mb-3"
                  >
                    {{ success_message }}
                  </v-alert>
                </v-col>

                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    :disabled="!valid"
                    color="success"
                    class="mr-0"
                    @click="updateProfile"
                  >
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <base-material-card
          class="v-card-profile"
          avatar="https://medrankinteractive.com/wp-content/uploads/2020/04/lamar-circle.png"
        >
          <v-card-text class="text-center">
            <h6 class="text-h4 mb-1 grey--text">
              CEO
            </h6>

            <h4 class="text-h3 font-weight-light mb-3 black--text">
              Lamar Hull
            </h4>

            <p class="font-weight-light grey--text">
              Lamar Hull is the Founder of Med Rank Interactive, a full-service digital marketing agency in Charlotte that specializes in local SEO exclusively for dentists, orthodontists, pharmacists, independent physicians, and multi-location medical practices.
            </p>

            <v-btn
              color="success"
              rounded
              class="mr-0"
            >
              Follow
            </v-btn>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      profile: {},
      company_name: '',
      valid: true,
      success_message: '',
    }),

    async mounted () {
      // this.$store.dispatch('getCallrailCompanies')
      this.profile = await this.$store.state.profile
      this.company_name = await this.$store.state.profile.profile.company_name
      // alert(this.company_name)
      // console.log(this.profile)
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
    },
  }
</script>
