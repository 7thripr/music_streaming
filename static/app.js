import router from './router.js'
import Navbar from './components/NavBar.js'

router.beforeEach((to, from, next) => {
    const allowedRoutes = ['Login', 'Signup', 'Dashboard', 'Home'];
  
    if (!allowedRoutes.includes(to.name) && !localStorage.getItem('auth-token')) {
      // If the destination route is not in the allowedRoutes array and there's no auth-token
      next({ name: 'Login' });
    } else {
      // Allow the navigation to proceed
      next();
    }
  });

new Vue({
  el: '#app',
  template: `<div>
  <Navbar :key='has_changed'/>
  <router-view class="m-3"/></div>`,
  router,
  components: {
    Navbar,
  },
  data: {
    has_changed: true,
  },
  watch: {
    $route(to, from) {
      this.has_changed = !this.has_changed
    },
  },
})
