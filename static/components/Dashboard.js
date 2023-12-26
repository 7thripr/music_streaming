export default {
    template: `<div>
    <div align="center">
       <br>
       <div class="row">
          <div class="col-md-4">
             <div class="card shadow-lg bg-transparent">
                <a href="http://127.0.0.1:5000/#/playlist" >
                <img src="https://ucarecdn.com/d7485848-027b-4cd5-aa13-400ec0ebacd2/-/preview/500x500/-/quality/smart/-/format/auto/" class="img-fluid card-img-top card-img-bottom">
                </a>
             </div>
          </div>
          <div class="col-md-4">
             <div class="card shadow-lg bg-transparent">
                <a href="http://127.0.0.1:5000/#/top-songs" >
                <img src="https://ucarecdn.com/8f1c1a87-1b9b-4ce4-8a24-f4a295b6a373/-/preview/500x500/-/quality/smart/-/format/auto/" class="img-fluid card-img-top card-img-bottom">
                </a>
             </div>
          </div>
          <div class="col-md-4">
             <div class="card shadow-lg bg-transparent">
                <a href="http://127.0.0.1:5000/#/new-songs" >
                <img src="https://ucarecdn.com/2ea29435-3338-407d-b836-c3b475bc222f/-/preview/500x500/-/quality/smart/-/format/auto/" class="img-fluid card-img-top card-img-bottom">
                </a>
             </div>
          </div>
       </div>
       <br>
       <br>    
       <img width="100" height="100" src="https://img.icons8.com/ios-filled/100/yandex-music.png" alt="yandex-music" align="center"/>
       <ul class="list-group mx-auto" style="max-width: 600px; margin-top: 10px;">
          <input class="form-control" type="text" v-model="search" placeholder="Search for Songs"><br>
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
                      <td><button @click="playAndListen(item)" class="btn btn-primary"><i class="bi bi-play-fill"></i></button>
                         <button @click="reportSong(item)" class="btn btn-secondary"><i class="bi bi-flag-fill"></i></button>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
       </ul>
    </div>
    <div class="container d-flex align-items-center justify-content-center" style="margin-top: 10px;">
       <video ref="audioPlayer" style="border-radius:5pt;" :src="currentSong.audio_file" :poster="currentSong.image" height="210px" controls @ended="playNext()">
       </video>
    </div>
    <div class="container d-flex align-items-center justify-content-center" style="margin-top: 10px;">
       <div v-if="isPlaying" class="col-4">
          <button class="btn btn-danger" @click="likeSong(currentSong.music_id)"><i class="bi bi-heart-fill"></i></button>
          <div class="d-flex justify-content-between mt-3">
             <p>Listened Count: {{ currentSong.listened }}</p>
          </div>
          <div>
             <h6>Lyrics:</h6>
             <pre>{{ currentSong.lyrics }}</pre>
          </div>
       </div>
    </div>
 </div>`,
    data() {
        return {
            search: '',
            musiclist: [], // Array of tracks
            currentSongIndex: 0,
            currentSong: {},
            isPlaying: false,
        };
    },
    methods: {
        playAndListen(item) {
        this.playSong(item);
        this.updateListened(item.music_id);
        },
        async playSong(song) {
        this.currentSong = song;
        this.$refs.audioPlayer.load(); // Load the new song in the audio player
        this.$refs.audioPlayer.play(); // Play the song
        this.isPlaying = true; // Set isPlaying to true when play button is clicked
        },

        async reportSong(song) {
            const res = await fetch(`/api/report-song`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                },
                    body: JSON.stringify({music_id: song.music_id}),
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Reported song");
            }
            else {
                console.error(`Failed to get tracks: ${data.message}`);
            }
        },
        async updateListened(musicId) {
            const res = await fetch(`/api/update-listencount`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                },
                    body: JSON.stringify({music_id: musicId}),
            });
            const data = await res.json();
            if (res.ok) {
                this.currentSong.listened = data.count;
                const index = this.musiclist.findIndex(obj => {
                    return obj.music_id === musicId;
                });
                console.log("Data", data.count);
            }
            else {
                console.error(`Failed to get tracks: ${data.message}`);
            }
        },
        playNext() {
            if (this.currentSongIndex < this.musiclist.length - 1) {
                this.currentSongIndex++;
                this.playCurrentSong();
            }
        },
        async getTracks() {
            const res = await fetch('/api/musicinfo', {
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                },
            });
            const data = await res.json().catch(err => console.log("gettracks", err));
            if (res.ok) {
                this.musiclist = data;
                console.log(this.musiclist);
                this.currentSong = this.musiclist[this.currentSongIndex];
                console.log(this.currentSong);
            }
            else {
                console.error(`Failed to get tracks: ${data.message}`);
            }
        },
        async likeSong(musicId) {
            console.log("music id", musicId);
            const res = await fetch(`/api/like-song`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token'),
                },
                // send music_id and email
                body: JSON.stringify({ music_id: musicId, email: localStorage.getItem('uniqueid') }),
            });
            const data = await res.json().catch(err => console.log(err));
            if (res.status === 201) {
                console.log("Unliked song");
            } else if (res.status === 200) {
                console.log("Liked song");
            } else {
                console.error(`Failed to get tracks: ${data.message}`);
            }
        },        
    },
    computed: {
        authToken() {
            return localStorage.getItem('token');
        },
        filteredItems() {
            return this.musiclist.filter(item => {
              // Check if item.name is defined before calling toLowerCase()
              return item.title && item.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || 
              item.album_title && item.album_title.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
              item.genre && item.genre.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
              item.artist && item.artist.toLowerCase().indexOf(this.search.toLowerCase()) > -1
            });
          }
          
    },
    created() {
        this.getTracks();
        
    },
}