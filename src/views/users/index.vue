<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <div>
        <div class="flex items-center gap-2">
          <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <h1 class="text-2xl font-bold text-slate-800">User Management</h1>
        </div>
        <p class="text-sm text-slate-500 mt-1 ml-9">
          Logged in as:
          <span class="font-semibold text-slate-700">
            {{ currentUser?.username }}
          </span>
        </p>
      </div>

      <button
        @click="openAdd"
        v-if="currentUser?.role === 'admin'"
        class="bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add User
      </button>
    </div>

    <!-- TABLE AREA -->
    <div v-if="loading" class="bg-white rounded-2xl shadow border overflow-hidden p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="text-gray-500 mt-2">Loading users...</p>
    </div>

    <div v-else class="bg-white rounded-2xl shadow border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-100 text-slate-600 font-medium">
            <tr>
              <th class="p-4">ID</th>
              <th class="p-4">Username</th>
              <th class="p-4">Full Name</th>
              <th class="p-4">Role</th>
              <th class="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-t hover:bg-slate-50 transition">
              <td class="p-4 text-slate-500">{{ user.id }}</td>
              <td class="p-4 font-medium text-slate-800">{{ user.username }}</td>
              <td class="p-4 text-slate-600">{{ user.fullname || '-' }}</td>
              <td class="p-4">
                <span :class="user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'" class="px-2 py-1 rounded-full text-xs font-medium uppercase">
                  {{ user.role }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex items-center justify-center gap-2">
                  <button @click="viewLoginHistory(user)" class="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition" title="History">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </button>
                  <button v-if="currentUser?.role === 'admin'" @click="editUser(user)" class="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition" title="Edit">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                  <button v-if="currentUser?.role === 'admin' && currentUser.id !== user.id" @click="deleteUser(user.id)" class="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition" title="Delete">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- EDIT/ADD USER MODAL -->
    <div 
      v-if="openModal" 
      class="fixed inset-0 z-50 overflow-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-fadeIn">
        <div class="flex justify-between items-center p-5 border-b bg-blue-600 rounded-t-2xl">
          <div class="flex items-center gap-3 text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <h3 class="text-lg font-bold">{{ isEdit ? "Edit User" : "Add New User" }}</h3>
          </div>
          <button @click="closeModal" class="text-white/80 hover:text-white transition"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Username *</label>
            <div class="relative text-slate-400 focus-within:text-blue-600">
              <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <input v-model.trim="form.username" class="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-700" :class="errors.username ? 'border-red-500' : 'border-gray-300'" />
            </div>
          </div>
          <!-- (Remaining form fields here...) -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
            <div class="relative text-slate-400 focus-within:text-blue-600">
              <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
              </div>
              <input v-model.trim="form.fullname" class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-700" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
            <div class="relative text-slate-400 focus-within:text-blue-600">
              <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <input v-model.trim="form.email" class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-700" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
            <div class="relative text-slate-400 focus-within:text-blue-600">
              <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <input v-model.trim="form.phone" class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-700" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password {{ isEdit ? '(Optional)' : '*' }}</label>
            <div class="relative text-slate-400 focus-within:text-blue-600">
              <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <input v-model="form.password" type="password" :placeholder="isEdit ? 'Leave blank to keep current' : ''" class="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-700" :class="errors.password ? 'border-red-500' : 'border-gray-300'" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Role</label>
            <div class="relative text-slate-400 focus-within:text-blue-600">
              <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <select v-model="form.role" class="w-full pl-8 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition text-slate-700 bg-white">
                <option value="user">Standard User</option>
                <option value="admin">Administrator</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 p-5 border-t bg-slate-50 rounded-b-2xl">
          <button @click="closeModal" class="px-4 py-2 border rounded-lg hover:bg-white transition text-sm font-semibold text-slate-600 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            Cancel
          </button>
          <button @click="saveUser" :disabled="saving" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
            {{ saving ? 'Saving...' : (isEdit ? 'Update User' : 'Create User') }}
          </button>
        </div>
      </div>
    </div>

    <!-- NEW: LOGIN HISTORY MODAL (This was missing!) -->
    <div 
      v-if="showHistoryModal" 
      class="fixed inset-0 z-50 overflow-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="showHistoryModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all animate-fadeIn overflow-hidden">
        <div class="p-5 border-b flex justify-between items-center bg-green-600 text-white">
          <h3 class="text-lg font-bold flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Login History: {{ selectedUser?.username }}
          </h3>
          <button @click="showHistoryModal = false" class="hover:bg-green-700 p-1 rounded-full"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
        </div>
        
        <div class="p-6">
          <div v-if="loginHistoryLoading" class="text-center py-10">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p class="text-slate-500 mt-2">Fetching history...</p>
          </div>
          
          <div v-else-if="loginHistory.length === 0" class="text-center py-10 text-slate-400">
            No login records found for this user.
          </div>
          
          <div v-else class="overflow-y-auto max-h-96 rounded-lg border">
            <table class="w-full text-sm text-left">
              <thead class="bg-slate-50 text-slate-600 border-b">
                <tr>
                  <th class="p-3">Time</th>
                  <th class="p-3">IP Address</th>
                  <th class="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(log, idx) in loginHistory" :key="idx" class="border-b last:border-0 hover:bg-slate-50 transition">
                  <td class="p-3 font-medium text-slate-700">
                    {{ formatDate(log.login_time) }}
                    <span class="block text-xs text-slate-400 font-normal">{{ formatRelativeTime(log.login_time) }}</span>
                  </td>
                  <td class="p-3 text-slate-600">{{ log.ip_address || 'Unknown' }}</td>
                  <td class="p-3">
                    <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">Success</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>
<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import api from '@/api.js';
const router = useRouter()

const users = ref([])
const openModal = ref(false)
const isEdit = ref(false)
const loading = ref(false)
const saving = ref(false)
const currentUser = ref(null)
const errors = ref({ username: "", password: "" })

const showHistoryModal = ref(false)
const selectedUser = ref(null)
const loginHistory = ref([])
const loginHistoryLoading = ref(false)

const form = ref({
  id: null,
  username: "",
  fullname: "",
  email: "",
  phone: "",
  password: "",
  role: "user"
})

const api = axios.create({ baseURL: "http://localhost:3002" })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.push("/login")
    }
    return Promise.reject(error)
  }
)

