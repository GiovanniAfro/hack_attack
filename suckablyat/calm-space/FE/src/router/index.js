import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Record from '../components/Record.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'Calm Sapce'
          }
    },
    {
        path: '/about',
        name: 'About',
        component: Record,
    },
    // Add other routes here as needed
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
      document.title = to.meta.title;
    } else {
      document.title = 'Default Title';
    }
    next();
  });

export default router
