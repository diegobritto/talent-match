import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import JobsView from '../views/JobsView.vue'
import AuthView from '../views/AuthView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: JobsView,
    },
    {
      path: '/jobs/:id',
      name: 'job-details',
      component: () => import('../views/JobDetailsView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: AuthView,
    },
    {
      path: '/register',
      name: 'register',
      component: AuthView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
    // Candidate routes
    {
      path: '/candidate',
      name: 'candidate',
      children: [
        {
          path: 'dashboard',
          name: 'candidate-dashboard',
          component: () => import('../views/candidate/DashboardView.vue'),
        },
        {
          path: 'profile',
          name: 'candidate-profile',
          component: () => import('../views/candidate/ProfileView.vue'),
        },
        {
          path: 'applications',
          name: 'candidate-applications',
          component: () => import('../views/candidate/ApplicationsView.vue'),
        },
        {
          path: 'saved-jobs',
          name: 'candidate-saved-jobs',
          component: () => import('../views/candidate/SavedJobsView.vue'),
        },
      ],
    },
    // Company routes
    {
      path: '/company',
      name: 'company',
      children: [
        {
          path: 'dashboard',
          name: 'company-dashboard',
          component: () => import('../views/company/DashboardView.vue'),
        },
        {
          path: 'post-job',
          name: 'company-post-job',
          component: () => import('../views/company/PostJobView.vue'),
        },
        {
          path: 'applications',
          name: 'company-applications',
          component: () => import('../views/company/ApplicationsView.vue'),
        },
        {
          path: 'candidate/:id',
          name: 'company-candidate-profile',
          component: () => import('../views/company/CandidateProfileView.vue'),
        },
        {
          path: 'profile',
          name: 'company-profile',
          component: () => import('../views/company/CompanyProfileView.vue'),
        },
      ],
    },
  ],
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user')
  const requiresAuth = to.path.startsWith('/candidate') || to.path.startsWith('/company')
  
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router

