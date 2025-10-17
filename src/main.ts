import { createApp } from 'vue'
import { router } from '@/route/routes.ts'
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Material,
    }
})
app.mount('#app')
