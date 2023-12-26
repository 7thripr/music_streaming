export default {
  template: `
  <div align="center">
  <img width="100" height="100" src="https://img.icons8.com/ios-glyphs/100/play-album.png" alt="play-album"/>
    <div v-if="!showCreateForm">
      <button @click="toggleCreateForm" class="btn btn-dark">Create Playlist</button>
    </div>
    <div v-else class="input-group" style="width: 40%">
      <input class="form-control" v-model="playlistName" placeholder="Enter playlist name" />
      <button @click="createPlaylist" class="btn btn-success">Save Playlist</button>
      <button @click="toggleCreateForm" class="btn btn-danger">Cancel</button>
    </div>
    <br>
    <h1>My Playlists</h1>
    <div class="row">
  <div class="col-md-3" v-for="(item, i) in filteredPlaylists" :key="i">
  <div class="card card-lg mb-4 shadow" style="width: 50%;">
  <div class="card-body">
    <h2 class="card-title h4">{{ item.playlist_name }}</h2>
    <button @click="openPlaylist(item.playlist_id)" class="btn btn-primary btn-sm">Open</button>
    <button @click="deletePlaylist(item.playlist_id)" class="btn btn-danger btn-sm ml-2">Delete</button>
  </div>
</div>

  </div>
</div>

  </div>
  
  </div>
  `,
  data() {
    return {
      playlistName: '',
      email: localStorage.getItem('uniqueid'),
      playlists: [],
      showCreateForm: false,
      authToken: localStorage.getItem('auth-token'),
    };
  },
  methods: {
    async openPlaylist(playlistId) {
      this.$router.push({ 
        path: '/view-playlist',
        query: { playlistId: playlistId }
      });
    },    
    async deletePlaylist(playlistId) {
      try {
        const response = await fetch('/api/delete-playlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.authToken,
          },
          body: JSON.stringify({playlist_id: playlistId,}),
        });

        if (!response.ok) {
          console.log('Failed to delete playlist');
        }
        this.fetchPlaylist(); 
        // Remove the deleted playlist from the local list
        this.playlists = this.playlists.filter(item => item.id !== playlistId);
      } catch (error) {
        console.error('Error deleting playlist:', error);
      }
    },

    async fetchPlaylist() {
      try {
        const res = await fetch('/api/playlistinfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.authToken,
          },
        });
        const data = await res.json();
        console.log(data);
        this.playlists = data;
        this.playlists = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching playlists:', error);
        this.playlists = [];
      }
    },
    async createPlaylist() {
      try {
        const response = await fetch('/api/create-playlists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.authToken,
          },
          body: JSON.stringify({
            playlist_name: this.playlistName,
            email: this.email,
          }),
        });
        console.log(this.playlistName);
        if (!response.ok) {
          throw new Error(`Failed to create playlist. Status: ${response.status}`);
        }
        this.fetchPlaylist(); // Corrected method name
        this.playlistName = ''; // Clear the input field
        this.showCreateForm = false; // Hide the input form after creating a playlist
        window.location.reload();
      } catch (error) {
        console.error('Error creating playlist:', error);
      }
    },
    toggleCreateForm() {
      this.showCreateForm = !this.showCreateForm;
    },
  },
  computed: {
    authToken() {
      return localStorage.getItem('token');
    },
    filteredPlaylists() {
      // return all the entries which have email equal to this.email
      return this.playlists.filter(item => {
        return item.email === this.email;
      });
    }
  },
  created() {
    this.fetchPlaylist();
  },
};
