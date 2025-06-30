<template>
  <div class="saved-jobs-view">
    <div class="saved-jobs-header">
      <h1>Vagas Salvas</h1>
      <p>Suas vagas favoritas em um só lugar</p>
    </div>

    <div class="saved-jobs-stats">
      <div class="stat-card">
        <div class="stat-number">{{ totalSavedJobs }}</div>
        <div class="stat-label">Vagas Salvas</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ recentlyAdded }}</div>
        <div class="stat-label">Adicionadas Esta Semana</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ appliedFromSaved }}</div>
        <div class="stat-label">Candidaturas Enviadas</div>
      </div>
    </div>

    <div class="saved-jobs-filters">
      <div class="filter-group">
        <label for="location-filter">Localização:</label>
        <select id="location-filter" v-model="selectedLocation">
          <option value="">Todas as Localizações</option>
          <option value="São Paulo, SP">São Paulo, SP</option>
          <option value="Rio de Janeiro, RJ">Rio de Janeiro, RJ</option>
          <option value="Belo Horizonte, MG">Belo Horizonte, MG</option>
          <option value="Porto Alegre, RS">Porto Alegre, RS</option>
          <option value="Remote">Remoto</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="salary-filter">Faixa Salarial:</label>
        <select id="salary-filter" v-model="selectedSalaryRange">
          <option value="">Todas as Faixas</option>
          <option value="0-5000">Até R$ 5.000</option>
          <option value="5000-8000">R$ 5.000 - R$ 8.000</option>
          <option value="8000-12000">R$ 8.000 - R$ 12.000</option>
          <option value="12000+">Acima de R$ 12.000</option>
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

      <div class="sort-group">
        <label for="sort-filter">Ordenar por:</label>
        <select id="sort-filter" v-model="sortBy">
          <option value="savedAt">Data que Salvou</option>
          <option value="postedAt">Data de Publicação</option>
          <option value="company">Empresa</option>
          <option value="salary">Salário</option>
        </select>
      </div>
    </div>

    <div class="bulk-actions" v-if="selectedJobs.length > 0">
      <div class="selection-info">
        {{ selectedJobs.length }} vaga(s) selecionada(s)
      </div>
      <div class="bulk-buttons">
        <button @click="bulkApply" class="bulk-button primary">
          Candidatar-se em Lote
        </button>
        <button @click="bulkRemove" class="bulk-button danger">
          Remover Selecionadas
        </button>
        <button @click="clearSelection" class="bulk-button secondary">
          Limpar Seleção
        </button>
      </div>
    </div>

    <div class="saved-jobs-list">
      <div v-if="filteredSavedJobs.length === 0" class="no-saved-jobs">
        <div class="empty-state">
          <div class="empty-icon">💾</div>
          <h3>Nenhuma vaga salva encontrada</h3>
          <p>{{ searchTerm || selectedLocation ? 'Tente ajustar os filtros' : 'Você ainda não salvou nenhuma vaga' }}</p>
          <router-link to="/jobs" class="cta-button">
            Buscar Vagas
          </router-link>
        </div>
      </div>

      <div v-else class="jobs-grid">
        <div
          v-for="job in filteredSavedJobs"
          :key="job.id"
          class="job-card"
          :class="{ 'selected': selectedJobs.includes(job.id) }"
        >
          <div class="job-card-header">
            <input
              type="checkbox"
              :value="job.id"
              v-model="selectedJobs"
              class="job-checkbox"
            />
            <button @click="removeFromSaved(job.id)" class="remove-button" title="Remover das salvas">
              ❌
            </button>
          </div>

          <div class="job-content">
            <div class="company-logo">
              <img :src="job.companyLogo" :alt="job.company" />
            </div>

            <div class="job-info">
              <h3>{{ job.title }}</h3>
              <p class="company-name">{{ job.company }}</p>
              
              <div class="job-details">
                <span class="location">📍 {{ job.location }}</span>
                <span class="type">💼 {{ job.type }}</span>
                <span class="experience">👨‍💼 {{ job.experienceLevel }}</span>
              </div>

              <div class="salary">
                💰 {{ job.salary }}
              </div>

              <div class="job-description">
                {{ job.description.substring(0, 150) }}...
              </div>

              <div class="job-tags">
                <span v-for="skill in job.skills.slice(0, 3)" :key="skill" class="skill-tag">
                  {{ skill }}
                </span>
                <span v-if="job.skills.length > 3" class="more-skills">
                  +{{ job.skills.length - 3 }} mais
                </span>
              </div>
            </div>
          </div>

          <div class="job-meta">
            <div class="saved-date">
              Salva em: {{ formatDate(job.savedAt) }}
            </div>
            <div class="posted-date">
              Publicada: {{ formatDate(job.postedAt) }}
            </div>
          </div>

          <div class="job-actions">
            <router-link :to="`/jobs/${job.id}`" class="action-button secondary">
              Ver Detalhes
            </router-link>
            <button 
              @click="applyToJob(job.id)" 
              class="action-button primary"
              :disabled="job.hasApplied"
            >
              {{ job.hasApplied ? 'Já Candidatou' : 'Candidatar-se' }}
            </button>
          </div>

          <div v-if="job.hasApplied" class="applied-badge">
            ✅ Candidatura Enviada
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

