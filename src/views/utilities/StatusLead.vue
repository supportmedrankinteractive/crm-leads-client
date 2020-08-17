<template>
  <v-container>
    <v-select
      :items="status"
      v-model="leadStatus"
      @change="changeStatus"
      :value="lead.status"
      label="Status"
      min-height=2
      dense
      outlined
      style="max-width:140px;height:30px;"
    ></v-select>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        status: ['New Patient', 'Existing Patient', 'Not Interested', 'Price Shopping', 'Invalid Phone Number', 'Voicemail'],
        leadStatus: '',
      }
    },
    props: ['lead'],
    mounted () {
      this.leadStatus = this.lead.status
    },
    methods: {
      changeStatus () {
        this.$store.dispatch('updateLeadStatus', { id: this.lead.lead_id, status: this.leadStatus })
      },
    },
  }
</script>
