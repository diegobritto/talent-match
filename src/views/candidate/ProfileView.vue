<template>
  <div class="candidate-layout">
    <CandidateSidebar />
    
    <main class="main-content">
      <div class="container">
        <!-- Header -->
        <div class="profile-header">
          <h1>Meu Perfil</h1>
          <p>Mantenha suas informações atualizadas para receber as melhores oportunidades</p>
        </div>

        <!-- Profile Form -->
        <form @submit.prevent="saveProfile" class="profile-form">
          <!-- Personal Information -->
          <div class="form-section">
            <div class="section-header">
              <h2>Informações Pessoais</h2>
              <span class="completion-badge" :class="{ complete: personalInfoComplete }">
                {{ personalInfoComplete ? 'Completo' : 'Incompleto' }}
              </span>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nome Completo *</label>
                <input 
                  v-model="profile.personalInfo.fullName"
                  type="text" 
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">E-mail *</label>
                <input 
                  v-model="profile.personalInfo.email"
                  type="email" 
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Telefone</label>
                <input 
                  v-model="profile.personalInfo.phone"
                  type="tel" 
                  class="form-input"
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Data de Nascimento</label>
                <input 
                  v-model="profile.personalInfo.birthDate"
                  type="date" 
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Cidade</label>
                <input 
                  v-model="profile.personalInfo.city"
                  type="text" 
                  class="form-input"
                  placeholder="São Paulo, SP"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">LinkedIn</label>
                <input 
                  v-model="profile.personalInfo.linkedin"
                  type="url" 
                  class="form-input"
                  placeholder="https://linkedin.com/in/seuperfil"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Resumo Profissional</label>
              <textarea 
                v-model="profile.personalInfo.summary"
                class="form-textarea"
                rows="4"
                placeholder="Descreva brevemente sua experiência e objetivos profissionais..."
              ></textarea>
            </div>
          </div>

          <!-- Professional Experience -->
          <div class="form-section">
            <div class="section-header">
              <h2>Experiência Profissional</h2>
              <button 
                type="button" 
                @click="addExperience" 
                class="btn btn-secondary btn-small"
              >
                + Adicionar Experiência
              </button>
            </div>
            
            <div 
              v-for="(experience, index) in profile.experiences" 
              :key="index"
              class="experience-item"
            >
              <div class="item-header">
                <h3>Experiência {{ index + 1 }}</h3>
                <button 
                  type="button" 
                  @click="removeExperience(index)"
                  class="remove-btn"
                >
                  ×
                </button>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Cargo *</label>
                  <input 
                    v-model="experience.position"
                    type="text" 
                    class="form-input"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Empresa *</label>
                  <input 
                    v-model="experience.company"
                    type="text" 
                    class="form-input"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Data de Início *</label>
                  <input 
                    v-model="experience.startDate"
                    type="month" 
                    class="form-input"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Data de Fim</label>
                  <input 
                    v-model="experience.endDate"
                    type="month" 
                    class="form-input"
                    :disabled="experience.current"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label class="checkbox-item">
                  <input 
                    type="checkbox" 
                    v-model="experience.current"
                    
                  />
                  Trabalho aqui atualmente
                </label>
              </div>
              
              <div class="form-group">
                <label class="form-label">Descrição das Atividades</label>
                <textarea 
                  v-model="experience.description"
                  class="form-textarea"
                  rows="3"
                  placeholder="Descreva suas principais responsabilidades e conquistas..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Education -->
          <div class="form-section">
            <div class="section-header">
              <h2>Formação Acadêmica</h2>
              <button 
                type="button" 
                @click="addEducation" 
                class="btn btn-secondary btn-small"
              >
                + Adicionar Formação
              </button>
            </div>
            
            <div 
              v-for="(education, index) in profile.education" 
              :key="index"
              class="education-item"
            >
              <div class="item-header">
                <h3>Formação {{ index + 1 }}</h3>
                <button 
                  type="button" 
                  @click="removeEducation(index)"
                  class="remove-btn"
                >
                  ×
                </button>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Curso *</label>
                  <input 
                    v-model="education.course"
                    type="text" 
                    class="form-input"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Instituição *</label>
                  <input 
                    v-model="education.institution"
                    type="text" 
                    class="form-input"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Nível</label>
                  <select v-model="education.level" class="form-select">
                    <option value="">Selecione</option>
                    <option value="tecnico">Técnico</option>
                    <option value="graduacao">Graduação</option>
                    <option value="pos-graduacao">Pós-graduação</option>
                    <option value="mestrado">Mestrado</option>
                    <option value="doutorado">Doutorado</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Ano de Conclusão</label>
                  <input 
                    v-model="education.year"
                    type="number" 
                    class="form-input"
                    min="1950"
                    :max="new Date().getFullYear() + 10"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Skills -->
          <div class="form-section">
            <div class="section-header">
              <h2>Habilidades e Competências</h2>
            </div>
            
            <div class="skills-section">
              <div class="form-group">
                <label class="form-label">Adicionar Habilidade</label>
                <div class="skill-input-group">
                  <input 
                    v-model="newSkill"
                    type="text" 
                    class="form-input"
                    placeholder="Digite uma habilidade..."
                    @keyup.enter="addSkill"
                  />
                  <button 
                    type="button" 
                    @click="addSkill"
                    class="btn btn-primary"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
              
              <div class="skills-list">
                <span 
                  v-for="(skill, index) in profile.skills" 
                  :key="index"
                  class="skill-tag"
                >
                  {{ skill }}
                  <button 
                    type="button" 
                    @click="removeSkill(index)"
                    class="skill-remove"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- Languages -->
          <div class="form-section">
            <div class="section-header">
              <h2>Idiomas</h2>
              <button 
                type="button" 
                @click="addLanguage" 
                class="btn btn-secondary btn-small"
              >
                + Adicionar Idioma
              </button>
            </div>
            
            <div 
              v-for="(language, index) in profile.languages" 
              :key="index"
              class="language-item"
            >
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Idioma</label>
                  <input 
                    v-model="language.name"
                    type="text" 
                    class="form-input"
                    placeholder="Ex: Inglês"
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Nível</label>
                  <select v-model="language.level" class="form-select">
                    <option value="">Selecione</option>
                    <option value="basico">Básico</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                    <option value="fluente">Fluente</option>
                    <option value="nativo">Nativo</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <button 
                    type="button" 
                    @click="removeLanguage(index)"
                    class="btn btn-danger btn-small"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-large" :disabled="saving">
              {{ saving ? 'Salvando...' : 'Salvar Perfil' }}
            </button>
            <button type="button" @click="resetForm" class="btn btn-secondary btn-large">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CandidateSidebar from '@/components/candidate/CandidateSidebar.vue'