interface SavedJob {
  id: number
  title: string
  company: string
  companyLogo: string
  location: string
  type: string
  experienceLevel: string
  salary: string
  description: string
  skills: string[]
  savedAt: string
  postedAt: string
  hasApplied: boolean
}

const savedJobs = ref<SavedJob[]>([
  {
    id: 1,
    title: 'Desenvolvedor Frontend Vue.js',
    company: 'TechCorp',
    companyLogo: '/api/placeholder/60/60',
    location: 'São Paulo, SP',
    type: 'CLT',
    experienceLevel: 'Pleno',
    salary: 'R$ 8.000 - R$ 12.000',
    description: 'Estamos procurando um desenvolvedor frontend experiente em Vue.js para se juntar à nossa equipe de desenvolvimento. Você será responsável por desenvolver interfaces de usuário modernas e responsivas.',
    skills: ['Vue.js', 'TypeScript', 'CSS', 'JavaScript', 'Git'],
    savedAt: '2024-01-20',
    postedAt: '2024-01-15',
    hasApplied: true
  },
  {
    id: 2,
    title: 'Desenvolvedor React',
    company: 'StartupXYZ',
    companyLogo: '/api/placeholder/60/60',
    location: 'Rio de Janeiro, RJ',
    type: 'PJ',
    experienceLevel: 'Sênior',
    salary: 'R$ 7.000 - R$ 10.000',
    description: 'Oportunidade para desenvolvedor React experiente em startup inovadora. Trabalhe com tecnologias modernas e tenha impacto direto no produto.',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    savedAt: '2024-01-18',
    postedAt: '2024-01-12',
    hasApplied: false
  },
  {
    id: 3,
    title: 'Frontend Developer',
    company: 'DigitalCorp',
    companyLogo: '/api/placeholder/60/60',
    location: 'Remote',
    type: 'CLT',
    experienceLevel: 'Pleno',
    salary: 'R$ 9.000 - R$ 13.000',
    description: 'Posição remota para desenvolvedor frontend com foco em experiência do usuário. Trabalhe com equipe internacional e projetos desafiadores.',
    skills: ['React', 'Vue.js', 'TypeScript', 'Figma', 'Storybook'],
    savedAt: '2024-01-16',
    postedAt: '2024-01-10',
    hasApplied: false
  },
  {
    id: 4,
    title: 'Vue.js Developer',
    company: 'InnovaTech',
    companyLogo: '/api/placeholder/60/60',
    location: 'Porto Alegre, RS',
    type: 'CLT',
    experienceLevel: 'Júnior',
    salary: 'R$ 5.000 - R$ 7.000',
    description: 'Oportunidade para desenvolvedor júnior crescer em empresa de tecnologia. Mentoria e treinamentos inclusos.',
    skills: ['Vue.js', 'JavaScript', 'HTML', 'CSS'],
    savedAt: '2024-01-14',
    postedAt: '2024-01-08',
    hasApplied: false
  },
  {
    id: 5,
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    companyLogo: '/api/placeholder/60/60',
    location: 'Belo Horizonte, MG',
    type: 'CLT',
    experienceLevel: 'Sênior',
    salary: 'R$ 12.000 - R$ 15.000',
    description: 'Desenvolvedor full stack para liderar projetos complexos. Experiência com arquitetura de sistemas e liderança técnica.',
    skills: ['Vue.js', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes'],
    savedAt: '2024-01-12',
    postedAt: '2024-01-05',
    hasApplied: false
  }
])

const selectedLocation = ref('')
const selectedSalaryRange = ref('')
const searchTerm = ref('')
const sortBy = ref('savedAt')
const selectedJobs = ref<number[]>([])
const currentPage = ref(1)
const itemsPerPage = 6

const totalSavedJobs = computed(() => savedJobs.value.length)
const recentlyAdded = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return savedJobs.value.filter(job => new Date(job.savedAt) >= oneWeekAgo).length
})
const appliedFromSaved = computed(() => savedJobs.value.filter(job => job.hasApplied).length)

