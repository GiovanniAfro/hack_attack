import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './router'
import { BCardText, BCard, BCol, BRow, BContainer, BNavForm, BFormInput, BNavItemDropdown, BDropdownItem, BButton, BNavbar, BNavbarBrand, BNavbarToggle, BCollapse, BNavbarNav, BNavItem } from 'bootstrap-vue-next'


// Import Bootstrap and BootstrapVueNext CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

// Import BootstrapVueNext
import BootstrapVueNext from 'bootstrap-vue-next'

// Create the app
const app = createApp(App)

// Make axios globally available in the app

app.component('BNavbar', BNavbar)
app.component('BCardText', BCardText)
app.component('BCard', BCard)
app.component('BCol', BCol)
app.component('BRow', BRow)
app.component('BContainer', BContainer)
app.component('BNavForm', BNavForm)
app.component('BFormInput', BFormInput)
app.component('BNavItemDropdown', BNavItemDropdown)
app.component('BDropdownItem', BDropdownItem)
app.component('BButton', BButton)
app.component('BNavbarBrand', BNavbarBrand)
app.component('BNavbarToggle', BNavbarToggle)
app.component('BCollapse', BCollapse)
app.component('BNavbarNav', BNavbarNav)
app.component('BNavItem', BNavItem)

// Make BootstrapVueNext available throughout your project
app.use(BootstrapVueNext)

// Use the router
app.use(router)

// Mount the app
app.mount('#app')
