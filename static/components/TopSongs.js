export default {
    template: `
    <div>
        <div align="center">
        <img width="100" height="100" style="margin: 20px;" src="https://img.icons8.com/ios-filled/100/bar-chart--v1.png" alt="bar-chart--v1"/>
        <div class="container" align="center">
        <ul class="list-group mx-auto" style="max-width: 600px;">
        <li class="list-group-item bg-dark text-light">
          <h4 class="mb-0">Top Music List</h4>
        </li>
        <div class="table-responsive table-container" style="max-height: 300px; overflow-y: auto;">
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th style="width: 20%;">Title</th>
                <th style="width: 20%;">Album Title</th>
                <th style="width: 15%;">Genre</th>
                <th style="width: 20%;">Artist</th>
                <th style="width: 15%;">Actions</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              <tr v-for="(item, i) in filteredItems" :key="i">
                <td>{{ item.title }}</td>
                <td>{{ item.album_title }}</td>
                <td>{{ item.genre }}</td>
                <td>{{ item.artist }}</td>
                <td>
                <button class="btn btn-secondary" @click="playAndListen(item)">Play</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ul>
        </div>
        </div>
        <div class="container d-flex align-items-center justify-content-center" style="margin-top: 10px;">
      <video ref="audioPlayer" style="border-radius:5pt;" :src="currentSong.audio_file" :poster="currentSong.image" height="210px" autoplay controls @ended="playNext()">
      </video>
      </div>
      <div class="container d-flex align-items-center justify-content-center" style="margin-top: 20px;">
      <div v-if="isPlaying" class="col-4">
                <div class="d-flex justify-content-between mt-3">
                    <p>Listened Count: {{ currentSong.listened }}</p>
                </div>
                <div>
                    <h6>Lyrics:</h6>
                    <pre>{{ currentSong.lyrics }}</pre>
                </div>
                </div>
                </div>
        </div>
        </div>
        `,
        data() {
            return {
                musiclist: [],
                currentSongIndex: 0,
                currentSong: {},
                isPlaying: false,
            }
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
                async updateListened(musicId) {
                    const res = await fetch(`/api/update-listencount`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authentication-Token': localStorage.getItem('auth-token'),
                        },
                            body: JSON.stringify({music_id: musicId}),
                    });
                    const data = await res.json();
                    if (res.ok) {
                        this.currentSong.listened = data.count;
                        
                        // const index = arr.findIndex(obj => {
                        //     return obj.id === 2;
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
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.getItem('auth-token'),
                    },
                });
                const data = await res.json();
                console.log('Data:', data);
                this.musiclist = data;
            },
        },
        computed: {
            filteredItems() {
                // returns top 10 songs with highest listned number
                return this.musiclist.sort((a, b) => b.listened - a.listened).slice(0, 10);
            },
        },
        mounted() {
            this.getTracks();
        },
    }