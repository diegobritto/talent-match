<template>
  <div class="company-applications-view">
    <div class="applications-header">
      <h1>Gerenciar Candidaturas</h1>
      <p>Acompanhe e gerencie todas as candidaturas para suas vagas.</p>
    </div>

    <div class="applications-stats">
      <div class="stat-card">
        <div class="stat-number">{{ totalApplications }}</div>
        <div class="stat-label">Total de Candidaturas</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ newApplications }}</div>
        <div class="stat-label">Novas Candidaturas</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ inReviewApplications }}</div>
        <div class="stat-label">Em Análise</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ interviewApplications }}</div>
        <div class="stat-label">Entrevistas Agendadas</div>
      </div>
    </div>

    <div class="applications-filters">
      <div class="filter-group">
        <label for="job-filter">Filtrar por Vaga:</label>
        <select id="job-filter" v-model="selectedJob">
          <option value="">Todas as Vagas</option>
          <option v-for="job in availableJobs" :key="job.id" :value="job.id">
            {{ job.title }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="status-filter">Filtrar por Status:</label>
        <select id="status-filter" v-model="selectedStatus">
          <option value="">Todos os Status</option>
          <option value="pending">Pendente</option>
          <option value="reviewing">Em Análise</option>
          <option value="interview">Entrevista</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Rejeitado</option>
        </select>
      </div>

      <div class="search-group">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Buscar por candidato ou habilidade..."
          class="search-input"
        />
      </div>

      <div class="sort-group">
        <label for="sort-filter">Ordenar por:</label>
        <select id="sort-filter" v-model="sortBy">
          <option value="appliedAt">Data de Candidatura</option>
          <option value="name">Nome do Candidato</option>
          <option value="status">Status</option>
        </select>
      </div>
    </div>

    <div class="bulk-actions" v-if="selectedApplications.length > 0">
      <div class="selection-info">
        {{ selectedApplications.length }} candidatura(s) selecionada(s)
      </div>
      <div class="bulk-buttons">
        <button @click="bulkUpdateStatus('reviewing')" class="bulk-button primary">
          Marcar como Em Análise
        </button>
        <button @click="bulkUpdateStatus('interview')" class="bulk-button info">
          Agendar Entrevista
        </button>
        <button @click="bulkUpdateStatus('approved')" class="bulk-button success">
          Aprovar
        </button>
        <button @click="bulkUpdateStatus('rejected')" class="bulk-button danger">
          Rejeitar
        </button>
        <button @click="clearSelection" class="bulk-button secondary">
          Limpar Seleção
        </button>
      </div>
    </div>

    <div class="applications-table">
      <div v-if="filteredApplications.length === 0" class="no-applications">
        <div class="empty-state">
          <div class="empty-icon">🤷‍♀️</div>
          <h3>Nenhuma candidatura encontrada</h3>
          <p>{{ searchTerm || selectedJob || selectedStatus ? 'Tente ajustar os filtros' : 'Ainda não há candidaturas para suas vagas' }}</p>
          <router-link to="/company/post-job" class="cta-button">
            Publicar Vaga
          </router-link>
        </div>
      </div>

      <div v-else>
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" v-model="selectAll" /></th>
              <th>Candidato</th>
              <th>Vaga</th>
              <th>Status</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="application in filteredApplications" :key="application.id">
              <td><input type="checkbox" :value="application.id" v-model="selectedApplications" /></td>
              <td>
                <div class="candidate-cell">
                  <img :src="application.candidateAvatar" :alt="application.candidateName" class="candidate-avatar" />
                  <div class="candidate-details">
                    <router-link :to="`/company/candidate/${application.candidateId}`" class="candidate-name">
                      {{ application.candidateName }}
                    </router-link>
                    <span class="candidate-email">{{ application.candidateEmail }}</span>
                  </div>
                </div>
              </td>
              <td>{{ application.jobTitle }}</td>
              <td>
                <span class="status-badge" :class="application.status">
                  {{ getStatusText(application.status) }}
                </span>
              </td>
              <td>{{ formatDate(application.appliedAt) }}</td>
              <td>
                <div class="action-buttons">
                  <router-link :to="`/company/candidate/${application.candidateId}`" class="action-button primary">
                    Ver Perfil
                  </router-link>
                  <button @click="openStatusModal(application)" class="action-button secondary">
                    Atualizar Status
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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

    <!-- Modal de Atualização de Status -->
    <div v-if="isStatusModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2>Atualizar Status da Candidatura</h2>
        <p>Candidato: <strong>{{ currentApplication?.candidateName }}</strong></p>
        <p>Vaga: <strong>{{ currentApplication?.jobTitle }}</strong></p>
        
        <div class="form-group">
          <label for="new-status">Novo Status:</label>
          <select id="new-status" v-model="newStatus">
            <option value="pending">Pendente</option>
            <option value="reviewing">Em Análise</option>
            <option value="interview">Entrevista</option>
            <option value="approved">Aprovado</option>
            <option value="rejected">Rejeitado</option>
          </select>
        </div>

        <div class="form-group">
          <label for="feedback">Feedback (Opcional):</label>
          <textarea id="feedback" v-model="feedback" rows="4"></textarea>
        </div>

        <div class="modal-actions">
          <button @click="updateStatus" class="action-button primary">Salvar</button>
          <button @click="closeStatusModal" class="action-button secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Job {
  id: number
  title: string
}

