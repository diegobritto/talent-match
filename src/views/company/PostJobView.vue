<template>
  <div class="post-job-view">
    <div class="post-job-header">
      <h1>Publicar Nova Vaga</h1>
      <p>Preencha os detalhes da vaga para encontrar o talento ideal.</p>
    </div>

    <form @submit.prevent="submitJob" class="job-form">
      <div class="form-section">
        <h2>Informações Básicas</h2>
        <div class="form-group">
          <label for="job-title">Título da Vaga *</label>
          <input type="text" id="job-title" v-model="job.title" required placeholder="Ex: Desenvolvedor Frontend Sênior" />
        </div>

        <div class="form-group">
          <label for="company-name">Nome da Empresa *</label>
          <input type="text" id="company-name" v-model="job.company" required placeholder="Ex: Tech Innovations Ltda." />
        </div>

        <div class="form-group">
          <label for="location">Localização *</label>
          <input type="text" id="location" v-model="job.location" required placeholder="Ex: São Paulo, SP ou Remoto" />
        </div>

        <div class="form-group">
          <label for="job-type">Tipo de Contrato *</label>
          <select id="job-type" v-model="job.type" required>
            <option value="">Selecione o tipo</option>
            <option value="CLT">CLT</option>
            <option value="PJ">PJ</option>
            <option value="Estágio">Estágio</option>
            <option value="Temporário">Temporário</option>
          </select>
        </div>

        <div class="form-group">
          <label for="experience-level">Nível de Experiência *</label>
          <select id="experience-level" v-model="job.experienceLevel" required>
            <option value="">Selecione o nível</option>
            <option value="Estágio">Estágio</option>
            <option value="Júnior">Júnior</option>
            <option value="Pleno">Pleno</option>
            <option value="Sênior">Sênior</option>
            <option value="Especialista">Especialista</option>
          </select>
        </div>

        <div class="form-group">
          <label for="salary">Faixa Salarial (Opcional)</label>
          <input type="text" id="salary" v-model="job.salary" placeholder="Ex: R$ 5.000 - R$ 8.000 ou A combinar" />
        </div>
      </div>

      <div class="form-section">
        <h2>Descrição da Vaga</h2>
        <div class="form-group">
          <label for="description">Descrição Detalhada *</label>
          <textarea id="description" v-model="job.description" required rows="10" placeholder="Descreva as responsabilidades, o dia a dia e o que a empresa oferece..."></textarea>
        </div>
      </div>

      <div class="form-section">
        <h2>Requisitos e Qualificações</h2>
        <div class="form-group">
          <label for="requirements">Requisitos (um por linha) *</label>
          <textarea id="requirements" v-model="job.requirements" required rows="7" placeholder="Ex: Experiência com Vue.js\nConhecimento em APIs RESTful\nInglês avançado"></textarea>
        </div>
      </div>

      <div class="form-section">
        <h2>Benefícios (Opcional)</h2>
        <div class="form-group">
          <label for="benefits">Benefícios Oferecidos (um por linha)</label>
          <textarea id="benefits" v-model="job.benefits" rows="5" placeholder="Ex: Vale Refeição\nPlano de Saúde\nAuxílio Home Office"></textarea>
        </div>
      </div>

      <div class="form-section">
        <h2>Informações Adicionais</h2>
        <div class="form-group">
          <label for="company-description">Sobre a Empresa (Opcional)</label>
          <textarea id="company-description" v-model="job.companyDescription" rows="5" placeholder="Fale um pouco sobre a cultura da sua empresa, missão e valores."></textarea>
        </div>

        <div class="form-group">
          <label for="contact-email">E-mail para Contato *</label>
          <input type="email" id="contact-email" v-model="job.contactEmail" required placeholder="email@empresa.com" />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Publicando...' : 'Publicar Vaga' }}
        </button>
        <button type="button" @click="cancel" class="cancel-button">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const job = reactive({
  title: '',
  company: '',
  location: '',
  type: '',
  experienceLevel: '',
  salary: '',
  description: '',
  requirements: '',
  benefits: '',
  companyDescription: '',
  contactEmail: ''
})

const isSubmitting = ref(false)

const submitJob = async () => {
  isSubmitting.value = true
  // Simular envio da vaga para um backend
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('Vaga publicada com sucesso!')
    router.push('/company/dashboard') // Redirecionar para o dashboard após publicar
  } catch (error) {
    alert('Erro ao publicar vaga. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}

const cancel = () => {
  if (confirm('Tem certeza que deseja cancelar? As informações não salvas serão perdidas.')) {
    router.push('/company/dashboard')
  }
}
</script>

<style scoped>
.post-job-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.post-job-header {
  text-align: center;
  margin-bottom: 40px;
}

.post-job-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.post-job-header p {
  color: #666;
  font-size: 1.1rem;
}

.job-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.submit-button,
.cancel-button {
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button {
  background: #4CAF50;
  color: white;
}

.submit-button:hover:not(:disabled) {
  background: #45a049;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-button {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background: #e0e0e0;
}

@media (max-width: 768px) {
  .post-job-header h1 {
    font-size: 2rem;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

