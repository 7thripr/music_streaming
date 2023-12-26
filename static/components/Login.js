export default {
    template: `
    <section class="h-100">
    <div class="container h-100">
			<div class="row justify-content-sm-center h-100">
				<div class="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
					<div class="text-center my-5">
                    <img width="100" height="100" src="https://img.icons8.com/ios-filled/100/login-rounded-right.png" alt="login-rounded-right"/>
					</div>
					<div class="card shadow-lg">
						<div class="card-body p-5">
							<h1 class="fs-4 card-title fw-bold mb-4">Login</h1>
								<form>
                <div class="mb-3">
                                    <label for="user-email" class="form-label">Email address</label>
                                    <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email" required>
								</div>

								<div class="mb-3">
									<div class="mb-2 w-100">
                                          <label for="user-password" class="form-label">Password</label>
                                          <input type="password" class="form-control" id="user-password" v-model="cred.password" required>
								</div>

								<div class="d-flex align-items-center">
									<div class="form-check">
										<input type="checkbox" name="remember" id="remember" class="form-check-input">
										<label for="remember" class="form-check-label">Remember Me</label>
									</div>
									<button @click='login' class="btn btn-primary ms-auto">
										Login
									</button>
								</div>
						</div>
            </form>
            <div class="card-footer py-3 border-0">
            <div class="text-center">
                Don't have an account?
                <router-link to="/signup" tag="button" class="btn btn-outline-primary">Register Now</router-link>
						</div>
            </div>
				</div>
			</div>
		</div>
    </div>
</div>
        </section>`,
    data() {
      return {
        cred: {
          email: null,
          password: null,
        },
        error: null,
      }
    },
    methods: {
      async login() {
        const res = await fetch('/api/universal-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.cred),
        })
        const data = await res.json()
        console.log(data)
        if (res.ok) {
          localStorage.setItem('auth-token', data.token)
          localStorage.setItem('role', data.role)
          localStorage.setItem('uniqueid', data.email)
          this.$router.push({ path: '/dashboard' })
        } else {
          this.error = data.message
        }
      },
    },
  }
  