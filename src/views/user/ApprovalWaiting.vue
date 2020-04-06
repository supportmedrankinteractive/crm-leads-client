<template>
  <v-container
    id="alerts"
    fluid
    tag="section"
  >
    <base-v-component
      heading="Alerts"
      link="components/alerts"
    />

    <v-row>
      <v-col
        cols="12"
        md="12"
      >
        <v-card>
          <v-card-text>
            <base-subheading subheading="Notification Style" />
            <base-material-alert
              color="primary"
              dark
              icon="mdi-bell"
            >
              You can see that the icon and the close button are always vertically aligned. This is a beautiful notification. So you don't have to worry about the style.
            </base-material-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'UserApprovalWaiting',

    data: () => ({
      color: 'info',
      colors: [
        'info',
        'success',
        'warning',
        'error',
      ],
      dialog: false,
      dialog2: false,
      dialog3: false,
      direction: 'top center',
      directions: [
        'top left',
        'top center',
        'top right',
        'bottom left',
        'bottom center',
        'bottom right',
      ],
      snackbar: false,
    }),

    computed: {
      parsedDirection () {
        return this.direction.split(' ')
      },
    },

    methods: {
      randomColor () {
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
      },
    },

    mounted() {
      alert(this.$store.state.user.is_approved)
    },    
  }
</script>
