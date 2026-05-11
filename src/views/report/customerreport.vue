<template>
  <div class="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2">
        <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <h2 class="text-2xl font-bold text-slate-800">Customer Report</h2>
      </div>
      <p class="text-slate-500 text-sm mt-1 ml-9">Customer analytics and purchase history</p>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-blue-100 text-sm">Total Customers</p>
            <h3 class="text-2xl font-bold">{{ totalCustomers }}</h3>
          </div>
          <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        </div>
      </div>
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-green-100 text-sm">Total Revenue</p>
            <h3 class="text-2xl font-bold">${{ formatNumber(totalRevenue) }}</h3>
          </div>
          <svg class="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-orange-100 text-sm">Average per Customer</p>
            <h3 class="text-2xl font-bold">${{ formatNumber(avgPerCustomer) }}</h3>
          </div>
          <svg class="w-8 h-8 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
      </div>
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-purple-100 text-sm">VIP Customers</p>
            <h3 class="text-2xl font-bold">{{ vipCount }}</h3>
          </div>
          <svg class="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Top Customers -->
    <div class="bg-white rounded-xl shadow-md p-5 mb-6">
      <div class="flex items-center gap-2 mb-4">
        <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
        <h3 class="font-semibold text-lg text-slate-800">Top Spending Customers</h3>
      </div>
      <div class="space-y-3">
        <div v-for="(customer, idx) in topCustomers" :key="customer.id" class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
            {{ idx + 1 }}
          </div>
          <div class="flex-1">
            <div class="flex justify-between">
              <span class="font-medium">{{ customer.name }}</span>
              <span class="font-bold text-green-600">${{ formatNumber(customer.total_spent) }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div class="bg-green-500 h-2 rounded-full" :style="{ width: getPercentage(customer.total_spent) + '%' }"></div>
            </div>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-xs text-gray-500">⭐ {{ customer.point || 0 }} points</span>
              <span class="text-xs text-gray-400">📞 {{ customer.phone || 'No phone' }}</span>
            </div>
          </div>
        </div>
        <div v-if="topCustomers.length === 0" class="text-center text-gray-400 py-4">
          No customer data available
        </div>
      </div>
    </div>

    <!-- Customer Table with Purchase History -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="px-4 py-3 border-b bg-gray-50">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <h3 class="font-semibold text-gray-700">Customer List</h3>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer Name</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Phone</th>
              <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Total Spent</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Points</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Orders</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Last Purchase</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer.id" class="border-t hover:bg-gray-50 transition">
              <td class="px-4 py-3 font-medium text-gray-800">{{ customer.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ customer.phone || '-' }}</td>
              <td class="px-4 py-3 text-right text-green-600 font-bold">${{ formatNumber(customer.total_spent) }}</td>
              <td class="px-4 py-3 text-center">
                <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                  {{ customer.point || 0 }}
                </span>
              </td>
              <td class="px-4 py-3 text-center text-sm text-gray-700">{{ customer.order_count || 0 }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ customer.last_purchase || '-' }}</td>
              <td class="px-4 py-3 text-center">
                <button @click="viewPurchaseHistory(customer)" class="text-blue-600 hover:text-blue-800 transition flex items-center justify-center gap-1 mx-auto">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <span class="text-sm">View</span>
                </button>
              </td>
            </tr>
            <tr v-if="customers.length === 0 && !loading">
              <td colspan="7" class="text-center py-12 text-gray-400">
                <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <p>No customer data available</p>
              </td>
            </tr>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p class="text-gray-500 mt-2">Loading customers...</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Purchase History Modal -->
    <div v-if="showHistoryModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50" @click.self="showHistoryModal = false">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl transform transition-all duration-300 animate-fadeIn">
        <div class="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <h3 class="font-bold text-lg">Purchase History - {{ selectedCustomer?.name }}</h3>
            </div>
            <button @click="showHistoryModal = false" class="text-white hover:bg-white/20 rounded-full p-1 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <div class="mb-4 p-3 bg-gray-50 rounded-lg border">
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span class="font-semibold text-gray-600">Phone:</span>
                <span class="ml-2 text-gray-800">{{ selectedCustomer?.phone || '-' }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-600">Email:</span>
                <span class="ml-2 text-gray-800">{{ selectedCustomer?.email || '-' }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-600">Total Spent:</span>
                <span class="ml-2 text-green-600 font-bold">${{ formatNumber(selectedCustomer?.total_spent) }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-600">Points:</span>
                <span class="ml-2 text-yellow-600 font-semibold">{{ selectedCustomer?.point || 0 }}</span>
              </div>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600">Receipt No</th>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
                  <th class="px-3 py-2 text-right text-xs font-semibold text-gray-600">Amount</th>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600">Payment</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sale in purchaseHistory" :key="sale.id" class="border-t hover:bg-gray-50 transition">
                  <td class="px-3 py-2 font-mono text-xs text-gray-600">{{ sale.receipt_number }}</td>
                  <td class="px-3 py-2 text-xs text-gray-500">{{ formatDate(sale.created_at) }}</td>
                  <td class="px-3 py-2 text-right text-green-600 font-bold text-sm">${{ formatNumber(sale.total_amount) }}</td>
                  <td class="px-3 py-2 text-xs">
                    <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{{ sale.payment_method || 'Cash' }}</span>
                  </td>
                </tr>
                <tr v-if="purchaseHistory.length === 0">
  <td colspan="4" class="text-center py-8 text-gray-400">
    <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
    </svg>
    <p>No purchase history</p>
  </td>
</tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="p-3 border-t bg-gray-50 flex justify-end rounded-b-xl">
          <button @click="showHistoryModal = false" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '.././api.js'; 
const customers = ref([])
const loading = ref(false)
const showHistoryModal = ref(false)
const selectedCustomer = ref(null)
const purchaseHistory = ref([])
const error = ref('')

const api = axios.create({ baseURL: 'http://localhost:3002' })
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Computed
const totalCustomers = computed(() => customers.value.length)
const totalRevenue = computed(() => {
  return customers.value.reduce((sum, c) => sum + (parseFloat(c.total_spent) || 0), 0)
})
const avgPerCustomer = computed(() => {
  return totalCustomers.value > 0 ? totalRevenue.value / totalCustomers.value : 0
})
const vipCount = computed(() => {
  return customers.value.filter(c => (parseFloat(c.total_spent) || 0) > 1000).length
})
const topCustomers = computed(() => {
  return [...customers.value].sort((a, b) => (parseFloat(b.total_spent) || 0) - (parseFloat(a.total_spent) || 0)).slice(0, 5)
})

// Fetch customers from backend report endpoint
const fetchCustomers = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await api.get('/reports/customers')
    customers.value = (response.data || []).map(c => ({
      id: c.id || c.customer_name,
      name: c.customer_name,
      phone: c.customer_phone,
      email: c.customer_email,
      total_spent: parseFloat(c.total_spent) || 0,
      point: c.point || 0,
      order_count: c.order_count || 0,
      last_purchase: c.last_purchase ? new Date(c.last_purchase).toLocaleDateString() : '-'
    }))
  } catch (err) {
    error.value = `Failed to load customers: ${err.response?.data?.message || err.message || 'Unknown error'}`
    console.error('Error fetching customers:', err)
    customers.value = []
  } finally {
    loading.value = false
  }
}

// View purchase history for selected customer
const viewPurchaseHistory = async (customer) => {
  selectedCustomer.value = customer
  try {
    const response = await api.get(`/reports/customers/${encodeURIComponent(customer.name)}`)
    purchaseHistory.value = response.data || []
    showHistoryModal.value = true
  } catch (err) {
    console.error('Error fetching purchase history:', err)
    purchaseHistory.value = []
    showHistoryModal.value = true
  }
}

const formatNumber = (value) => {
  const num = parseFloat(value)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPercentage = (value) => {
  const max = Math.max(...customers.value.map(c => parseFloat(c.total_spent) || 0), 1)
  return ((parseFloat(value) || 0) / max) * 100
}

onMounted(() => {
  fetchCustomers()
})
</script>

<style scoped>
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

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>