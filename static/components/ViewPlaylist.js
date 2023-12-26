export default {
    template: `
    <div align="center">
    <img width="100" height="100" src="https://img.icons8.com/ios/100/playlist.png" alt="playlist"/>
    <h1>{{ playlists.playlist_name }}</h1>
    <br>
    <h2>Tracks</h2>
    <br>
    <div class="table table-container" style="max-height: 300px; overflow-y: auto;">
      <thead class="table-dark">
        <tr>
          <th>Name</th>
          <th>Album</th>
          <th>Genre</th>
          <th>Artist</th>
          <th>Play</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
      <!-- <div v-for="(item, index) in musiclist" :key="index"> -->
      <!--<tr v-if="playlistMusicList.includes(item.music_id)"> -->
      <tr v-for="(item, index) in songInfoList" :key="index">
      <td>{{ item.title }}</td>
      <td>{{ item.album_title }}</td>
      <td>{{ item.genre }}</td>
      <td>{{ item.artist }}</td>
      <td>
        <button @click="playSong(item)" class="btn btn-success">Play</button>
      </td>
      <td>
        <button @click="[deleteSongFromPlaylist(item.music_id), toggleReload]"  class="btn btn-danger">Remove</button>
      </td>
        </tr>
      </tbody>
    </table>
    </div>
    <br>        
    <div class="row">
    <i>Add songs to your playlist.</i>
    </div>
    <div class="container" align="center">
        <div style="width: 400px;">
        <button @click="toggleSearch" :class="showSearch ? 'btn btn-danger' : 'btn btn-primary'">
        {{ showSearch ? 'Close' : 'Add Song' }}
      </button>
          <br><br>
          <div v-if="showSearch">
          <ul class="list-group mx-auto" style="max-width: 600px; margin-top: 10px;">
        
          <input class="form-control" type="text" v-model="search" placeholder="Search for Songs"><br>
          <li class="list-group-item bg-dark text-light">
            <h4 class="mb-0">Music List</h4>
          </li>
        <div class="table-responsive table-container" style="max-height: 300px; overflow-y: auto;">
            <table class="table table-bordered table-hover">
              <thead class="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Album</th>
                  <th>Genre</th>
                  <th>Artist</th>
                  <th>Add</th>
                </tr>
              </thead>
              <tbody class="table-group-divider">
                <tr v-for="(item, i) in filteredItems" :key="i">
                  <td>{{ item.title }}</td>
                  <td>{{ item.album_title }}</td>
                  <td>{{ item.genre }}</td>
                  <td>{{ item.artist }}</td>
                  <td>
                    <button @click="addSongToPlaylist(item.music_id)" class="btn btn-success">Add</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          </ul>
        </div>
      </div>
    </div>
    <div class="container d-flex align-items-center justify-content-center" style="margin-top: 10px;">
      <!-- <video ref="audioPlayer" style="border-radius:5pt;" :src="currentSong.audio_file" :poster="currentSong.image" height="210px" autoplay controls @ended="playNext()">
      </video> -->
      <video v-if="currentSong && currentSong.audio_file" ref="audioPlayer" style="border-radius:5pt;" :src="currentSong.audio_file" :poster="currentSong.image" height="210px" autoplay controls @ended="playNext()">
</video>

      </div>
      <div class="container d-flex align-items-center justify-content-center" style="margin-top: 10px;">
      <div v-if="isPlaying" class="col-4">
                <div>
                    <h6>Lyrics:</h6>
                    <pre>{{ currentSong.lyrics }}</pre>
                </div>
                </div>
                </div>
    </div>
  </div>
</div>
    `,
    data() {
      return {
          search: '',
          musiclist: null,
          playlistMusicList: null,
          currentSongIndex: 0,
          currentSong: {},
          songInfoList: [],
          reload: false,
          isPlaying: false,
          showSearch: false, // Flag to toggle search visibility
          playlists: [], // Add this line to define playlists
      };
  },
  
  methods: {
    async addSongToPlaylist(trackId) {
      try {
        // Check if trackId is already present in the playlist
        if (this.playlists.song_list.includes(trackId)) {
          console.log('Track is already in the playlist.');
          return;
        }
    
        const response = await fetch('/api/add-to-playlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
          body: JSON.stringify({
            track_id: trackId,
            playlist_id: this.playlistId,
          }),
        });
    
        if (!response.ok) {
          console.log('Failed to add track to playlist');
          return;
        }
        this.songInfoList = null;
        window.location.reload();
        this.fetchPlaylistNamebyId(this.playlistId);
      } catch (error) {
        console.error('Error adding track to playlist:', error);
      }
    },
    async deleteSongFromPlaylist(trackId) {
      try {
        const response = await fetch('/api/delete-song-from-playlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
          body: JSON.stringify({
            track_id: trackId,
            playlist_id: this.playlistId,
          }),
        });
    
        if (!response.ok) {
          console.log('Failed to delete track from playlist');
          return;
        }
        this.songInfoList = null;
        window.location.reload();
        this.fetchPlaylistNamebyId(this.playlistId);
      } catch (error) {
        console.error('Error deleting track from playlist:', error);
      }
    },
    toggleSearch() {
        this.showSearch = !this.showSearch;
    },
    toggleReload() {
        this.reload = !this.reload;
    },
    playSong(song) {
        this.currentSong = song;
        this.$refs.audioPlayer.load(); // Load the new song in the audio player
        this.$refs.audioPlayer.play(); // Play the song
        this.isPlaying = true; // Set isPlaying to true when the play button is clicked
    },
    playNext() {
        if (this.currentSongIndex < this.songInfoList.length - 1) {
            this.currentSongIndex++;
            this.playCurrentSong();
        }
    },
    playCurrentSong() {
        this.currentSong = this.songInfoList[this.currentSongIndex];
        this.$refs.audioPlayer.load();
        this.$refs.audioPlayer.play();
    },
    async getTracks() {
        const res = await fetch('/api/musicinfo', {
            headers: {
              'Authentication-Token': localStorage.getItem('auth-token'),
            },
        });
        const data = await res.json();
        if (res.ok) {
            this.musiclist = data;
            console.log("musiclist", this.musiclist);
            
        }
    },
    fetchPlaylistNamebyId(playlistId) {
      // Create a promise chain using then and catch
      fetch('/api/get-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({
          playlist_id: playlistId,
        }),
      })
        .then((res) => {
          // Handle the response
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log('Playlist Data from server:', data);
          this.playlists = data;
          this.playlistMusicList = JSON.parse("[" + this.playlists.song_list + "]");
          console.log('playlist List check:', this.playlistMusicList);
          for (let i = 0; i < this.musiclist.length; i++) {
            if (this.playlistMusicList.includes(this.musiclist[i].music_id)) {
              console.log('Found a match!');
              this.songInfoList.push(this.musiclist[i]);
            }
          }
          console.log('Song Info List:', this.songInfoList);
          this.currentSong = this.songInfoList[this.currentSongIndex];
        })
        .catch((error) => {
          // Handle errors
          console.error('Error fetching playlist:', error);
        });
    },
    
},
computed: {
    authToken() {
        return localStorage.getItem('token');
    },
    filteredItems() {
      return this.musiclist.filter(item => {
        return item.title && item.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || 
        item.album_title && item.album_title.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
        item.genre && item.genre.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
        item.artist && item.artist.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      });
    },
    filteredPlaylistItems() {
      const songIDs = this.songInfoList.map(item => item.music_id);
      console.log('Song IDs:', songIDs);
      return this.musiclist.filter(item => songIDs.includes(item.music_id));
    },
    // iterate over the playlistMusicList and find the music info for each item from musiclist
    // return the music info for the item
    
},

created() {
  this.playlistId = this.$route.query.playlistId;
  this.getTracks();
  this.fetchPlaylistNamebyId(this.playlistId);
  
},
};
