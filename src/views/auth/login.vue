<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="brand-icon">🛒</div>
        <h2 class="brand-title">KH POS System</h2>
        <p class="brand-subtitle">Sign in to start your session</p>
      </div>

      <div class="login-body">
        <div class="form-group">
          <label class="input-label">Username</label>
          <input 
            v-model="username" 
            type="text" 
            class="form-input" 
            placeholder="Enter username" 
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label class="input-label">Password</label>
          <input 
            v-model="password" 
            type="password" 
            class="form-input" 
            placeholder="••••••••" 
            @keyup.enter="handleLogin"
            :disabled="loading"
          />
        </div>

        <transition name="fade">
          <div v-if="errorMessage" class="error-alert">
            {{ errorMessage }}
          </div>
        </transition>

        <button 
          @click="handleLogin" 
          :disabled="loading" 
          class="login-button"
        >
          <span v-if="!loading">Sign In</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        </button>
      </div>
      
      <div class="login-footer">
        by khea
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// អថេរសម្រាប់គ្រប់គ្រងទិន្នន័យ
const username = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);
const router = useRouter();

// បង្កើត Base URL សម្រាប់ API (ស្របតាម Backend លើ Render)
const response = await axios.post('https://pos-backend-live.onrender.com/api/login', loginData);
const handleLogin = async () => {
  try {
    // បងត្រូវប្រើ API_URL ដែលបងទើបតែកែហ្នឹង
    // ចំណាំ៖ បើ API_URL មាន /api រួចហើយ ក្នុង axios ដាក់តែ /login បានហើយ
    const response = await axios.post(`${API_URL}/login`, {
      username: username.value,
      password: password.value
    });
    
    // បើ Login ជោគជ័យ
    alert("Login Successful!");
  } catch (error) {
    console.error(error);
    // បើវានៅតែចេញ Connection Failed បងត្រូវឆែកមើល CORS នៅ Backend
    alert("Login Failed: " + (error.response?.data?.message || "Connection error"));
  }
};
</script>

<style scoped>
/* ការប្រើប្រាស់ @apply តាមការចង់បានរបស់អ្នក */

/* Animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>