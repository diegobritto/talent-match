<template>
  <div class="candidate-profile-view">
    <div class="profile-header">
      <button @click="$router.go(-1)" class="back-button">
        ← Voltar
      </button>
      <div class="profile-summary">
        <img :src="candidate.avatar" :alt="candidate.name" class="profile-avatar" />
        <div class="profile-info">
          <h1>{{ candidate.name }}</h1>
          <p class="candidate-title">{{ candidate.title }}</p>
          <div class="candidate-meta">
            <span class="location">📍 {{ candidate.location }}</span>
            <span class="experience">👨‍💼 {{ candidate.experience }} de experiência</span>
            <span class="education">🎓 {{ candidate.education }}</span>
          </div>
          <div class="contact-links">
            <a :href="`mailto:${candidate.email}`" class="contact-link">📧 {{ candidate.email }}</a>
            <a :href="candidate.linkedin" target="_blank" class="contact-link" v-if="candidate.linkedin">🔗 LinkedIn</a>
            <a :href="candidate.portfolio" target="_blank" class="contact-link" v-if="candidate.portfolio">🌐 Portfólio</a>
          </div>
        </div>
        <div class="profile-actions">
          <button @click="scheduleInterview" class="action-button primary">Agendar Entrevista</button>
          <button @click="sendFeedback" class="action-button secondary">Enviar Feedback</button>
          <button @click="downloadResume" class="action-button tertiary">Baixar CV</button>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <div class="main-content">
        <section class="about-section">
          <h2>Sobre</h2>
          <p>{{ candidate.about }}</p>
        </section>

        <section class="experience-section">
          <h2>Experiência Profissional</h2>
          <div v-for="exp in candidate.workExperience" :key="exp.id" class="experience-item">
            <h3>{{ exp.title }}</h3>
            <p class="company-duration">{{ exp.company }} | {{ exp.duration }}</p>
            <p>{{ exp.description }}</p>
          </div>
        </section>

        <section class="education-section">
          <h2>Formação Acadêmica</h2>
          <div v-for="edu in candidate.educationHistory" :key="edu.id" class="education-item">
            <h3>{{ edu.degree }}</h3>
            <p class="institution-year">{{ edu.institution }} | {{ edu.year }}</p>
          </div>
        </section>

        <section class="skills-section">
          <h2>Habilidades</h2>
          <div class="skills-grid">
            <span v-for="skill in candidate.skills" :key="skill" class="skill-tag">{{ skill }}</span>
          </div>
        </section>

        <section class="languages-section">
          <h2>Idiomas</h2>
          <div class="languages-list">
            <span v-for="lang in candidate.languages" :key="lang.name" class="language-item">
              {{ lang.name }} ({{ lang.level }})
            </span>
          </div>
        </section>

        <section class="projects-section" v-if="candidate.projects && candidate.projects.length > 0">
          <h2>Projetos</h2>
          <div v-for="project in candidate.projects" :key="project.id" class="project-item">
            <h3>{{ project.name }}</h3>
            <p class="project-description">{{ project.description }}</p>
            <a :href="project.link" target="_blank" class="project-link" v-if="project.link">Ver Projeto</a>
          </div>
        </section>
      </div>

      <div class="sidebar">
        <div class="widget">
          <h3>Compatibilidade com a Vaga</h3>
          <div class="compatibility-score">
            <div class="score-circle" :style="{ background: `conic-gradient(#4CAF50 ${compatibilityScore}%, #eee 0%)` }">
              <span>{{ compatibilityScore }}%</span>
            </div>
            <p>Baseado em habilidades e experiência.</p>
          </div>
        </div>

        <div class="widget">
          <h3>Status da Candidatura</h3>
          <div class="application-status">
            <span class="status-badge" :class="candidate.applicationStatus">
              {{ getStatusText(candidate.applicationStatus) }}
            </span>
            <p>Última atualização: {{ formatDate(candidate.lastStatusUpdate) }}</p>
            <button @click="openStatusModal" class="action-button primary small">Atualizar Status</button>
          </div>
        </div>

        <div class="widget">
          <h3>Notas Internas</h3>
          <textarea v-model="internalNotes" placeholder="Adicione notas sobre este candidato..." rows="6"></textarea>
          <button @click="saveNotes" class="action-button primary small">Salvar Notas</button>
        </div>
      </div>
    </div>

    <!-- Modal de Atualização de Status -->
    <div v-if="isStatusModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2>Atualizar Status da Candidatura</h2>
        <p>Candidato: <strong>{{ candidate.name }}</strong></p>
        
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
          <button @click="updateApplicationStatus" class="action-button primary">Salvar</button>
          <button @click="closeStatusModal" class="action-button secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const candidateId = route.params.id