// ================= METHODS =================

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await api.get("/users")
    users.value = res.data
  } catch (error) {
    console.error("Failed to fetch users:", error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return "Never"
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (e) {
    return dateString
  }
}

const formatRelativeTime = (dateString) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return formatDate(dateString)
}

const viewLoginHistory = async (user) => {
  selectedUser.value = user
  showHistoryModal.value = true
  loginHistoryLoading.value = true
  loginHistory.value = []

  try {
    const res = await api.get(`/login-history/${user.id}`)
    loginHistory.value = res.data || []
  } catch (error) {
    console.error("Failed to fetch login history:", error)
    loginHistory.value = []
  } finally {
    loginHistoryLoading.value = false
  }
}

const openAdd = () => {
  form.value = { id: null, username: "", fullname: "", email: "", phone: "", password: "", role: "user" }
  errors.value = { username: "", password: "" }
  isEdit.value = false
  openModal.value = true
}

const editUser = (user) => {
  form.value = {
    id: user.id,
    username: user.username || "",
    fullname: user.fullname || "",
    email: user.email || "",
    phone: user.phone || "",
    password: "",
    role: user.role || "user"
  }
  errors.value = { username: "", password: "" }
  isEdit.value = true
  openModal.value = true
}

const deleteUser = async (id) => {
  if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return
  
  try {
    await api.delete(`/users/${id}`)
    await fetchUsers()
    alert("User deleted successfully")
  } catch (error) {
    alert(error.response?.data?.message || "Failed to delete user")
  }
}

const validate = () => {
  const newErrors = { username: "", password: "" }
  let isValid = true

  if (!form.value.username.trim()) {
    newErrors.username = "Username is required"
    isValid = false
  } else if (form.value.username.length < 3) {
    newErrors.username = "Username must be at least 3 characters"
    isValid = false
  }

  if (!isEdit.value) {
    if (!form.value.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (form.value.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }
  } else if (form.value.password && form.value.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters"
    isValid = false
  }

  errors.value = newErrors
  return isValid
}

const saveUser = async () => {
  if (!validate()) return

  saving.value = true

  try {
    if (isEdit.value) {
      const payload = {
        username: form.value.username,
        role: form.value.role,
        email: form.value.email || null,
        fullname: form.value.fullname || null,
        phone: form.value.phone || null
      }

      if (form.value.password && form.value.password.length >= 6) {
        payload.password = form.value.password
      }

      await api.put(`/users/${form.value.id}`, payload)
      alert("User updated successfully!")
    } else {
      await api.post("/users", {
        username: form.value.username,
        password: form.value.password,
        role: form.value.role,
        email: form.value.email || null,
        fullname: form.value.fullname || null,
        phone: form.value.phone || null
      })
      alert("User created successfully!")
    }

    await fetchUsers()
    closeModal()

  } catch (error) {
    alert(error.response?.data?.message || "Failed to save user")
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  openModal.value = false
  errors.value = { username: "", password: "" }
}

// INIT
onMounted(() => {
  const token = localStorage.getItem("token")
  if (!token) {
    router.push("/login")
    return
  }

  const userStr = localStorage.getItem("user")
  if (userStr) {
    try {
      currentUser.value = JSON.parse(userStr)
    } catch (e) {
      console.error("Failed to parse user", e)
    }
  }
  
  fetchUsers()
})
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>