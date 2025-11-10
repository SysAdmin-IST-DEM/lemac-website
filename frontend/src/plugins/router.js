import { getAuthToken } from '@/api/httpClient.api';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home/Home.vue';
import Login from '@/pages/Login.vue';
import NotFoundPage from '@/pages/404.vue';
import Dashboard from '@/pages/Dashboard/Dashboard.vue';
import NavBar from '@/components/Dashboard/Navbar/NavBar.vue';
import Users from '@/pages/Dashboard/Users.vue';
import Hours from '@/pages/Dashboard/Hours.vue';
import Workstations from '@/pages/Dashboard/Workstations.vue';
import Publications from '@/pages/Dashboard/Publications.vue';
import Rooms from '@/pages/Dashboard/Rooms.vue';
import Schedule from '@/pages/Dashboard/Schedule.vue';
import About from '@/pages/Home/About.vue';
import Reservations from '@/pages/Home/Reservations.vue';
import Software from '@/pages/Home/Software.vue';
import PrintingForm from '@/pages/Home/PrintingForm.vue';
import Printing from '@/pages/Dashboard/Printing.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: 'Home', noAuth: true },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: { title: 'About', noAuth: true },
  },
  {
    path: '/reservations',
    name: 'reservations',
    component: Reservations,
    meta: { title: 'Reservations', noAuth: true },
  },
  {
    path: '/printing',
    name: 'printing',
    component: PrintingForm,
    meta: { title: 'Printing', noAuth: true },
  },
  {
    path: '/software',
    name: 'software',
    component: Software,
    meta: { title: 'Reservations', noAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { title: 'Login' },
  },
  {
    path: '/dashboard',
    meta: { navBar: NavBar },
    children: [
      {
        path: '',
        name: 'dashboard-home',
        component: Dashboard,
        meta: { title: 'Dashboard' },
      },
      {
        path: 'users',
        name: 'dashboard-users',
        component: Users,
        meta: { title: 'User Management' },
      },
      {
        path: 'hours',
        name: 'dashboard-hours',
        component: Hours,
        meta: { title: "Hours' Registry" },
      },
      {
        path: 'workstations',
        name: 'dashboard-workstations',
        component: Workstations,
        meta: { title: 'Workstations' },
      },
      {
        path: 'publications',
        name: 'dashboard-publications',
        component: Publications,
        meta: { title: 'Announcements' },
      },
      {
        path: 'rooms',
        name: 'dashboard-rooms',
        component: Rooms,
        meta: { title: 'Room Reservation' },
      },
      {
        path: 'schedule',
        name: 'dashboard-schedule',
        component: Schedule,
        meta: { title: 'Monitor Schedule' },
      },
      {
        path: 'printing',
        name: 'dashboard-printing',
        component: Printing,
        meta: { title: 'Monitor Schedule' },
      },
      {
        path: 'drive',
        name: 'dashboard-drive',
        beforeEnter: () => {
          window.location.href = "https://drive.google.com/drive/folders/1KFYaJqnscGJ_YC5se43KJcyQQ56kYX2-?usp=drive_link"
          return false
        }
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'page-not-found',
    component: NotFoundPage,
    meta: { title: 'Page Not Found', noAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  base: import.meta.env.BASE_URL || '/',
  redirect: '/',
  routes,
});

router.beforeEach((to, _from, next) => {
  // Change the document title
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);
  if (nearestWithTitle) document.title = `${nearestWithTitle.meta.title} | LEMAC`;
  else document.title = 'LEMAC';

  if (to.matched.some((record) => !record.meta.noAuth) && !getAuthToken()) {
    next({
      path: '/',
      params: { nextUrl: to.fullPath },
    });
    return;
  }

  next();
});

export default router;
