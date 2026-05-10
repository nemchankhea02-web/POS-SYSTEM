<template>
  <div class="flex h-screen bg-slate-100">

    <!-- SIDEBAR -->
    <aside
      :class="[
        'flex flex-col text-white transition-all duration-300 shadow-xl relative',
        sidebarOpen ? 'w-64' : 'w-20'
      ]"
      class="bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800"
    >

      <!-- LOGO -->
      <div class="p-4 flex items-center gap-3 border-b border-white/10"
        :class="sidebarOpen ? '' : 'justify-center'">

        <div class="h-10 w-10 flex items-center justify-center rounded-full bg-white text-blue-900 font-bold shadow">
          P
        </div>

        <div v-if="sidebarOpen">
          <div class="font-bold text-lg leading-tight">POS System</div>
          <div class="text-xs opacity-70">{{ displayRole }}</div>
        </div>

      </div>

      <!-- MENU -->
      <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
        <!-- Dashboard -->
        <router-link to="/dashboard" class="menu-item" :class="{ 'justify-center': !sidebarOpen }">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <span v-if="sidebarOpen">Dashboard</span>
        </router-link>

        <!-- Sale -->
        <router-link to="/sale" class="menu-item" :class="{ 'justify-center': !sidebarOpen }">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <span v-if="sidebarOpen">Sale</span>
        </router-link>

        <!-- Checkout -->
        <router-link to="/checkout" class="menu-item" :class="{ 'justify-center': !sidebarOpen }">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
          <span v-if="sidebarOpen">Checkout</span>
        </router-link>

        <!-- Sale Tracking -->
        <router-link to="/saletracking" class="menu-item" :class="{ 'justify-center': !sidebarOpen }">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <span v-if="sidebarOpen">Sale Tracking</span>
        </router-link>

        <!-- Products Dropdown -->
        <div class="relative">
          <button 
            @click="toggleProductMenu"
            class="menu-item w-full flex justify-between items-center"
            :class="{ 'justify-center': !sidebarOpen, 'justify-between': sidebarOpen }"
          >
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              <span v-if="sidebarOpen">Products</span>
            </div>
            <span v-if="sidebarOpen" class="text-xs transition-transform" :class="{ 'rotate-180': productOpen }">▼</span>
          </button>

          <div v-if="productOpen && sidebarOpen" class="ml-6 mt-1 space-y-1">
            <router-link to="/products" class="sub-item">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              Product List
            </router-link>
            <router-link v-if="isAdmin" to="/addproduct" class="sub-item">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Product
            </router-link>
          </div>
        </div>

        <!-- Stock Tracking -->
        <router-link to="/stocktracking" class="menu-item" :class="{ 'justify-center': !sidebarOpen }">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <span v-if="sidebarOpen">Stock Tracking</span>
        </router-link>

        <!-- Customers Dropdown -->
        <div class="relative">
          <button 
            @click="toggleCustomerMenu"
            class="menu-item w-full flex justify-between items-center"
            :class="{ 'justify-center': !sidebarOpen, 'justify-between': sidebarOpen }"
          >
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <span v-if="sidebarOpen">Customers</span>
            </div>
            <span v-if="sidebarOpen" class="text-xs transition-transform" :class="{ 'rotate-180': customerOpen }">▼</span>
          </button>

          <div v-if="customerOpen && sidebarOpen" class="ml-6 mt-1 space-y-1">
            <router-link to="/customers" class="sub-item">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Customer List
            </router-link>
          </div>
        </div>

        <!-- Reports Dropdown -->
        <div class="relative">
          <button 
            @click="toggleReportMenu"
            class="menu-item w-full flex justify-between items-center"
            :class="{ 'justify-center': !sidebarOpen, 'justify-between': sidebarOpen }"
          >
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span v-if="sidebarOpen">Reports</span>
            </div>
            <span v-if="sidebarOpen" class="text-xs transition-transform" :class="{ 'rotate-180': reportOpen }">▼</span>
          </button>

          <div v-if="reportOpen && sidebarOpen" class="ml-6 mt-1 space-y-1">
            <router-link to="/salesreport" class="sub-item">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Sales Report
            </router-link>
            <router-link to="/productreport" class="sub-item">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              Product Report
            </router-link>
            <router-link to="/customerreport" class="sub-item">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              Customer Report
            </router-link>
          </div>
        </div>

        <!-- Notifications -->
        <router-link to="/notification" class="menu-item" :class="{ 'justify-center': !sidebarOpen }">
          <div class="relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span 
              v-if="notificationCount > 0" 
              class="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full"
            >
              {{ notificationCount > 9 ? '9+' : notificationCount }}
            </span>
          </div>
          <span v-if="sidebarOpen">Notifications</span>
        </router-link>

        <!-- Settings Dropdown -->
        <div class="relative">
          <button 
            @click="toggleSettingMenu"
            class="menu-item w-full flex justify-between items-center"
            :class="{ 'justify-center': !sidebarOpen, 'justify-between': sidebarOpen }"
          >
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span v-if="sidebarOpen">Settings</span>
            </div>
            <span v-if="sidebarOpen" class="text-xs transition-transform" :class="{ 'rotate-180': settingOpen }">▼</span>
          </button>

          <div v-if="settingOpen && sidebarOpen" class="ml-6 mt-1 space-y-1">
            <router-link to="/setting" class="sub-item">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Profile
            </router-link>
            <router-link v-if="isAdmin" to="/user" class="sub-item">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              User Management
            </router-link>
            <router-link to="/companyprofile" class="sub-item">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Company Profile
            </router-link>
          </div>
        </div>

      </nav>

      <!-- LOGOUT -->
      <div class="p-3 border-t border-white/10">
        <button @click="handleLogout" class="menu-item w-full bg-red-500 hover:bg-red-600 rounded-xl" :class="{ 'justify-center': !sidebarOpen }">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span v-if="sidebarOpen">Logout</span>
        </button>
      </div>

    </aside>

    <!-- MAIN -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- TOPBAR -->
      <header class="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div class="px-4 lg:px-6">
          <div class="flex items-center justify-between h-14">

            <!-- Left Section -->
            <div class="flex items-center gap-3">
              <button 
                @click="toggleSidebar" 
                class="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                :title="sidebarOpen ? 'Collapse menu' : 'Expand menu'"
              >
                <svg v-if="sidebarOpen" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 class="text-lg font-semibold text-gray-800">{{ pageTitle }}</h1>
            </div>

            <!-- Right Section -->
            <div class="flex items-center gap-2">
              
              <!-- Search Bar -->
              <div class="hidden md:flex items-center bg-gray-50 rounded-lg border border-gray-200 px-3 py-1.5">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input
                  v-model="searchTerm"
                  @keyup.enter="performSearch"
                  class="w-64 px-2 py-1 text-sm bg-transparent focus:outline-none"
                  placeholder="Search products..."
                />
              </div>

              <!-- Refresh Button -->
              <button 
                @click="refreshPage" 
                class="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                title="Refresh"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <!-- Notification Bell -->
              <router-link 
                to="/notification" 
                class="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                title="Notifications"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span 
                  v-if="notificationCount > 0" 
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1"
                >
                  {{ notificationCount > 99 ? '99+' : notificationCount }}
                </span>
              </router-link>

              <!-- User Menu with Profile Picture -->
              <div class="relative">
                <button 
                  @click="showUserMenu = !showUserMenu" 
                  class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                  <!-- Profile Picture or Initial -->
                  <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center overflow-hidden">
                    <img 
                      v-if="userAvatar && userAvatar !== 'null'" 
                      :src="userAvatar" 
                      class="w-full h-full object-cover"
                      @error="handleAvatarError"
                    />
                    <span v-else class="font-bold text-sm">{{ userInitial }}</span>
                  </div>
                  <span class="hidden md:inline text-sm font-medium text-gray-700">{{ userName }}</span>
                  <svg class="hidden md:inline w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div v-if="showUserMenu" class="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <!-- User Info Section -->
                  <div class="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center overflow-hidden">
                        <img 
                          v-if="userAvatar && userAvatar !== 'null'" 
                          :src="userAvatar" 
                          class="w-full h-full object-cover"
                          @error="handleAvatarError"
                        />
                        <span v-else class="font-bold text-lg">{{ userInitial }}</span>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-gray-800">{{ userFullname || userName }}</p>
                        <p class="text-xs text-gray-500">{{ userEmail || 'No email' }}</p>
                        <p class="text-xs text-blue-600 mt-0.5">{{ displayRole }}</p>
                      </div>
                    </div>
                  </div>
                  <router-link to="/setting" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-sm text-gray-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    My Profile
                  </router-link>
                  <router-link to="/companyprofile" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-sm text-gray-700">
                     <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
                    company profile
                  </router-link>
                  <hr class="my-1">
                  <button @click="handleLogout" class="flex items-center gap-3 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      <!-- CONTENT -->
      <main class="flex-1 overflow-auto p-4 lg:p-6">
        <router-view />
      </main>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

