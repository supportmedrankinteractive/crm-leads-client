<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="500px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          :small=true
        >
          View Follow Ups
        </v-btn>
      </template>
      <v-card
        class="mx-auto"
        tile
      >
        <v-card-title>Follow Ups</v-card-title>
        <v-divider></v-divider>
        <v-list rounded>
          <v-list-item-group
            v-model="item"
            color="primary"
          >
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
            >
              <!-- <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon> -->
              <v-list-item-content v-html="`<strong>Follow up #${item.order}</strong> ${item.text} on ${formatDate(item.date_at)}`">
                <!-- <v-list-item-title v-html="`<strong>Follow up #${item.order}</strong> ${item.text} on ${formatDate(item.date_at)}`" /> -->
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >Close
          </v-btn>
          <!-- <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >Add Follow Up
          </v-btn> -->
          <add-follow-up
            :lead_id="items[0].lead_id"
            @add-follow-up="addFollowUp"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import moment from 'moment'
  import AddFollowUp from './AddFollowUp'

  export default {
    components: {
      AddFollowUp,
    },
    data () {
      return {
        dialogm1: '',
        dialog: false,
        item: 1,
        items: [],
      }
    },
    props: ['source'],
    mounted () {
      // console.log(this.lead_id)
      this.assignFollowUps()
    },
    methods: {
      assignFollowUps () {
        this.items = this.source.map((src, index) => {
          return { ...src, icon: 'mdi-clock', order: index + 1 }
        }).sort((a, b) => new Date(b.date_at) - new Date(a.date_at))
      },
      formatDate (followUpDate) {
        return moment(followUpDate).format('MMM DD, YYYY')
      },
      addFollowUp (e) {
        this.items.unshift({ ...e, icon: 'mdi-clock', order: this.items.length + 1 })
      },
    },
  }
</script>
