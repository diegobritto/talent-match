<template>
  <div class="company-dashboard">
    <div class="dashboard-header">
      <h1>Dashboard da Empresa</h1>
      <p>Bem-vindo de volta! Aqui está um resumo das suas atividades de recrutamento.</p>
    </div>

    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <div class="stat-number">{{ activeJobs }}</div>
          <div class="stat-label">Vagas Ativas</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalApplications }}</div>
          <div class="stat-label">Candidaturas Recebidas</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <div class="stat-number">{{ scheduledInterviews }}</div>
          <div class="stat-label">Entrevistas Agendadas</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-number">{{ hiredCandidates }}</div>
          <div class="stat-label">Contratações</div>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="main-content">
        <div class="section">
          <div class="section-header">
            <h2>Vagas Ativas</h2>
            <router-link to="/company/post-job" class="action-link">
              + Nova Vaga
            </router-link>
          </div>
          
          <div class="jobs-list">
            <div v-if="recentJobs.length === 0" class="empty-state">
              <p>Nenhuma vaga ativa no momento</p>
              <router-link to="/company/post-job" class="cta-button">
                Publicar Primeira Vaga
              </router-link>
            </div>
            
            <div v-else>
              <div v-for="job in recentJobs" :key="job.id" class="job-item">
                <div class="job-info">
                  <h3>{{ job.title }}</h3>
                  <div class="job-meta">
                    <span class="location">📍 {{ job.location }}</span>
                    <span class="type">💼 {{ job.type }}</span>
                    <span class="applications">👥 {{ job.applicationsCount }} candidaturas</span>
                  </div>
                  <div class="job-status">
                    <span class="status-badge" :class="job.status">
                      {{ getStatusText(job.status) }}
                    </span>
                    <span class="posted-date">
                      Publicada em {{ formatDate(job.postedAt) }}
                    </span>
                  </div>
                </div>
                
                <div class="job-actions">
                  <router-link :to="`/company/applications?job=${job.id}`" class="action-button secondary">
                    Ver Candidaturas
                  </router-link>
                  <button @click="editJob(job.id)" class="action-button primary">
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2>Candidaturas Recentes</h2>
            <router-link to="/company/applications" class="action-link">
              Ver Todas
            </router-link>
          </div>
          
          <div class="applications-list">
            <div v-if="recentApplications.length === 0" class="empty-state">
              <p>Nenhuma candidatura recente</p>
            </div>
            
            <div v-else>
              <div v-for="application in recentApplications" :key="application.id" class="application-item">
                <div class="candidate-info">
                  <div class="candidate-avatar">
                    <img :src="application.candidateAvatar" :alt="application.candidateName" />
                  </div>
                  <div class="candidate-details">
                    <h4>{{ application.candidateName }}</h4>
                    <p class="job-title">{{ application.jobTitle }}</p>
                    <div class="application-meta">
                      <span class="experience">👨‍💼 {{ application.experience }}</span>
                      <span class="location">📍 {{ application.location }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="application-status">
                  <span class="status-badge" :class="application.status">
                    {{ getApplicationStatusText(application.status) }}
                  </span>
                  <div class="application-date">
                    {{ formatDate(application.appliedAt) }}
                  </div>
                </div>
                
                <div class="application-actions">
                  <router-link :to="`/company/candidate/${application.candidateId}`" class="action-button secondary">
                    Ver Perfil
                  </router-link>
                  <button @click="reviewApplication(application.id)" class="action-button primary">
                    Avaliar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar">
        <div class="widget">
          <h3>Ações Rápidas</h3>
          <div class="quick-actions">
            <router-link to="/company/post-job" class="quick-action">
              <div class="action-icon">📝</div>
              <div class="action-text">Publicar Nova Vaga</div>
            </router-link>
            
            <router-link to="/company/applications" class="quick-action">
              <div class="action-icon">👥</div>
              <div class="action-text">Gerenciar Candidaturas</div>
            </router-link>
            
            <router-link to="/company/profile" class="quick-action">
              <div class="action-icon">🏢</div>
              <div class="action-text">Editar Perfil da Empresa</div>
            </router-link>
            
            <router-link to="/jobs" class="quick-action">
              <div class="action-icon">🔍</div>
              <div class="action-text">Buscar Talentos</div>
            </router-link>
          </div>
        </div>

        <div class="widget">
          <h3>Estatísticas do Mês</h3>
          <div class="monthly-stats">
            <div class="stat-item">
              <span class="stat-label">Visualizações de Vagas</span>
              <span class="stat-value">{{ monthlyViews }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Novas Candidaturas</span>
              <span class="stat-value">{{ monthlyApplications }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Entrevistas Realizadas</span>
              <span class="stat-value">{{ monthlyInterviews }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Taxa de Conversão</span>
              <span class="stat-value">{{ conversionRate }}%</span>
            </div>
          </div>
        </div>

        <div class="widget">
          <h3>Dicas de Recrutamento</h3>
          <div class="tips">
            <div class="tip-item">
              <div class="tip-icon">💡</div>
              <div class="tip-text">
                <strong>Otimize suas descrições:</strong> Vagas com descrições detalhadas recebem 40% mais candidaturas.
              </div>
            </div>
            <div class="tip-item">
              <div class="tip-icon">⚡</div>
              <div class="tip-text">
                <strong>Responda rapidamente:</strong> Candidatos que recebem feedback em até 24h têm maior chance de aceitar ofertas.
              </div>
            </div>
            <div class="tip-item">
              <div class="tip-icon">🎯</div>
              <div class="tip-text">
                <strong>Use filtros inteligentes:</strong> Configure critérios específicos para encontrar candidatos ideais.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Job {
  id: number
  title: string
  location: string
  type: string
  status: 'active' | 'paused' | 'closed'
  applicationsCount: number
  postedAt: string
}

interface Application {
  id: number
  candidateId: number
  candidateName: string
  candidateAvatar: string
  jobTitle: string
  experience: string
  location: string
  status: 'pending' | 'reviewing' | 'interview' | 'approved' | 'rejected'
  appliedAt: string
}

const recentJobs = ref<Job[]>([
  {
    id: 1,
    title: 'Desenvolvedor Frontend Vue.js',
    location: 'São Paulo, SP',
    type: 'CLT',
    status: 'active',
    applicationsCount: 15,
    postedAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Designer UX/UI',
    location: 'Remote',
    type: 'PJ',
    status: 'active',
    applicationsCount: 8,
    postedAt: '2024-01-18'
  },
  {
    id: 3,
    title: 'Desenvolvedor Backend Node.js',
    location: 'Rio de Janeiro, RJ',
    type: 'CLT',
    status: 'paused',
    applicationsCount: 22,
    postedAt: '2024-01-10'
  }
])

const recentApplications = ref<Application[]>([
  {
    id: 1,
    candidateId: 1,
    candidateName: 'Ana Silva',
    candidateAvatar: '/api/placeholder/40/40',
    jobTitle: 'Desenvolvedor Frontend Vue.js',
    experience: '3 anos',
    location: 'São Paulo, SP',
    status: 'pending',
    appliedAt: '2024-01-20'
  },
  {
    id: 2,
    candidateId: 2,
    candidateName: 'Carlos Santos',
    candidateAvatar: '/api/placeholder/40/40',
    jobTitle: 'Designer UX/UI',
    experience: '5 anos',
    location: 'Belo Horizonte, MG',
    status: 'reviewing',
    appliedAt: '2024-01-19'
  },
  {
    id: 3,
    candidateId: 3,
    candidateName: 'Maria Oliveira',
    candidateAvatar: '/api/placeholder/40/40',
    jobTitle: 'Desenvolvedor Frontend Vue.js',
    experience: '2 anos',
    location: 'São Paulo, SP',
    status: 'interview',
    appliedAt: '2024-01-18'
  }
])

const activeJobs = computed(() => recentJobs.value.filter(job => job.status === 'active').length)
const totalApplications = computed(() => recentJobs.value.reduce((sum, job) => sum + job.applicationsCount, 0))
const scheduledInterviews = computed(() => recentApplications.value.filter(app => app.status === 'interview').length)
const hiredCandidates = ref(5)
const monthlyViews = ref(1250)
const monthlyApplications = ref(45)
const monthlyInterviews = ref(12)
const conversionRate = ref(8.5)

const getStatusText = (status: string) => {
  const statusMap = {
    active: 'Ativa',
    paused: 'Pausada',
    closed: 'Fechada'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getApplicationStatusText = (status: string) => {
  const statusMap = {
    pending: 'Pendente',
    reviewing: 'Em Análise',
    interview: 'Entrevista',
    approved: 'Aprovado',
    rejected: 'Rejeitado'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const editJob = (jobId: number) => {
  // Implementar navegação para edição de vaga
  alert(`Editar vaga ${jobId}`)
}

const reviewApplication = (applicationId: number) => {
  // Implementar navegação para avaliação de candidatura
  alert(`Avaliar candidatura ${applicationId}`)
}

onMounted(() => {
  // Carregar dados do dashboard
  console.log('Carregando dashboard da empresa...')
})
</script>

<style scoped>
.company-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 40px;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.dashboard-header p {
  color: #666;
  font-size: 1.1rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 25px;
  margin-bottom: 25px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.section-header h2 {
  color: #333;
  font-size: 1.5rem;
}

.action-link {
  color: #4CAF50;
  text-decoration: none;
  font-weight: bold;
  padding: 8px 16px;
  border: 2px solid #4CAF50;
  border-radius: 6px;
  transition: all 0.3s;
}

.action-link:hover {
  background: #4CAF50;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.cta-button {
  background: #4CAF50;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  display: inline-block;
  margin-top: 15px;
}

.job-item,
.application-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.job-item:last-child,
.application-item:last-child {
  border-bottom: none;
}

.job-info h3,
.candidate-details h4 {
  color: #333;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.job-meta,
.application-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.job-meta span,
.application-meta span {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.job-status,
.application-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.paused {
  background: #fff3cd;
  color: #856404;
}

.status-badge.closed {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.reviewing {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.interview {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.approved {
  background: #d4edda;
  color: #155724;
}

.status-badge.rejected {
  background: #f8d7da;
  color: #721c24;
}

.posted-date,
.application-date {
  color: #666;
  font-size: 0.8rem;
}

.job-actions,
.application-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.action-button.primary {
  background: #4CAF50;
  color: white;
}

.action-button.secondary {
  background: #f5f5f5;
  color: #333;
}

.action-button:hover {
  opacity: 0.8;
}

.candidate-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.candidate-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.candidate-details .job-title {
  color: #666;
  margin-bottom: 8px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.widget {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 25px;
}

.widget h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border: 2px solid #f5f5f5;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
}

.quick-action:hover {
  border-color: #4CAF50;
  background: #f9f9f9;
}

.action-icon {
  font-size: 1.5rem;
}

.action-text {
  font-weight: 500;
}

.monthly-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.stat-value {
  font-weight: bold;
  color: #4CAF50;
}

.tips {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tip-item {
  display: flex;
  gap: 12px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.tip-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.tip-text {
  font-size: 0.9rem;
  line-height: 1.4;
  color: #555;
}

@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header h1 {
    font-size: 2rem;
  }
  
  .dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .job-item,
  .application-item {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .job-actions,
  .application-actions {
    width: 100%;
  }
  
  .action-button {
    flex: 1;
    text-align: center;
  }
  
  .candidate-info {
    width: 100%;
  }
  
  .application-status {
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>

