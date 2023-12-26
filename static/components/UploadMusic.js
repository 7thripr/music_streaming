export default {
    template: `<div class="mt-5" align="center">
    <img width="100" height="100" src="https://img.icons8.com/pastel-glyph/100/upload--v1.png" alt="upload--v1"/>    <div class = "container-sm" align="center">
    <div class="card p-4 mb-3 shadow" style="border-radius:5pt; width: 40%;">
        <div class="mb-3">
            <label for="title" class="form-label">Title:</label>
            <input type="text" class="form-control" v-model="cred.title" required />
        </div>
        <div class="mb-3">
            <label for="artist" class="form-label">Artist:</label>
            <input type="text" class="form-control" v-model="cred.artist" required />
        </div>
        <div class="mb-3">
            <label for="album" class="form-label">Album:</label>
            <input type="text" class="form-control" v-model="cred.album" required />
        </div>
        <div class="mb-3">
            <label for="genre" class="form-label">Genre:</label>
            <input type="text" class="form-control" v-model="cred.genre" required />
        </div>
        <div class="mb-3">
            <label for="year" class="form-label">Year:</label>
            <input type="text" class="form-control" v-model="cred.year" required/>
        </div>
        <div class="mb-3" title="Extensions required - mpr, flac and flac">
            <label for="year" class="form-label">Paste Your Audio Path:</label>
            <input type="text" class="form-control" v-model="cred.file" required />
        </div>
        <div class="mb-3">
            <label for="year" class="form-label">Paste Your Image Path:</label>
            <input type="text" class="form-control" v-model="cred.image" required />
        </div>
        <div class="mb-3">
            <label for="year" class="form-label">Lyrics</label>
            <textarea class="form-control" v-model="cred.lyrics" required></textarea>
            <button type="submit" class="btn btn-primary mt-3" @click="uploadMusic">Upload</button>
        </div>
    </div>
    </div>
</div>`,
    data() {
        return {
          cred: {
            title: null,
            artist: null,
            album: null,
            genre: null,
            file: null,
            year: null,
            image: null,
            lyrics: null,
            email: localStorage.getItem('uniqueid'),
          },
          error: null,
        };
      },
      methods: {
        async uploadMusic() {
            const res = await fetch('/api/upload-music', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authentication-Token': localStorage.getItem('auth-token'),
                },
                body: JSON.stringify(this.cred),
              })
              const data = await res.json()
              if (res.ok) {
                this.$router.push({ path: '/dashboard' })
              } else {
                this.error = data.message
              }
        },
      },
}