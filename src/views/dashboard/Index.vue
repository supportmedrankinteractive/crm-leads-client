<template>
  <v-app>
    <dashboard-core-app-bar
      v-if="$store.getters.isAdmin || ($store.state.user && $store.state.user.is_approved === 1)"
      v-model="expandOnHover"
    />

    <dashboard-core-drawer
      v-if="$store.getters.isAdmin || ($store.state.user && $store.state.user.is_approved === 1)"
      :expand-on-hover.sync="expandOnHover"
    />

    <dashboard-core-view />

    <dashboard-core-settings v-model="expandOnHover" />
  </v-app>
</template>

<script>
  export default {
    name: 'DashboardIndex',

    components: {
      DashboardCoreAppBar: () => import('./components/core/AppBar'),
      DashboardCoreDrawer: () => import('./components/core/Drawer'),
      DashboardCoreSettings: () => import('./components/core/Settings'),
      DashboardCoreView: () => import('./components/core/View'),
    },

    data: () => ({
      expandOnHover: false,
    }),
  }
</script>
