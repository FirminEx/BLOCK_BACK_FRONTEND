import GuardianDashboard from '@/components/GuardianDashboard.vue';
import LoginPage from '@/components/LoginPage.vue';
import SafeguardedDashboard from '@/components/SafeguardedDashboard.vue';
import SettingsPage from '@/components/SettingsPage.vue';
import { getClientAddress, isContractApproved } from '@/lib/config';
import { jwtDecode } from 'jwt-decode';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/guardian-dashboard',
      component: GuardianDashboard,
      meta: {
        requireAuth: true,
        requireContract: true
      }
    },
    {
      path: '/safeguarded-dashboard',
      component: SafeguardedDashboard,
      meta: {
        requireAuth: true,
        requireContract: true
      }
    },
    { path: '/login', component: LoginPage },
    { path: '/settings', component: SettingsPage },
    { path: '/:pathMatch(.*)*', redirect: '/safeguarded-dashboard' }
  ]
});

export const isTokenValid = () => {
  try {
    const token = window.localStorage.getItem('token');
    if (!token) throw new Error('No token');

    const claims = jwtDecode(token);

    return !claims.exp || claims.exp > Date.now() / 1000;
  } catch (err) {
    console.log(err);
    return false;
  }
};

router.beforeEach((to) => {
  if (!to.meta.requireAuth) return;

  if (!isTokenValid()) return 'login';
});

router.beforeEach(async (to) => {
  if (!to.meta.requireContract) return;

  const address = await getClientAddress();

  const approvedContract = await isContractApproved(address);
  
  if (!approvedContract) return 'settings';
});

export default router;
