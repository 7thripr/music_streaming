export default {
    template: `
    <div>
    <div align="center" class="mb-4">
        <img width="100" height="100" src="https://img.icons8.com/pastel-glyph/64/nft-user.png" alt="nft-user"/>
        <br>
        <ul class="list-group mx-auto" style="max-width: 600px; margin: 20px;">
        <input class="form-control" type="text" v-model="search" placeholder="Search for Creator"><br>

        <li class="list-group-item bg-dark text-light">
          <h4 class="mb-0">Music List</h4>
        </li>
        <div class="table-responsive table-container" style="max-height: 300px; overflow-y: auto;">
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th style="width: 20%;">Username</th>
                <th style="width: 20%;">Email</th>
                <th style="width: 13%;">Action</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              <tr v-for="(item, i) in filteredCreators" :key="i">
                <td>{{ item.username }}</td>
                <td>{{ item.email }}</td>
                <td>
                  <button class="btn btn-primary" @click="demoteCreator(item.email)"><i class="bi bi-arrow-bar-down"></i></button>
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
            search: '',
            creatorList: [],
            userList: [],
        }
    },
    methods: {
      async getCreatorList() {
        const res = await fetch('/api/get-creator-list', {
            method: 'GET',
        });
        const data = await res.json();
        if (res.ok) {
            this.creatorList = data;
            console.log(this.creatorList);
        }
    },
    async getUserList() {
      const res = await fetch('/api/get-all-users', {
          method: 'GET',
      });
      const data = await res.json();
      if (res.ok) {
          this.userList = data;
          console.log("UserList", this.userList);
      }
  },
  async demoteCreator(email_id) {
    const res = await fetch('/api/demote-creator', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({ email: email_id }),
    });
    const data = await res.json().catch(err => console.log(err));
    if (res.ok) {
        this.getCreatorList();
    }
    },
  },
    computed: {
      filteredCreators() {
        const creatorIds = this.creatorList.map(item => item.user_id);
        console.log("CreatorIds", creatorIds);
    
        if (this.userList) {
            return this.userList.filter(item => creatorIds.includes(item.id));
        } else {
            return [];
        }
    },
    },
    mounted() {
      this.getCreatorList();
      this.getUserList();
  },
}