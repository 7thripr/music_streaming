User
export default {
    template: `
    <div class="container">
    <h1>Playlist: {{ playlists[0].playlist_name }}</h1>
  </div>
    `,
    data() {
        return {
            playlistId: null,
            playlist: [],
            playlists: {},
        };
    },
    methods: {
      async addTrackToPlaylist(trackId) {
        try {
          const response = await fetch('/api/add-track-to-playlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.authToken,
            },
            body: JSON.stringify({
              track_id: trackId,
              playlist_id: this.playlistId,
            }),
          });
          if (!response.ok) {
            console.log('Failed to add track to playlist');
          }
          this.fetchPlaylist();
        } catch (error) {
          console.error('Error adding track to playlist:', error);
        }
      },
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
              this.playlists = data[0];
              // this.playlists = Array.isArray(data) ? data : [];
            } catch (error) {
              console.error('Error fetching playlists:', error);
              this.playlists = [];
            }
          },
          async fetchPlaylistNamebyId() {
            try {
              const res = await fetch('/api/playlistinfo', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authentication-Token': this.authToken,
                },
              });
              const data = await res.json();
              console.log(data[0]);
              this.playlists = data;
            } catch (error) {
              console.error('Error fetching playlists:', error);
              this.playlists = [];
            }
          }
        },
    mounted() {
        // Accessing query parameters
        this.playlistId = this.$route.query.playlistId;
        this.fetchPlaylistNamebyId(this.playlistId);

    },
    filteredPlaylists() {
        // return all the entries which have email equal to this.email
        return this.playlists.filter(item => {
          return item.playlist_id === this.playlistId;
        });
      },
    created() {
        this.fetchPlaylist();
        this.getTracks();
    }
}
