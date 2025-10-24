import { createApp } from 'vue'
import { router } from '@/route/routes.ts'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import './style.css'
import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Material,
    }
})
app.mount('#app')