const saving = ref(false)
const newSkill = ref('')

// Profile data
const profile = ref({
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    city: '',
    linkedin: '',
    summary: ''
  },
  experiences: [
    {
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
  ],
  education: [
    {
      course: '',
      institution: '',
      level: '',
      year: ''
    }
  ],
  skills: ['JavaScript', 'Vue.js', 'React', 'Node.js'],
  languages: [
    {
      name: 'Português',
      level: 'nativo'
    },
    {
      name: 'Inglês',
      level: 'intermediario'
    }
  ]
})

// Computed
const personalInfoComplete = computed(() => {
  const info = profile.value.personalInfo
  return !!(info.fullName && info.email && info.phone && info.city && info.summary)
})

// Methods
const addExperience = () => {
  profile.value.experiences.push({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  })
}

const removeExperience = (index: number) => {
  if (profile.value.experiences.length > 1) {
    profile.value.experiences.splice(index, 1)
  }
}

const addEducation = () => {
  profile.value.education.push({
    course: '',
    institution: '',
    level: '',
    year: ''
  })
}

const removeEducation = (index: number) => {
  if (profile.value.education.length > 1) {
    profile.value.education.splice(index, 1)
  }
}

const addSkill = () => {
  if (newSkill.value.trim() && !profile.value.skills.includes(newSkill.value.trim())) {
    profile.value.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (index: number) => {
  profile.value.skills.splice(index, 1)
}

const addLanguage = () => {
  profile.value.languages.push({
    name: '',
    level: ''
  })
}

const removeLanguage = (index: number) => {
  if (profile.value.languages.length > 1) {
    profile.value.languages.splice(index, 1)
  }
}

const saveProfile = async () => {
  saving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Save to localStorage (in a real app, send to API)
    localStorage.setItem('candidateProfile', JSON.stringify(profile.value))
    
    alert('Perfil salvo com sucesso!')
  } catch (error) {
    console.error('Error saving profile:', error)
    alert('Erro ao salvar perfil. Tente novamente.')
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  // Reset to saved data or initial state
  loadProfile()
}

const loadProfile = () => {
  const savedProfile = localStorage.getItem('candidateProfile')
  if (savedProfile) {
    profile.value = JSON.parse(savedProfile)
  } else {
    // Load user data from auth
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    if (userData.name) {
      profile.value.personalInfo.fullName = userData.name
    }
    if (userData.email) {
      profile.value.personalInfo.email = userData.email
    }
  }
}

// Initialize
onMounted(() => {
  loadProfile()
})
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
  max-width: 800px;
  margin: 0 auto;
}

/* Header */
.profile-header {
  margin-bottom: 2rem;
}

.profile-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 0.5rem;
}

.profile-header p {
  color: #6B7280;
  font-size: 1.125rem;
}

/* Form Sections */
.form-section {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E5E7EB;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
}

.completion-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #FEF3C7;
  color: #92400E;
}

.completion-badge.complete {
  background: #D1FAE5;
  color: #065F46;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* Experience/Education Items */
.experience-item,
.education-item {
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.item-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1F2937;
}

.remove-btn {
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #DC2626;
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

/* Skills Section */
.skills-section {
  margin-top: 1rem;
}

.skill-input-group {
  display: flex;
  gap: 0.5rem;
}

.skill-input-group .form-input {
  flex: 1;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.skill-tag {
  background: #DBEAFE;
  color: #1E40AF;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skill-remove {
  background: none;
  border: none;
  color: #1E40AF;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skill-remove:hover {
  color: #1D4ED8;
}

/* Languages */
.language-item {
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .skill-input-group {
    flex-direction: column;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>

