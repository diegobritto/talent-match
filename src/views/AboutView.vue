<template>
  <div class="about">
    <div class="about-container">
      <div class="about-header">
        <h1>Sobre o TalentMatch</h1>
        <p class="subtitle">Conectando talentos às melhores oportunidades</p>
      </div>

      <div class="about-content">
        <section class="intro-section">
          <h2>Quem Somos</h2>
          <p>
            O TalentMatch é uma plataforma inovadora que conecta profissionais talentosos 
            com empresas que buscam os melhores candidatos. Nossa missão é simplificar 
            o processo de recrutamento, tornando-o mais eficiente e transparente para todos.
          </p>
        </section>

        <section class="features-section">
          <h2>O que Oferecemos</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🔍</div>
              <h3>Busca Inteligente</h3>
              <p>Encontre vagas que combinam perfeitamente com seu perfil profissional.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🤝</div>
              <h3>Conexão Direta</h3>
              <p>Conecte-se diretamente com recrutadores e empresas interessadas.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>Acompanhamento</h3>
              <p>Monitore suas candidaturas e receba feedback em tempo real.</p>
            </div>
          </div>
        </section>

        <section class="stats-section">
          <h2>Nossos Números</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">10,000+</div>
              <div class="stat-label">Vagas Publicadas</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">5,000+</div>
              <div class="stat-label">Profissionais Cadastrados</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">1,200+</div>
              <div class="stat-label">Empresas Parceiras</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">95%</div>
              <div class="stat-label">Taxa de Satisfação</div>
            </div>
          </div>
        </section>

        <section class="contact-section">
          <h2>Entre em Contato</h2>
          <p>Tem alguma dúvida ou sugestão? Estamos aqui para ajudar!</p>
          <div class="contact-info">
            <div class="contact-item">
              <strong>Email:</strong> contato@talentmatch.com
            </div>
            <div class="contact-item">
              <strong>Telefone:</strong> (11) 3000-0000
            </div>
            <div class="contact-item">
              <strong>Endereço:</strong> São Paulo, SP - Brasil
            </div>
          </div>
          <router-link to="/contact" class="contact-button">
            Fale Conosco
          </router-link>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Componente About - informações sobre a plataforma TalentMatch
</script>

<style scoped>
.about {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
}

.about-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 0;
}

.about-header h1 {
  font-size: 3rem;
  color: #333;
  margin-bottom: 15px;
}

.subtitle {
  font-size: 1.3rem;
  color: #666;
  margin: 0;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

section {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

section h2 {
  font-size: 2.2rem;
  color: #333;
  margin-bottom: 25px;
  text-align: center;
}

.intro-section p {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #555;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.feature-card {
  text-align: center;
  padding: 30px 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.stat-item {
  text-align: center;
  padding: 20px;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1.1rem;
  color: #666;
}

.contact-section {
  text-align: center;
}

.contact-section p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.contact-item {
  font-size: 1.1rem;
  color: #555;
}

.contact-button {
  display: inline-block;
  background: #4CAF50;
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

.contact-button:hover {
  background: #45a049;
}

@media (max-width: 768px) {
  .about {
    padding: 10px;
  }

  .about-header h1 {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  section {
    padding: 25px;
  }

  section h2 {
    font-size: 1.8rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .contact-info {
    flex-direction: column;
    gap: 15px;
  }

  .stat-number {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .about-header h1 {
    font-size: 2rem;
  }
}
</style>

