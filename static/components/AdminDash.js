export default {
    template: `
    <div>
    <div align="center" class="mb-4">
      <img width="100" height="100" src="https://img.icons8.com/ios/100/dashboard.png" alt="dashboard"/>
      <br>
    </div>

    <div class="row">

  <div class="col-md-2">
<div class="card bg-white text-center">
  <div class="card-body">
      <p class="card-title">Creators Registered</p>
      <a href="http://127.0.0.1:5000/#/creator-manage" class="btn btn-secondary">
      <h5 class="card-text">{{ creatorCount }}</h5>
      </a>
    </div>
  </div>
</div>

<div class="col-md-2">
<div class="card bg-white text-center">
  <div class="card-body">
            <p class="card-title">No. of Users Registered</p>
            <h5 class="card-text btn btn-secondary">{{ userCount }}</h5>
          </div>
        </div>
      </div>

      <div class="col-md-2">
      <div class="card bg-white text-center">
        <div class="card-body">
          <p class="card-title">No. Of Songs Uploaded </p>
          <a href="http://127.0.0.1:5000/#/song-list" class="btn btn-secondary">
          <h5 class="card-text">{{ musicCount || 0 }}</h5>
          </a>
        </div>
      </div>
    </div>
    <div class="col-md-2">
  <div class="card bg-white text-center">
    <div class="card-body">
        <p class="card-title">Songs Flagged by Users</p>
        <a href="http://127.0.0.1:5000/#/flagged-songs" class="btn btn-secondary">
        <h5 class="card-text">View</h5></a>
      </div>
    </div>
  </div>
  </div>
<br>
<button @click="renderPieChart()" class="btn btn-primary">Get Stats</button>
<div class="card mt-4">
      <div class="card-body">
<div class="chart-container" style="position: relative; height:40vh; width:80vw">
    <canvas id="userCreatorChart"></canvas>
</div>
</div>
</div>
  </div>
  </div>
    `,
    data() {
        return {
            creatorCount: null,
            musicCount: null,
            userCount: null,
            musiclist: [],
            userCreatorChart: null,
          }
    },
    methods: {
        async getAccountCount() {
            const res = await fetch('/api/account-count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token'),
                },
            });
            const data = await res.json();
            this.creatorCount = data.creator_count;
            this.userCount = data.user_count;
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
              this.musicCount = this.musiclist.length;
          }
          else {
              console.error(`Failed to get tracks: ${data.message}`);
          }
      },
    async renderPieChart() {
      if (this.creatorCount !== null && this.userCount !== null) {
        const ctx = document.getElementById('userCreatorChart').getContext('2d');
        this.userCreatorChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Creators', 'Users'],
            datasets: [{
              data: [this.creatorCount, this.userCount],
              backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)'],
            }],
          },
        });
      } else {
        console.error('Unable to render the pie chart. Data not available.');
      }
    },
    
  },
    created() {
        this.getAccountCount();
        this.getTracks();
    },
    mounted() {
    },
}