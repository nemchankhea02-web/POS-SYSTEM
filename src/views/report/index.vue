<template>
  <div class="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    <div class="flex items-center gap-2 mb-2">
      <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
      <h2 class="text-2xl font-bold text-slate-800">Sales Report</h2>
    </div>
    <p class="text-slate-500 text-sm mb-6 ml-9">Sales statistics and performance analysis</p>

    <div v-if="error" class="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- Date Filter -->
    <div class="bg-white rounded-xl shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Period</label>
          <select v-model="period" @change="onPeriodChange" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year (2026)</option>
            <option value="2025">Year 2025</option>
            <option value="all">All Time</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        <div v-if="period === 'custom'">
          <label class="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <input type="date" v-model="customStartDate" class="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
        <div v-if="period === 'custom'">
          <label class="block text-sm font-medium text-slate-700 mb-1">End Date</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <input type="date" v-model="customEndDate" class="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
        <div class="flex gap-2 items-end" :class="period === 'custom' ? 'col-span-2' : 'col-span-3'">
          <button @click="fetchData" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Generate
          </button>
          <button @click="exportToExcel" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
            </svg>
            Export Excel
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="text-gray-500 mt-2">Loading sales data...</p>
    </div>

    <div v-else>
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-blue-100 text-sm">Total Sales</p>
              <h3 class="text-2xl font-bold">{{ formatPrice(totalSales) }}</h3>
              <p class="text-xs text-blue-100">{{ transactionCount }} transactions</p>
            </div>
            <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-green-100 text-sm">Average Order</p>
              <h3 class="text-2xl font-bold">{{ formatPrice(avgOrder) }}</h3>
            </div>
            <svg class="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-orange-100 text-sm">Highest Sale</p>
              <h3 class="text-2xl font-bold">{{ formatPrice(highestSale) }}</h3>
            </div>
            <svg class="w-8 h-8 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
        </div>
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-purple-100 text-sm">Today's Sales</p>
              <h3 class="text-2xl font-bold">{{ formatPrice(todaySales) }}</h3>
            </div>
            <svg class="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        <div class="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white shadow-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-teal-100 text-sm">{{ selectedYear }} Sales</p>
              <h3 class="text-2xl font-bold">{{ formatPrice(yearSales) }}</h3>
            </div>
            <svg class="w-8 h-8 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Sales Table -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="px-4 py-3 border-b bg-gray-50">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 class="font-semibold text-gray-700">Daily Sales Summary</h3>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Orders</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Total Sales</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Avg Order</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Items Sold</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in sales" :key="day.date" class="border-t hover:bg-gray-50 transition">
                <td class="px-4 py-3 text-sm text-gray-700">{{ day.date }}</td>
                <td class="px-4 py-3 text-right font-semibold text-sm text-gray-800">{{ day.order_count || 0 }}</td>
                <td class="px-4 py-3 text-right font-bold text-green-600 text-sm">{{ formatPrice(day.total_sales) }}</td>
                <td class="px-4 py-3 text-right text-sm text-gray-600">{{ formatPrice(day.avg_order) }}</td>
                <td class="px-4 py-3 text-right text-sm text-gray-600">{{ day.total_items || 0 }}</td>
              </tr>
              <tr v-if="sales.length === 0">
                <td colspan="5" class="text-center py-12 text-gray-400">
                  <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <p>No sales data for selected period</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Sales List -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden mt-6">
        <div class="px-4 py-3 border-b bg-gray-50">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="font-semibold text-gray-700">Recent Transactions</h3>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">Receipt #</th>
                <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">Customer</th>
                <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
                <th class="px-4 py-2 text-right text-sm font-semibold text-gray-600">Amount</th>
                <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in recentSales" :key="sale.id" class="border-t hover:bg-gray-50 transition">
                <td class="px-4 py-2 text-sm font-mono text-gray-600">{{ sale.receipt_number }}</td>
                <td class="px-4 py-2 text-sm text-gray-700">{{ sale.customer_name || 'Walk-in' }}</td>
                <td class="px-4 py-2 text-sm text-gray-500">{{ formatDateTime(sale.created_at) }}</td>
                <td class="px-4 py-2 text-right font-bold text-green-600">{{ formatPrice(sale.total_amount) }}</td>
                <td class="px-4 py-2 text-sm">
                  <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">{{ sale.payment_method || 'Cash' }}</span>
                </td>
              </tr>
              <tr v-if="recentSales.length === 0">
                <td colspan="5" class="text-center py-8 text-gray-400">
                  <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <p>No recent transactions</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api.js'; 
