const fs = require('fs')

module.exports = {
  devServer: {
    host: 'app.crm-leads.app',
    https: {
      key: fs.readFileSync('./server.key'),
      cert: fs.readFileSync('./server.crt')
    },
    port: 443
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
