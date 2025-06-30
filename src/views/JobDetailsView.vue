<template>
  <div class="job-details">
    <div class="job-header">
      <button @click="$router.go(-1)" class="back-button">
        ← Voltar
      </button>
      <div class="job-title-section">
        <h1>{{ job.title }}</h1>
        <p class="company-name">{{ job.company }}</p>
        <div class="job-meta">
          <span class="location">📍 {{ job.location }}</span>
          <span class="type">💼 {{ job.type }}</span>
          <span class="salary">💰 {{ job.salary }}</span>
        </div>
      </div>
    </div>

    <div class="job-content">
      <div class="main-content">
        <section class="job-description">
          <h2>Descrição da Vaga</h2>
          <div v-html="job.description"></div>
        </section>

        <section class="job-requirements">
          <h2>Requisitos</h2>
          <ul>
            <li v-for="requirement in job.requirements" :key="requirement">
              {{ requirement }}
            </li>
          </ul>
        </section>

        <section class="job-benefits">
          <h2>Benefícios</h2>
          <ul>
            <li v-for="benefit in job.benefits" :key="benefit">
              {{ benefit }}
            </li>
          </ul>
        </section>
      </div>

      <div class="sidebar">
        <div class="apply-section">
          <button @click="applyToJob" class="apply-button" :disabled="hasApplied">
            {{ hasApplied ? 'Candidatura Enviada' : 'Candidatar-se' }}
          </button>
          <button @click="saveJob" class="save-button" :class="{ saved: isSaved }">
            {{ isSaved ? '❤️ Salva' : '🤍 Salvar' }}
          </button>
        </div>

        <div class="company-info">
          <h3>Sobre a Empresa</h3>
          <div class="company-logo">
            <img :src="job.companyLogo" :alt="job.company" />
          </div>
          <p>{{ job.companyDescription }}</p>
          <div class="company-stats">
            <div class="stat">
              <span class="label">Funcionários:</span>
              <span class="value">{{ job.companySize }}</span>
            </div>
            <div class="stat">
              <span class="label">Setor:</span>
              <span class="value">{{ job.companySector }}</span>
            </div>
          </div>
        </div>

        <div class="similar-jobs">
          <h3>Vagas Similares</h3>
          <div v-for="similarJob in similarJobs" :key="similarJob.id" class="similar-job">
            <router-link :to="`/jobs/${similarJob.id}`">
              <h4>{{ similarJob.title }}</h4>
              <p>{{ similarJob.company }}</p>
              <span class="salary">{{ similarJob.salary }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const jobId = route.params.id

const job = ref({
  id: 1,
  title: 'Desenvolvedor Frontend Vue.js',
  company: 'TechCorp',
  location: 'São Paulo, SP',
  type: 'CLT',
  salary: 'R$ 8.000 - R$ 12.000',
  description: `
    <p>Estamos procurando um desenvolvedor frontend experiente em Vue.js para se juntar à nossa equipe de desenvolvimento.</p>
    <p>Você será responsável por desenvolver interfaces de usuário modernas e responsivas, trabalhando em colaboração com designers e desenvolvedores backend.</p>
  `,
  requirements: [
    'Experiência mínima de 3 anos com Vue.js',
    'Conhecimento em TypeScript',
    'Experiência com Vuex/Pinia',
    'Conhecimento em CSS/SCSS',
    'Experiência com testes unitários',
    'Conhecimento em Git'
  ],
  benefits: [
    'Plano de saúde e odontológico',
    'Vale refeição R$ 30/dia',
    'Home office flexível',
    'Auxílio educação',
    'Participação nos lucros',
    'Ambiente descontraído'
  ],
  companyLogo: '/api/placeholder/100/100',
  companyDescription: 'A TechCorp é uma empresa líder em soluções tecnológicas, focada em inovação e desenvolvimento de produtos digitais.',
  companySize: '200-500',
  companySector: 'Tecnologia'
})

const similarJobs = ref([
  { id: 2, title: 'Desenvolvedor React', company: 'StartupXYZ', salary: 'R$ 7.000 - R$ 10.000' },
  { id: 3, title: 'Frontend Developer', company: 'DigitalCorp', salary: 'R$ 9.000 - R$ 13.000' },
  { id: 4, title: 'Vue.js Developer', company: 'InnovaTech', salary: 'R$ 8.500 - R$ 11.500' }
])

const hasApplied = ref(false)
const isSaved = ref(false)

const applyToJob = () => {
  hasApplied.value = true
  // Aqui você implementaria a lógica de candidatura
  alert('Candidatura enviada com sucesso!')
}

const saveJob = () => {
  isSaved.value = !isSaved.value
  // Aqui você implementaria a lógica de salvar/remover vaga
}

onMounted(() => {
  // Aqui você carregaria os dados da vaga baseado no ID
  console.log('Carregando vaga:', jobId)
})
</script>

<style scoped>
.job-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.job-header {
  margin-bottom: 30px;
}

.back-button {
  background: none;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.job-title-section h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
}

.company-name {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 15px;
}

.job-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.job-meta span {
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.job-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.main-content section {
  margin-bottom: 30px;
}

.main-content h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.main-content ul {
  list-style: none;
  padding: 0;
}

.main-content li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.main-content li:before {
  content: "✓";
  color: #4CAF50;
  margin-right: 10px;
}

.sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.apply-section {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.apply-button {
  width: 100%;
  background: #4CAF50;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-bottom: 10px;
}

.apply-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.save-button {
  width: 100%;
  background: white;
  border: 2px solid #ddd;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
}

.save-button.saved {
  border-color: #ff4757;
  color: #ff4757;
}

.company-info {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.company-info h3 {
  margin-bottom: 15px;
}

.company-logo img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.company-stats {
  margin-top: 15px;
}

.stat {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.similar-jobs {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}

.similar-job {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.similar-job:last-child {
  border-bottom: none;
}

.similar-job a {
  text-decoration: none;
  color: inherit;
}

.similar-job h4 {
  margin-bottom: 5px;
  color: #333;
}

.similar-job p {
  color: #666;
  margin-bottom: 5px;
}

.similar-job .salary {
  color: #4CAF50;
  font-weight: bold;
}

@media (max-width: 768px) {
  .job-content {
    grid-template-columns: 1fr;
  }
  
  .job-title-section h1 {
    font-size: 2rem;
  }
  
  .job-meta {
    flex-direction: column;
    gap: 10px;
  }
}
</style>

