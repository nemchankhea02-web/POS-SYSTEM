<template>
  <div class="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-1">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
        </svg>
        <h2 class="text-2xl font-bold text-slate-800">Sale Tracking</h2>
      </div>
      <p class="text-slate-500 text-sm mt-1">Track and monitor all sales from checkout</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white cursor-pointer hover:scale-105 transition-transform" @click="filterAllSales">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-blue-100 text-sm">Total Sales</p>
            <h3 class="text-2xl font-bold mt-1">${{ formatNumber(totalSalesAmount) }}</h3>
            <p class="text-xs text-blue-100 mt-1">{{ totalSalesCount }} transactions</p>
          </div>
          <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-green-100 text-sm">Average Order</p>
            <h3 class="text-2xl font-bold mt-1">${{ formatNumber(averageOrder) }}</h3>
          </div>
          <svg class="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
      </div>
      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-orange-100 text-sm">Today's Sales</p>
            <h3 class="text-2xl font-bold mt-1">${{ formatNumber(todaySales) }}</h3>
          </div>
          <svg class="w-8 h-8 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      </div>
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-purple-100 text-sm">Highest Sale</p>
            <h3 class="text-2xl font-bold mt-1">${{ formatNumber(highestSale) }}</h3>
          </div>
          <svg class="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Search Filters -->
    <div class="bg-white rounded-xl shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Receipt Number</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              v-model="searchReceipt" 
              type="text" 
              placeholder="REC-xxxxx"
              class="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Date From</label>
          <input 
            type="date" 
            v-model="dateFrom" 
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Date To</label>
          <input 
            type="date" 
            v-model="dateTo" 
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
          <select v-model="paymentMethod" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="all">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="ABA Bank">ABA Bank</option>
            <option value="ACLEDA">ACLEDA</option>
            <option value="Wing">Wing</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <div class="flex gap-2 items-end">
          <button @click="searchSales" class="bg-blue-600 text-white px-4 py-2 rounded-lg flex-1 hover:bg-blue-700 transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Search
          </button>
          <button @click="resetFilters" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Sales Table -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold text-slate-600">Receipt No</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-slate-600">Date & Time</th>
              <th class="px-4 py-3 text-right text-sm font-semibold text-slate-600">Total Amount</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-slate-600">Payment Method</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in filteredSales" :key="sale.id" class="border-t hover:bg-gray-50 transition">
              <td class="px-4 py-3 font-mono text-sm font-semibold text-slate-700">{{ sale.receipt_number }}</td>
              <td class="px-4 py-3 text-sm text-slate-600">{{ formatDateTime(sale.created_at) }}</td>
              <td class="px-4 py-3 text-right font-bold text-green-600">${{ formatNumber(sale.total_amount) }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="getPaymentBadgeClass(sale.payment_method)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ sale.payment_method || 'Cash' }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="viewDetails(sale)" class="text-blue-600 hover:text-blue-800 transition p-1" title="View Details">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button @click="printReceipt(sale)" class="text-green-600 hover:text-green-800 transition p-1" title="Print Receipt">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredSales.length === 0 && !loading">
              <td colspan="5" class="text-center py-12 text-gray-400">
                <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <p>No sales found</p>
                <p class="text-xs mt-1">Sales from checkout will appear here</p>
              </td>
            </tr>
            <tr v-if="loading">
              <td colspan="5" class="text-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p class="text-gray-500 mt-2">Loading sales...</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sale Details Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50" @click.self="showModal = false">
      <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-300 animate-fadeIn">
        <div class="flex justify-between items-center mb-4 pb-2 border-b">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="font-bold text-lg text-slate-800">Sale Details</h3>
          </div>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 transition p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between py-2 border-b">
            <span class="text-slate-600">Receipt No:</span>
            <span class="font-mono font-semibold text-blue-600">{{ selectedSale?.receipt_number }}</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span class="text-slate-600">Customer:</span>
            <span class="font-semibold">{{ selectedSale?.customer_name || 'Walk-in Customer' }}</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span class="text-slate-600">Phone:</span>
            <span>{{ selectedSale?.customer_phone || '-' }}</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span class="text-slate-600">Date & Time:</span>
            <span class="text-sm">{{ formatDateTime(selectedSale?.created_at) }}</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span class="text-slate-600">Total Amount:</span>
            <span class="font-bold text-green-600 text-lg">${{ formatNumber(selectedSale?.total_amount) }}</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span class="text-slate-600">Payment Method:</span>
            <span class="font-medium">{{ selectedSale?.payment_method || 'Cash' }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-slate-600">Status:</span>
            <span class="text-green-600 font-medium flex items-center gap-1">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              Completed
            </span>
          </div>
        </div>
        <button @click="printSelectedReceipt" class="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
          </svg>
          Print Receipt
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../api.js'; 
const sales = ref([])
const loading = ref(false)
const searchReceipt = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const paymentMethod = ref('all')
const showModal = ref(false)
const selectedSale = ref(null)

// Statistics
const totalSalesAmount = ref(0)
const totalSalesCount = ref(0)
const averageOrder = ref(0)
const todaySales = ref(0)
const highestSale = ref(0)

const api = axios.create({ baseURL: 'http://localhost:3002' })
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Filtered Sales
const filteredSales = computed(() => {
  let result = [...sales.value]
  
  if (searchReceipt.value) {
    result = result.filter(s => 
      s.receipt_number?.toLowerCase().includes(searchReceipt.value.toLowerCase())
    )
  }
  
  if (dateFrom.value) {
    result = result.filter(s => s.created_at?.split('T')[0] >= dateFrom.value)
  }
  
  if (dateTo.value) {
    result = result.filter(s => s.created_at?.split('T')[0] <= dateTo.value)
  }
  
  if (paymentMethod.value !== 'all') {
    result = result.filter(s => s.payment_method === paymentMethod.value)
  }
  
  return result
})

// Fetch sales from database
const fetchSales = async () => {
  loading.value = true
  try {
    const params = {
      startDate: dateFrom.value || undefined,
      endDate: dateTo.value || undefined
    }
    const response = await api.get('/reports/sale-tracking', { params })
    sales.value = response.data || []
    calculateStatistics()
  } catch (err) {
    console.error('Error fetching sales:', err)
    alert(`Error loading sales: ${err.response?.data?.message || err.message || 'Unknown error'}`)
    sales.value = []
  } finally {
    loading.value = false
  }
}

// Calculate statistics
const calculateStatistics = () => {
  const amounts = sales.value.map(s => parseFloat(s.total_amount) || 0)
  totalSalesAmount.value = amounts.reduce((sum, amt) => sum + amt, 0)
  totalSalesCount.value = sales.value.length
  averageOrder.value = totalSalesCount.value > 0 ? totalSalesAmount.value / totalSalesCount.value : 0
  highestSale.value = amounts.length > 0 ? Math.max(...amounts) : 0
  
  // Today's sales
  const today = new Date().toISOString().split('T')[0]
  todaySales.value = sales.value
    .filter(s => s.created_at?.split('T')[0] === today)
    .reduce((sum, s) => sum + (parseFloat(s.total_amount) || 0), 0)
}

// Search function
const searchSales = async () => {
  await fetchSales()
}

const resetFilters = async () => {
  searchReceipt.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  paymentMethod.value = 'all'
  await fetchSales()
}

const filterAllSales = () => {
  resetFilters()
}

const viewDetails = (sale) => {
  selectedSale.value = sale
  showModal.value = true
}

const printReceipt = (sale) => {
  const printWindow = window.open('', '_blank', 'width=400,height=600')
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${sale.receipt_number}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; padding: 20px; font-size: 12px; line-height: 1.5; }
          .text-center { text-align: center; }
          .border { border-top: 1px dashed #ccc; margin: 10px 0; }
          .flex { display: flex; justify-content: space-between; margin: 5px 0; }
          .font-bold { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="text-center">
          <h2>POS SYSTEM</h2>
          <p>Your Store Address</p>
          <p>Tel: 123-456-7890</p>
        </div>
        <div class="border"></div>
        <div class="flex"><span>Receipt:</span><span class="font-bold">${sale.receipt_number}</span></div>
        <div class="flex"><span>Date:</span><span>${new Date(sale.created_at).toLocaleString()}</span></div>
        <div class="flex"><span>Customer:</span><span>${sale.customer_name || 'Walk-in Customer'}</span></div>
        <div class="border"></div>
        <div class="flex"><span>Total:</span><span class="font-bold">$${parseFloat(sale.total_amount).toFixed(2)}</span></div>
        <div class="flex"><span>Payment:</span><span>${sale.payment_method || 'Cash'}</span></div>
        <div class="border"></div>
        <div class="text-center">
          <p class="font-bold">Thank you for your business!</p>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
    printWindow.close()
  }
}

const printSelectedReceipt = () => {
  if (selectedSale.value) {
    printReceipt(selectedSale.value)
  }
}

const formatNumber = (value) => {
  const num = parseFloat(value)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

const formatDateTime = (dateString) => {
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

const getPaymentBadgeClass = (method) => {
  const classes = {
    'Cash': 'bg-green-100 text-green-700',
    'ABA Bank': 'bg-blue-100 text-blue-700',
    'ACLEDA': 'bg-purple-100 text-purple-700',
    'Wing': 'bg-orange-100 text-orange-700',
    'Bank Transfer': 'bg-gray-100 text-gray-700'
  }
  return classes[method] || 'bg-gray-100 text-gray-700'
}

onMounted(() => {
  fetchSales()
  setInterval(fetchSales, 30000)
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