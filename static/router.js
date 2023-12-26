import Home from './components/Home.js'
import Signup from './components/Signup.js'
import Login from './components/Login.js'
import UploadMusic from './components/UploadMusic.js'
import Dashboard from './components/Dashboard.js'
import AdminDash from './components/AdminDash.js'
import Profile from './components/Profile.js'
import Playlist from './components/Playlist.js'
import AcntCount from './components/AcntCount.js'
import ViewPlaylist from './components/ViewPlaylist.js'
import ApplyCreator from './components/ApplyCreator.js'
import EditMusic from './components/EditMusic.js'
import TopSongs from './components/TopSongs.js'
import flaggedSongs from './components/flaggedSongs.js'
import CreatorManagement from './components/CreatorManagement.js'
import NewSongs from './components/NewSongs.js'

const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/signup', component: Signup, name: 'Signup' },
  { path: '/upload-music', component: UploadMusic, name: 'UploadMusic' },
  { path: '/dashboard', component: Dashboard, name: 'Dashboard' },
  { path: '/admin', component: AdminDash, name: 'AdminDash' },
  { path: '/profile', component: Profile, name: 'Profile' },
  { path: '/playlist', component: Playlist, name: 'Playlist' },
  { path: '/account-stats', component: AcntCount, name: 'AcntCount' },
  { path: '/view-playlist', component: ViewPlaylist, name: 'ViewPlaylist' },
  { path: '/apply-creator', component: ApplyCreator, name: 'ApplyCreator' },
  { path: '/edit-music/', component: EditMusic, name: 'EditMusic', props: true },
  { path: '/top-songs', component: TopSongs, name: 'TopSongs' },
  { path: '/flagged-songs', component: flaggedSongs, name: 'flaggedSongs' },
  { path: '/creator-manage', component: CreatorManagement, name: 'CreatorManagement' },
  { path: '/new-songs', component: NewSongs, name: 'NewSongs' },
  { path: '*', redirect: '/' },
  
]

export default new VueRouter({
  routes,
})
