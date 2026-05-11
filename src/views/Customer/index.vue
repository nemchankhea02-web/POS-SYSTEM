<template>
  <div class="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <h2 class="text-2xl font-bold text-slate-800">Customer Management</h2>
        </div>
        <p class="text-slate-500 text-sm mt-1 ml-8">Manage your customer information</p>
      </div>
      <button 
        @click="openAddModal" 
        class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-md"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add New Customer
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- Search Bar -->
    <div class="bg-white rounded-xl shadow-md p-4 mb-6">
      <div class="flex gap-4">
        <div class="flex-1 relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            v-model="searchKeyword" 
            @input="searchCustomers"
            type="text" 
            placeholder="Search by name, phone or email..."
            class="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button @click="fetchCustomers" class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          Search
        </button>
        <button @click="resetSearch" class="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Reset
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white cursor-pointer hover:scale-105 transition-transform" @click="fetchCustomers">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-blue-100 text-sm">Total Customers</p>
            <h3 class="text-2xl font-bold">{{ customers.length }}</h3>
          </div>
          <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        </div>
      </div>
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-green-100 text-sm">Total Spent</p>
            <h3 class="text-2xl font-bold">${{ formatNumber(totalSpent) }}</h3>
          </div>
          <svg class="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-orange-100 text-sm">Total Points</p>
            <h3 class="text-2xl font-bold">{{ totalPoints }}</h3>
          </div>
          <svg class="w-8 h-8 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
        </div>
      </div>
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-purple-100 text-sm">VIP Customers</p>
            <h3 class="text-2xl font-bold">{{ vipCount }}</h3>
          </div>
          <svg class="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Customer Table -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Phone</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Address</th>
              <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Total Spent</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Points</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer.id" class="border-t hover:bg-gray-50 transition">
              <td class="px-4 py-3 text-sm text-gray-500">{{ customer.id }}</td>
              <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ customer.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ customer.phone || '-' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ customer.email || '-' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ customer.address || '-' }}</td>
              <td class="px-4 py-3 text-right text-sm text-green-600 font-bold">
                ${{ formatNumber(customer.total_spent || 0) }}
              </td>
              <td class="px-4 py-3 text-center">
                <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                  {{ customer.point || 0 }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditModal(customer)" class="text-blue-600 hover:text-blue-800 transition p-1" title="Edit">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click="deleteCustomer(customer.id)" class="text-red-600 hover:text-red-800 transition p-1" title="Delete">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="customers.length === 0 && !loading">
              <td colspan="8" class="text-center py-12 text-gray-400">
                <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <p>No customers found</p>
                <p class="text-xs mt-1">Click "Add New Customer" to create one</p>
              </td>
            </tr>
            <tr v-if="loading">
              <td colspan="8" class="text-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p class="text-gray-500 mt-2">Loading customers...</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Customer Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50" @click.self="closeModal">
      <div class="bg-white rounded-xl max-w-md w-full shadow-2xl transform transition-all duration-300 animate-fadeIn">
        <div class="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <h3 class="font-bold text-lg">{{ isEdit ? 'Edit Customer' : 'Add New Customer' }}</h3>
            </div>
            <button @click="closeModal" class="text-white hover:bg-white/20 rounded-full p-1 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Customer Name <span class="text-red-500">*</span></label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <input 
                v-model="formData.name" 
                type="text" 
                class="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter customer name"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <input 
                v-model="formData.phone" 
                type="tel" 
                class="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter phone number"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <input 
                v-model="formData.email" 
                type="email" 
                class="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter email address"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <div class="relative">
              <svg class="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <textarea 
                v-model="formData.address" 
                rows="2" 
                class="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter address"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t bg-gray-50 flex gap-2 justify-end rounded-b-xl">
          <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancel
          </button>
          <button @click="saveCustomer" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            {{ isEdit ? 'Update' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../api.js'; 
const customers = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const showModal = ref(false)
const isEdit = ref(false)
const error = ref('')
const formData = ref({
  id: null,
  name: '',
  phone: '',
  email: '',
  address: ''
})

const api = axios.create({ baseURL: 'http://localhost:3002' })
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Computed
const totalSpent = computed(() => {
  return customers.value.reduce((sum, c) => {
    const spent = parseFloat(c.total_spent) || parseFloat(c.totalSpent) || 0
    return sum + spent
  }, 0)
})

const totalPoints = computed(() => {
  return customers.value.reduce((sum, c) => {
    const points = parseInt(c.point) || parseInt(c.points) || 0
    return sum + points
  }, 0)
})

const vipCount = computed(() => {
  return customers.value.filter(c => {
    const spent = parseFloat(c.total_spent) || parseFloat(c.totalSpent) || 0
    return spent > 1000
  }).length
})

// Fetch customers
const fetchCustomers = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await api.get('/customers')
    customers.value = response.data || []
  } catch (err) {
    error.value = `Failed to load customers: ${err.response?.data?.message || err.message || 'Unknown error'}`
    console.error('Error fetching customers:', err)
  } finally {
    loading.value = false
  }
}

// Search customers
const searchCustomers = async () => {
  if (searchKeyword.value.length < 2) {
    await fetchCustomers()
    return
  }
  loading.value = true
  error.value = ''
  try {
    const response = await api.get(`/customers/search/${searchKeyword.value}`)
    customers.value = response.data || []
  } catch (err) {
    error.value = `Search failed: ${err.response?.data?.message || err.message || 'Unknown error'}`
    console.error('Error searching customers:', err)
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchKeyword.value = ''
  fetchCustomers()
}

// Open add modal
const openAddModal = () => {
  isEdit.value = false
  formData.value = { id: null, name: '', phone: '', email: '', address: '' }
  showModal.value = true
}

// Open edit modal
const openEditModal = (customer) => {
  isEdit.value = true
  formData.value = { ...customer }
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  formData.value = { id: null, name: '', phone: '', email: '', address: '' }
}

// Save customer
const saveCustomer = async () => {
  if (!formData.value.name) {
    alert('Please enter customer name')
    return
  }
  
  try {
    if (isEdit.value) {
      await api.put(`/customers/${formData.value.id}`, formData.value)
      alert('Customer updated successfully!')
    } else {
      await api.post('/customers', formData.value)
      alert('Customer added successfully!')
    }
    closeModal()
    await fetchCustomers()
  } catch (err) {
    console.error('Error saving customer:', err)
    alert('Failed to save customer')
  }
}

// Delete customer
const deleteCustomer = async (id) => {
  if (confirm('Are you sure you want to delete this customer?')) {
    try {
      await api.delete(`/customers/${id}`)
      alert('Customer deleted successfully!')
      await fetchCustomers()
    } catch (err) {
      console.error('Error deleting customer:', err)
      alert('Failed to delete customer')
    }
  }
}

const formatNumber = (value) => {
  const num = parseFloat(value)
  return isNaN(num) ? '0.00' : num.toFixed(2)
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