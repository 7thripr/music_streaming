export default {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
    <a class="navbar-brand" href="/#/dashboard">OSMusic</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul class="navbar-nav">
            <li class="nav-item" v-if="!is_login">
                <router-link class="nav-link" to="/signup">Register</router-link>
            </li>
            <li class="nav-item" v-if="!is_login">
                <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item" v-if="role === 'admin'">
                <router-link class="nav-link" to="/admin">Admin</router-link>
            </li>
            <li class="nav-item" v-if="is_login && role === 'user'">
                <router-link class="nav-link" to="/apply-creator">Become a Creator Now!</router-link>
            </li>
            <li class="nav-item" v-if="is_login && (role === 'creator' || role === 'admin')">
                <router-link class="nav-link" to="/upload-music">Upload</router-link>
            </li>
            <li class="nav-item" v-if="is_login && (role === 'creator')">
                <router-link class="nav-link" to="/profile">Profile</router-link>
            </li>
            <li class="nav-item" v-if="is_login">
                <button class="nav-link" @click='logout'>Logout</button>
            </li>
      </ul>
    </div>
  </div>
</nav>
    `,
    data() {
      return {
        role: localStorage.getItem('role'),
        is_login: localStorage.getItem('auth-token'),
      }
    },
    methods: {
      logout() {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('role');
        localStorage.removeItem('uniqueid');
        this.$router.push('/login');
      },

  }
  }
