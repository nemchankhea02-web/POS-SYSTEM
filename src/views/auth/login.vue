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
            placeholder="Enter password"
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
          <span v-else>Processing...</span>
        </button>
        
        <!-- Debug info (remove after fixing) -->
        <div class="debug-info" style="font-size: 12px; margin-top: 10px; color: #666;">
          API URL: {{ apiUrl }}
        </div>
      </div>
      
      <div class="login-footer">
        BY KHEA
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);
const router = useRouter();

// Use relative URL
const apiUrl = computed(() => '/api');

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = "Please enter both username and password";
    return;
  }

  loading.value = true;
  errorMessage.value = "";

  try {
    console.log('Attempting login to:', `${apiUrl.value}/login`);
    
    const res = await axios.post('/api/login', {
      username: username.value,
      password: password.value
    });

    console.log('Login response:', res.data);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push({ name: 'dashboard' });
    }
  } catch (err) {
    console.error("Login Error Details:", err);
    console.log("Error response:", err.response);
    console.log("Error request:", err.request);
    
    if (err.response) {
      errorMessage.value = err.response.data?.message || `Error ${err.response.status}: Login failed`;
    } else if (err.request) {
      errorMessage.value = "Cannot connect to server. Please check if backend is running.";
    } else {
      errorMessage.value = "An error occurred. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};
</script>