// ==================== STATE ====================
const sidebarOpen = ref(true);
const productOpen = ref(false);
const reportOpen = ref(false);
const customerOpen = ref(false);
const settingOpen = ref(false);
const searchTerm = ref("");
const showUserMenu = ref(false);
const notifications = ref([]);
const userData = ref({});

// User profile data for avatar
const userAvatar = ref("");
const userFullname = ref("");
const userEmail = ref("");

// ==================== API ====================
const api = axios.create({ baseURL: 'http://localhost:3002' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ==================== COMPUTED ====================
const userName = computed(() => userData.value.username || "Admin");
const userInitial = computed(() => {
  const name = userFullname.value || userData.value.fullname || userData.value.username || "Admin";
  return name.charAt(0).toUpperCase();
});
const displayRole = computed(() => {
  if (!userData.value.role) return "Guest";
  return userData.value.role.charAt(0).toUpperCase() + userData.value.role.slice(1);
});
const isAdmin = computed(() => userData.value.role === "admin");

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/sale': 'Sale',
    '/checkout': 'Checkout',
    '/products': 'Products',
    '/addproduct': 'Add Product',
    '/customers': 'Customers',
    '/addcustomer': 'Add Customer',
    '/stocktracking': 'Stock Tracking',
    '/saletracking': 'Sale Tracking',
    '/salesreport': 'Sales Report',
    '/productreport': 'Product Report',
    '/customerreport': 'Customer Report',
    '/notification': 'Notifications',
    '/user': 'User Management',
    '/setting': 'Settings'
  };
  return titles[route.path] || 'POS System';
});

