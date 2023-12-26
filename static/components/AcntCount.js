export default {
    template: `
    <div>
    <h2>User and Creator Statistics</h2>
    <div>
      <p>Total Users: {{ userCount }}</p>
      <p>Total Creators: {{ creatorCount }}</p>
      <p>Total Songs: {{ songCount }}</p>
    </div>
  </div>
    `,
    data() {
      return {
        userCount: 0,
        creatorCount: 0,
      };
    },
    methods: {
      async fetchData() {
        try {
          const response = await fetch('/api/account-count', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': localStorage.getItem('token'),
            },
          });
  
          if (!response.ok) {
            throw new Error(`Failed to fetch user data. Status: ${response.status}`);
          }
  
          const data = await response.json();
          this.userCount = data.user_count;
          this.creatorCount = data.creator_count;
          this.songCount = data.songs_count;
        } catch (error) {
          console.error('Error:', error);
        }
      },
    },
    created() {
      this.fetchData(); // Fetch data when the component is created
    },
  };