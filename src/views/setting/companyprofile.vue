<template>
  <div class="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2">
        <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <h1 class="text-2xl font-bold text-slate-800">Company Information</h1>
      </div>
      <p class="text-slate-500 text-sm mt-1 ml-9">Manage your business information</p>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- Success Message -->
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 transform translate-y-2" enter-to-class="opacity-100 transform translate-y-0">
      <div v-if="successMessage" class="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        {{ successMessage }}
      </div>
    </transition>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- LEFT: Company Logo & Info Card -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-md p-6 text-center sticky top-6">
          <!-- Company Logo -->
          <div class="relative inline-block group">
            <div class="w-40 h-40 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-lg overflow-hidden border-2 border-blue-300">
              <img 
                v-if="companyData.logo && companyData.logo !== 'null'" 
                :src="companyData.logo" 
                class="w-full h-full object-cover"
                @error="handleLogoError"
              />
              <div v-else class="text-center p-4">
                <svg class="w-16 h-16 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <p class="text-xs text-gray-500">Company Logo</p>
              </div>
            </div>
            <button 
              @click="openLogoModal" 
              class="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition transform group-hover:scale-110"
              title="Change Logo"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>

          <h2 class="text-xl font-bold text-slate-800 mt-4">{{ companyData.name || 'Your Company Name' }}</h2>
          
          <div class="mt-4 pt-4 border-t border-gray-200 text-left space-y-2">
            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span class="text-gray-600">{{ companyData.email || 'company@example.com' }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span class="text-gray-600">{{ companyData.phone || '+855 12 345 6789' }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="text-gray-600">{{ companyData.address || 'Street Address, City, Country' }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9"></path>
              </svg>
              <span class="text-gray-600">{{ companyData.website || 'www.yourcompany.com' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Edit Company Form -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center gap-2 mb-4 border-b pb-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <h3 class="text-lg font-semibold text-slate-800">Company Details</h3>
          </div>
          
          <form @submit.prevent="saveCompanyInfo" class="space-y-4">
            <!-- Company Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <input 
                  v-model="formData.name"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
                  required
                  placeholder="Enter company name"
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <input 
                  v-model="formData.email"
                  type="email"
                  class="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
                  placeholder="company@example.com"
                />
              </div>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <input 
                  v-model="formData.phone"
                  type="tel"
                  class="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
                  placeholder="+855 12 345 6789"
                />
              </div>
            </div>

            <!-- Address -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div class="relative">
                <svg class="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <textarea 
                  v-model="formData.address"
                  rows="2"
                  class="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
                  placeholder="Street Address, City, Country"
                ></textarea>
              </div>
            </div>

            <!-- Website -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9"></path>
                </svg>
                <input 
                  v-model="formData.website"
                  type="url"
                  class="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
                  placeholder="www.yourcompany.com"
                />
              </div>
            </div>

            <!-- Tax ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tax ID / VAT Number</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <input 
                  v-model="formData.taxId"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
                  placeholder="Enter Tax ID"
                />
              </div>
            </div>

            <!-- Currency -->
           <!-- Currency -->
<div>
  <label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
  <div class="relative">
    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <select v-model="formData.currency" class="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none appearance-none bg-white">
      <option value="USD">USD - US Dollar ($)</option>
      <option value="KHR">KHR - Cambodian Riel (៛)</option>
      <option value="EUR">EUR - Euro (€)</option>
      <option value="GBP">GBP - British Pound (£)</option>
    </select>
    <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </div>
</div>

            <!-- Footer Note / Receipt Message -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Footer Note (Receipt Message)</label>
              <div class="relative">
                <svg class="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <textarea 
                  v-model="formData.footerNote"
                  rows="2"
                  class="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
                  placeholder="Thank you for your business!"
                ></textarea>
              </div>
              <p class="text-xs text-gray-400 mt-1">This message will appear on receipts</p>
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 pt-4 border-t border-gray-200">
              <button 
                type="submit" 
                :disabled="saving"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                <svg v-if="saving" class="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                </svg>
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
              <button 
                type="button"
                @click="resetForm"
                class="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>

    <!-- Logo URL Modal -->
    <div v-if="showLogoModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50" @click.self="closeLogoModal">
      <div class="bg-white rounded-xl max-w-md w-full shadow-2xl transform transition-all duration-300 animate-fadeIn">
        <div class="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <h3 class="font-bold text-lg">Company Logo</h3>
            </div>
            <button @click="closeLogoModal" class="text-white hover:bg-white/20 rounded-full p-1 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <input 
                v-model="logoUrl"
                type="url"
                class="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <p class="text-xs text-gray-500 mt-1">Enter a direct image URL (JPG, PNG, GIF)</p>
          </div>
          <div v-if="logoUrl" class="mt-3">
            <p class="text-sm font-medium text-slate-700 mb-2">Preview:</p>
            <div class="w-32 h-32 rounded-xl overflow-hidden border-2 border-blue-300 mx-auto shadow-md bg-white p-2">
              <img :src="logoUrl" class="w-full h-full object-contain" @error="previewError = true" />
            </div>
            <p v-if="previewError" class="text-xs text-red-500 text-center mt-2">Invalid image URL</p>
          </div>
        </div>
        <div class="p-4 border-t bg-gray-50 flex gap-2 justify-end rounded-b-xl">
          <button @click="closeLogoModal" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancel
          </button>
          <button @click="updateLogo" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            Update Logo
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// State
const saving = ref(false);
const successMessage = ref("");
const error = ref("");
const showLogoModal = ref(false);
const logoUrl = ref("");
const previewError = ref(false);

// Company Data
const companyData = ref({
  id: null,
  name: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  logo: "",
  taxId: "",
  currency: "USD",
  footerNote: "Thank you for your business!"
});

// Form Data
const formData = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  logo: "",
  taxId: "",
  currency: "USD",
  footerNote: ""
});

// API
const api = axios.create({ baseURL: 'http://localhost:3002' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper Functions
const showSuccess = (message) => {
  successMessage.value = message;
  setTimeout(() => { successMessage.value = ""; }, 3000);
};

const showError = (message) => {
  error.value = message;
  setTimeout(() => { error.value = ""; }, 3000);
};

const resetForm = () => {
  formData.value = {
    name: companyData.value.name || "",
    email: companyData.value.email || "",
    phone: companyData.value.phone || "",
    address: companyData.value.address || "",
    website: companyData.value.website || "",
    logo: companyData.value.logo || "",
    taxId: companyData.value.taxId || "",
    currency: companyData.value.currency || "USD",
    footerNote: companyData.value.footerNote || "Thank you for your business!"
  };
};

// Handle logo error
const handleLogoError = () => {
  companyData.value.logo = "";
};

// Logo Modal
const openLogoModal = () => {
  logoUrl.value = companyData.value.logo || "";
  previewError.value = false;
  showLogoModal.value = true;
};

const closeLogoModal = () => {
  showLogoModal.value = false;
  logoUrl.value = "";
};

const updateLogo = async () => {
  if (!logoUrl.value) {
    showError("Please enter an image URL");
    return;
  }
  
  try {
    // Here you would call an API to update the logo
    // For now, we'll just update locally
    companyData.value.logo = logoUrl.value;
    formData.value.logo = logoUrl.value;
    showSuccess("Logo updated successfully");
    closeLogoModal();
    
    // Save to backend
    await saveCompanyInfo();
  } catch (err) {
    console.error("Error updating logo:", err);
    showError(err.response?.data?.message || "Failed to update logo");
  }
};

// Fetch Company Info
const fetchCompanyInfo = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const response = await api.get('/company/info');
    if (response.data) {
      companyData.value = response.data;
      resetForm();
    }
  } catch (err) {
    console.error("Error fetching company info:", err);
    // If no data exists, use default values
    companyData.value = {
      id: null,
      name: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      logo: "",
      taxId: "",
      currency: "USD",
      footerNote: "Thank you for your business!"
    };
    resetForm();
  }
};

// Save Company Info
const saveCompanyInfo = async () => {
  saving.value = true;
  try {
    const response = await api.post('/company/info', formData.value);
    
    if (response.data.success) {
      companyData.value = response.data.data || formData.value;
      showSuccess("Company information saved successfully!");
    }
  } catch (err) {
    console.error("Error saving company info:", err);
    showError(err.response?.data?.message || "Failed to save company information");
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchCompanyInfo();
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
</style>