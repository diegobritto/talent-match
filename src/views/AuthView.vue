<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-container">
        <!-- Login Section -->
        <div class="auth-section">
          <div class="auth-card">
            <h2>Entrar</h2>
            <p class="auth-subtitle">Acesse sua conta para continuar</p>
            
            <form @submit.prevent="handleLogin" class="auth-form">
              <div class="form-group">
                <label class="form-label">E-mail</label>
                <input 
                  v-model="loginForm.email"
                  type="email" 
                  placeholder="seu@email.com"
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Senha</label>
                <input 
                  v-model="loginForm.password"
                  type="password" 
                  placeholder="Sua senha"
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-options">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="loginForm.rememberMe" />
                  Lembrar de mim
                </label>
                <a href="#" @click.prevent="showForgotPassword = true" class="forgot-link">
                  Esqueci minha senha
                </a>
              </div>
              
              <button type="submit" class="btn btn-primary w-full" :disabled="loginLoading">
                {{ loginLoading ? 'Entrando...' : 'Entrar' }}
              </button>
            </form>
            
            <div class="auth-divider">
              <span>ou continue com</span>
            </div>
            
            <div class="social-buttons">
              <button @click="loginWithGoogle" class="btn btn-secondary social-btn">
                📧 Google
              </button>
              <button @click="loginWithLinkedIn" class="btn btn-secondary social-btn">
                🔗 LinkedIn
              </button>
            </div>
          </div>
        </div>

        <!-- Register Section -->
        <div class="auth-section">
          <div class="auth-card">
            <h2>Cadastrar</h2>
            <p class="auth-subtitle">Crie sua conta gratuitamente</p>
            
            <!-- User Type Selection -->
            <div class="user-type-selection">
              <label class="form-label">Eu sou:</label>
              <div class="user-type-options">
                <label class="user-type-option" :class="{ active: registerForm.userType === 'candidate' }">
                  <input 
                    type="radio" 
                    value="candidate" 
                    v-model="registerForm.userType"
                  />
                  <div class="option-content">
                    <div class="option-icon">👤</div>
                    <div class="option-text">
                      <strong>Candidato</strong>
                      <span>Procuro emprego</span>
                    </div>
                  </div>
                </label>
                
                <label class="user-type-option" :class="{ active: registerForm.userType === 'company' }">
                  <input 
                    type="radio" 
                    value="company" 
                    v-model="registerForm.userType"
                  />
                  <div class="option-content">
                    <div class="option-icon">🏢</div>
                    <div class="option-text">
                      <strong>Empresa</strong>
                      <span>Busco talentos</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            <form @submit.prevent="handleRegister" class="auth-form">
              <div class="form-group">
                <label class="form-label">
                  {{ registerForm.userType === 'company' ? 'Nome da Empresa' : 'Nome Completo' }}
                </label>
                <input 
                  v-model="registerForm.name"
                  type="text" 
                  :placeholder="registerForm.userType === 'company' ? 'Nome da sua empresa' : 'Seu nome completo'"
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">E-mail</label>
                <input 
                  v-model="registerForm.email"
                  type="email" 
                  placeholder="seu@email.com"
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Senha</label>
                <input 
                  v-model="registerForm.password"
                  type="password" 
                  placeholder="Mínimo 8 caracteres"
                  class="form-input"
                  minlength="8"
                  required
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Confirmar Senha</label>
                <input 
                  v-model="registerForm.confirmPassword"
                  type="password" 
                  placeholder="Confirme sua senha"
                  class="form-input"
                  required
                />
                <div v-if="passwordMismatch" class="error-message">
                  As senhas não coincidem
                </div>
              </div>
              
              <div class="form-group">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="registerForm.acceptTerms" required />
                  Concordo com os 
                  <a href="#" @click.prevent="showTerms = true">Termos de Uso</a> 
                  e 
                  <a href="#" @click.prevent="showPrivacy = true">Política de Privacidade</a>
                </label>
              </div>
              
              <button 
                type="submit" 
                class="btn btn-primary w-full" 
                :disabled="registerLoading || passwordMismatch || !registerForm.acceptTerms"
              >
                {{ registerLoading ? 'Criando conta...' : 'Criar Conta' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="modal-overlay" @click="showForgotPassword = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Recuperar Senha</h3>
          <button @click="showForgotPassword = false" class="close-button">×</button>
        </div>
        <div class="modal-body">
          <p>Digite seu e-mail para receber as instruções de recuperação de senha:</p>
          <form @submit.prevent="handleForgotPassword">
            <div class="form-group">
              <input 
                v-model="forgotPasswordEmail"
                type="email" 
                placeholder="seu@email.com"
                class="form-input"
                required
              />
            </div>
            <div class="modal-actions">
              <button type="button" @click="showForgotPassword = false" class="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Terms Modal -->
    <div v-if="showTerms" class="modal-overlay" @click="showTerms = false">
      <div class="modal large" @click.stop>
        <div class="modal-header">
          <h3>Termos de Uso</h3>
          <button @click="showTerms = false" class="close-button">×</button>
        </div>
        <div class="modal-body">
          <div class="terms-content">
            <h4>1. Aceitação dos Termos</h4>
            <p>Ao utilizar a plataforma TalentMatch, você concorda com estes termos de uso.</p>
            
            <h4>2. Uso da Plataforma</h4>
            <p>A plataforma destina-se exclusivamente para fins de recrutamento e busca de emprego.</p>
            
            <h4>3. Responsabilidades do Usuário</h4>
            <p>Os usuários são responsáveis pela veracidade das informações fornecidas.</p>
            
            <h4>4. Privacidade</h4>
            <p>Respeitamos sua privacidade conforme nossa Política de Privacidade.</p>
          </div>
          <div class="modal-actions">
            <button @click="showTerms = false" class="btn btn-primary">
              Entendi
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Privacy Modal -->
    <div v-if="showPrivacy" class="modal-overlay" @click="showPrivacy = false">
      <div class="modal large" @click.stop>
        <div class="modal-header">
          <h3>Política de Privacidade</h3>
          <button @click="showPrivacy = false" class="close-button">×</button>
        </div>
        <div class="modal-body">
          <div class="terms-content">
            <h4>1. Coleta de Dados</h4>
            <p>Coletamos apenas os dados necessários para o funcionamento da plataforma.</p>
            
            <h4>2. Uso dos Dados</h4>
            <p>Seus dados são utilizados exclusivamente para conectar candidatos e empresas.</p>
            
            <h4>3. Compartilhamento</h4>
            <p>Não compartilhamos seus dados com terceiros sem seu consentimento.</p>
            
            <h4>4. Segurança</h4>
            <p>Utilizamos as melhores práticas de segurança para proteger seus dados.</p>
          </div>
          <div class="modal-actions">
            <button @click="showPrivacy = false" class="btn btn-primary">
              Entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Reactive data
const loginLoading = ref(false)
const registerLoading = ref(false)
const showForgotPassword = ref(false)
const showTerms = ref(false)
const showPrivacy = ref(false)
const forgotPasswordEmail = ref('')

// Forms
const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false
})

