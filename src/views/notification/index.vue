<template>
  <div class="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">

    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <div class="flex items-center gap-2">
          <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <h2 class="text-2xl font-bold text-slate-800">Notifications</h2>
        </div>
        <p class="text-slate-500 text-sm mt-1 ml-9">Stay updated with your store activities</p>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Notification Bell with Badge -->
        <div class="relative cursor-pointer hover:scale-110 transition-transform" @click="toggleDropdown">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <span v-if="unreadCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
            {{ unreadCount }}
          </span>
        </div>

        <!-- User Info -->
        <div class="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {{ userInitial }}
          </div>
          <div class="hidden md:block">
            <div class="text-sm font-semibold text-slate-700">{{ userName }}</div>
            <div class="text-xs text-slate-500">{{ displayRole }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Dropdown Menu -->
    <div v-if="showDropdown" class="fixed right-6 top-28 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-fadeIn">
      <div class="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <h3 class="font-semibold">Recent Notifications</h3>
          </div>
          <button @click="markAllAsRead" class="text-xs hover:underline">Mark all as read</button>
        </div>
      </div>
      <div class="max-h-96 overflow-y-auto">
        <div v-for="n in recentNotifications" :key="n.id" class="p-3 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer" @click="handleNotificationClick(n.id)">
          <div class="flex items-start gap-3">
            <div :class="['w-8 h-8 flex items-center justify-center rounded-full text-sm', iconBg(n.type)]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <use :href="getIconPath(n.type)"></use>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-800">{{ n.title }}</p>
              <p class="text-xs text-slate-500 mt-1">{{ n.message }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatTime(n.created_at) }}</p>
            </div>
            <div v-if="!n.is_read" class="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
        <div v-if="recentNotifications.length === 0 && !loading" class="p-8 text-center text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <p>No notifications yet</p>
        </div>
        <div v-if="loading && recentNotifications.length === 0" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
      <div class="p-2 bg-gray-50 text-center border-t">
        <button @click="showFullNotifications" class="text-sm text-blue-600 hover:text-blue-700">View all notifications →</button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
      <button 
        @click="activeFilter = 'all'"
        :class="['px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1', 
          activeFilter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100']"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
        All
        <span class="ml-1 text-xs">{{ notifications.length }}</span>
      </button>
      <button 
        @click="activeFilter = 'unread'"
        :class="['px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1', 
          activeFilter === 'unread' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100']"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
        Unread
        <span class="ml-1 text-xs">{{ unreadCount }}</span>
      </button>
      <button 
        @click="activeFilter = 'warning'"
        :class="['px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1', 
          activeFilter === 'warning' ? 'bg-yellow-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100']"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        Warnings
      </button>
      <button 
        @click="activeFilter = 'success'"
        :class="['px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1', 
          activeFilter === 'success' ? 'bg-green-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100']"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Success
      </button>
      <button 
        @click="activeFilter = 'info'"
        :class="['px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1', 
          activeFilter === 'info' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100']"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Info
      </button>
    </div>

    <!-- Notification Cards Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div
        v-for="n in filteredNotifications"
        :key="n.id"
        :class="['bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border-l-4 cursor-pointer transform hover:-translate-y-1', borderColor(n.type), !n.is_read ? 'bg-blue-50/30' : '']"
        @click="markAsRead(n.id)"
      >
        <div class="flex gap-4">
          <div :class="['w-12 h-12 flex items-center justify-center rounded-full shadow-sm', iconBg(n.type)]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <use :href="getIconPath(n.type)"></use>
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <h3 class="font-semibold text-slate-800">{{ n.title }}</h3>
              <button 
                @click.stop="deleteNotification(n.id)" 
                class="text-gray-400 hover:text-red-500 transition p-1"
                title="Delete"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-600 mt-1 leading-relaxed">{{ n.message }}</p>
            <div class="flex justify-between items-center mt-3">
              <span class="text-xs text-gray-400">{{ formatTime(n.created_at) }}</span>
              <span v-if="!n.is_read" class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">New</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredNotifications.length === 0 && !loading" class="text-center py-16">
      <svg class="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
      </svg>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">No notifications</h3>
      <p class="text-gray-400">You're all caught up!</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading && notifications.length === 0" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="text-gray-500 mt-4">Loading notifications...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api.js';