interface Candidate {
  id: number
  name: string
  title: string
  avatar: string
  location: string
  experience: string
  education: string
  email: string
  linkedin?: string
  portfolio?: string
  about: string
  workExperience: Array<{ id: number; title: string; company: string; duration: string; description: string }>
  educationHistory: Array<{ id: number; degree: string; institution: string; year: string }>
  skills: string[]
  languages: Array<{ name: string; level: string }>
  projects?: Array<{ id: number; name: string; description: string; link?: string }>
  applicationStatus: 'pending' | 'reviewing' | 'interview' | 'approved' | 'rejected'
  lastStatusUpdate: string
}

const candidate = reactive<Candidate>({
  id: 1,
  name: 'João Silva',
  title: 'Desenvolvedor Frontend',
  avatar: '/api/placeholder/100/100',
  location: 'São Paulo, SP',
  experience: '5 anos',
  education: 'Engenharia de Software - USP',
  email: 'joao.silva@example.com',
  linkedin: 'https://linkedin.com/in/joaosilva',
  portfolio: 'https://joaosilva.dev',
  about: 'Desenvolvedor frontend apaixonado por criar interfaces de usuário intuitivas e responsivas. Experiência sólida com Vue.js, React e TypeScript. Busco desafios que me permitam crescer e aplicar minhas habilidades para resolver problemas complexos.',
  workExperience: [
    {
      id: 1,
      title: 'Desenvolvedor Frontend Sênior',
      company: 'Tech Solutions',
      duration: 'Jan 2022 - Presente',
      description: 'Liderança no desenvolvimento de novas funcionalidades e manutenção de aplicações web utilizando Vue.js e TypeScript. Otimização de performance e refatoração de código legado.'
    },
    {
      id: 2,
      title: 'Desenvolvedor Frontend Pleno',
      company: 'Web Innovators',
      duration: 'Fev 2019 - Dez 2021',
      description: 'Desenvolvimento de componentes reutilizáveis em React e integração com APIs RESTful. Participação ativa em code reviews e planejamento de sprints.'
    }
  ],
  educationHistory: [
    {
      id: 1,
      degree: 'Bacharelado em Engenharia de Software',
      institution: 'Universidade de São Paulo (USP)',
      year: '2018'
    },
    {
      id: 2,
      degree: 'Técnico em Desenvolvimento de Sistemas',
      institution: 'ETEC',
      year: '2014'
    }
  ],
  skills: [
    'Vue.js',
    'React',
    'TypeScript',
    'JavaScript',
    'HTML5',
    'CSS3',
    'Sass',
    'Git',
    'RESTful APIs',
    'UX/UI Principles',
    'Jest',
    'Cypress'
  ],
  languages: [
    { name: 'Português', level: 'Nativo' },
    { name: 'Inglês', level: 'Avançado' },
    { name: 'Espanhol', level: 'Intermediário' }
  ],
  projects: [
    {
      id: 1,
      name: 'Plataforma E-commerce XYZ',
      description: 'Desenvolvimento do frontend de uma plataforma de e-commerce escalável, com foco em performance e experiência do usuário.',
      link: 'https://example.com/project-xyz'
    },
    {
      id: 2,
      name: 'Sistema de Gerenciamento de Tarefas',
      description: 'Criação de um sistema interno para gerenciamento de tarefas, utilizando Vue.js e Pinia para gerenciamento de estado.'
    }
  ],
  applicationStatus: 'interview',
  lastStatusUpdate: '2024-01-25'
})

const compatibilityScore = ref(85) // Exemplo de score de compatibilidade
const internalNotes = ref('Candidato com excelente experiência em Vue.js e bom fit cultural. Agendar entrevista técnica.')

