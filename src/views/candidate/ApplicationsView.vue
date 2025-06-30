<template>
  <div class="applications-view">
    <div class="applications-header">
      <h1>Minhas Candidaturas</h1>
      <p>Acompanhe o status de todas as suas candidaturas</p>
    </div>

    <div class="applications-stats">
      <div class="stat-card">
        <div class="stat-number">{{ totalApplications }}</div>
        <div class="stat-label">Total de Candidaturas</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ pendingApplications }}</div>
        <div class="stat-label">Em Análise</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ interviewApplications }}</div>
        <div class="stat-label">Entrevistas</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ approvedApplications }}</div>
        <div class="stat-label">Aprovadas</div>
      </div>
    </div>

    <div class="applications-filters">
      <div class="filter-group">
        <label for="status-filter">Filtrar por Status:</label>
        <select id="status-filter" v-model="selectedStatus">
          <option value="">Todos os Status</option>
          <option value="pending">Em Análise</option>
          <option value="interview">Entrevista Agendada</option>
          <option value="approved">Aprovada</option>
          <option value="rejected">Rejeitada</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="date-filter">Filtrar por Data:</label>
        <select id="date-filter" v-model="selectedDateRange">
          <option value="">Todas as Datas</option>
          <option value="week">Última Semana</option>
          <option value="month">Último Mês</option>
          <option value="3months">Últimos 3 Meses</option>
        </select>
      </div>

      <div class="search-group">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Buscar por empresa ou vaga..."
          class="search-input"
        />
      </div>
    </div>

    <div class="applications-list">
      <div v-if="filteredApplications.length === 0" class="no-applications">
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>Nenhuma candidatura encontrada</h3>
          <p>{{ searchTerm || selectedStatus ? 'Tente ajustar os filtros' : 'Você ainda não se candidatou a nenhuma vaga' }}</p>
          <router-link to="/jobs" class="cta-button">
            Buscar Vagas
          </router-link>
        </div>
      </div>

      <div v-else>
        <div
          v-for="application in filteredApplications"
          :key="application.id"
          class="application-card"
          :class="{ 'highlight': application.hasUpdate }"
        >
          <div class="application-header">
            <div class="job-info">
              <h3>{{ application.jobTitle }}</h3>
              <p class="company-name">{{ application.company }}</p>
              <div class="job-details">
                <span class="location">📍 {{ application.location }}</span>
                <span class="salary">💰 {{ application.salary }}</span>
              </div>
            </div>
            <div class="application-status">
              <span class="status-badge" :class="application.status">
                {{ getStatusText(application.status) }}
              </span>
              <div class="application-date">
                Candidatura: {{ formatDate(application.appliedAt) }}
              </div>
            </div>
          </div>

          <div class="application-timeline">
            <div class="timeline-item" :class="{ active: true }">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-title">Candidatura Enviada</div>
                <div class="timeline-date">{{ formatDate(application.appliedAt) }}</div>
              </div>
            </div>

            <div class="timeline-item" :class="{ active: application.status !== 'pending' }">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-title">Em Análise</div>
                <div class="timeline-date" v-if="application.reviewedAt">
                  {{ formatDate(application.reviewedAt) }}
                </div>
              </div>
            </div>

            <div class="timeline-item" :class="{ active: application.status === 'interview' || application.status === 'approved' }">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-title">
                  {{ application.status === 'interview' ? 'Entrevista Agendada' : 'Processo Finalizado' }}
                </div>
                <div class="timeline-date" v-if="application.interviewAt">
                  {{ formatDate(application.interviewAt) }}
                </div>
              </div>
            </div>
          </div>

          <div class="application-actions">
            <router-link :to="`/jobs/${application.jobId}`" class="action-button secondary">
              Ver Vaga
            </router-link>
            <button @click="withdrawApplication(application.id)" class="action-button danger" v-if="application.status === 'pending'">
              Cancelar Candidatura
            </button>
            <button @click="viewDetails(application)" class="action-button primary">
              Ver Detalhes
            </button>
          </div>

          <div v-if="application.feedback" class="application-feedback">
            <h4>Feedback da Empresa:</h4>
            <p>{{ application.feedback }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        Anterior
      </button>
      
      <span class="pagination-info">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
      
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="pagination-button"
      >
        Próxima
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Application {
  id: number
  jobId: number
  jobTitle: string
  company: string
  location: string
  salary: string
  status: 'pending' | 'interview' | 'approved' | 'rejected'
  appliedAt: string
  reviewedAt?: string
  interviewAt?: string
  feedback?: string
  hasUpdate: boolean
}

const applications = ref<Application[]>([
  {
    id: 1,
    jobId: 1,
    jobTitle: 'Desenvolvedor Frontend Vue.js',
    company: 'TechCorp',
    location: 'São Paulo, SP',
    salary: 'R$ 8.000 - R$ 12.000',
    status: 'interview',
    appliedAt: '2024-01-15',
    reviewedAt: '2024-01-18',
    interviewAt: '2024-01-25',
    hasUpdate: true
  },
  {
    id: 2,
    jobId: 2,
    jobTitle: 'Desenvolvedor React',
    company: 'StartupXYZ',
    location: 'Rio de Janeiro, RJ',
    salary: 'R$ 7.000 - R$ 10.000',
    status: 'pending',
    appliedAt: '2024-01-20',
    hasUpdate: false
  },
  {
    id: 3,
    jobId: 3,
    jobTitle: 'Frontend Developer',
    company: 'DigitalCorp',
    location: 'Belo Horizonte, MG',
    salary: 'R$ 9.000 - R$ 13.000',
    status: 'approved',
    appliedAt: '2024-01-10',
    reviewedAt: '2024-01-12',
    interviewAt: '2024-01-18',
    feedback: 'Parabéns! Você foi aprovado para a próxima etapa do processo seletivo.',
    hasUpdate: false
  },
  {
    id: 4,
    jobId: 4,
    jobTitle: 'Vue.js Developer',
    company: 'InnovaTech',
    location: 'Porto Alegre, RS',
    salary: 'R$ 8.500 - R$ 11.500',
    status: 'rejected',
    appliedAt: '2024-01-05',
    reviewedAt: '2024-01-08',
    feedback: 'Agradecemos seu interesse. Infelizmente, optamos por outro candidato neste momento.',
    hasUpdate: false
  }
])

const selectedStatus = ref('')
const selectedDateRange = ref('')
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const totalApplications = computed(() => applications.value.length)
const pendingApplications = computed(() => applications.value.filter(app => app.status === 'pending').length)
const interviewApplications = computed(() => applications.value.filter(app => app.status === 'interview').length)
const approvedApplications = computed(() => applications.value.filter(app => app.status === 'approved').length)

const filteredApplications = computed(() => {
  let filtered = applications.value

  if (selectedStatus.value) {
    filtered = filtered.filter(app => app.status === selectedStatus.value)
  }

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(app =>
      app.jobTitle.toLowerCase().includes(term) ||
      app.company.toLowerCase().includes(term)
    )
  }

  if (selectedDateRange.value) {
    const now = new Date()
    const filterDate = new Date()
    
    switch (selectedDateRange.value) {
      case 'week':
        filterDate.setDate(now.getDate() - 7)
        break
      case 'month':
        filterDate.setMonth(now.getMonth() - 1)
        break
      case '3months':
        filterDate.setMonth(now.getMonth() - 3)
        break
    }
    
    filtered = filtered.filter(app => new Date(app.appliedAt) >= filterDate)
  }

  return filtered.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
})

