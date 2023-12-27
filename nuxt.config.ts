// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/content'],
  typescript: {
    strict: true,
  },
  app: {
    baseURL: '/boards/',
  },
  ssr:     false,
  css:     ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss:  {},
      autoprefixer: {},
    },
  },
})
