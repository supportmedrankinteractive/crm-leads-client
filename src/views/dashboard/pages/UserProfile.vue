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
              <span class="body-1">— Complete your profile</span>
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
                    v-model="profile.company"
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
          avatar="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg"
        >
          <v-card-text class="text-center">
            <h6 class="display-1 mb-1 grey--text">
              CEO / CO-FOUNDER
            </h6>

            <h4 class="display-2 font-weight-light mb-3 black--text">
              Alec Thompson
            </h4>

            <p class="font-weight-light grey--text">
              Don't be scared of the truth because we need to restart the human foundation in truth And I love you like Kanye loves Kanye I love Rick Owens’ bed design but the back is...
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
      valid: true,
      success_message: '',
    }),

    async mounted () {
      // this.$store.dispatch('getCallrailCompanies')
      this.profile = this.$store.state.profile
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
