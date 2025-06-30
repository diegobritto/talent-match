<template>
  <header
    class="header"
    :class="{ 'header-hidden': isHidden }"
  >
    <div class="container">
      <div class="header-content">
        <router-link to="/" class="logo">TalentMatch</router-link>
        
        <nav>
          <ul class="nav-menu">
            <li><router-link to="/jobs">Buscar Vagas</router-link></li>
            <li><router-link to="/about">Sobre</router-link></li>
            <li><router-link to="/contact">Contato</router-link></li>
          </ul>
        </nav>
        
        <div class="header-buttons">
          <router-link to="/login" class="btn btn-secondary">Entrar</router-link>
          <router-link to="/register" class="btn btn-primary">Cadastrar</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Controla se o cabeçalho está escondido
const isHidden = ref(false);
let lastScrollY = 0;

// Função para detectar o scroll
const handleScroll = () => {
  if (window.scrollY > lastScrollY) {
    // Rolando para baixo
    isHidden.value = true;
  } else {
    // Rolando para cima
    isHidden.value = false;
  }
  lastScrollY = window.scrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #E5E7EB;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: transform 0.3s ease-in-out;
}

/* Esconde o cabeçalho quando rolando para baixo */
.header-hidden {
  transform: translateY(-100%);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563EB;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  text-decoration: none;
  color: #6B7280;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  color: #2563EB;
}

.header-buttons {
  display: flex;
  gap: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
