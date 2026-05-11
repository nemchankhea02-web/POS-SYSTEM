<template>
  <div class="max-w-5xl mx-auto p-4 md:p-8 text-slate-900">
    
    <!-- Header Section -->
    <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <nav class="flex items-center text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
          <span>Account Settings</span>
          <svg class="w-4 h-4 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="text-slate-400">Profile</span>
        </nav>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Personal Information</h1>
        <p class="text-slate-500 mt-2 font-medium">Manage your public profile and account security preferences.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- LEFT COLUMN: Profile Card -->
      <div class="lg:col-span-4">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
          <div class="h-24 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
          <div class="px-6 pb-6">
            <div class="relative -mt-12 mb-4 flex justify-center">
              <div class="relative group">
                <div class="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center text-indigo-600 text-4xl font-bold overflow-hidden">
                  <img 
                    v-if="userData.avatar && userData.avatar !== 'null'" 
                    :src="userData.avatar" 
                    class="w-full h-full object-cover"
                    @error="handleAvatarError"
                  />
                  <span v-else>{{ userInitial }}</span>
                </div>
                <button 
                  @click="openAvatarModal" 
                  class="absolute bottom-1 right-1 bg-white text-slate-700 p-2 rounded-full shadow-md border border-slate-200 hover:text-indigo-600 hover:border-indigo-100 transition-all transform hover:scale-110"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div class="text-center">
              <h2 class="text-xl font-bold text-slate-800">{{ userData.fullname || userData.username }}</h2>
              <p class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 mt-1 uppercase tracking-wide">
                {{ userData.role === 'admin' ? 'Administrator' : 'Cashier' }}
              </p>
            </div>

            <div class="mt-8 space-y-4 border-t border-slate-50 pt-6">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-slate-400">Account Status</span>
                <span class="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                  <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Verified
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-slate-400">Joined Date</span>
                <span class="text-sm font-semibold text-slate-700">{{ formatDate(userData.created_at) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-slate-400">Last Login</span>
                <span class="text-sm font-semibold text-slate-700">{{ formatDate(userData.last_login) || 'Never' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Form and Activity -->
      <div class="lg:col-span-8 space-y-6">
        
        <!-- Form Section -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div class="p-6 border-b border-slate-100 flex items-center gap-3">
            <div class="p-2 bg-indigo-50 rounded-lg">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h3 class="text-lg font-bold text-slate-800">Basic Information</h3>
          </div>
          
          <form @submit.prevent="updateProfile" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Username</label>
                <input v-model="formData.username" type="text" class="form-input" required />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input v-model="formData.email" type="email" class="form-input" placeholder="name@company.com" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input v-model="formData.fullname" type="text" class="form-input" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                <input v-model="formData.phone" type="tel" class="form-input" />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Address</label>
              <textarea v-model="formData.address" rows="2" class="form-input resize-none"></textarea>
            </div>

            <!-- Password Section -->
            <div class="pt-6 border-t border-slate-100">
              <h4 class="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-width="2"/></svg>
                Security Upgrade
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input v-model="passwordData.current" type="password" placeholder="Current Password" class="form-input text-sm" />
                <input v-model="passwordData.new" type="password" placeholder="New Password" class="form-input text-sm" />
                <input v-model="passwordData.confirm" type="password" placeholder="Confirm New" class="form-input text-sm" />
              </div>
            </div>

            <!-- Footer Buttons -->
            <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" @click="resetForm" class="btn-secondary">Reset</button>
              <button type="submit" :disabled="loading" class="btn-primary">
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Update Profile
              </button>
            </div>
          </form>
        </div>

        <!-- Sessions Section -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-slate-100 rounded-lg text-slate-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 class="text-lg font-bold text-slate-800">Login Activity</h3>
            </div>
          </div>
          <div class="divide-y divide-slate-50">
            <div v-for="(session, idx) in sessions" :key="idx" class="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div :class="idx === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'" class="w-10 h-10 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2"/></svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-700 font-mono">{{ session.ip_address || '127.0.0.1' }}</p>
                  <p class="text-xs font-medium text-slate-400">{{ formatDateTime(session.login_time) }}</p>
                </div>
              </div>
              <span v-if="idx === 0" class="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Active</span>
            </div>
            <div v-if="sessions.length === 0" class="p-10 text-center text-slate-400 italic">No activity recorded.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals and Alerts (Keep logic, update styling) -->
    <div v-if="showAvatarModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closeAvatarModal">
      <div class="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-fadeIn">
        <div class="p-6 text-center border-b border-slate-50">
           <h3 class="text-xl font-bold text-slate-800">Profile Picture</h3>
           <p class="text-sm text-slate-500 mt-1">Paste a URL from the web</p>
        </div>
        <div class="p-6 space-y-4">
          <input v-model="avatarUrl" type="url" class="form-input text-sm" placeholder="https://..." />
          <div v-if="avatarUrl" class="w-24 h-24 rounded-full overflow-hidden mx-auto ring-4 ring-indigo-50 shadow-inner">
            <img :src="avatarUrl" class="w-full h-full object-cover" @error="previewError = true" />
          </div>
        </div>
        <div class="p-4 bg-slate-50 flex gap-2">
          <button @click="closeAvatarModal" class="flex-1 btn-secondary text-sm">Cancel</button>
          <button @click="updateAvatar" class="flex-1 btn-primary text-sm">Update</button>
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <Teleport to="body">
      <div class="fixed bottom-6 right-6 space-y-3 z-[100]">
        <div v-if="successMessage" class="flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl animate-fadeIn">
          <div class="p-1 bg-emerald-500 rounded-full"><svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="3"/></svg></div>
          <span class="text-sm font-bold">{{ successMessage }}</span>
        </div>
        <div v-if="errorMessage" class="flex items-center gap-3 bg-red-600 text-white px-5 py-3 rounded-2xl shadow-2xl animate-fadeIn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5"/></svg>
          <span class="text-sm font-bold">{{ errorMessage }}</span>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}
</style>

<script setup>
/* NO CHANGES TO YOUR SCRIPT LOGIC */
import { ref, computed, onMounted } from "vue";
import api from '@/api.js';const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const showAvatarModal = ref(false);
const avatarUrl = ref("");
const previewError = ref(false);

const userData = ref({
  id: null,
  username: "",
  role: "",
  email: "",
  fullname: "",
  phone: "",
  address: "",
  avatar: "",
  created_at: "",
  last_login: ""
});

const formData = ref({
  username: "",
  email: "",
  fullname: "",
  phone: "",
  address: ""
});

const passwordData = ref({
  current: "",
  new: "",
  confirm: ""
});

const sessions = ref([]);

const api = axios.create({ baseURL: 'http://localhost:3002' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const userInitial = computed(() => {
  const name = userData.value.fullname || userData.value.username || "U";
  return name.charAt(0).toUpperCase();
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const showSuccess = (message) => {
  successMessage.value = message;
  setTimeout(() => { successMessage.value = ""; }, 3000);
};

const showError = (message) => {
  errorMessage.value = message;
  setTimeout(() => { errorMessage.value = ""; }, 3000);
};

const resetForm = () => {
  formData.value = {
    username: userData.value.username || "",
    email: userData.value.email || "",
    fullname: userData.value.fullname || "",
    phone: userData.value.phone || "",
    address: userData.value.address || ""
  };
  passwordData.value = {
    current: "",
    new: "",
    confirm: ""
  };
};

const handleAvatarError = () => {
  userData.value.avatar = "";
};

const openAvatarModal = () => {
  avatarUrl.value = userData.value.avatar || "";
  previewError.value = false;
  showAvatarModal.value = true;
};

const closeAvatarModal = () => {
  showAvatarModal.value = false;
  avatarUrl.value = "";
};

const updateAvatar = async () => {
  if (!avatarUrl.value) {
    showError("Please enter an image URL");
    return;
  }
  try {
    const response = await api.post('/user/avatar', { avatarUrl: avatarUrl.value });
    if (response.data.success) {
      userData.value.avatar = avatarUrl.value;
      showSuccess("Avatar updated successfully");
      closeAvatarModal();
    }
  } catch (err) {
    showError(err.response?.data?.message || "Failed to update avatar");
  }
};

const fetchUserProfile = async () => {
  loading.value = true;
  try {
    const response = await api.get('/user/profile');
    userData.value = response.data;
    resetForm();
  } catch (err) {
    showError("Failed to load profile");
  } finally {
    loading.value = false;
  }
};

const fetchSessions = async () => {
  try {
    const response = await api.get('/user/sessions');
    sessions.value = response.data || [];
  } catch (err) {}
};

const updateProfile = async () => {
  loading.value = true;
  try {
    const updateData = {
      username: formData.value.username,
      email: formData.value.email,
      fullname: formData.value.fullname,
      phone: formData.value.phone,
      address: formData.value.address
    };

    if (passwordData.value.new) {
      if (passwordData.value.new !== passwordData.value.confirm) {
        showError("New passwords do not match");
        loading.value = false;
        return;
      }
      if (!passwordData.value.current) {
        showError("Please enter current password");
        loading.value = false;
        return;
      }
      if (passwordData.value.new.length < 4) {
        showError("New password must be at least 4 characters");
        loading.value = false;
        return;
      }
      updateData.current_password = passwordData.value.current;
      updateData.new_password = passwordData.value.new;
    }

    const response = await api.put('/user/profile', updateData);
    if (response.data.success) {
      showSuccess("Profile updated successfully");
      if (response.data.user) {
        userData.value = { ...userData.value, ...response.data.user };
      } else {
        await fetchUserProfile();
      }
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.username = formData.value.username;
        localStorage.setItem("user", JSON.stringify(user));
      }
      resetForm();
    }
  } catch (err) {
    showError(err.response?.data?.message || "Failed to update profile");
  } finally {
    loading.value = false;
  }
};

const loadLocalUser = () => {
  const stored = localStorage.getItem("user");
  if (stored) {
    const user = JSON.parse(stored);
    userData.value.id = user.id;
    userData.value.username = user.username;
    userData.value.role = user.role;
  }
};

onMounted(() => {
  loadLocalUser();
  fetchUserProfile();
  fetchSessions();
});
</script>