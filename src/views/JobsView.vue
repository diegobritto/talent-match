<template>
  <div class="jobs-page">
    <!-- Search Header -->
    <section class="search-header">
      <div class="container">
        <div class="search-bar">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Busque por cargo, empresa ou palavra-chave..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="search-button">
            Buscar
          </button>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="jobs-layout">
        <!-- Filters Sidebar -->
        <aside class="filters-sidebar">
          <div class="filters">
            <h3>Filtros</h3>
            
            <!-- Location Filter -->
            <div class="filter-group">
              <label class="filter-title">Localização</label>
              <select v-model="filters.location" class="form-select">
                <option value="">Todas as cidades</option>
                <option value="sao-paulo">São Paulo, SP</option>
                <option value="rio-janeiro">Rio de Janeiro, RJ</option>
                <option value="belo-horizonte">Belo Horizonte, MG</option>
                <option value="brasilia">Brasília, DF</option>
                <option value="porto-alegre">Porto Alegre, RS</option>
              </select>
            </div>

            <!-- Work Mode Filter -->
            <div class="filter-group">
              <label class="filter-title">Modelo de Trabalho</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="filters.workMode" value="remote" />
                  Remoto
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="filters.workMode" value="onsite" />
                  Presencial
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="filters.workMode" value="hybrid" />
                  Híbrido
                </label>
              </div>
            </div>

            <!-- Contract Type Filter -->
            <div class="filter-group">
              <label class="filter-title">Tipo de Contrato</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="filters.contractType" value="clt" />
                  CLT
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="filters.contractType" value="pj" />
                  PJ
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="filters.contractType" value="internship" />
                  Estágio
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="filters.contractType" value="freelancer" />
                  Freelancer
                </label>
              </div>
            </div>

            <!-- Experience Level Filter -->
            <div class="filter-group">
              <label class="filter-title">Nível de Experiência</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="filters.experienceLevel" value="internship" />
                  Estágio
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="filters.experienceLevel" value="junior" />
                  Júnior
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="filters.experienceLevel" value="mid" />
                  Pleno
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="filters.experienceLevel" value="senior" />
                  Sênior
                </label>
              </div>
            </div>

            <button @click="clearFilters" class="btn btn-secondary w-full">
              Limpar Filtros
            </button>
          </div>
        </aside>

        <!-- Results Section -->
        <main class="results-section">
          <div class="results-header">
            <div class="results-info">
              <h2>Resultados para "{{ searchQuery || 'Todas as vagas' }}"</h2>
              <p>Encontramos {{ filteredJobs.length }} vagas que correspondem à sua busca</p>
            </div>
            
            <div class="sort-controls">
              <label>Ordenar por:</label>
              <select v-model="sortBy" class="form-select">
                <option value="relevance">Mais relevantes</option>
                <option value="date">Mais recentes</option>
                <option value="salary-high">Maior salário</option>
                <option value="salary-low">Menor salário</option>
              </select>
            </div>
          </div>

          <!-- Job Cards -->
          <div class="jobs-list">
            <div 
              v-for="job in paginatedJobs" 
              :key="job.id"
              class="job-card"
              @click="viewJob(job.id)"
            >
              <div class="job-header">
                <div class="company-logo" :style="{ background: job.companyColor }">
                  {{ job.company.charAt(0) }}
                </div>
                <div class="job-actions">
                  <button 
                    @click.stop="toggleSaveJob(job.id)"
                    class="save-button"
                    :class="{ saved: job.isSaved }"
                  >
                    💾
                  </button>
                </div>
              </div>

              <div class="job-content">
                <div class="job-badges">
                  <span v-if="job.isNew" class="badge badge-success">Nova</span>
                  <span v-if="job.isUrgent" class="badge badge-warning">Urgente</span>
                  <span v-if="job.isFeatured" class="badge badge-primary">Destaque</span>
                </div>

                <h3 class="job-title">{{ job.title }}</h3>
                <p class="job-company">{{ job.company }}</p>
                <p class="job-posted">Publicado há {{ job.postedDays }} dias</p>

                <div class="job-details">
                  <span class="job-detail">📍 {{ job.location }}</span>
                  <span class="job-detail">💼 {{ job.contractType }}</span>
                  <span class="job-detail">🏠 {{ job.workMode }}</span>
                  <span class="job-detail">⭐ {{ job.experienceLevel }}</span>
                </div>

                <p class="job-description">{{ job.description }}</p>

                <div class="job-skills">
                  <span 
                    v-for="skill in job.skills" 
                    :key="skill"
                    class="skill-tag"
                  >
                    {{ skill }}
                  </span>
                </div>

                <div class="job-footer">
                  <div class="job-salary">{{ job.salary }}</div>
                  <div class="job-actions-buttons">
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
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="btn btn-secondary"
            >
              Anterior
            </button>
            
            <div class="page-numbers">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="currentPage = page"
                class="page-button"
                :class="{ active: page === currentPage }"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="btn btn-secondary"
            >
              Próxima
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Reactive data
const searchQuery = ref('')
const sortBy = ref('relevance')
const currentPage = ref(1)
const itemsPerPage = 10

