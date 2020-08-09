<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="300px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="blue"
          dark
          v-bind="attrs"
          v-on="on"
          :small=true
        >
          Add Follow Up
        </v-btn>
      </template>
      <v-card
        class="mx-auto"
        max-width="300"
        tile
      >
        <v-card-title>Add Follow Up</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <v-textarea
                  v-model="form.text"
                  label="Enter your note"
                  required
                ></v-textarea>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <v-dialog
                  ref="dialog"
                  v-model="modal"
                  :return-value.sync="form.date"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.date"
                      label="Select Date"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.date"
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="modal = false"
                    >Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog.save(form.date)"
                    >OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
                <v-card-actions>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="dialog = false"
                  >Close
                  </v-btn>
                  <v-btn
                    @click="addFollowUp"
                    color="blue darken-1"
                    text
                  >Save
                  </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  // import moment from 'moment'
  export default {
    data () {
      return {
        dialogm1: '',
        dialog: false,
        item: {},
        form: {
          text: '',
          date: '',
        },
        modal: false,
      }
    },
    props: ['lead_id'],
    mounted () {
      // console.log('lead id', this.lead_id)
    },
    methods: {
      addFollowUp () {
        const followUp = { ...this.form, lead_id: this.lead_id }
        // console.log(followUp)
        this.$store.dispatch('addFollowUp', followUp)
          .then(() => {
            this.$emit('add-follow-up', followUp)
            this.dialog = false
          })
        this.form = { text: '', date: '' }
      },
    },
  }
</script>
