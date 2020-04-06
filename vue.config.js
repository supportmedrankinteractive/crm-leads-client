module.exports = {
  devServer: {
    host: 'app.crm-leads.test'
  },

  transpileDependencies: ['vue-world-map', 'vuetify'],

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}
