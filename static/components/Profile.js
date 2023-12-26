export default {
    template: `
    <div align="center" >
    <img width="100" height="100" src="https://img.icons8.com/ios/100/about-us-male.png" alt="about-us-male"/>
        <div class="container card col-4 bg-dark text-light p-4 shadow-lg" style="width: 15%; margin: 20px;">
        <h4 class="mb-4">Creator Info</h4>

        <p class="mb-2"><strong>Username:</strong> {{ username }}</p>
        <p class="mb-2"><strong>Account Type:</strong> {{ accountType }}</p>
        <p class="mb-2"><strong>Account Status:</strong> {{ accountStatus }}</p>
        <p class="mb-2"><strong>Songs Uploaded:</strong> {{ filteredItems.length }}</p>
        </div>
        <br>
        <center><h2>My Uploads</h2></center>
        <ul class="list-group mx-auto" style="max-width: 600px;">
        <li class="list-group-item bg-dark text-light">
          <h4 class="mb-0">Music List</h4>
        </li>
        <div class="table-responsive table-container" style="max-height: 300px; overflow-y: auto;">
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th style="width: 20%;">Title</th>
                <th style="width: 20%;">Album Title</th>
                <th style="width: 15%;">Genre</th>
                <th style="width: 20%;">Artist</th>
                <th style="width: 17%;">Actions</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              <tr v-for="(item, i) in filteredItems" :key="i">
                <td>{{ item.title }}</td>
                <td>{{ item.album_title }}</td>
                <td>{{ item.genre }}</td>
                <td>{{ item.artist }}</td>
                <td>
                  <button class="btn btn-primary" @click="navigateToEditMusic(item)"><i class="bi bi-pencil-square"></i></button>
                  <button class="btn btn-danger" @click="deleteSong(item.music_id)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ul>
        </div>
    </div>
    `,
    data() {
        return {
            username: '',
            email: localStorage.getItem('uniqueid'),
            accountType: '',
            accountStatus: '',
            musiclist: [],
            songsUploaded: '',
            authToken: localStorage.getItem('auth-token'),
        };
    },
    methods: {
        async deleteSong(item) {
            const res = await fetch('/api/musicinfo', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': this.authToken,
              },
              body: JSON.stringify({ music_id: item }),
            })
            const data = await res.json()
            if (res.ok) {
              this.musiclist = data // Set the received tracks to the component's data
              console.log(this.musiclist) 
            } else {
              alert(data.message)
            }
          },
        navigateToEditMusic(item) {
            console.log('Info prop before navigation:', item);
            this.$router.push({ name: 'EditMusic', params: { info: item } });
          },
        async getTracks() {
            const res = await fetch('/api/musicinfo', {
              headers: {
                'Authentication-Token': this.authToken,
              },
            })
            const data = await res.json()
            if (res.ok) {
              this.musiclist = data // Set the received tracks to the component's data
              console.log(this.musiclist) 
            } else {
              alert(data.message)
            }
          },

          async getProfile() {
            try {
                const res = await fetch('/api/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.authToken,
                    },
                    body: JSON.stringify({ email: this.email }),
                });
        
                if (!res.ok) {
                    console.error('Error:', res.status, res.statusText);
                    return;
                }
        
                const data = await res.json();
                console.log(data);
                this.username = data.user.username;
                this.accountType = data.user.role;
                this.accountStatus = data.user.active;
            } catch (error) {
                console.error('Error:', error);
            }
        },
        editProfile() {
            this.$router.push('/api/edit-profile');
        },
    },
    mounted() {
        this.getTracks()
        this.getProfile()
        },
    computed: {
        filteredItems() {
            return this.musiclist.filter((item) => {
                return item.uploader.match(this.username);
            });
        }
    },
};
