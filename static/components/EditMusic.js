export default {
  template: `
  <div align="center" style="padding:20;">
  <img width="64" height="64" src="https://img.icons8.com/pastel-glyph/64/create-new--v1.png" alt="create-new--v1"/>
  <div class="card p-4 mb-3 shadow" style="border-radius:5pt; width: 20%; margin-top:20px;">
    <div class="card-body" style="border-radius:5pt;">

      <h1 class="card-title">Edit Music</h1>

      <form @submit.prevent="editMusic">

        <!-- Title -->
        <div class="mb-3">
          <label for="title" class="form-label">Title:</label>
          <input v-model="cred.title" type="text" class="form-control" id="title" :placeholder="info.title">
        </div>

        <!-- Artist -->
        <div class="mb-3">
          <label for="artist" class="form-label">Artist:</label>
          <input v-model="cred.artist" type="text" class="form-control" id="artist" :placeholder="info.artist">
        </div>

        <!-- Album -->
        <div class="mb-3">
          <label for="album" class="form-label">Album:</label>
          <input v-model="cred.album" type="text" class="form-control" id="album" :placeholder="info.album_title">
        </div>

        <!-- Genre -->
        <div class="mb-3">
          <label for="genre" class="form-label">Genre:</label>
          <input v-model="cred.genre" type="text" class="form-control" id="genre" :placeholder="info.genre">
        </div>

        <!-- Year -->
        <div class="mb-3">
          <label for="year" class="form-label">Year:</label>
          <input v-model="cred.year" type="text" class="form-control" id="year" :placeholder="info.release_year">
        </div>

        <!-- Lyrics -->
        <div class="mb-3">
          <label for="lyrics" class="form-label">Lyrics:</label>
          <textarea v-model="cred.lyrics" class="form-control" id="lyrics"></textarea>
        </div>

        <button type="submit" class="btn btn-primary">Save Changes</button>
      </form>

    </div>
  </div>
</div>
  `,
  props: {
    info: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      cred: {
        title: null,
        artist: null,
        album: null,
        genre: null,
        year: null,
        lyrics: null,
        email: localStorage.getItem('uniqueid'),
        music_id: this.info.music_id,
      },
      received: {},
      music: {},
    }
  },
  watch: {
    info: {
      handler(newInfo) {
        console.log('Received info in EditMusic:', newInfo);
        this.music = newInfo;
      },
      immediate: true,
    },
  },
  methods: {
    async editMusic() {
      for (const prop in this.cred) {
        if (typeof this.cred[prop] === 'string') {
          this.cred[prop] = this.cred[prop].trim();
        }
      }
      const res = await fetch('/api/edit-music', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': localStorage.getItem('token'),
        },
        body: JSON.stringify(this.cred),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Music edited successfully');
        this.$router.push({ path: '/profile' });
      } else {
        alert(data.message);
      }
    },
  },
  created() {
    this.info = this.$route.params.info;
    console.log('Received info in EditMusic:', this.info);
    this.music = this.info || {}; 
    console.log('Id', this.music.music_id);
  },  
}