const router = useRouter()
const notifications = ref([])
const loading = ref(false)
const showDropdown = ref(false)
const activeFilter = ref('all')
const user = ref({ name: 'Admin', role: 'admin' })

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative') && !event.target.closest('.fixed')) {
    showDropdown.value = false
  }
}

// Load user data
const loadUser = () => {
  try {
    const stored = localStorage.getItem('user')
    if (stored) {
      const userData = JSON.parse(stored)
      user.value = {
        name: userData.username || userData.name || 'Admin',
        role: userData.role || 'admin'
      }
    }
  } catch (error) {
    console.warn('Failed to parse user', error)
  }
}

const userName = computed(() => user.value.name)
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())
const displayRole = computed(() => {
  if (!user.value.role) return 'Guest'
  return user.value.role.charAt(0).toUpperCase() + user.value.role.slice(1)
})

const unreadCount = computed(() => notifications.value.filter(n => !n.is_read).length)
const recentNotifications = computed(() => notifications.value.slice(0, 5))

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') return notifications.value
  if (activeFilter.value === 'unread') return notifications.value.filter(n => !n.is_read)
  return notifications.value.filter(n => n.type === activeFilter.value)
})

// Get icon path based on type
const getIconPath = (type) => {
  const icons = {
    warning: '#warning-icon',
    success: '#success-icon', 
    info: '#info-icon',
    error: '#error-icon'
  }
  return icons[type] || '#info-icon'
}

// API calls
const api = axios.create({
  baseURL: 'http://localhost:3002'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const fetchNotifications = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.log('No token found')
      loading.value = false
      return
    }
    
    const response = await api.get('/notifications')
    notifications.value = response.data.notifications || []
    console.log('Notifications fetched:', notifications.value.length)
  } catch (err) {
    console.error('Error fetching notifications:', err.response?.data || err.message)
    notifications.value = []
  } finally {
    loading.value = false
  }
}

const markAsRead = async (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification && !notification.is_read) {
    try {
      await api.put(`/notifications/${id}/read`)
      notification.is_read = true
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }
}

const markAllAsRead = async () => {
  try {
    await api.put('/notifications/read-all')
    notifications.value.forEach(n => n.is_read = true)
  } catch (err) {
    console.error('Error marking all as read:', err)
  }
}

const deleteNotification = async (id) => {
  if (confirm('Delete this notification?')) {
    try {
      await api.delete(`/notifications/${id}`)
      notifications.value = notifications.value.filter(n => n.id !== id)
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const showFullNotifications = () => {
  showDropdown.value = false
  activeFilter.value = 'all'
}

const handleNotificationClick = (id) => {
  markAsRead(id)
}

// Helper functions
const iconBg = (type) => {
  const bg = {
    warning: 'bg-yellow-100 text-yellow-600',
    success: 'bg-green-100 text-green-600',
    info: 'bg-blue-100 text-blue-600',
    error: 'bg-red-100 text-red-600'
  }
  return bg[type] || 'bg-gray-100 text-gray-600'
}

const borderColor = (type) => {
  const border = {
    warning: 'border-yellow-400',
    success: 'border-green-400',
    info: 'border-blue-400',
    error: 'border-red-400'
  }
  return border[type] || 'border-gray-400'
}

const formatTime = (timestamp) => {
  if (!timestamp) return 'Just now'
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString()
}

let interval
onMounted(() => {
  loadUser()
  fetchNotifications()
  document.addEventListener('click', handleClickOutside)
  
  // Auto-refresh every 30 seconds
  interval = setInterval(fetchNotifications, 30000)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>