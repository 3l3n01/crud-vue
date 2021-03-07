import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueConfig from 'vue-configuration';
import appConfig from './config.js';


// pass config object to the plugin
Vue.use(VueConfig, {
    config: appConfig
});

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
