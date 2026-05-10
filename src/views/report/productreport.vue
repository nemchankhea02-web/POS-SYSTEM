<template>
  <div class="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center gap-2">
        <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
        <h2 class="text-2xl font-bold text-slate-800">Product Report</h2>
      </div>
      <button @click="fetchData" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Refresh
      </button>
    </div>
    <p class="text-slate-500 text-sm mb-6 ml-9">Product performance and inventory analysis</p>

    <!-- Error Alert -->
    <div v-if="error" class="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="text-gray-500 mt-2">Loading product data...</p>
    </div>

    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg cursor-pointer hover:scale-105 transition-transform" @click="goToProducts">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-blue-100 text-sm">Total Products</p>
              <h3 class="text-2xl font-bold">{{ totalProducts }}</h3>
            </div>
            <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
        </div>
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-green-100 text-sm">Total Items Sold</p>
              <h3 class="text-2xl font-bold">{{ totalSold }}</h3>
            </div>
            <svg class="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
        </div>
        <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white shadow-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-yellow-100 text-sm">Low Stock Items (≤10)</p>
              <h3 class="text-2xl font-bold text-yellow-100">{{ lowStockCount }}</h3>
            </div>
            <svg class="w-8 h-8 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        </div>
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-purple-100 text-sm">Total Revenue</p>
              <h3 class="text-2xl font-bold">{{ formatPrice(totalRevenue) }}</h3>
              <p class="text-xs text-purple-200 mt-1">Excluding VAT</p>
            </div>
            <svg class="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- VAT Note Card -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p class="text-yellow-700 text-sm font-semibold">Note</p>
              <p class="text-yellow-600 text-xs">Product revenue excludes VAT (5%). Sales report includes VAT.</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500">Product Revenue (excl. VAT)</p>
            <p class="font-bold text-green-600 text-lg">{{ formatPrice(totalRevenue) }}</p>
            <p class="text-xs text-gray-500 mt-1">With VAT (+5%): {{ formatPrice(totalRevenue * 1.05) }}</p>
          </div>
        </div>
      </div>

      <!-- Top Selling Products -->
      <div class="bg-white rounded-xl shadow-md p-5 mb-6">
        <div class="flex items-center gap-2 mb-4">
          <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
          <h3 class="font-semibold text-lg text-slate-800">Top Selling Products</h3>
        </div>
        <div class="space-y-3">
          <div v-for="(p, idx) in topProducts" :key="idx" class="flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
              {{ idx+1 }}
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-800">{{ p.name }}</span>
                <span class="font-bold text-blue-600">{{ p.sold }} sold</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div class="bg-blue-600 h-2 rounded-full" :style="{ width: getPercent(p.sold) + '%' }"></div>
              </div>
            </div>
          </div>
          <div v-if="topProducts.length === 0" class="text-center py-4 text-gray-400">
            No sales data available
          </div>
        </div>
      </div>

      <!-- Product Table -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="px-4 py-3 border-b bg-gray-50">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 class="font-semibold text-gray-700">Product Inventory</h3>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Product Name</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Price</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Sold</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Stock</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Revenue</th>
                <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in products" :key="p.id" class="border-t hover:bg-gray-50 transition">
                <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ p.name }}</td>
                <td class="px-4 py-3 text-sm">
                  <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{{ p.category || 'Uncategorized' }}</span>
                </td>
                <td class="px-4 py-3 text-right text-sm text-gray-700">{{ formatPrice(p.price) }}</td>
                <td class="px-4 py-3 text-right text-sm font-semibold text-gray-800">{{ p.sold || 0 }}</td>
                <td class="px-4 py-3 text-right text-sm" :class="(p.stock || 0) <= 10 ? 'text-red-500 font-bold' : 'text-gray-700'">
                  {{ p.stock || 0 }}
                  <span v-if="(p.stock || 0) <= 10" class="ml-1 inline-block">
                    <svg class="w-3 h-3 inline text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </span>
                </td>
                <td class="px-4 py-3 text-right text-sm text-green-600 font-bold">{{ formatPrice(p.revenue) }}</td>
                <td class="px-4 py-3 text-center">
                  <span :class="getStatusClass(p.stock)" class="px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDot(p.stock)"></span>
                    {{ getStatusText(p.stock) }}
                  </span>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="7" class="text-center py-12 text-gray-400">
                  <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                  <p>No products found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Export Button -->
      <div class="mt-6 flex justify-end">
        <button @click="exportToExcel" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
          </svg>
          Export to Excel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const products = ref([])