const isStatusModalOpen = ref(false)
const newStatus = ref<Candidate['applicationStatus']>('pending')
const feedback = ref<string>('')

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

const scheduleInterview = () => {
  alert('Funcionalidade de agendar entrevista (a ser implementada)')
}

const sendFeedback = () => {
  alert('Funcionalidade de enviar feedback (a ser implementada)')
}

const downloadResume = () => {
  alert('Funcionalidade de baixar CV (a ser implementada)')
}

const saveNotes = () => {
  alert('Notas salvas: ' + internalNotes.value)
  // Aqui você enviaria as notas para o backend
}

const openStatusModal = () => {
  newStatus.value = candidate.applicationStatus
  feedback.value = '' // Limpar feedback anterior ao abrir
  isStatusModalOpen.value = true
}

const closeStatusModal = () => {
  isStatusModalOpen.value = false
}

const updateApplicationStatus = () => {
  candidate.applicationStatus = newStatus.value
  candidate.lastStatusUpdate = new Date().toISOString().split('T')[0]
  alert(`Status da candidatura atualizado para ${getStatusText(newStatus.value)}`)
  // Aqui você enviaria a atualização para o backend
  closeStatusModal()
}

onMounted(() => {
  // Carregar dados do candidato baseado no candidateId
  console.log('Carregando perfil do candidato:', candidateId)
})
</script>

<style scoped>
.candidate-profile-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  margin-bottom: 40px;
}

.back-button {
  background: none;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.profile-summary {
  display: flex;
  align-items: center;
  gap: 30px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  flex-wrap: wrap;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #4CAF50;
  flex-shrink: 0;
}

.profile-info {
  flex-grow: 1;
}

.profile-info h1 {
  font-size: 2.8rem;
  color: #333;
  margin-bottom: 5px;
}

.candidate-title {
  font-size: 1.4rem;
  color: #555;
  margin-bottom: 15px;
}

.candidate-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.candidate-meta span {
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #444;
}

.contact-links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.contact-link {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.contact-link:hover {
  text-decoration: underline;
}

.profile-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-left: auto; /* Empurra para a direita */
}

.action-button {
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button.primary {
  background: #4CAF50;
  color: white;
}

.action-button.secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.action-button.tertiary {
  background: #007bff;
  color: white;
}

.action-button:hover {
  opacity: 0.9;
}

.profile-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.main-content section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 25px;
}

.main-content h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.8rem;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.about-section p {
  line-height: 1.6;
  color: #555;
}

.experience-item,
.education-item,
.project-item {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #eee;
}

.experience-item:last-child,
.education-item:last-child,
.project-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.experience-item h3,
.education-item h3,
.project-item h3 {
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 5px;
}

.company-duration,
.institution-year {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 10px;
}

.experience-item p {
  color: #555;
  line-height: 1.5;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.languages-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.language-item {
  background: #f0f4c3;
  color: #689f38;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.project-description {
  color: #555;
  line-height: 1.5;
  margin-bottom: 10px;
}

.project-link {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
}

.project-link:hover {
  text-decoration: underline;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.widget {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.widget h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.compatibility-score {
  text-align: center;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.2rem;
  font-weight: bold;
  color: #4CAF50;
  margin: 0 auto 15px;
  position: relative;
}

.score-circle span {
  z-index: 1;
}

.compatibility-score p {
  color: #666;
  font-size: 0.9rem;
}

.application-status {
  text-align: center;
}

.status-badge {
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 10px;
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

.application-status p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.action-button.small {
  padding: 8px 15px;
  font-size: 0.9rem;
}

.widget textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 10px;
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

@media (max-width: 1024px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-summary {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-info {
    text-align: center;
  }
  
  .profile-actions {
    justify-content: center;
    width: 100%;
  }
  
  .candidate-meta,
  .contact-links {
    justify-content: center;
  }
  
  .main-content section {
    padding: 20px;
  }
  
  .widget {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .profile-info h1 {
    font-size: 2.2rem;
  }
  
  .candidate-title {
    font-size: 1.2rem;
  }
  
  .action-button {
    width: 100%;
  }
}
</style>

