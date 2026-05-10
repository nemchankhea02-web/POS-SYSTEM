<template>
  <div class="p-6 bg-slate-100 min-h-screen">

    <!-- HEADER -->
    <div class="sticky-top z-10 bg-slate-100 mb-4 mt-[-24px]">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          <h1 class="text-2xl font-semibold text-slate-800">Products</h1>
        </div>

        <button
          @click="addProduct"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Product
        </button>
      </div>
    </div>

    <!-- ERROR -->
    <div v-if="error" class="mb-4 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      {{ error }}
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-10 text-slate-500">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2">Loading products...</p>
    </div>

    <!-- FILTERS -->
    <div v-if="!loading" class="bg-white p-4 rounded-2xl shadow-sm mb-4 flex flex-wrap gap-3 items-center">
      <div class="relative flex-1 md:w-1/3">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input
          v-model="search"
          placeholder="Search product..."
          class="w-full border rounded-xl pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
        />
      </div>

      <select v-model="category" class="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none">
        <option>All</option>
        <option>Drinks</option>
        <option>Snacks</option>
        <option>Health</option>
        <option>Household</option>
        <option>Uncategorized</option>
      </select>

      <select v-model="status" class="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none">
        <option>All</option>
        <option>In Stock</option>
        <option>Low Stock</option>
        <option>Out of Stock</option>
      </select>
    </div>

    <!-- EMPTY -->
    <div v-if="!loading && products.length === 0" class="bg-white p-8 rounded-2xl shadow text-center">
      <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
      </svg>
      <p class="text-slate-500 mb-4">No products found</p>
      <button
        @click="addProduct"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 mx-auto"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Create First Product
      </button>
    </div>

    <!-- TABLE -->
    <div v-if="!loading && products.length > 0" class="bg-white rounded-2xl shadow overflow-hidden">

      <table class="w-full text-sm">

        <!-- HEAD -->
        <thead class="bg-slate-100 text-slate-600">
          <tr>
            <th class="p-3 text-left">#</th>
            <th class="p-3 text-left">Image</th>
            <th class="p-3 text-left">Product</th>
            <th class="p-3 text-left">Barcode</th>
            <th class="p-3 text-left">Category</th>
            <th class="p-3 text-left">Price</th>
            <th class="p-3 text-left">Stock</th>
            <th class="p-3 text-left">Status</th>
            <th class="p-3 text-left">Action</th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody>

          <tr
            v-for="(product, index) in filteredProducts"
            :key="product.id"
            class="border-t hover:bg-slate-50 transition"
          >

            <td class="p-3 text-slate-500">{{ index + 1 }}</td>

            <!-- IMAGE -->
            <td class="p-3">
              <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                <img
                  v-if="product.image"
                  :src="product.image"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <div v-else class="text-slate-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </td>

            <td class="p-3 font-medium text-slate-800">
              {{ product.name }}
            </td>

            <td class="p-3 text-slate-500 font-mono text-xs">
              {{ product.barcode || '-' }}
            </td>

            <td class="p-3">
              <span class="bg-slate-200 px-2 py-1 rounded-lg text-xs font-medium">
                {{ product.category || 'Uncategorized' }}
              </span>
            </td>

            <td class="p-3 font-semibold text-green-600">
              ${{ parseFloat(product.price).toFixed(2) }}
            </td>

            <td class="p-3 font-semibold text-slate-700">
              {{ product.stock }}
            </td>

            <td class="p-3">
              <span
                :class="[
                  'px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 w-fit',
                  getStatus(product.stock) === 'In Stock' && 'bg-green-100 text-green-700',
                  getStatus(product.stock) === 'Low Stock' && 'bg-yellow-100 text-yellow-700',
                  getStatus(product.stock) === 'Out of Stock' && 'bg-red-100 text-red-700'
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="[
                  getStatus(product.stock) === 'In Stock' && 'bg-green-500',
                  getStatus(product.stock) === 'Low Stock' && 'bg-yellow-500',
                  getStatus(product.stock) === 'Out of Stock' && 'bg-red-500'
                ]"></span>
                {{ getStatus(product.stock) }}
              </span>
            </td>

            <!-- ACTION -->
            <td class="p-3">
              <div class="flex gap-2">

                <button
                  v-if="isAdmin"
                  @click="editProduct(product.id)"
                  class="action-btn bg-blue-500 hover:bg-blue-600 flex items-center gap-1"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </button>

                <button
                  v-if="isAdmin"
                  @click="deleteProduct(product.id)"
                  class="action-btn bg-red-500 hover:bg-red-600 flex items-center gap-1"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>

                <span v-if="!isAdmin" class="text-xs text-slate-400">
                  Admin only
                </span>

              </div>
            </td>

          </tr>

        </tbody>

      </table>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();

// Filters
const search = ref(route.query.search?.toString() ?? "");
const category = ref("All");
const status = ref("All");

// States
const loading = ref(false);
const error = ref("");
const products = ref([]);
const currentUser = ref({ role: "" });
const isAdmin = computed(() => currentUser.value.role === "admin");

const getStoredUser = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { role: payload.role };
    } catch {
      return null;
    }
  }

  return null;
};

// Stock status helper
const getStatus = (stock) => {
  const normalizedStock = Number(stock) || 0;
  if (normalizedStock === 0) return "Out of Stock";
  if (normalizedStock <= 10) return "Low Stock";
  return "In Stock";
};

// Handle image error
const handleImageError = (event) => {
  event.target.style.display = 'none';
  const parent = event.target.parentElement;
  if (parent) {
    parent.innerHTML = `
      <div class="w-full h-full bg-gray-200 flex items-center justify-center">
        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
    `;
  }
};

// Fetch products
const fetchProducts = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await axios.get("http://localhost:3002/products");
    products.value = response.data || [];
  } catch (err) {
    console.error(err);
    error.value = "Failed to load products. Make sure the backend is running.";
    products.value = [];
  } finally {
    loading.value = false;
  }
};

// Filtered products
const filteredProducts = computed(() =>
  products.value.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.value.toLowerCase());
    const matchesCategory = category.value === "All" || p.category === category.value;
    const matchesStatus = status.value === "All" || getStatus(p.stock) === status.value;
    return matchesSearch && matchesCategory && matchesStatus;
  })
);

// CRUD Operations
const addProduct = () => {
  router.push("/addproduct");
};

const editProduct = (id) => {
  router.push(`/addproduct/${id}`);
};

const deleteProduct = async (id) => {
  const product = products.value.find((p) => p.id == id);

  if (!product) {
    alert("Product not found");
    return;
  }

  if (!confirm(`Delete "${product.name}"?`)) return;

  try {
    await axios.delete(`http://localhost:3002/products/${id}`);

    products.value = products.value.filter(p => p.id !== id);

    alert("Deleted successfully");
  } catch (err) {
    console.error(err);

    let message = "Delete failed";
    if (err.response?.data?.message) {
      message = err.response.data.message;
    }

    alert(message);
  }
};

// Watch search query
watch(search, (newVal) => {
  router.replace({ query: { ...route.query, search: newVal || undefined } });
});

// Load data
onMounted(() => {
  const storedUser = getStoredUser();
  currentUser.value = storedUser ?? { role: "" };
  fetchProducts();
});
</script>

<style scoped>
table tbody tr:hover { background-color: #f9fafb; }
button { font-size: 0.875rem; font-weight: 500; }
.action-btn {
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 8px;
  color: white;
  transition: 0.2s;
  cursor: pointer;
  border: none;
}
.action-btn:hover {
  transform: translateY(-1px);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>