const totalPages = computed(() => Math.ceil(applications.value.length / itemsPerPage))

const getStatusText = (status: string) => {
  const statusMap = {
    pending: 'Em Análise',
    interview: 'Entrevista Agendada',
    approved: 'Aprovada',
    rejected: 'Rejeitada'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const withdrawApplication = (applicationId: number) => {
  if (confirm('Tem certeza que deseja cancelar esta candidatura?')) {
    const index = applications.value.findIndex(app => app.id === applicationId)
    if (index > -1) {
      applications.value.splice(index, 1)
    }
  }
}

const viewDetails = (application: Application) => {
  // Implementar modal ou navegação para detalhes
  alert(`Detalhes da candidatura para: ${application.jobTitle}`)
}

onMounted(() => {
  // Carregar candidaturas do usuário
  console.log('Carregando candidaturas...')
})
</script>

<style scoped>
.applications-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.applications-header {
  text-align: center;
  margin-bottom: 30px;
}

.applications-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.applications-header p {
  color: #666;
  font-size: 1.1rem;
}

.applications-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.applications-filters {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: bold;
  color: #333;
  font-size: 0.9rem;
}

.filter-group select {
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.search-group {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.applications-list {
  margin-bottom: 30px;
}

.no-applications {
  text-align: center;
  padding: 60px 20px;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  margin-bottom: 20px;
}

.cta-button {
  background: #4CAF50;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  display: inline-block;
}

.application-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  padding: 25px;
  transition: all 0.3s;
}

.application-card.highlight {
  border-left: 4px solid #4CAF50;
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.job-info h3 {
  color: #333;
  margin-bottom: 5px;
  font-size: 1.3rem;
}

.company-name {
  color: #666;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.job-details {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.job-details span {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
}

.application-status {
  text-align: right;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 5px;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
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

.application-date {
  color: #666;
  font-size: 0.9rem;
}

.application-timeline {
  display: flex;
  margin: 20px 0;
  position: relative;
}

.application-timeline::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  height: 2px;
  background: #eee;
  z-index: 1;
}

.timeline-item {
  flex: 1;
  position: relative;
  text-align: center;
}

.timeline-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #eee;
  margin: 0 auto 10px;
  position: relative;
  z-index: 2;
  border: 3px solid white;
}

.timeline-item.active .timeline-dot {
  background: #4CAF50;
}

.timeline-title {
  font-weight: bold;
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.timeline-date {
  color: #666;
  font-size: 0.8rem;
}

.application-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
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

.action-button.danger {
  background: #f44336;
  color: white;
}

.action-button:hover {
  opacity: 0.8;
}

.application-feedback {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
  margin-top: 20px;
}

.application-feedback h4 {
  color: #333;
  margin-bottom: 10px;
}

.application-feedback p {
  color: #666;
  line-height: 1.5;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.pagination-button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.pagination-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pagination-info {
  color: #666;
}

@media (max-width: 768px) {
  .applications-header h1 {
    font-size: 2rem;
  }
  
  .applications-filters {
    flex-direction: column;
    gap: 15px;
  }
  
  .application-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .application-status {
    text-align: left;
  }
  
  .application-timeline {
    flex-direction: column;
    gap: 20px;
  }
  
  .application-timeline::before {
    display: none;
  }
  
  .timeline-item {
    text-align: left;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .timeline-dot {
    margin: 0;
    flex-shrink: 0;
  }
  
  .action-button {
    flex: 1;
    text-align: center;
  }
}
</style>

