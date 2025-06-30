<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Conectando Talentos e Oportunidades
            </h1>
            <p class="hero-description">
              A plataforma que une candidatos qualificados às melhores empresas. 
              Encontre sua próxima oportunidade ou o talento ideal para sua equipe.
            </p>
            
            <!-- Search Bar -->
            <div class="search-section">
              <div class="search-bar">
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Busque por cargo, empresa ou palavra-chave..."
                  class="search-input"
                  @keyup.enter="handleSearch"
                />
                <button @click="handleSearch" class="search-button">
                  Buscar Vagas
                </button>
              </div>
              
              <div class="user-type-buttons">
                <router-link to="/register?type=candidate" class="btn btn-success">
                  Sou Candidato
                </router-link>
                <router-link to="/register?type=company" class="btn btn-secondary">
                  Sou Empresa
                </router-link>
              </div>
            </div>
          </div>
          
          <div class="hero-visual">
            <div class="connection-icon">
              🤝
            </div>
            <div class="feature-highlight">
              <h3>Conexão Perfeita</h3>
              <p>Algoritmo inteligente que conecta candidatos às vagas mais adequadas ao seu perfil</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <div class="stat-number" :class="stat.color">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Jobs -->
    <section class="featured-jobs">
      <div class="container">
        <div class="section-header">
          <h2>Vagas em Destaque</h2>
          <p>Oportunidades selecionadas especialmente para você</p>
        </div>
        
        <div class="jobs-grid">
          <div 
            v-for="job in featuredJobs" 
            :key="job.id"
            class="job-card"
            @click="viewJob(job.id)"
          >
            <div class="job-header">
              <div class="company-logo" :style="{ background: job.companyColor }">
                {{ job.company.charAt(0) }}
              </div>
              <div class="job-badges">
                <span v-if="job.isNew" class="badge badge-success">Nova</span>
                <span v-if="job.isUrgent" class="badge badge-warning">Urgente</span>
                <span v-if="job.isFeatured" class="badge badge-primary">Destaque</span>
              </div>
            </div>
            
            <h3 class="job-title">{{ job.title }}</h3>
            <p class="job-company">{{ job.company }}</p>
            
            <div class="job-details">
              <span class="job-detail">📍 {{ job.location }}</span>
              <span class="job-detail">💼 {{ job.type }}</span>
              <span class="job-detail">🏠 {{ job.mode }}</span>
            </div>
            
            <div class="job-skills">
              <span 
                v-for="skill in job.skills" 
                :key="skill"
                class="skill-tag"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="section-footer">
          <router-link to="/jobs" class="btn btn-primary">
            Ver Todas as Vagas
          </router-link>
        </div>
      </div>
    </section>

    <!-- How it Works -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header">
          <h2>Como Funciona</h2>
          <p>Processo simples e eficiente para candidatos e empresas</p>
        </div>
        
        <div class="process-grid">
          <div class="process-section">
            <h3>Para Candidatos</h3>
            <div class="process-steps">
              <div v-for="step in candidateSteps" :key="step.number" class="process-step">
                <div class="step-number">{{ step.number }}</div>
                <div class="step-content">
                  <h4>{{ step.title }}</h4>
                  <p>{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="process-section">
            <h3>Para Empresas</h3>
            <div class="process-steps">
              <div v-for="step in companySteps" :key="step.number" class="process-step">
                <div class="step-number">{{ step.number }}</div>
                <div class="step-content">
                  <h4>{{ step.title }}</h4>
                  <p>{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partner Companies -->
    <section class="partner-companies">
      <div class="container">
        <div class="section-header">
          <h2>Empresas Parceiras</h2>
          <p>Mais de 2.000 empresas confiam em nossa plataforma</p>
        </div>
        
        <div class="companies-grid">
          <div 
            v-for="company in partnerCompanies" 
            :key="company.name"
            class="company-item"
          >
            <div class="company-logo" :style="{ background: company.color }">
              {{ company.name.charAt(0) }}
            </div>
            <div class="company-info">
              <h4>{{ company.name }}</h4>
              <p>{{ company.sector }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Pronto para Começar?</h2>
          <p>Junte-se a milhares de profissionais e empresas que já encontraram o match perfeito</p>
          <div class="cta-buttons">
            <router-link to="/register?type=candidate" class="btn btn-primary btn-large">
              Criar Conta como Candidato
            </router-link>
            <router-link to="/register?type=company" class="btn btn-secondary btn-large">
              Cadastrar Empresa
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

// Stats data
const stats = ref([
  { value: '10K+', label: 'Vagas Ativas', color: 'text-blue-600' },
  { value: '50K+', label: 'Candidatos', color: 'text-green-600' },
  { value: '2K+', label: 'Empresas', color: 'text-yellow-600' },
  { value: '95%', label: 'Satisfação', color: 'text-red-600' }
])

// Featured jobs data
const featuredJobs = ref([
  {
    id: 1,
    title: 'Desenvolvedor Full Stack',
    company: 'TechCorp Brasil',
    location: 'São Paulo, SP',
    type: 'CLT',
    mode: 'Remoto',
    skills: ['React', 'Node.js', 'Python'],
    companyColor: '#2563EB',
    isNew: true,
    isUrgent: false,
    isFeatured: false
  },
  {
    id: 2,
    title: 'Designer UX/UI',
    company: 'Marketing Plus',
    location: 'Rio de Janeiro, RJ',
    type: 'PJ',
    mode: 'Presencial',
    skills: ['Figma', 'Adobe XD', 'Sketch'],
    companyColor: '#10B981',
    isNew: false,
    isUrgent: true,
    isFeatured: false
  },
  {
    id: 3,
    title: 'Analista de Marketing Digital',
    company: 'Inovação Digital',
    location: 'Belo Horizonte, MG',
    type: 'CLT',
    mode: 'Híbrido',
    skills: ['Google Ads', 'Facebook Ads', 'Analytics'],
    companyColor: '#F59E0B',
    isNew: false,
    isUrgent: false,
    isFeatured: true
  }
])

// Process steps
const candidateSteps = ref([
  {
    number: 1,
    title: 'Crie seu Perfil',
    description: 'Cadastre-se e complete seu currículo com suas experiências e habilidades'
  },
  {
    number: 2,
    title: 'Busque Vagas',
    description: 'Use nossos filtros avançados para encontrar oportunidades ideais'
  },
  {
    number: 3,
    title: 'Candidate-se',
    description: 'Aplique para as vagas com um clique e acompanhe o processo'
  }
])

const companySteps = ref([
  {
    number: 1,
    title: 'Publique Vagas',
    description: 'Crie anúncios detalhados com requisitos e benefícios'
  },
  {
    number: 2,
    title: 'Receba Candidatos',
    description: 'Nosso algoritmo filtra candidatos compatíveis com seu perfil'
  },
  {
    number: 3,
    title: 'Gerencie Processos',
    description: 'Organize entrevistas e acompanhe todo o processo seletivo'
  }
])

// Partner companies
const partnerCompanies = ref([
  { name: 'TechCorp', sector: 'Tecnologia', color: '#2563EB' },
  { name: 'Marketing+', sector: 'Marketing', color: '#10B981' },
  { name: 'Inovação', sector: 'Consultoria', color: '#F59E0B' },
  { name: 'StartupX', sector: 'Startup', color: '#EF4444' }
])

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/jobs?q=${encodeURIComponent(searchQuery.value)}`)
  } else {
    router.push('/jobs')
  }
}

const viewJob = (jobId: number) => {
  router.push(`/jobs/${jobId}`)
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  color: white;
  padding: 4rem 0;
}

.hero-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.search-section {
  margin-bottom: 2rem;
}

.search-bar {
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  max-width: 600px;
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

.user-type-buttons {
  display: flex;
  gap: 1rem;
}

.hero-visual {
  text-align: center;
}

.connection-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.feature-highlight h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.feature-highlight p {
  opacity: 0.9;
}

/* Stats Section */
.stats-section {
  padding: 3rem 0;
  background: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6B7280;
  font-weight: 500;
}

/* Featured Jobs */
.featured-jobs {
  padding: 4rem 0;
  background: #F9FAFB;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1F2937;
}

.section-header p {
  font-size: 1.125rem;
  color: #6B7280;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.job-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
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

.job-badges {
  display: flex;
  gap: 0.5rem;
}

.job-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1F2937;
}

.job-company {
  color: #6B7280;
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

.job-skills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.skill-tag {
  background: #DBEAFE;
  color: #1E40AF;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.section-footer {
  text-align: center;
}

/* How it Works */
.how-it-works {
  padding: 4rem 0;
  background: white;
}

.process-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4rem;
}

.process-section h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  color: #1F2937;
}

.process-steps {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.process-step {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #2563EB;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content h4 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1F2937;
}

.step-content p {
  color: #6B7280;
  line-height: 1.6;
}

/* Partner Companies */
.partner-companies {
  padding: 4rem 0;
  background: #F9FAFB;
}

.companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.company-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.company-item .company-logo {
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
}

.company-info h4 {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1F2937;
}

.company-info p {
  color: #6B7280;
  font-size: 0.875rem;
}

/* CTA Section */
.cta-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
  color: white;
}

.cta-content {
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .process-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .search-bar {
    flex-direction: column;
  }
  
  .search-input,
  .search-button {
    border-radius: 0.75rem;
  }
  
  .user-type-buttons {
    flex-direction: column;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .jobs-grid {
    grid-template-columns: 1fr;
  }
}
</style>

