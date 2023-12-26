export default {
    template: `
    <div align="center">
    <img width="100" height="100" src="https://img.icons8.com/ios/100/flag--v1.png" alt="flag--v1"/>
    <br>
    <center><h2>Flagged Songs</h2></center>
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
              <tr v-for="(item, index) in flaggedSongsData" :key="item.music_id">
                <td>{{ item.title }}</td>
                <td>{{ item.album_title }}</td>
                <td>{{ item.genre }}</td>
                <td>{{ item.artist }}</td>
                <td>
                    <button class="btn btn-danger" @click="permaDeleteSongs(item.music_id)"><i class="bi bi-trash"></i></button>
                    <button class="btn btn-secondary" @click="deleteFromFlagged(item.music_id)"><i class="bi bi-x-circle"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ul>
    </div>
    `,
    data () {
        return {
            flaggedSongs: [],
            musiclist: [],
            authToken: localStorage.getItem('auth-token'),
        }
    },
    methods: {
        async getTracks() {
            const res = await fetch('/api/musicinfo', {
                headers: {
                    'Authentication-Token': this.authToken,
                },
            });
            const data = await res.json();
            if (res.ok) {
                this.musiclist = data;
                console.log(this.musiclist);
                this.currentSong = this.musiclist[this.currentSongIndex];
            }
            else {
                console.error(`Failed to get tracks: ${data.message}`);
            }
        },
        async getFlaggedSongs() {
            const res = await fetch('/api/report-song', {
                method: 'GET'
            });
            const data = await res.json();
            this.flaggedSongs = data;
            console.log("Flagged Data", this.flaggedSongs);
        },
        async permaDeleteSongs(musicId) {
            const res = await fetch('/api/edit-music', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                },
                body: JSON.stringify({music_id: musicId}),
        });
        const data = await res.json();
        if (res.ok) {
            console.log("Deleted song");
            // this.getFlaggedSongs();
        }
        else {
            console.error(`Failed to get tracks: ${data.message}`);
        }
        },
        async deleteFromFlagged(musicId) {
            const res = await fetch('/api/report-song', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                },
                body: JSON.stringify({music_id: musicId}),
        });
        const data = await res.json();
        if (res.ok) {
            console.log("Deleted song from flagged");
            // remove song from flaggedSongsData
            for (let i = 0; i < this.flaggedSongsData.length; i++) {
                if (this.flaggedSongsData[i].music_id === musicId) {
                    this.flaggedSongsData.splice(i, 1);
                }
            }
            windows.location.reload()
        }
        else {
            console.error(`Failed to get tracks: ${data.message}`);
        }
        },
        
    },
    computed: {
        flaggedSongsData() {
            const flaggedIds = this.flaggedSongs.map(item => item.music_id);
            return this.musiclist.filter(item => flaggedIds.includes(item.music_id));
    }
},
    created() {
        this.getTracks();
        this.getFlaggedSongs();
    },
}