const notificationCount = computed(() => notifications.value.filter(n => !n.is_read).length);

// ==================== METHODS ====================
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const toggleProductMenu = () => {
  productOpen.value = !productOpen.value;
  if (productOpen.value) {
    reportOpen.value = false;
    customerOpen.value = false;
    settingOpen.value = false;
  }
};

const toggleReportMenu = () => {
  reportOpen.value = !reportOpen.value;
  if (reportOpen.value) {
    productOpen.value = false;
    customerOpen.value = false;
    settingOpen.value = false;
  }
};

const toggleCustomerMenu = () => {
  customerOpen.value = !customerOpen.value;
  if (customerOpen.value) {
    productOpen.value = false;
    reportOpen.value = false;
    settingOpen.value = false;
  }
};

const toggleSettingMenu = () => {
  settingOpen.value = !settingOpen.value;
  if (settingOpen.value) {
    productOpen.value = false;
    reportOpen.value = false;
    customerOpen.value = false;
  }
};

const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    const response = await api.get('/notifications');
    notifications.value = response.data.notifications || [];
  } catch (err) {
    console.error('Error fetching notifications:', err);
  }
};

const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    const response = await api.get('/user/profile');
    if (response.data) {
      userAvatar.value = response.data.avatar || "";
      userFullname.value = response.data.fullname || "";
      userEmail.value = response.data.email || "";
    }
  } catch (err) {
    console.error('Error fetching user profile:', err);
  }
};

const handleAvatarError = () => {
  userAvatar.value = "";
};

const performSearch = () => {
  const query = searchTerm.value.trim();
  if (query) {
    router.push({ name: "products", query: { search: query } });
    searchTerm.value = "";
  }
};

const refreshPage = () => {
  fetchNotifications();
  if (route.path === '/dashboard') {
    window.location.reload();
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};

const loadUser = () => {
  try {
    const stored = localStorage.getItem("user");
    if (stored) {
      userData.value = JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to parse user", error);
  }
};

// ==================== CLICK OUTSIDE ====================
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false;
  }
};

// ==================== LIFECYCLE ====================
onMounted(() => {
  loadUser();
  fetchNotifications();
  fetchUserProfile();
  document.addEventListener('click', handleClickOutside);
  setInterval(fetchNotifications, 30000);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const route = useRoute();
const router = useRouter();
</script>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 500;
  margin-top: 4px;
  transition: all 0.2s ease;
  color: #e0e7ff;
  text-decoration: none;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateX(4px);
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.sub-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  color: #f1f5f9;
  text-decoration: none;
}

.sub-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>