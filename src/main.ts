import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routers'

// PrimeVue and theme
import PrimeVue from 'primevue/config'
// import 'primevue/resources/themes/saga-blue/theme.css'   // pick your theme
// import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App)

// Use PrimeVue
app.use(PrimeVue)

// Use your router
app.use(router)

app.mount('#app')