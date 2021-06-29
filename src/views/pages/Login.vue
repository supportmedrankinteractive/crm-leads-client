<template>
  <v-container
    id="login"
    class="fill-height justify-center"
    tag="section"
  >
    <v-row justify="center">
      <v-slide-y-transition appear>
        <base-material-card
          color="success"
          light
          max-width="100%"
          width="400"
          class="px-5 py-3"
        >
          <template v-slot:heading>
            <div class="text-center">
              <h1 class="text-h3 font-weight-bold mb-2">
                Login
              </h1>

              <v-btn
                v-for="(social, i) in socials"
                :key="i"
                :href="social.href"
                class="ma-1"
                icon
                rel="noopener"
                target="_blank"
              >
                <v-icon
                  v-text="social.icon"
                />
              </v-btn>
            </div>
          </template>

          <v-card-text class="text-center">
            <v-text-field
              v-model="email"
              color="secondary"
              label="Email..."
              prepend-icon="mdi-email"
            />

            <v-text-field
              v-model="password"
              class="mb-8"
              color="secondary"
              label="Password..."
              prepend-icon="mdi-lock-outline"
            />

            <div
              style="color:red; font-size:12px"
              @if="error_message"
            >
              {{ error_message }}
            </div>

            <pages-btn
              large
              color=""
              depressed
              class="v-btn--text success--text"
              @click="login"
            >
              Let's Go
            </pages-btn>
          </v-card-text>
        </base-material-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  // import { mapActions } from 'vuex'

  export default {
    name: 'UserLogin',

    components: {
      PagesBtn: () => import('./components/Btn'),
    },

    data: () => ({
      socials: [
        {
          href: '#',
          icon: 'mdi-facebook-box',
        },
        {
          href: '#',
          icon: 'mdi-twitter',
        },
        {
          href: '#',
          icon: 'mdi-github-box',
        },
      ],
      email: '',
      password: '',
      error_message: '',
    }),

    mounted () {
      // this.login()
      // alert(this.$store.state.user)
    },

    methods: {
      login () {
        this.$store.dispatch('userLogin', { email: this.email, password: this.password })
          .then(response => {
            // console.log(response.data)
            this.$router.push({ name: 'User Dashboard' })
          })
          .catch(() => {
            this.error_message = 'Incorrect combination of email and password.'
          })
      },
    },
  }
</script>
