import { createApp } from 'vue'
import { router } from '@/route/routes.ts'
import './style.css'
import App from './App.vue'

createApp(App).use(router).mount('#app')
