<template>
  <aside class="candidate-sidebar">
    <div class="sidebar-header">
      <div class="user-info">
        <div class="user-avatar">
          {{ userInitial }}
        </div>
        <div class="user-details">
          <h3>{{ userName }}</h3>
          <p>{{ userTitle }}</p>
        </div>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <ul class="nav-menu">
        <li>
          <router-link to="/candidate/dashboard" class="nav-item">
            <span class="nav-icon">📊</span>
            <span class="nav-text">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/candidate/profile" class="nav-item">
            <span class="nav-icon">👤</span>
            <span class="nav-text">Meu Perfil</span>
          </router-link>
        </li>
        <li>
          <router-link to="/jobs" class="nav-item">
            <span class="nav-icon">🔍</span>
            <span class="nav-text">Buscar Vagas</span>
          </router-link>
        </li>
        <li>
          <router-link to="/candidate/applications" class="nav-item">
            <span class="nav-icon">📋</span>
            <span class="nav-text">Minhas Candidaturas</span>
          </router-link>
        </li>
        <li>
          <router-link to="/candidate/saved-jobs" class="nav-item">
            <span class="nav-icon">💾</span>
            <span class="nav-text">Vagas Salvas</span>
          </router-link>
        </li>
        <li>
          <router-link to="/candidate/notifications" class="nav-item">
            <span class="nav-icon">🔔</span>
            <span class="nav-text">Notificações</span>
            <span v-if="notificationCount > 0" class="notification-badge">
              {{ notificationCount }}
            </span>
          </router-link>
        </li>
        <li>
          <router-link to="/candidate/settings" class="nav-item">
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">Configurações</span>
          </router-link>
        </li>
      </ul>
    </nav>
    
    <div class="sidebar-footer">
      <button @click="logout" class="logout-btn">
        <span class="nav-icon">🚪</span>
        <span class="nav-text">Sair</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const notificationCount = ref(3)

// Get user data from localStorage (in a real app, use Pinia store)
const userData = JSON.parse(localStorage.getItem('user') || '{}')

const userName = computed(() => userData.name || 'Carlos Silva')
const userTitle = computed(() => 'Desenvolvedor Full Stack')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const logout = () => {
  localStorage.removeItem('user')
  router.push('/')
}
</script>

<style scoped>
.candidate-sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #E5E7EB;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 50;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 50px;
  height: 50px;
  background: #2563EB;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
}

.user-details h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 0.25rem;
}

.user-details p {
  font-size: 0.875rem;
  color: #6B7280;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-menu li {
  margin-bottom: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #6B7280;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.nav-item:hover {
  background: #F3F4F6;
  color: #1F2937;
}

.nav-item.router-link-active {
  background: #DBEAFE;
  color: #2563EB;
  border-right: 3px solid #2563EB;
}

.nav-icon {
  font-size: 1.125rem;
  width: 20px;
  text-align: center;
}

.nav-text {
  font-weight: 500;
}

.notification-badge {
  background: #EF4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  margin-left: auto;
  min-width: 18px;
  text-align: center;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #E5E7EB;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: none;
  color: #6B7280;
  text-align: left;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #FEE2E2;
  color: #DC2626;
}

/* Responsive */
@media (max-width: 768px) {
  .candidate-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .candidate-sidebar.open {
    transform: translateX(0);
  }
}
</style>