const sales = ref([])
const recentSales = ref([])
const period = ref('year')
const customStartDate = ref('')
const customEndDate = ref('')
const loading = ref(false)
const error = ref('')
const currencySymbol = ref('$')
const selectedYear = ref('2026')
const yearSales = ref(0)

// Summary stats
const totalSales = ref(0)
const transactionCount = ref(0)
const avgOrder = ref(0)
const highestSale = ref(0)
const todaySales = ref(0)
const totalItemsSold = ref(0)

const api = axios.create({ baseURL: 'http://localhost:3002' })
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const formatPrice = (value) => {
  const num = parseFloat(value)
  if (isNaN(num)) return `${currencySymbol.value}0.00`
  return `${currencySymbol.value}${num.toFixed(2)}`
}

const fetchCurrency = async () => {
  try {
    const res = await api.get('/company/info')
    if (res.data && res.data.currency) {
      currencySymbol.value = res.data.currency === 'KHR' ? '៛' : '$'
    }
  } catch (err) {
    console.error('Error fetching currency:', err)
  }
}

// Get date range based on period
const getDateRange = () => {
  const today = new Date()
  const endDate = today.toISOString().split('T')[0]
  let startDate = endDate

  if (period.value === 'custom' && customStartDate.value && customEndDate.value) {
    return { startDate: customStartDate.value, endDate: customEndDate.value, year: null }
  }

  switch (period.value) {
    case 'today':
      startDate = endDate
      break
    case 'week':
      const pastWeek = new Date(today)
      pastWeek.setDate(today.getDate() - 6)
      startDate = pastWeek.toISOString().split('T')[0]
      break
    case 'month':
      const pastMonth = new Date(today)
      pastMonth.setMonth(today.getMonth() - 1)
      startDate = pastMonth.toISOString().split('T')[0]
      break
    case '2025':
      selectedYear.value = '2025'
      return { startDate: null, endDate: null, year: 2025 }
    case 'year':
      selectedYear.value = '2026'
      return { startDate: null, endDate: null, year: 2026 }
    case 'all':
      selectedYear.value = 'All Time'
      return { startDate: null, endDate: null, year: null }
  }
  return { startDate, endDate, year: null }
}

// Fetch sales data
const fetchData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { startDate, endDate, year } = getDateRange()
    
    let url = '/reports/sales'
    let params = {}
    
    if (year) {
      params.year = year
      selectedYear.value = year
    } else if (startDate && endDate) {
      params.startDate = startDate
      params.endDate = endDate
      selectedYear.value = `${startDate} to ${endDate}`
    } else {
      selectedYear.value = 'All Time'
    }
    
    const response = await api.get(url, { params })
    
    const data = response.data
    sales.value = data.dailySales || []
    recentSales.value = data.recentSales || []
    
    // Calculate summary
    const summary = data.summary || {}
    totalSales.value = parseFloat(summary.total_revenue) || 0
    transactionCount.value = parseInt(summary.total_orders) || 0
    avgOrder.value = parseFloat(summary.average_order) || 0
    totalItemsSold.value = parseInt(summary.total_items) || 0
    
    // Calculate highest sale
    highestSale.value = sales.value.length > 0 
      ? Math.max(...sales.value.map(s => parseFloat(s.total_sales) || 0)) 
      : 0
    
    // Calculate today's sales
    const todayStr = new Date().toISOString().split('T')[0]
    todaySales.value = sales.value
      .filter(s => s.date === todayStr)
      .reduce((sum, s) => sum + (parseFloat(s.total_sales) || 0), 0)
    
    // Year sales for display
    if (year) {
      yearSales.value = totalSales.value
    }
      
  } catch (err) { 
    error.value = err.response?.data?.message || err.message || 'Failed to load report'
    console.error('Error fetching sales report:', err)
  } finally {
    loading.value = false
  }
}

const onPeriodChange = () => {
  if (period.value !== 'custom') {
    customStartDate.value = ''
    customEndDate.value = ''
    fetchData()
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Export to Excel
const exportToExcel = () => {
  if (sales.value.length === 0) {
    alert('No data to export')
    return
  }
  
  const headers = ['Date', 'Orders', 'Total Sales', 'Average Order', 'Items Sold']
  const rows = sales.value.map(s => [
    s.date,
    s.order_count || 0,
    s.total_sales,
    s.avg_order,
    s.total_items || 0
  ])
  
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `sales_report_${new Date().toISOString().split('T')[0]}.csv`
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