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
import api from '../../api.js';
// ឆែកមើលថាតើកំពុងរត់លើម៉ាស៊ីនបង (Local) ឬលើ Render
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// បើ Local ប្រើ port 3002 បើលើ Render ប្រើ URL របស់បង
const API_URL = isLocal 
  ? "http://localhost:3002/api" 
  : "https://pos-backend-live.onrender.com/api";

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = "Please enter both username and password";
    return;
  }

  loading.value = true;
  errorMessage.value = "";

  try {
    const res = await api.post(`${API_URL}/login`, {
      username: username.value,
      password: password.value
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push({ name: '/dashboard' });
    }
  } catch (err) {
    console.error("Login Error:", err);
    // បង្ហាញ Error Message ពី Database ប្រសិនបើមានបញ្ហា Access Denied
    errorMessage.value = err.response?.data?.message || "Connection failed. Check your internet.";
  } finally {
    loading.value = false;
  }
};
</script>