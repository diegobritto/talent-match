<template>
  <div class="company-profile-view">
    <div class="profile-header">
      <h1>Perfil da Empresa</h1>
      <p>Gerencie as informações da sua empresa e como ela aparece para os candidatos.</p>
    </div>

    <form @submit.prevent="saveProfile" class="profile-form">
      <div class="form-section">
        <h2>Informações Gerais</h2>
        <div class="form-group">
          <label for="company-name">Nome da Empresa *</label>
          <input type="text" id="company-name" v-model="company.name" required placeholder="Nome completo da sua empresa" />
        </div>

        <div class="form-group">
          <label for="company-slogan">Slogan / Frase de Efeito</label>
          <input type="text" id="company-slogan" v-model="company.slogan" placeholder="Ex: Inovação que transforma o futuro" />
        </div>

        <div class="form-group">
          <label for="company-website">Website *</label>
          <input type="url" id="company-website" v-model="company.website" required placeholder="https://www.suaempresa.com" />
        </div>

        <div class="form-group">
          <label for="company-industry">Setor / Indústria *</label>
          <input type="text" id="company-industry" v-model="company.industry" required placeholder="Ex: Tecnologia, Saúde, Finanças" />
        </div>

        <div class="form-group">
          <label for="company-size">Porte da Empresa *</label>
          <select id="company-size" v-model="company.size" required>
            <option value="">Selecione o porte</option>
            <option value="1-10">1-10 funcionários</option>
            <option value="11-50">11-50 funcionários</option>
            <option value="51-200">51-200 funcionários</option>
            <option value="201-500">201-500 funcionários</option>
            <option value="501-1000">501-1000 funcionários</option>
            <option value="1000+">Mais de 1000 funcionários</option>
          </select>
        </div>
      </div>

      <div class="form-section">
        <h2>Sobre a Empresa</h2>
        <div class="form-group">
          <label for="company-description">Descrição Detalhada *</label>
          <textarea id="company-description" v-model="company.description" required rows="10" placeholder="Fale sobre a história da sua empresa, missão, valores, cultura e o que a torna um ótimo lugar para trabalhar."></textarea>
        </div>

        <div class="form-group">
          <label for="company-mission">Missão</label>
          <textarea id="company-mission" v-model="company.mission" rows="4" placeholder="Nossa missão é..."></textarea>
        </div>

        <div class="form-group">
          <label for="company-values">Valores (um por linha)</label>
          <textarea id="company-values" v-model="company.values" rows="5" placeholder="Ex: Inovação\nColaboração\nIntegridade"></textarea>
        </div>
      </div>

      <div class="form-section">
        <h2>Contato e Localização</h2>
        <div class="form-group">
          <label for="company-email">E-mail de Contato *</label>
          <input type="email" id="company-email" v-model="company.email" required placeholder="contato@suaempresa.com" />
        </div>

        <div class="form-group">
          <label for="company-phone">Telefone</label>
          <input type="tel" id="company-phone" v-model="company.phone" placeholder="(XX) XXXX-XXXX" />
        </div>

        <div class="form-group">
          <label for="company-address">Endereço Principal</label>
          <input type="text" id="company-address" v-model="company.address" placeholder="Rua, Número, Bairro" />
        </div>

        <div class="form-group">
          <label for="company-city">Cidade *</label>
          <input type="text" id="company-city" v-model="company.city" required placeholder="Ex: São Paulo" />
        </div>

        <div class="form-group">
          <label for="company-state">Estado *</label>
          <input type="text" id="company-state" v-model="company.state" required placeholder="Ex: SP" />
        </div>

        <div class="form-group">
          <label for="company-zip">CEP</label>
          <input type="text" id="company-zip" v-model="company.zipCode" placeholder="Ex: 00000-000" />
        </div>
      </div>

      <div class="form-section">
        <h2>Mídias Sociais</h2>
        <div class="form-group">
          <label for="social-linkedin">LinkedIn URL</label>
          <input type="url" id="social-linkedin" v-model="company.social.linkedin" placeholder="https://linkedin.com/company/suaempresa" />
        </div>
        <div class="form-group">
          <label for="social-facebook">Facebook URL</label>
          <input type="url" id="social-facebook" v-model="company.social.facebook" placeholder="https://facebook.com/suaempresa" />
        </div>
        <div class="form-group">
          <label for="social-instagram">Instagram URL</label>
          <input type="url" id="social-instagram" v-model="company.social.instagram" placeholder="https://instagram.com/suaempresa" />
        </div>
        <div class="form-group">
          <label for="social-twitter">Twitter URL</label>
          <input type="url" id="social-twitter" v-model="company.social.twitter" placeholder="https://twitter.com/suaempresa" />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Salvando...' : 'Salvar Perfil' }}
        </button>
        <button type="button" @click="cancel" class="cancel-button">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface CompanyProfile {
  name: string
  slogan: string
  website: string
  industry: string
  size: string
  description: string
  mission: string
  values: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  social: {
    linkedin: string
    facebook: string
    instagram: string
    twitter: string
  }
}

const company = reactive<CompanyProfile>({
  name: 'Tech Innovations Ltda.',
  slogan: 'Inovação que transforma o futuro',
  website: 'https://www.techinnovations.com',
  industry: 'Tecnologia',
  size: '51-200',
  description: 'A Tech Innovations é uma empresa líder no desenvolvimento de soluções de software inovadoras para o mercado global. Nosso foco é em inteligência artificial, big data e computação em nuvem. Valorizamos a criatividade, a colaboração e o impacto positivo na sociedade.',
  mission: 'Empoderar empresas com tecnologia de ponta para impulsionar o crescimento e a eficiência.',
  values: 'Inovação\nColaboração\nIntegridade\nExcelência\nFoco no Cliente',
  email: 'contato@techinnovations.com',
  phone: '(11) 98765-4321',
  address: 'Av. Engenheiro Luís Carlos Berrini, 1500',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '04571-010',
  social: {
    linkedin: 'https://linkedin.com/company/techinnovations',
    facebook: 'https://facebook.com/techinnovations',
    instagram: 'https://instagram.com/techinnovations',
    twitter: 'https://twitter.com/techinnovations'
  }
})

const isSubmitting = ref(false)

const saveProfile = async () => {
  isSubmitting.value = true
  try {
    // Simular envio dos dados para um backend
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('Perfil da empresa salvo com sucesso!')
    // Opcional: redirecionar ou atualizar a página
  } catch (error) {
    alert('Erro ao salvar perfil. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}

const cancel = () => {
  if (confirm('Tem certeza que deseja cancelar? As alterações não salvas serão perdidas.')) {
    router.go(-1) // Volta para a página anterior
  }
}

onMounted(() => {
  // Carregar dados do perfil da empresa (se existirem)
  console.log('Carregando perfil da empresa...')
})
</script>

<style scoped>
.company-profile-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.profile-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.profile-header p {
  color: #666;
  font-size: 1.1rem;
}

.profile-form {
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
  .profile-header h1 {
    font-size: 2rem;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

