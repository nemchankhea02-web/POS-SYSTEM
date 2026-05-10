<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <!-- Error Alert -->
    <div v-if="error" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline"> {{ error }}</span>
      <button @click="error = null" class="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.03a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
        </svg>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="text-gray-600 mt-2">Loading dashboard...</p>
    </div>

    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <!-- Total Sales Card -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg cursor-pointer hover:scale-105 transition-transform" @click="goTo('salesreport')">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-blue-100 text-sm">Total Sales (All Time)</p>
              <h2 class="text-3xl font-bold mt-2">{{ formatPrice(stats.totalSales) }}</h2>
              <p class="text-blue-100 text-xs mt-1">{{ stats.totalOrders }} transactions</p>
            </div>
            <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="mt-3 text-xs text-blue-100">
            <span v-if="stats.salesGrowth > 0">↑ {{ stats.salesGrowth }}% from yesterday</span>
            <span v-else-if="stats.salesGrowth < 0">↓ {{ Math.abs(stats.salesGrowth) }}% from yesterday</span>
            <span v-else>No change from yesterday</span>
          </div>
        </div>

        <!-- Products Card -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg cursor-pointer hover:scale-105 transition-transform" @click="goTo('products')">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-green-100 text-sm">Products</p>
              <h2 class="text-3xl font-bold mt-2">{{ stats.totalProducts }}</h2>
              <p v-if="stats.lowStock > 0" class="text-yellow-200 text-xs mt-1">{{ stats.lowStock }} low stock</p>
              <p v-else class="text-green-100 text-xs mt-1">All stock levels good</p>
            </div>
            <svg class="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
        </div>

        <!-- Users Card -->
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg cursor-pointer hover:scale-105 transition-transform" @click="goTo('user')">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-purple-100 text-sm">Users</p>
              <h2 class="text-3xl font-bold mt-2">{{ stats.userCount }}</h2>
              <p class="text-purple-100 text-xs mt-1">{{ stats.adminCount }} administrators</p>
            </div>
            <svg class="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Today's Sales Card -->
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg cursor-pointer hover:scale-105 transition-transform" @click="goTo('salesreport')">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-orange-100 text-sm">Today's Sales</p>
              <h2 class="text-3xl font-bold mt-2">{{ formatPrice(stats.todaySales) }}</h2>
              <p class="text-orange-100 text-xs mt-1">Yesterday: {{ formatPrice(stats.yesterdaySales) }}</p>
            </div>
            <svg class="w-8 h-8 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>

        <!-- 2026 Sales Card -->
        <div class="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-5 text-white shadow-lg cursor-pointer hover:scale-105 transition-transform" @click="goTo('salesreport')">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-teal-100 text-sm">{{ currentYear }} Sales</p>
              <h2 class="text-3xl font-bold mt-2">{{ formatPrice(stats.thisYearSales) }}</h2>
            </div>
            <svg class="w-8 h-8 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Top Products Chart -->
        <div class="bg-white rounded-xl shadow-md p-5">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
            <h3 class="font-semibold text-lg text-slate-800">Top Selling Products</h3>
          </div>
          <div class="space-y-3">
            <div v-for="(product, idx) in stats.topProducts" :key="idx" class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                {{ idx + 1 }}
              </div>
              <div class="flex-1">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-slate-700">{{ product.name }}</span>
                  <span class="text-sm font-bold text-blue-600">{{ product.total_sold }} sold</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" :style="{ width: getMaxPercentage(product.total_sold) + '%' }"></div>
                </div>
              </div>
            </div>
            <div v-if="!stats.topProducts || stats.topProducts.length === 0" class="text-center text-gray-500 py-6">
              No sales data available
            </div>
          </div>
        </div>

        <!-- Daily Sales Chart -->
        <div class="bg-white rounded-xl shadow-md p-5">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <h3 class="font-semibold text-lg text-slate-800">Last 7 Days Sales (Cambodia Time)</h3>
          </div>
          <div class="space-y-3">
            <div v-for="day in stats.dailySales" :key="day.date" class="flex items-center gap-3">
              <div class="w-28 text-sm text-slate-600">{{ day.date }}</div>
              <div class="flex-1">
                <div class="w-full bg-gray-200 rounded-full h-8">
                  <div class="bg-green-500 h-8 rounded-full flex items-center justify-end px-2 text-white text-xs font-medium" 
                       :style="{ width: getDailyPercentage(day.total) + '%' }">
                    {{ formatPrice(day.total) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!stats.dailySales || stats.dailySales.length === 0" class="text-center text-gray-500 py-6">
              No sales data for last 7 days
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Sales & Logins -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Recent Sales -->
        <div class="bg-white rounded-xl shadow-md p-5">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <h3 class="font-semibold text-lg text-slate-800">Recent Sales</h3>
            </div>
            <router-link to="/salesreport" class="text-blue-600 text-sm hover:underline">View All →</router-link>
          </div>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div v-for="(sale, idx) in stats.recentSales" :key="idx" class="p-3 rounded-lg hover:bg-slate-50 transition border border-gray-100">
              <div class="flex justify-between items-center">
                <div>
                  <span class="font-medium text-sm text-slate-800">{{ sale.receipt_number }}</span>
                  <p class="text-xs text-slate-500 mt-1">{{ formatDateTime(sale.created_at) }}</p>
                </div>
                <div class="text-right">
                  <span class="text-green-600 font-bold">{{ formatPrice(sale.total_amount) }}</span>
                  <p class="text-xs text-slate-400">{{ sale.payment_method || 'Cash' }}</p>
                </div>
              </div>
            </div>
            <div v-if="!stats.recentSales || stats.recentSales.length === 0" class="text-center text-gray-500 py-4">
              No sales yet
            </div>
          </div>
        </div>

        <!-- Recent Logins -->
        <div class="bg-white rounded-xl shadow-md p-5">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            <h3 class="font-semibold text-lg text-slate-800">Recent Logins</h3>
          </div>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div v-for="(login, idx) in stats.recentLogins" :key="idx" class="p-3 rounded-lg hover:bg-slate-50 transition border border-gray-100">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">
                    {{ (login.username || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-medium text-sm text-slate-800">{{ login.username }}</span>
                </div>
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-mono">{{ login.ip_address || 'Unknown' }}</span>
              </div>
              <p class="text-xs text-slate-500 mt-2 ml-8">{{ formatDateTime(login.login_time) }}</p>
            </div>
            <div v-if="!stats.recentLogins || stats.recentLogins.length === 0" class="text-center text-gray-500 py-8">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p>No login history yet</p>
              <p class="text-xs mt-2">Login history will appear here after users log in</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-md p-5">
        <div class="flex items-center gap-2 mb-4">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          <h3 class="font-semibold text-lg text-slate-800">Quick Actions</h3>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <button @click="goTo('sale')" class="action-btn bg-gradient-to-r from-blue-500 to-blue-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            New Sale
          </button>
          <button @click="goTo('addproduct')" class="action-btn bg-gradient-to-r from-green-500 to-green-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add Product
          </button>
          <button @click="goTo('user')" class="action-btn bg-gradient-to-r from-purple-500 to-purple-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            Users
          </button>
          <button @click="goTo('stocktracking')" class="action-btn bg-gradient-to-r from-orange-500 to-orange-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            Stock
          </button>
          <button @click="goTo('salesreport')" class="action-btn bg-gradient-to-r from-indigo-500 to-indigo-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Reports
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const loading = ref(false);
const error = ref(null);
const currencySymbol = ref('$');
const currentYear = ref(new Date().getFullYear());

const stats = ref({
  totalProducts: 0,
  totalSales: 0,
  totalOrders: 0,
  userCount: 0,
  adminCount: 0,
  lowStock: 0,
  todaySales: 0,
  yesterdaySales: 0,
  thisYearSales: 0,
  salesGrowth: 0,
  topProducts: [],
  dailySales: [],
  recentSales: [],
  recentLogins: []
});

const formatPrice = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return `${currencySymbol.value}0.00`;
  return `${currencySymbol.value}${num.toFixed(2)}`;
};

const api = axios.create({
  baseURL: 'http://localhost:3002',
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch(e) {
    return dateString;
  }
};

const getMaxPercentage = (value) => {
  if (!stats.value.topProducts || stats.value.topProducts.length === 0) return 0;
  const maxSold = Math.max(...stats.value.topProducts.map(p => p.total_sold));
  return maxSold > 0 ? (value / maxSold) * 100 : 0;
};

const getDailyPercentage = (value) => {
  if (!stats.value.dailySales || stats.value.dailySales.length === 0) return 0;
  const maxDaily = Math.max(...stats.value.dailySales.map(d => d.total));
  return maxDaily > 0 ? (value / maxDaily) * 100 : 0;
};

const goTo = (routeName) => {
  router.push({ name: routeName });
};

const fetchDashboardData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const response = await api.get("/dashboard/stats");
    
    stats.value = {
      totalProducts: response.data.totalProducts || 0,
      totalSales: response.data.totalSales || 0,
      totalOrders: response.data.totalOrders || 0,
      userCount: response.data.userCount || 0,
      adminCount: response.data.adminCount || 0,
      lowStock: response.data.lowStock || 0,
      todaySales: response.data.todaySales || 0,
      yesterdaySales: response.data.yesterdaySales || 0,
      thisYearSales: response.data.thisYearSales || 0,
      salesGrowth: response.data.salesGrowth || 0,
      topProducts: response.data.topProducts || [],
      dailySales: response.data.dailySales || [],
      recentSales: response.data.recentSales || [],
      recentLogins: response.data.recentLogins || []
    };
    
    // Fetch company currency
    try {
      const companyRes = await api.get('/company/info');
      if (companyRes.data && companyRes.data.currency) {
        currencySymbol.value = companyRes.data.currency === 'KHR' ? '៛' : '$';
      }
    } catch (err) {
      console.log('Using default currency');
    }
    
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    error.value = err.response?.data?.message || err.message || "Failed to load dashboard data";
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  fetchDashboardData();
};

let interval;
onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    fetchDashboardData();
    interval = setInterval(fetchDashboardData, 30000);
  } else {
    router.push("/login");
  }
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});

defineExpose({
  refreshData
});
</script>

<style scoped>
.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  color: white;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-size: 0.9rem;
}

.action-btn:hover {
  transform: translateY(-2px);
  shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>