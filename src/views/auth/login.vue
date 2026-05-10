<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      <div class="bg-blue-600 p-8 text-center text-white">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 text-3xl">🛒</div>
        <h2 class="text-2xl font-bold">POS System</h2>
        <p class="text-blue-100 text-sm mt-1">Sign in to start your session</p>
      </div>

      <div class="p-8 space-y-5">
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Username</label>
          <input v-model="username" type="text" class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="admin" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
          <input v-model="password" type="password" @keyup.enter="handleLogin" class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm bg-red-50 p-2 rounded">{{ errorMessage }}</div>

        <button @click="handleLogin" :disabled="loading" class="w-full py-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold shadow-lg disabled:opacity-50 transition-all">
          {{ loading ? 'Authenticating...' : 'Sign In' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const res = await axios.post("http://localhost:3002/login", {
      username: username.value,
      password: password.value
    });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    router.push({ name: 'dashboard' });
  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Connection failed";
  } finally {
    loading.value = false;
  }
};
</script>