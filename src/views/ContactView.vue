<template>
  <div class="contact-page">
    <div class="contact-header">
      <h1>Entre em Contato</h1>
      <p>Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo.</p>
    </div>

    <div class="contact-content">
      <div class="contact-form-section">
        <h2>Envie uma Mensagem</h2>
        <form @submit.prevent="submitForm" class="contact-form">
          <div class="form-group">
            <label for="name">Nome Completo *</label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              required
              placeholder="Seu nome completo"
            />
          </div>

          <div class="form-group">
            <label for="email">E-mail *</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              required
              placeholder="seu@email.com"
            />
          </div>

          <div class="form-group">
            <label for="phone">Telefone</label>
            <input
              type="tel"
              id="phone"
              v-model="form.phone"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div class="form-group">
            <label for="subject">Assunto *</label>
            <select id="subject" v-model="form.subject" required>
              <option value="">Selecione um assunto</option>
              <option value="support">Suporte Técnico</option>
              <option value="candidate">Dúvidas de Candidato</option>
              <option value="company">Dúvidas de Empresa</option>
              <option value="partnership">Parcerias</option>
              <option value="feedback">Feedback</option>
              <option value="other">Outros</option>
            </select>
          </div>

          <div class="form-group">
            <label for="message">Mensagem *</label>
            <textarea
              id="message"
              v-model="form.message"
              required
              rows="6"
              placeholder="Descreva sua dúvida ou mensagem..."
            ></textarea>
          </div>

          <button type="submit" class="submit-button" :disabled="isSubmitting">
            {{ isSubmitting ? 'Enviando...' : 'Enviar Mensagem' }}
          </button>
        </form>
      </div>

      <div class="contact-info-section">
        <h2>Informações de Contato</h2>
        
        <div class="contact-info">
          <div class="info-item">
            <div class="icon">📧</div>
            <div class="details">
              <h3>E-mail</h3>
              <p>contato@talentmatch.com</p>
              <p>suporte@talentmatch.com</p>
            </div>
          </div>

          <div class="info-item">
            <div class="icon">📞</div>
            <div class="details">
              <h3>Telefone</h3>
              <p>(11) 3000-0000</p>
              <p>Segunda a Sexta: 9h às 18h</p>
            </div>
          </div>

          <div class="info-item">
            <div class="icon">📍</div>
            <div class="details">
              <h3>Endereço</h3>
              <p>Av. Paulista, 1000</p>
              <p>São Paulo, SP - 01310-100</p>
            </div>
          </div>

          <div class="info-item">
            <div class="icon">🕒</div>
            <div class="details">
              <h3>Horário de Atendimento</h3>
              <p>Segunda a Sexta: 9h às 18h</p>
              <p>Sábado: 9h às 12h</p>
            </div>
          </div>
        </div>

        <div class="social-media">
          <h3>Redes Sociais</h3>
          <div class="social-links">
            <a href="#" class="social-link">
              <span class="icon">📘</span>
              Facebook
            </a>
            <a href="#" class="social-link">
              <span class="icon">📷</span>
              Instagram
            </a>
            <a href="#" class="social-link">
              <span class="icon">💼</span>
              LinkedIn
            </a>
            <a href="#" class="social-link">
              <span class="icon">🐦</span>
              Twitter
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="faq-section">
      <h2>Perguntas Frequentes</h2>
      <div class="faq-list">
        <div v-for="faq in faqs" :key="faq.id" class="faq-item">
          <button @click="toggleFaq(faq.id)" class="faq-question">
            {{ faq.question }}
            <span class="faq-icon">{{ openFaqs.includes(faq.id) ? '−' : '+' }}</span>
          </button>
          <div v-show="openFaqs.includes(faq.id)" class="faq-answer">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const openFaqs = ref<number[]>([])

const faqs = ref([
  {
    id: 1,
    question: 'Como posso criar uma conta no TalentMatch?',
    answer: 'Você pode criar uma conta clicando no botão "Cadastrar" no topo da página e preenchendo suas informações básicas.'
  },
  {
    id: 2,
    question: 'É gratuito para candidatos?',
    answer: 'Sim! O TalentMatch é completamente gratuito para candidatos. Você pode buscar vagas, se candidatar e gerenciar seu perfil sem nenhum custo.'
  },
  {
    id: 3,
    question: 'Como as empresas podem publicar vagas?',
    answer: 'Empresas podem criar uma conta empresarial e acessar o painel de controle para publicar vagas, gerenciar candidaturas e encontrar talentos.'
  },
  {
    id: 4,
    question: 'Posso editar meu perfil depois de criado?',
    answer: 'Sim! Você pode editar seu perfil a qualquer momento através do painel do candidato, atualizando suas informações, experiências e habilidades.'
  },
  {
    id: 5,
    question: 'Como recebo notificações sobre vagas?',
    answer: 'Você pode configurar suas preferências de notificação no seu perfil para receber alertas sobre vagas que correspondem ao seu perfil.'
  }
])

const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Simular envio do formulário
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
    
    // Limpar formulário
    Object.keys(form).forEach(key => {
      form[key as keyof typeof form] = ''
    })
  } catch (error) {
    alert('Erro ao enviar mensagem. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}

const toggleFaq = (id: number) => {
  const index = openFaqs.value.indexOf(id)
  if (index > -1) {
    openFaqs.value.splice(index, 1)
  } else {
    openFaqs.value.push(id)
  }
}
</script>

<style scoped>
.contact-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.contact-header {
  text-align: center;
  margin-bottom: 50px;
}

.contact-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 15px;
}

.contact-header p {
  font-size: 1.1rem;
  color: #666;
}

.contact-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 50px;
  margin-bottom: 50px;
}

.contact-form-section h2,
.contact-info-section h2 {
  color: #333;
  margin-bottom: 25px;
  font-size: 1.8rem;
}

.contact-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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

.submit-button {
  width: 100%;
  background: #4CAF50;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover:not(:disabled) {
  background: #45a049;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.contact-info {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.info-item .icon {
  font-size: 1.5rem;
  margin-right: 15px;
  margin-top: 5px;
}

.info-item h3 {
  color: #333;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.info-item p {
  color: #666;
  margin-bottom: 4px;
}

.social-media {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.social-media h3 {
  color: #333;
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.social-link {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
}

.social-link:hover {
  border-color: #4CAF50;
  background: #f9f9f9;
}

.social-link .icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

.faq-section {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.faq-section h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 1.8rem;
  text-align: center;
}

.faq-item {
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.faq-question {
  width: 100%;
  background: none;
  border: none;
  padding: 20px 0;
  text-align: left;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-question:hover {
  color: #4CAF50;
}

.faq-icon {
  font-size: 1.5rem;
  color: #4CAF50;
}

.faq-answer {
  padding: 0 0 20px 0;
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .contact-header h1 {
    font-size: 2rem;
  }
  
  .contact-form,
  .contact-info,
  .social-media,
  .faq-section {
    padding: 20px;
  }
  
  .social-links {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
}
</style>

