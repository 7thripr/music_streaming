// Signup Component
export default {
    template: `
    <div>
    <section class="h-100">
       <div class="container h-100">
          <div class="row justify-content-sm-center h-100">
             <div class="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
                <div class="text-center my-5">
                   <img width="128" height="128" src="https://img.icons8.com/pastel-glyph/128/add-user-male--v2.png" alt="add-user-male--v2"/>
                </div>
                <div class="card shadow-lg">
                   <div class="card-body p-5">
                      <h1 class="fs-4 card-title fw-bold mb-4">Register</h1>
                      <div class="mb-3">
                         <label class="mb-2 text-muted" for="name">Name</label>
                         <input type="text" class="form-control" id="user-username" v-model="cred.username">
                         <div class="invalid-feedback">
                            Name is required	
                         </div>
                      </div>
                      <div class="mb-3">
                         <label for="user-email" class="form-label">Email address</label>
                         <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email">
                         <div class="invalid-feedback">
                            Email is invalid
                         </div>
                      </div>
                      <div class="mb-3">
                         <label class="mb-2 text-muted" for="password">Password</label>
                         <input type="password" class="form-control" id="user-password" v-model="cred.password">
                         <div class="invalid-feedback">
                            Password is required
                         </div>
                      </div>
                      <p class="form-text text-muted mb-3">
                         By registering you agree with our terms and condition.
                      </p>
                      <div class="align-items-center d-flex">
                         <button @click="signup" class="btn btn-primary ms-auto">Sign Up</button>
                      </div>
                   </div>
                   <div class="card-footer py-3 border-0">
                      <div class="text-center">
                      Proceed to Login if you already have an account.
                         <router-link to="/login" tag="button" class="btn btn-outline-primary">Login</router-link>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </section>
 </div>
    `,
    data() {
        return {
          cred: {
            username: null,
            email: null,
            password: null,
          },
          error: null,
        };
      },      
      methods: {
        async signup() {
          const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.cred),
          })
          const data = await res.json()
          if (res.ok) {
            this.$router.push({ path: '/login' });
          } else {
            // Registration failed, handle the error
            this.error = data.error;
          }
        },
      },
    }