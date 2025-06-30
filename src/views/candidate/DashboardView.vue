<template>
  <div class="candidate-layout">
    <CandidateSidebar />
    
    <main class="main-content">
      <div class="container">
        <!-- Welcome Header -->
        <div class="welcome-header">
          <h1>Bem-vindo de volta, {{ userName }}! 👋</h1>
          <p>Aqui está um resumo das suas atividades e oportunidades</p>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ stats.applications }}</div>
            <div class="stat-label">Candidaturas Ativas</div>
            <div class="stat-change positive">+2 esta semana</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-number">{{ stats.interviews }}</div>
            <div class="stat-label">Entrevistas Agendadas</div>
            <div class="stat-change">{{ stats.interviews > 0 ? 'Próxima em 2 dias' : 'Nenhuma agendada' }}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-number">{{ stats.savedJobs }}</div>
            <div class="stat-label">Vagas Salvas</div>
            <div class="stat-change">{{ stats.savedJobs }} para revisar</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-number">{{ stats.profileCompletion }}%</div>
            <div class="stat-label">Perfil Completo</div>
            <div class="stat-change" :class="{ warning: stats.profileCompletion < 100 }">
              {{ stats.profileCompletion < 100 ? 'Precisa atenção' : 'Completo' }}
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <!-- Profile Completion -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3>Complete seu Perfil</h3>
              <span class="completion-percentage">{{ stats.profileCompletion }}%</span>
            </div>
            
            <div class="progress-section">
              <div class="progress">
                <div 
                  class="progress-bar" 
                  :style="{ width: `${stats.profileCompletion}%` }"
                ></div>
              </div>
              <p class="progress-text">
                Complete seu perfil para receber mais oportunidades relevantes
              </p>
            </div>
            
            <div class="profile-checklist">
              <div 
                v-for="item in profileChecklist" 
                :key="item.id"
                class="checklist-item"
                :class="{ completed: item.completed }"
              >
                <span class="check-icon">{{ item.completed ? '✅' : '⏳' }}</span>
                <span class="check-text">{{ item.text }}</span>
              </div>
            </div>
            
            <router-link to="/candidate/profile" class="btn btn-primary">
              Completar Perfil
            </router-link>
          </div>

          <!-- Recommended Jobs -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3>Vagas Recomendadas</h3>
              <router-link to="/jobs" class="view-all-link">Ver todas</router-link>
            </div>
            
            <div class="recommended-jobs">
              <div 
                v-for="job in recommendedJobs" 
                :key="job.id"
                class="job-recommendation"
                @click="viewJob(job.id)"
              >
                <div class="job-header">
                  <div class="company-logo" :style="{ background: job.companyColor }">
                    {{ job.company.charAt(0) }}
                  </div>
                  <div class="match-score">
                    <span class="match-percentage">{{ job.matchPercentage }}%</span>
                    <span class="match-label">Match</span>
                  </div>
                </div>
                
                <h4 class="job-title">{{ job.title }}</h4>
                <p class="job-company">{{ job.company }}</p>
                
                <div class="job-details">
                  <span class="job-detail">📍 {{ job.location }}</span>
                  <span class="job-detail">🏠 {{ job.workMode }}</span>
                </div>
                
                <div class="job-salary">{{ job.salary }}</div>
                
                <div class="job-actions">
                  <button @click.stop="viewJob(job.id)" class="btn btn-secondary btn-small">
                    Ver Detalhes
                  </button>
                  <button @click.stop="applyToJob(job.id)" class="btn btn-primary btn-small">
                    Candidatar-se
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Applications -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3>Candidaturas Recentes</h3>
              <router-link to="/candidate/applications" class="view-all-link">Ver todas</router-link>
            </div>
            
            <div class="recent-applications">
              <div 
                v-for="application in recentApplications" 
                :key="application.id"
                class="application-item"
              >
                <div class="application-info">
                  <h4>{{ application.jobTitle }}</h4>
                  <p>{{ application.company }}</p>
                  <span class="application-date">{{ application.appliedDate }}</span>
                </div>
                
                <div class="application-status">
                  <span 
                    class="status-badge" 
                    :class="getStatusClass(application.status)"
                  >
                    {{ getStatusText(application.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notifications -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3>Notificações</h3>
              <router-link to="/candidate/notifications" class="view-all-link">Ver todas</router-link>
            </div>
            
            <div class="notifications-list">
              <div 
                v-for="notification in recentNotifications" 
                :key="notification.id"
                class="notification-item"
                :class="{ unread: !notification.read }"
              >
                <div class="notification-icon">{{ notification.icon }}</div>
                <div class="notification-content">
                  <p>{{ notification.message }}</p>
                  <span class="notification-time">{{ notification.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CandidateSidebar from '@/components/candidate/CandidateSidebar.vue'

const router = useRouter()

// Get user data
const userData = JSON.parse(localStorage.getItem('user') || '{}')
const userName = computed(() => userData.name || 'Carlos')

// Stats data
const stats = ref({
  applications: 12,
  interviews: 3,
  savedJobs: 8,
  profileCompletion: 85
})

// Profile checklist
const profileChecklist = ref([
  { id: 1, text: 'Informações básicas', completed: true },
  { id: 2, text: 'Experiência profissional', completed: true },
  { id: 3, text: 'Habilidades e competências', completed: false },
  { id: 4, text: 'Foto do perfil', completed: false }
])

// Recommended jobs
const recommendedJobs = ref([
  {
    id: 1,
    title: 'Desenvolvedor React Sênior',
    company: 'TechCorp Brasil',
    location: 'São Paulo, SP',
    workMode: 'Remoto',
    salary: 'R$ 12.000 - R$ 18.000',
    matchPercentage: 95,
    companyColor: '#2563EB'
  },
  {
    id: 2,
    title: 'Full Stack Developer',
    company: 'StartupX',
    location: 'Rio de Janeiro, RJ',
    workMode: 'Híbrido',
    salary: 'R$ 8.000 - R$ 12.000',
    matchPercentage: 88,
    companyColor: '#10B981'
  }
])

// Recent applications
const recentApplications = ref([
  {
    id: 1,
    jobTitle: 'Desenvolvedor Frontend',
    company: 'TechSolutions',
    appliedDate: 'Há 2 horas',
    status: 'pending'
  },
  {
    id: 2,
    jobTitle: 'React Developer',
    company: 'Innovation Labs',
    appliedDate: 'Ontem',
    status: 'reviewing'
  },
  {
    id: 3,
    jobTitle: 'Full Stack Engineer',
    company: 'Digital Corp',
    appliedDate: 'Há 3 dias',
    status: 'interview'
  }
])

// Recent notifications
const recentNotifications = ref([
  {
    id: 1,
    icon: '🎉',
    message: 'Sua candidatura para Desenvolvedor React foi aceita!',
    time: 'Há 1 hora',
    read: false
  },
  {
    id: 2,
    icon: '📅',
    message: 'Entrevista agendada para amanhã às 14h',
    time: 'Há 3 horas',
    read: false
  },
  {
    id: 3,
    icon: '💼',
    message: 'Nova vaga compatível com seu perfil',
    time: 'Há 1 dia',
    read: true
  }
])

// Methods
const viewJob = (jobId: number) => {
  router.push(`/jobs/${jobId}`)
}

const applyToJob = (jobId: number) => {
  router.push(`/jobs/${jobId}?apply=true`)
}

const getStatusClass = (status: string) => {
  const classes = {
    pending: 'status-pending',
    reviewing: 'status-reviewing',
    interview: 'status-interview',
    accepted: 'status-accepted',
    rejected: 'status-rejected'
  }
  return classes[status as keyof typeof classes] || 'status-pending'
}

const getStatusText = (status: string) => {
  const texts = {
    pending: 'Pendente',
    reviewing: 'Em Análise',
    interview: 'Entrevista',
    accepted: 'Aceito',
    rejected: 'Rejeitado'
  }
  return texts[status as keyof typeof texts] || 'Pendente'
}
</script>

<style scoped>
.candidate-layout {
  display: flex;
  min-height: 100vh;
  background: #F9FAFB;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Welcome Header */
.welcome-header {
  margin-bottom: 2rem;
}

.welcome-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 0.5rem;
}

.welcome-header p {
  color: #6B7280;
  font-size: 1.125rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6B7280;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.875rem;
  color: #10B981;
}

.stat-change.positive {
  color: #10B981;
}

.stat-change.warning {
  color: #F59E0B;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.dashboard-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1F2937;
}

.view-all-link {
  color: #2563EB;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
}

.view-all-link:hover {
  text-decoration: underline;
}

.completion-percentage {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2563EB;
}

/* Profile Completion */
.progress-section {
  margin-bottom: 1.5rem;
}

.progress-text {
  color: #6B7280;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.profile-checklist {
  margin-bottom: 1.5rem;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.checklist-item.completed .check-text {
  color: #10B981;
}

.check-icon {
  font-size: 1rem;
}

.check-text {
  color: #6B7280;
  font-weight: 500;
}

/* Recommended Jobs */
.recommended-jobs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.job-recommendation {
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.job-recommendation:hover {
  border-color: #2563EB;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.company-logo {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
}

.match-score {
  text-align: right;
}

.match-percentage {
  font-weight: 700;
  color: #10B981;
}

.match-label {
  display: block;
  font-size: 0.75rem;
  color: #6B7280;
}

.job-title {
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 0.25rem;
}

.job-company {
  color: #2563EB;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.job-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.job-detail {
  color: #6B7280;
  font-size: 0.875rem;
}

.job-salary {
  font-weight: 600;
  color: #10B981;
  margin-bottom: 0.75rem;
}

.job-actions {
  display: flex;
  gap: 0.5rem;
}

/* Recent Applications */
.recent-applications {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.application-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
}

.application-info h4 {
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 0.25rem;
}

.application-info p {
  color: #6B7280;
  margin-bottom: 0.25rem;
}

.application-date {
  font-size: 0.875rem;
  color: #9CA3AF;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-pending {
  background: #FEF3C7;
  color: #92400E;
}

.status-reviewing {
  background: #DBEAFE;
  color: #1E40AF;
}

.status-interview {
  background: #D1FAE5;
  color: #065F46;
}

.status-accepted {
  background: #D1FAE5;
  color: #065F46;
}

.status-rejected {
  background: #FEE2E2;
  color: #991B1B;
}

/* Notifications */
.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.notification-item.unread {
  background: #F0F9FF;
  border-left: 3px solid #2563EB;
}

.notification-icon {
  font-size: 1.25rem;
}

.notification-content p {
  color: #1F2937;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.875rem;
  color: #6B7280;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .job-actions {
    flex-direction: column;
  }
  
  .application-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

