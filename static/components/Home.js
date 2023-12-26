import Login from "./Login.js"
import Signup from "./Signup.js"
export default {
    template: `
    <div class="mt-5 text-center">
    <!-- Logo Image -->
    <div class="mb-4">
      <img src="https://ucarecdn.com/19efc97f-972e-4c31-9ad5-09f89c5babab/-/scale_crop/300x300/-/format/auto/-/quality/smart/" alt="Logo" class="img-fluid" style="max-width: 200px;">
    </div>

    <!-- Login and Signup Buttons -->
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4 mb-3">
        <router-link to="/login" class="btn btn-lg btn-primary">Login</router-link>
      </div>
      <div class="col-md-6 col-lg-4 mb-3">
        <router-link to="/signup" class="btn btn-lg btn-success">Signup</router-link>
      </div>
    </div>
  </div>
    `,
    components: {
        Login,
        Signup,
    },
    data: {
        has_changed: true,
    },
    watch: {
        $route(to, from) {
            this.has_changed = !this.has_changed
        },
    },
}
