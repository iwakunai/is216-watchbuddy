import { createApp } from "vue";
import { router } from "@/route/routes.ts";
import PrimeVue from "primevue/config";
import Material from "@primeuix/themes/material";
import { clerkPlugin } from "@clerk/vue";
import { dark } from "@clerk/themes";
import "./style.css";
import App from "./App.vue";

// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string

const app = createApp(App);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Material,
  },
});
app.use(clerkPlugin, {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  signInForceRedirectUrl: "/",
  appearance: {
    theme: dark,
    layout: {
      shimmer: false,
      unsafe_disableDevelopmentModeWarnings: false,
    },
  },
});
app.mount("#app");
