<template>
  <div class="about-container">
    <h1 class="about-title">About Us</h1>
    <div class="about-content">
      <div class="about-section">
        <h2>Our Mission</h2>
        <p>
          We are dedicated to creating innovative solutions that help businesses and individuals
          achieve their goals through cutting-edge technology and exceptional user experiences.
        </p>
      </div>

      <div class="about-section">
        <h2>Our Team</h2>
        <p>
          Our team consists of passionate developers, designers, and strategists who work together
          to deliver outstanding results. With years of experience in the industry, we bring
          expertise and creativity to every project.
        </p>
      </div>

      <div class="about-section">
        <h2>Our Values</h2>
        <ul class="values-list">
          <li>Innovation and continuous improvement</li>
          <li>Quality and attention to detail</li>
          <li>Collaboration and open communication</li>
          <li>Customer satisfaction and support</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutView',
})
</script>

<style scoped>
.about-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.about-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #42b883;
  text-align: center;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.about-section {
  background-color: rgba(26, 38, 52, 0.5);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.about-section h2 {
  color: #42b883;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.about-section p {
  line-height: 1.6;
  margin: 0;
}

.values-list {
  margin: 0;
  padding-left: 1.5rem;
}

.values-list li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}
</style>