const registerForm = ref({
  userType: 'candidate',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

// Computed
const passwordMismatch = computed(() => {
  return registerForm.value.password !== registerForm.value.confirmPassword && 
         registerForm.value.confirmPassword.length > 0
})

// Methods
const handleLogin = async () => {
  loginLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication
    const userData = {
      email: loginForm.value.email,
      userType: loginForm.value.email.includes('empresa') ? 'company' : 'candidate'
    }
    
    // Store user data (in a real app, use Pinia store)
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Redirect based on user type
    if (userData.userType === 'company') {
      router.push('/company/dashboard')
    } else {
      router.push('/candidate/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('Erro ao fazer login. Tente novamente.')
  } finally {
    loginLoading.value = false
  }
}

const handleRegister = async () => {
  if (passwordMismatch.value) return
  
  registerLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock registration
    const userData = {
      email: registerForm.value.email,
      name: registerForm.value.name,
      userType: registerForm.value.userType
    }
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Redirect based on user type
    if (registerForm.value.userType === 'company') {
      router.push('/company/dashboard')
    } else {
      router.push('/candidate/dashboard')
    }
  } catch (error) {
    console.error('Register error:', error)
    alert('Erro ao criar conta. Tente novamente.')
  } finally {
    registerLoading.value = false
  }
}

const handleForgotPassword = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Instruções de recuperação enviadas para seu e-mail!')
    showForgotPassword.value = false
    forgotPasswordEmail.value = ''
  } catch (error) {
    console.error('Forgot password error:', error)
    alert('Erro ao enviar e-mail. Tente novamente.')
  }
}

const loginWithGoogle = () => {
  alert('Login com Google será implementado em breve!')
}

const loginWithLinkedIn = () => {
  alert('Login com LinkedIn será implementado em breve!')
}

// Initialize user type from URL query
onMounted(() => {
  if (route.query.type === 'company') {
    registerForm.value.userType = 'company'
  }
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
}

.auth-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  background: white;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-card h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1F2937;
  text-align: center;
}

.auth-subtitle {
  color: #6B7280;
  text-align: center;
  margin-bottom: 2rem;
}

.auth-form {
  margin-bottom: 1.5rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #6B7280;
  font-size: 0.875rem;
}

.checkbox-item input {
  margin: 0;
}

.checkbox-item a {
  color: #2563EB;
  text-decoration: none;
}

.checkbox-item a:hover {
  text-decoration: underline;
}

.forgot-link {
  color: #2563EB;
  text-decoration: none;
  font-size: 0.875rem;
}

.forgot-link:hover {
  text-decoration: underline;
}

.auth-divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.auth-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #E5E7EB;
}

.auth-divider span {
  background: white;
  padding: 0 1rem;
  color: #6B7280;
  font-size: 0.875rem;
}

.social-buttons {
  display: flex;
  gap: 0.5rem;
}

.social-btn {
  flex: 1;
  font-size: 0.875rem;
}

/* User Type Selection */
.user-type-selection {
  margin-bottom: 1.5rem;
}

.user-type-options {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.user-type-option {
  flex: 1;
  cursor: pointer;
  border: 2px solid #E5E7EB;
  border-radius: 0.75rem;
  padding: 1rem;
  transition: all 0.2s;
}

.user-type-option:hover {
  border-color: #2563EB;
}

.user-type-option.active {
  border-color: #2563EB;
  background: #DBEAFE;
}

.user-type-option input {
  display: none;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.option-icon {
  font-size: 1.5rem;
}

.option-text {
  display: flex;
  flex-direction: column;
}

.option-text strong {
  color: #1F2937;
  font-weight: 600;
}

.option-text span {
  color: #6B7280;
  font-size: 0.875rem;
}

.error-message {
  color: #EF4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 1rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal.large {
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1F2937;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6B7280;
  padding: 0.25rem;
}

.close-button:hover {
  color: #1F2937;
}

.modal-body {
  padding: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.terms-content h4 {
  font-weight: 600;
  margin: 1.5rem 0 0.5rem;
  color: #1F2937;
}

.terms-content h4:first-child {
  margin-top: 0;
}

.terms-content p {
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 1rem;
  }
  
  .auth-card {
    padding: 2rem;
  }
  
  .user-type-options {
    flex-direction: column;
  }
  
  .social-buttons {
    flex-direction: column;
  }
  
  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .modal {
    margin: 1rem;
    width: auto;
  }
}
</style>

