<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>TalentMatch</h3>
          <p class="footer-description">
            Conectando talentos e oportunidades de forma inteligente e eficiente.
          </p>
        </div>
        
        <div class="footer-section">
          <h3>Para Candidatos</h3>
          <ul>
            <li><router-link to="/jobs">Buscar Vagas</router-link></li>
            <li><router-link to="/candidate/dashboard">Meu Perfil</router-link></li>
            <li><a href="#">Dicas de Carreira</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Para Empresas</h3>
          <ul>
            <li><router-link to="/company/post-job">Publicar Vaga</router-link></li>
            <li><router-link to="/company/dashboard">Dashboard</router-link></li>
            <li><a href="#">Planos</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Empresa</h3>
          <ul>
            <li><router-link to="/about">Sobre Nós</router-link></li>
            <li><router-link to="/contact">Contato</router-link></li>
            <li><a href="#">Privacidade</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} TalentMatch. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: #1F2937;
  color: white;
  padding: 3rem 0 2rem;
  margin-top: 4rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
  color: white;
}

.footer-description {
  color: #D1D5DB;
  margin-bottom: 1rem;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: #D1D5DB;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-section ul li a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding-top: 2rem;
  text-align: center;
  color: #D1D5DB;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>