// Filters
const filters = ref({
  location: '',
  workMode: [] as string[],
  contractType: [] as string[],
  experienceLevel: [] as string[]
})

// Jobs data
const jobs = ref([
  {
    id: 1,
    title: 'Desenvolvedor Full Stack Sênior',
    company: 'TechCorp Brasil',
    location: 'São Paulo, SP',
    contractType: 'CLT',
    workMode: 'Remoto',
    experienceLevel: 'Sênior',
    description: 'Buscamos desenvolvedor experiente para liderar projetos de alta complexidade. Trabalho 100% remoto com equipe internacional e tecnologias modernas.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    salary: 'R$ 12.000 - R$ 18.000',
    postedDays: 2,
    companyColor: '#2563EB',
    isNew: true,
    isUrgent: false,
    isFeatured: false,
    isSaved: false
  },
  {
    id: 2,
    title: 'Desenvolvedor Frontend React',
    company: 'StartupX Tecnologia',
    location: 'Rio de Janeiro, RJ',
    contractType: 'PJ',
    workMode: 'Híbrido',
    experienceLevel: 'Pleno',
    description: 'Oportunidade em startup em crescimento acelerado. Ambiente dinâmico, aprendizado constante e participação nos lucros.',
    skills: ['React', 'JavaScript', 'CSS', 'Git'],
    salary: 'R$ 7.000 - R$ 10.000',
    postedDays: 1,
    companyColor: '#10B981',
    isNew: false,
    isUrgent: true,
    isFeatured: false,
    isSaved: false
  },
  {
    id: 3,
    title: 'Desenvolvedor Backend Python',
    company: 'Inovação Digital',
    location: 'Belo Horizonte, MG',
    contractType: 'CLT',
    workMode: 'Presencial',
    experienceLevel: 'Júnior',
    description: 'Primeira oportunidade para desenvolvedor júnior. Mentoria dedicada, treinamentos e plano de carreira estruturado.',
    skills: ['Python', 'Django', 'PostgreSQL', 'REST API'],
    salary: 'R$ 4.500 - R$ 6.500',
    postedDays: 3,
    companyColor: '#F59E0B',
    isNew: false,
    isUrgent: false,
    isFeatured: true,
    isSaved: false
  },
  {
    id: 4,
    title: 'Desenvolvedor Mobile Flutter',
    company: 'DevSolutions',
    location: 'Brasília, DF',
    contractType: 'CLT',
    workMode: 'Híbrido',
    experienceLevel: 'Pleno',
    description: 'Desenvolvimento de aplicativos móveis para clientes do setor financeiro. Projetos desafiadores e equipe experiente.',
    skills: ['Flutter', 'Dart', 'Firebase', 'REST API'],
    salary: 'R$ 8.000 - R$ 11.000',
    postedDays: 5,
    companyColor: '#EF4444',
    isNew: false,
    isUrgent: false,
    isFeatured: false,
    isSaved: false
  }
])

// Computed properties
const filteredJobs = computed(() => {
  let result = jobs.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(job => 
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.skills.some(skill => skill.toLowerCase().includes(query))
    )
  }

  // Location filter
  if (filters.value.location) {
    result = result.filter(job => 
      job.location.toLowerCase().includes(filters.value.location)
    )
  }

  // Work mode filter
  if (filters.value.workMode.length > 0) {
    result = result.filter(job => 
      filters.value.workMode.some(mode => 
        job.workMode.toLowerCase().includes(mode)
      )
    )
  }

  // Contract type filter
  if (filters.value.contractType.length > 0) {
    result = result.filter(job => 
      filters.value.contractType.some(type => 
        job.contractType.toLowerCase().includes(type)
      )
    )
  }

  // Experience level filter
  if (filters.value.experienceLevel.length > 0) {
    result = result.filter(job => 
      filters.value.experienceLevel.some(level => 
        job.experienceLevel.toLowerCase().includes(level)
      )
    )
  }

  // Sort
  switch (sortBy.value) {
    case 'date':
      result.sort((a, b) => a.postedDays - b.postedDays)
      break
    case 'salary-high':
      result.sort((a, b) => {
        const aMax = parseInt(a.salary.split(' - R$ ')[1]?.replace(/\./g, '') || '0')
        const bMax = parseInt(b.salary.split(' - R$ ')[1]?.replace(/\./g, '') || '0')
        return bMax - aMax
      })
      break
    case 'salary-low':
      result.sort((a, b) => {
        const aMin = parseInt(a.salary.split('R$ ')[1]?.split(' -')[0]?.replace(/\./g, '') || '0')
        const bMin = parseInt(b.salary.split('R$ ')[1]?.split(' -')[0]?.replace(/\./g, '') || '0')
        return aMin - bMin
      })
      break
    default: // relevance
      result.sort((a, b) => {
        let aScore = 0
        let bScore = 0
        if (a.isFeatured) aScore += 3
        if (a.isUrgent) aScore += 2
        if (a.isNew) aScore += 1
        if (b.isFeatured) bScore += 3
        if (b.isUrgent) bScore += 2
        if (b.isNew) bScore += 1
        return bScore - aScore
      })
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage))

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredJobs.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const handleSearch = () => {
  currentPage.value = 1
  // Update URL with search query
  router.push({ query: { ...route.query, q: searchQuery.value } })
}