const topProducts = ref([])
const totalProducts = ref(0)
const totalSold = ref(0)
const lowStockCount = ref(0)
const totalRevenue = ref(0)
const loading = ref(false)
const error = ref('')
const currencySymbol = ref('$')

const api = axios.create({ baseURL: 'http://localhost:3002' })
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Status functions with LOW STOCK = ≤10
const getStatusText = (stock) => {
  const s = Number(stock) || 0
  if (s === 0) return 'Out of Stock'
  if (s <= 10) return 'Low Stock'
  if (s <= 20) return 'Running Low'
  return 'In Stock'
}

const getStatusClass = (stock) => {
  const s = Number(stock) || 0
  if (s === 0) return 'bg-red-100 text-red-700'
  if (s <= 10) return 'bg-yellow-100 text-yellow-700'
  if (s <= 20) return 'bg-orange-100 text-orange-700'
  return 'bg-green-100 text-green-700'
}

const getStatusDot = (stock) => {
  const s = Number(stock) || 0
  if (s === 0) return 'bg-red-500'
  if (s <= 10) return 'bg-yellow-500'
  if (s <= 20) return 'bg-orange-500'
  return 'bg-green-500'
}

const formatPrice = (value) => {
  const num = parseFloat(value)
  if (isNaN(num)) return `${currencySymbol.value}0.00`
  return `${currencySymbol.value}${num.toFixed(2)}`
}

const fetchCurrency = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return
    const response = await api.get('/company/info')
    if (response.data && response.data.currency) {
      currencySymbol.value = response.data.currency === 'KHR' ? '៛' : '$'
    }
  } catch (err) {
    console.error('Error fetching currency:', err)
  }
}

const fetchData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const res = await api.get('/reports/products')
    const data = res.data || []
    
    products.value = data.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: parseFloat(p.price) || 0,
      sold: parseInt(p.total_sold) || 0,
      revenue: parseFloat(p.total_revenue) || 0,
      stock: parseInt(p.current_stock) || 0
    }))
    
    // Calculate statistics
    totalProducts.value = products.value.length
    totalSold.value = products.value.reduce((sum, p) => sum + (p.sold || 0), 0)
    lowStockCount.value = products.value.filter(p => (p.stock || 0) <= 10).length  // Changed to 10
    totalRevenue.value = products.value.reduce((sum, p) => sum + (parseFloat(p.revenue) || 0), 0)
    
    // Top 5 selling products
    topProducts.value = [...products.value]
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5)
      
  } catch (err) { 
    error.value = err.response?.data?.message || err.message || 'Failed to load products'
    console.error('Error fetching product report:', err)
  } finally {
    loading.value = false
  }
}

const goToProducts = () => {
  router.push('/products')
}

const getPercent = (sold) => {
  const max = Math.max(...topProducts.value.map(p => p.sold || 0), 1)
  return ((sold || 0) / max) * 100
}

const formatNumber = (n) => {
  const num = parseFloat(n)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

const exportToExcel = () => {
  if (products.value.length === 0) {
    alert('No data to export')
    return
  }
  
  const headers = ['Product Name', 'Category', 'Price', 'Units Sold', 'Current Stock', 'Revenue (excl. VAT)', 'Status']
  const rows = products.value.map(p => [
    `"${p.name}"`,
    p.category || 'Uncategorized',
    formatNumber(p.price),
    p.sold || 0,
    p.stock || 0,
    formatNumber(p.revenue),
    getStatusText(p.stock)
  ])
  
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `product_report_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
  alert('Report exported successfully!')
}

onMounted(() => {
  fetchCurrency()
  fetchData()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>