interface Application {
  id: number
  candidateId: number
  candidateName: string
  candidateEmail: string
  candidateAvatar: string
  jobId: number
  jobTitle: string
  status: 'pending' | 'reviewing' | 'interview' | 'approved' | 'rejected'
  appliedAt: string
  feedback?: string
}

const availableJobs = ref<Job[]>([
  { id: 1, title: 'Desenvolvedor Frontend Vue.js' },
  { id: 2, title: 'Designer UX/UI' },
  { id: 3, title: 'Desenvolvedor Backend Node.js' },
])

const applications = ref<Application[]>([
  {
    id: 1,
    candidateId: 101,
    candidateName: 'Ana Silva',
    candidateEmail: 'ana.silva@email.com',
    candidateAvatar: '/api/placeholder/40/40',
    jobId: 1,
    jobTitle: 'Desenvolvedor Frontend Vue.js',
    status: 'pending',
    appliedAt: '2024-01-20',
  },
  {
    id: 2,
    candidateId: 102,
    candidateName: 'Bruno Costa',
    candidateEmail: 'bruno.costa@email.com',
    candidateAvatar: '/api/placeholder/40/40',
    jobId: 2,
    jobTitle: 'Designer UX/UI',
    status: 'reviewing',
    appliedAt: '2024-01-19',
  },
  {
    id: 3,
    candidateId: 103,
    candidateName: 'Carla Dias',
    candidateEmail: 'carla.dias@email.com',
    candidateAvatar: '/api/placeholder/40/40',
    jobId: 1,
    jobTitle: 'Desenvolvedor Frontend Vue.js',
    status: 'interview',
    appliedAt: '2024-01-18',
  },
  {
    id: 4,
    candidateId: 104,
    candidateName: 'Daniel Rocha',
    candidateEmail: 'daniel.rocha@email.com',
    candidateAvatar: '/api/placeholder/40/40',
    jobId: 3,
    jobTitle: 'Desenvolvedor Backend Node.js',
    status: 'approved',
    appliedAt: '2024-01-17',
  },
  {
    id: 5,
    candidateId: 105,
    candidateName: 'Eduarda Lima',
    candidateEmail: 'eduarda.lima@email.com',
    candidateAvatar: '/api/placeholder/40/40',
    jobId: 1,
    jobTitle: 'Desenvolvedor Frontend Vue.js',
    status: 'rejected',
    appliedAt: '2024-01-16',
  },
])

const selectedJob = ref<number | string>('')
const selectedStatus = ref<string>('')
const searchTerm = ref<string>('')
const sortBy = ref<string>('appliedAt')
const selectedApplications = ref<number[]>([])
const currentPage = ref(1)
const itemsPerPage = 10

const isStatusModalOpen = ref(false)
const currentApplication = ref<Application | null>(null)
const newStatus = ref<Application['status']>('pending')
const feedback = ref<string>('')

const totalApplications = computed(() => applications.value.length)
const newApplications = computed(() => applications.value.filter(app => app.status === 'pending').length)
const inReviewApplications = computed(() => applications.value.filter(app => app.status === 'reviewing').length)
const interviewApplications = computed(() => applications.value.filter(app => app.status === 'interview').length)

