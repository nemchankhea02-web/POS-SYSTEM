<template>
  <div class="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <div class="flex items-center gap-2">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <h1 class="text-3xl font-bold text-slate-800">Stock Tracking</h1>
          </div>
          <p class="text-slate-500 mt-1 ml-9">Monitor product inventory levels</p>
        </div>
        <div class="flex gap-3">
          <button 
            @click="exportToExcel" 
            class="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md"
            :disabled="products.length === 0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
            </svg>
            Export CSV
          </button>
          <button 
            @click="fetchStockData" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Alerts -->
    <div v-if="error" class="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {{ error }}
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="relative">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="text-gray-500 mt-3">Loading inventory...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        <div class="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all cursor-pointer" @click="search = ''">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Total Products</p>
              <p class="text-3xl font-bold text-gray-800 mt-1">{{ products.length }}</p>
            </div>
            <div class="bg-blue-100 rounded-full p-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all cursor-pointer" @click="search = ''">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">In Stock</p>
              <p class="text-3xl font-bold text-green-600 mt-1">{{ inStockCount }}</p>
            </div>
            <div class="bg-green-100 rounded-full p-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all cursor-pointer" @click="searchLowStock">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Low Stock (≤10)</p>
              <p class="text-3xl font-bold text-yellow-600 mt-1">{{ lowStockCount }}</p>
            </div>
            <div class="bg-yellow-100 rounded-full p-3">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all cursor-pointer" @click="searchOutOfStock">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Out of Stock</p>
              <p class="text-3xl font-bold text-red-600 mt-1">{{ outOfStockCount }}</p>
            </div>
            <div class="bg-red-100 rounded-full p-3">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Inventory Value</p>
              <p class="text-3xl font-bold text-purple-600 mt-1">${{ formatNumber(totalValue) }}</p>
            </div>
            <div class="bg-purple-100 rounded-full p-3">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="bg-white rounded-xl shadow-md p-4 mb-6">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            v-model="search" 
            type="text"
            placeholder="Search product by name or barcode..." 
            class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Barcode</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Value</th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(product, index) in filteredProducts" :key="product.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-500">{{ index + 1 }}</td>
                <td class="px-6 py-4">
                  <div class="font-semibold text-gray-800">{{ product.name }}</div>
                </td>
                <td class="px-6 py-4 text-sm font-mono text-gray-500">{{ product.barcode || '-' }}</td>
                <td class="px-6 py-4">
                  <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">{{ product.category || 'Uncategorized' }}</span>
                </td>
                <td class="px-6 py-4 text-right font-bold text-green-600">${{ formatNumber(product.price) }}</td>
                <td class="px-6 py-4 text-center">
                  <span class="font-bold text-lg">{{ product.stock || 0 }}</span>
                </td>
                <td class="px-6 py-4 text-right font-semibold text-purple-600">
                  ${{ formatNumber((product.stock || 0) * product.price) }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span :class="getStatusClass(product.stock)" class="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full" :class="getStatusDot(product.stock)"></span>
                    {{ getStatusText(product.stock) }}
                  </span>
                </td>
              </tr>
              <tr v-if="filteredProducts.length === 0">
                <td colspan="8" class="text-center py-12">
                  <div class="text-gray-400">
                    <svg class="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                    <p>No products found</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>Showing {{ filteredProducts.length }} of {{ products.length }} products</span>
            <span>Total Inventory Value: <strong class="text-purple-600">${{ formatNumber(totalValue) }}</strong></span>
            <span>Last updated: {{ lastUpdated }}</span>
          </div>
        </div>
      </div>

      <!-- Low Stock Warning Section -->
      <div v-if="lowStockProducts.length > 0" class="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h3 class="font-semibold text-yellow-800">Low Stock Alert (10 units or less)</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div v-for="product in lowStockProducts" :key="product.id" class="bg-white rounded-lg p-3 border border-yellow-200">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium text-gray-800">{{ product.name }}</p>
                <p class="text-xs text-gray-500 mt-1">Stock: {{ product.stock }} units left</p>
              </div>
              <span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">LOW</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Out of Stock Section -->
      <div v-if="outOfStockProducts.length > 0" class="mt-4 bg-red-50 border border-red-200 rounded-xl p-5">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <h3 class="font-semibold text-red-800">Out of Stock Products</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div v-for="product in outOfStockProducts" :key="product.id" class="bg-white rounded-lg p-3 border border-red-200">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium text-gray-800">{{ product.name }}</p>
                <p class="text-xs text-gray-500 mt-1">No stock available</p>
              </div>
              <span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">OUT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/api.js';
import { ref, computed, onMounted } from "vue"
const search = ref("")
const products = ref([])
const loading = ref(false)
const error = ref("")
const lastUpdated = ref("")

// Fetch products
const fetchStockData = async () => {
  loading.value = true
  error.value = ""
  try {
    const res = await axios.get("http://localhost:3002/products")
    products.value = res.data || []
    lastUpdated.value = new Date().toLocaleTimeString()
  } catch (err) {
    error.value = "Failed to load products. Make sure server is running."
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Search filters
const searchLowStock = () => {
  search.value = "lowstock"
  setTimeout(() => {
    search.value = ""
  }, 100)
}

const searchOutOfStock = () => {
  search.value = "outofstock"
  setTimeout(() => {
    search.value = ""
  }, 100)
}

// Computed stats
const inStockCount = computed(() => products.value.filter(p => (p.stock || 0) > 10).length)
const lowStockCount = computed(() => products.value.filter(p => (p.stock || 0) <= 10 && (p.stock || 0) > 0).length)
const outOfStockCount = computed(() => products.value.filter(p => (p.stock || 0) === 0).length)
const totalValue = computed(() => products.value.reduce((sum, p) => sum + ((p.stock || 0) * p.price), 0))

const lowStockProducts = computed(() => products.value.filter(p => (p.stock || 0) <= 10 && (p.stock || 0) > 0).sort((a, b) => a.stock - b.stock))
const outOfStockProducts = computed(() => products.value.filter(p => (p.stock || 0) === 0))

// Filter products
const filteredProducts = computed(() => {
  let filtered = products.value
  
  if (search.value === "lowstock") {
    filtered = filtered.filter(p => (p.stock || 0) <= 10 && (p.stock || 0) > 0)
  } else if (search.value === "outofstock") {
    filtered = filtered.filter(p => (p.stock || 0) === 0)
  } else if (search.value) {
    filtered = filtered.filter(p => 
      p.name?.toLowerCase().includes(search.value.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(search.value.toLowerCase())
    )
  }
  
  return filtered
})

// Status helpers
const getStatusText = (stock) => {
  const s = Number(stock) || 0
  if (s === 0) return "Out of Stock"
  if (s <= 10) return "Low Stock"
  return "In Stock"
}

const getStatusClass = (stock) => {
  const s = Number(stock) || 0
  if (s === 0) return "bg-red-100 text-red-700"
  if (s <= 10) return "bg-yellow-100 text-yellow-700"
  return "bg-green-100 text-green-700"
}

const getStatusDot = (stock) => {
  const s = Number(stock) || 0
  if (s === 0) return "bg-red-500"
  if (s <= 10) return "bg-yellow-500"
  return "bg-green-500"
}

// Format number
const formatNumber = (value) => {
  const num = parseFloat(value)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

// Export to CSV
const exportToExcel = () => {
  const headers = ["Product Name", "Barcode", "Category", "Price", "Stock", "Inventory Value", "Status"]
  const rows = filteredProducts.value.map(p => [
    `"${p.name}"`,
    p.barcode || '-',
    p.category || 'Uncategorized',
    p.price,
    p.stock || 0,
    ((p.stock || 0) * p.price).toFixed(2),
    getStatusText(p.stock)
  ])
  
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `stock_report_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  fetchStockData()
  // Auto refresh every 30 seconds
  const interval = setInterval(() => {
    if (!loading.value) fetchStockData()
  }, 30000)
  
  // Cleanup interval on component unmount
  return () => clearInterval(interval)
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