const filteredSavedJobs = computed(() => {
  let filtered = [...savedJobs.value]

  // Filtro por localização
  if (selectedLocation.value) {
    filtered = filtered.filter(job => job.location === selectedLocation.value)
  }

  // Filtro por faixa salarial
  if (selectedSalaryRange.value) {
    filtered = filtered.filter(job => {
      const salary = job.salary.toLowerCase()
      switch (selectedSalaryRange.value) {
        case '0-5000':
          return salary.includes('5.000') || salary.includes('4.000') || salary.includes('3.000')
        case '5000-8000':
          return salary.includes('5.000') || salary.includes('6.000') || salary.includes('7.000') || salary.includes('8.000')
        case '8000-12000':
          return salary.includes('8.000') || salary.includes('9.000') || salary.includes('10.000') || salary.includes('11.000') || salary.includes('12.000')
        case '12000+':
          return salary.includes('12.000') || salary.includes('13.000') || salary.includes('14.000') || salary.includes('15.000')
        default:
          return true
      }
    })
  }

  // Filtro por busca
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(job =>
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.skills.some(skill => skill.toLowerCase().includes(term))
    )
  }

  // Ordenação
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'savedAt':
        return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      case 'postedAt':
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      case 'company':
        return a.company.localeCompare(b.company)
      case 'salary':
        return b.salary.localeCompare(a.salary)
      default:
        return 0
    }
  })

  // Paginação
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const totalPages = computed(() => Math.ceil(savedJobs.value.length / itemsPerPage))

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const removeFromSaved = (jobId: number) => {
  if (confirm('Tem certeza que deseja remover esta vaga das salvas?')) {
    const index = savedJobs.value.findIndex(job => job.id === jobId)
    if (index > -1) {
      savedJobs.value.splice(index, 1)
    }
    // Remover da seleção se estiver selecionada
    const selectedIndex = selectedJobs.value.indexOf(jobId)
    if (selectedIndex > -1) {
      selectedJobs.value.splice(selectedIndex, 1)
    }
  }
}

const applyToJob = (jobId: number) => {
  const job = savedJobs.value.find(j => j.id === jobId)
  if (job) {
    job.hasApplied = true
    alert(`Candidatura enviada para: ${job.title}`)
  }
}

const bulkApply = () => {
  if (confirm(`Candidatar-se a ${selectedJobs.value.length} vaga(s)?`)) {
    selectedJobs.value.forEach(jobId => {
      const job = savedJobs.value.find(j => j.id === jobId)
      if (job && !job.hasApplied) {
        job.hasApplied = true
      }
    })
    alert('Candidaturas enviadas com sucesso!')
    selectedJobs.value = []
  }
}

const bulkRemove = () => {
  if (confirm(`Remover ${selectedJobs.value.length} vaga(s) das salvas?`)) {
    selectedJobs.value.forEach(jobId => {
      const index = savedJobs.value.findIndex(job => job.id === jobId)
      if (index > -1) {
        savedJobs.value.splice(index, 1)
      }
    })
    selectedJobs.value = []
  }
}

const clearSelection = () => {
  selectedJobs.value = []
}

onMounted(() => {
  // Carregar vagas salvas do usuário
  console.log('Carregando vagas salvas...')
})
</script>

<style scoped>
.saved-jobs-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.saved-jobs-header {
  text-align: center;
  margin-bottom: 30px;
}

.saved-jobs-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.saved-jobs-header p {
  color: #666;
  font-size: 1.1rem;
}

.saved-jobs-stats {
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

.saved-jobs-filters {
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

.saved-jobs-list {
  margin-bottom: 30px;
}

.no-saved-jobs {
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

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.job-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px;
  transition: all 0.3s;
  position: relative;
}

.job-card.selected {
  border: 2px solid #4CAF50;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2);
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.job-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.job-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.remove-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.remove-button:hover {
  opacity: 1;
}

.job-content {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.company-logo img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.job-info {
  flex: 1;
}

.job-info h3 {
  color: #333;
  margin-bottom: 5px;
  font-size: 1.2rem;
}

.company-name {
  color: #666;
  margin-bottom: 10px;
  font-weight: 500;
}

.job-details {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.job-details span {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.salary {
  color: #4CAF50;
  font-weight: bold;
  margin-bottom: 10px;
}

.job-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 10px;
}

.job-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.skill-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.more-skills {
  color: #666;
  font-size: 0.8rem;
  padding: 4px 8px;
}

.job-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.8rem;
  color: #666;
}

.job-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  text-decoration: none;
  text-align: center;
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

.action-button:disabled {
  background: #ccc;
  color: #666;
  cursor: not-allowed;
}

.action-button:hover:not(:disabled) {
  opacity: 0.8;
}

.applied-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #4CAF50;
  color: white;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
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
  .saved-jobs-header h1 {
    font-size: 2rem;
  }
  
  .saved-jobs-filters {
    flex-direction: column;
    gap: 15px;
  }
  
  .bulk-actions {
    flex-direction: column;
    text-align: center;
  }
  
  .jobs-grid {
    grid-template-columns: 1fr;
  }
  
  .job-content {
    flex-direction: column;
    text-align: center;
  }
  
  .job-details {
    justify-content: center;
  }
  
  .job-meta {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
  
  .action-button {
    padding: 12px;
  }
}
</style>