const filteredApplications = computed(() => {
  let filtered = [...applications.value]

  if (selectedJob.value) {
    filtered = filtered.filter(app => app.jobId === selectedJob.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(app => app.status === selectedStatus.value)
  }

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(app =>
      app.candidateName.toLowerCase().includes(term) ||
      app.jobTitle.toLowerCase().includes(term) ||
      app.candidateEmail.toLowerCase().includes(term)
    )
  }

  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'appliedAt':
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      case 'name':
        return a.candidateName.localeCompare(b.candidateName)
      case 'status':
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredApplications.value.length / itemsPerPage))

const selectAll = computed({
  get: () => selectedApplications.value.length === filteredApplications.value.length && filteredApplications.value.length > 0,
  set: (value: boolean) => {
    if (value) {
      selectedApplications.value = filteredApplications.value.map(app => app.id)
    } else {
      selectedApplications.value = []
    }
  }
})

const getStatusText = (status: string) => {
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

const openStatusModal = (application: Application) => {
  currentApplication.value = application
  newStatus.value = application.status
  feedback.value = application.feedback || ''
  isStatusModalOpen.value = true
}

const closeStatusModal = () => {
  isStatusModalOpen.value = false
  currentApplication.value = null
  feedback.value = ''
}

const updateStatus = () => {
  if (currentApplication.value) {
    const app = applications.value.find(a => a.id === currentApplication.value?.id)
    if (app) {
      app.status = newStatus.value
      app.feedback = feedback.value
      alert(`Status da candidatura de ${app.candidateName} atualizado para ${getStatusText(newStatus.value)}`)
    }
    closeStatusModal()
  }
}

const bulkUpdateStatus = (status: Application['status']) => {
  if (confirm(`Tem certeza que deseja atualizar o status de ${selectedApplications.value.length} candidaturas para ${getStatusText(status)}?`)) {
    selectedApplications.value.forEach(appId => {
      const app = applications.value.find(a => a.id === appId)
      if (app) {
        app.status = status
      }
    })
    alert('Status das candidaturas atualizado com sucesso!')
    selectedApplications.value = []
  }
}

const clearSelection = () => {
  selectedApplications.value = []
}

watch([selectedJob, selectedStatus, searchTerm], () => {
  currentPage.value = 1 // Reset pagination on filter change
})

onMounted(() => {
  // Carregar candidaturas e vagas da empresa
  console.log('Carregando candidaturas da empresa...')
})
</script>

<style scoped>
.company-applications-view {
  max-width: 1400px;
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
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: end;
}

.filter-group,
.sort-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label,
.sort-group label {
  font-weight: bold;
  color: #333;
  font-size: 0.9rem;
}

.filter-group select,
.sort-group select {
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

.bulk-actions {
  background: #e3f2fd;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.selection-info {
  font-weight: bold;
  color: #1976d2;
}

.bulk-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.bulk-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.bulk-button.primary {
  background: #4CAF50;
  color: white;
}

.bulk-button.info {
  background: #2196F3;
  color: white;
}

.bulk-button.success {
  background: #8BC34A;
  color: white;
}

.bulk-button.danger {
  background: #f44336;
  color: white;
}

.bulk-button.secondary {
  background: #f5f5f5;
  color: #333;
}

.bulk-button:hover {
  opacity: 0.8;
}

.applications-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.applications-table table {
  width: 100%;
  border-collapse: collapse;
}

.applications-table th,
.applications-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.applications-table th {
  background: #f8f8f8;
  font-weight: bold;
  color: #333;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.applications-table tr:last-child td {
  border-bottom: none;
}

.candidate-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.candidate-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.candidate-details {
  display: flex;
  flex-direction: column;
}

.candidate-name {
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.candidate-name:hover {
  color: #4CAF50;
}

.candidate-email {
  font-size: 0.8rem;
  color: #666;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  display: inline-block;
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
  background: #cce5ff;
  color: #004085;
}

.status-badge.approved {
  background: #d4edda;
  color: #155724;
}

.status-badge.rejected {
  background: #f8d7da;
  color: #721c24;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-button {
  padding: 8px 12px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.85rem;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.modal-content p {
  margin-bottom: 15px;
  color: #555;
}

.modal-content .form-group {
  margin-bottom: 20px;
}

.modal-content label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.modal-content select,
.modal-content textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .applications-header h1 {
    font-size: 2rem;
  }
  
  .applications-filters {
    flex-direction: column;
    gap: 15px;
  }
  
  .applications-table {
    overflow-x: scroll;
  }
  
  .applications-table th,
  .applications-table td {
    padding: 10px;
  }
  
  .candidate-cell {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 5px;
  }
  
  .action-button {
    width: 100%;
    text-align: center;
  }
}
</style>