const clearFilters = () => {
  filters.value = {
    location: '',
    workMode: [],
    contractType: [],
    experienceLevel: []
  }
  currentPage.value = 1
}

const toggleSaveJob = (jobId: number) => {
  const job = jobs.value.find(j => j.id === jobId)
  if (job) {
    job.isSaved = !job.isSaved
  }
}

const viewJob = (jobId: number) => {
  router.push(`/jobs/${jobId}`)
}

const applyToJob = (jobId: number) => {
  // Redirect to login if not authenticated, otherwise show application modal
  router.push(`/jobs/${jobId}?apply=true`)
}

// Watch for filter changes to reset pagination
watch([filters, sortBy], () => {
  currentPage.value = 1
}, { deep: true })

// Initialize search from URL query
onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q as string
  }
})
</script>

<style scoped>
.jobs-page {
  min-height: 100vh;
  background: #F9FAFB;
}

/* Search Header */
.search-header {
  background: #2563EB;
  padding: 2rem 0;
}

.search-bar {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 0.75rem 0 0 0.75rem;
  font-size: 1.125rem;
  outline: none;
}

.search-button {
  padding: 1rem 2rem;
  background: #F59E0B;
  color: white;
  border: none;
  border-radius: 0 0.75rem 0.75rem 0;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.search-button:hover {
  background: #D97706;
}

/* Layout */
.jobs-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  padding: 2rem 0;
}

/* Filters Sidebar */
.filters-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.filters {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filters h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1F2937;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-title {
  display: block;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #374151;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #6B7280;
}

.checkbox-item input {
  margin: 0;
}

/* Results Section */
.results-section {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid #E5E7EB;
}

.results-info h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1F2937;
}

.results-info p {
  color: #6B7280;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-controls label {
  font-weight: 500;
  color: #374151;
}

/* Job Cards */
.jobs-list {
  padding: 0 2rem 2rem;
}

.job-card {
  border-bottom: 1px solid #E5E7EB;
  padding: 2rem 0;
  cursor: pointer;
  transition: all 0.2s;
}

.job-card:hover {
  background: #F9FAFB;
  margin: 0 -2rem;
  padding: 2rem;
  border-radius: 0.5rem;
}

.job-card:last-child {
  border-bottom: none;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.company-logo {
  width: 50px;
  height: 50px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.job-actions {
  display: flex;
  gap: 0.5rem;
}

.save-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.save-button:hover {
  background: #F3F4F6;
}

.save-button.saved {
  background: #DBEAFE;
}

.job-content {
  margin-left: 66px;
}

.job-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.job-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1F2937;
}

.job-company {
  color: #2563EB;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.job-posted {
  color: #6B7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.job-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.job-detail {
  color: #6B7280;
  font-size: 0.875rem;
}

.job-description {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.job-skills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.skill-tag {
  background: #DBEAFE;
  color: #1E40AF;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.job-salary {
  font-weight: 600;
  color: #10B981;
  font-size: 1.125rem;
}

.job-actions-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid #E5E7EB;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-button {
  width: 40px;
  height: 40px;
  border: 1px solid #D1D5DB;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.page-button:hover {
  border-color: #2563EB;
  color: #2563EB;
}

.page-button.active {
  background: #2563EB;
  color: white;
  border-color: #2563EB;
}

/* Responsive */
@media (max-width: 768px) {
  .jobs-layout {
    grid-template-columns: 1fr;
  }
  
  .filters-sidebar {
    position: static;
  }
  
  .results-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .job-content {
    margin-left: 0;
  }
  
  .job-header {
    margin-bottom: 1rem;
  }
  
  .job-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .search-bar {
    flex-direction: column;
  }
  
  .search-input,
  .search-button {
    border-radius: 0.75rem;
  }
}
</style>

