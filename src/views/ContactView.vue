<template>
  <div class="contact-container">
    <h1 class="contact-title">Contact Us</h1>

    <div class="contact-content">
      <div class="contact-info">
        <h2>Get in Touch</h2>
        <p>
          We'd love to hear from you! Please use the form or contact information below to reach out.
        </p>

        <div class="contact-details">
          <div class="contact-item">
            <strong>Email:</strong>
            <a href="mailto:info@example.com">info@example.com</a>
          </div>

          <div class="contact-item">
            <strong>Phone:</strong>
            <span>(123) 456-7890</span>
          </div>

          <div class="contact-item">
            <strong>Address:</strong>
            <span>123 Tech Street, Suite 100<br />San Francisco, CA 94107</span>
          </div>
        </div>
      </div>

      <div class="contact-form-container">
        <h2>Send a Message</h2>
        <form class="contact-form" @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="form.name" required />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="form.email" required />
          </div>

          <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" v-model="form.subject" required />
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" v-model="form.message" rows="5" required></textarea>
          </div>

          <button type="submit" class="submit-button">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'ContactView',
  setup() {
    const form = reactive({
      name: '',
      email: '',
      subject: '',
      message: '',
    })

    const submitForm = () => {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', form)
      alert('Thank you for your message! We will get back to you soon.')

      // Reset form
      form.name = ''
      form.email = ''
      form.subject = ''
      form.message = ''
    }

    return {
      form,
      submitForm,
    }
  },
})
</script>

<style scoped>
.contact-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.contact-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #42b883;
  text-align: center;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
  }
}

.contact-info,
.contact-form-container {
  background-color: rgba(26, 38, 52, 0.5);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-info h2,
.contact-form-container h2 {
  color: #42b883;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.contact-details {
  margin-top: 1.5rem;
}

.contact-item {
  margin-bottom: 1rem;
}

.contact-item a {
  color: #42b883;
  text-decoration: none;
}

.contact-item a:hover {
  text-decoration: underline;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(15, 25, 36, 0.5);
  color: white;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b883;
}

.submit-button {
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 0.5rem;
}

.submit-button:hover {
  background-color: #3aa876;
}
</style>
