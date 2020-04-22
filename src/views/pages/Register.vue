<template>
  <v-container
    id="register"
    class="fill-height justify-center"
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="9"
      >
        <v-slide-y-transition appear>
          <v-card
            class="pa-3 pa-md-5 mx-auto"
            light
          >
            <pages-heading class="text-center display-3">
              Register
            </pages-heading>

            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-row no-gutters>
                  <v-col
                    v-for="(section, i) in sections"
                    :key="i"
                    cols="12"
                  >
                    <v-list-item three-line>
                      <v-list-item-icon class="mr-4 mt-5 mt-md-4">
                        <v-icon
                          :large="$vuetify.breakpoint.mdAndUp"
                          :color="section.iconColor"
                          v-text="section.icon"
                        />
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title
                          class="font-weight-light mb-4 mt-3"
                          v-text="section.title"
                        />

                        <v-list-item-subtitle v-text="section.text" />
                      </v-list-item-content>
                    </v-list-item>
                  </v-col>
                </v-row>
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <div class="text-center">
                  <v-btn
                    v-for="(social, i) in socials"
                    :key="i"
                    :color="social.iconColor"
                    class="my-2 mr-1"
                    dark
                    depressed
                    fab
                    small
                  >
                    <v-icon v-text="social.icon" />
                  </v-btn>

                  <div class="my-2" />

                  <div class="text-center grey--text body-1 font-weight-light">
                    Or Be Classical
                  </div>

                  <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                  >
                    <v-text-field
                      v-model="user.name"
                      :rules="$store.state.nameRules"
                      color="secondary"
                      label="Name..."
                      prepend-icon="mdi-face"
                    />

                    <v-text-field
                      v-model="user.email"
                      :rules="$store.state.emailRules"
                      color="secondary"
                      label="Email..."
                      prepend-icon="mdi-email"
                    />

                    <v-text-field
                      v-model="user.password"
                      :rules="$store.state.passwordRules"
                      class="mb-8"
                      color="secondary"
                      label="Password..."
                      prepend-icon="mdi-lock-outline"
                    />

                    <v-textarea
                      v-model="user.notes"
                      :rules="$store.state.notesRules"
                      color="secondary"
                      label="Registration Notes..."
                      placeholder="i.e: I am requesting to register for Organic Clicks, LLC"
                      prepend-icon="mdi-note"
                    />

                    <v-alert
                      v-if="success_message"
                      type="success"
                      :value="true"
                      class="mb-3"
                    >
                      {{ success_message }}
                    </v-alert>

                    <v-btn
                      :disabled="!valid"
                      color="success"
                      class="mr-4"
                      @click="register"
                    >
                      Register
                    </v-btn>
                  </v-form>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-slide-y-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'PagesRegister',

    components: {
      PagesHeading: () => import('./components/Heading'),
    },

    data: () => ({
      valid: true,
      user: {},
      success_message: '',
      sections: [
        {
          icon: 'mdi-chart-timeline-variant',
          iconColor: 'primary',
          title: 'Marketing',
          text: 'We\'ve created the marketing campaign of the website. It was a very interesting collaboration.',
        },
        {
          icon: 'mdi-code-tags',
          iconColor: 'secondary',
          title: 'Fully Coded in HTML5',
          text: 'We\'ve developed the website with HTML5 and CSS3. The client has access to the code using GitHub.',
        },
        {
          icon: 'mdi-account-multiple',
          iconColor: 'cyan',
          title: 'Built Audience',
          text: 'There is also a Fully Customizable CMS Admin Dashboard for this product.',
        },
      ],
      socials: [
        {
          href: '#',
          icon: 'mdi-twitter',
          iconColor: '#1DA1F2',
        },
        {
          href: '#',
          icon: 'mdi-dribbble',
          iconColor: '#ea4c89',
        },
        {
          href: '#',
          icon: 'mdi-facebook',
          iconColor: '#3B5998',
        },

      ],
    }),
    methods: {
      register () {
        this.$refs.form.validate()
        this.$store.dispatch('userRegister', this.user)
          .then(() => {
            this.success_message = 'Registration request submitted. Please wait while admin is verifying your request. '
          })
      },
    },
  }
</script>

<style lang="sass">
  #register
    .v-list-item__subtitle
      -webkic-line-clamp: initial
      -webkit-box-orient: initial
</style>
