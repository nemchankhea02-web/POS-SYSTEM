<template>
  <div class="p-6 bg-slate-100 min-h-screen">

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6 max-w-4xl mx-auto">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
        <h2 class="text-2xl font-semibold text-slate-800">
          {{ isEditing ? 'Edit Product' : 'Add Product' }}
        </h2>
      </div>
    </div>

    <!-- ERROR -->
    <div v-if="error" class="max-w-4xl mx-auto mb-4 p-3 rounded-xl bg-red-100 text-red-700 border border-red-200 flex items-center gap-2">
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      {{ error }}
    </div>

    <!-- LOADING -->
    <div v-if="loading && isEditing" class="max-w-4xl mx-auto bg-white shadow rounded-xl p-6 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="text-slate-500 mt-2">Loading product...</p>
    </div>

    <!-- FORM -->
    <div v-if="!loading" class="bg-white shadow rounded-2xl p-6 max-w-4xl mx-auto">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- Product Name -->
        <div>
          <label class="label">Product Name <span class="text-red-500">*</span></label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <input 
              v-model="product.name" 
              type="text" 
              class="input pl-10" 
              placeholder="Enter product name" 
            />
          </div>
        </div>

        <!-- Barcode -->
        <div>
          <label class="label">Barcode <span class="text-red-500">*</span></label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m4-16v16M8 4v16M4 4h16M4 20h16"></path>
            </svg>
            <input 
              v-model="product.barcode" 
              type="text" 
              class="input pl-10" 
              placeholder="Enter barcode" 
            />
          </div>
        </div>

        <!-- Category -->
        <div>
          <label class="label">Category</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <select v-model="product.category" class="input pl-10 appearance-none">
              <option value="">Select category</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
            <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>

        <!-- Price -->
        <div>
          <label class="label">Price ($) <span class="text-red-500">*</span></label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <input 
              v-model="product.price" 
              type="number" 
              step="0.01" 
              class="input pl-10" 
              placeholder="0.00" 
            />
          </div>
        </div>

        <!-- Stock -->
        <div>
          <label class="label">Stock Quantity</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <input 
              v-model="product.stock" 
              type="number" 
              class="input pl-10" 
              placeholder="Enter stock quantity" 
            />
          </div>
        </div>

        <!-- Image URL -->
        <div class="md:col-span-2">
          <label class="label">Product Image URL</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <input
              v-model="product.image"
              type="url"
              @input="updateImagePreview"
              class="input pl-10"
              placeholder="https://example.com/product-image.jpg"
            />
          </div>
          <p class="text-xs text-slate-400 mt-1">Optional - Enter direct image URL (JPG, PNG, GIF)</p>
        </div>

        <!-- Image Preview -->
        <div v-if="imagePreview" class="md:col-span-2 mt-2">
          <label class="label mb-2">Image Preview</label>
          <div class="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border">
            <div class="w-24 h-24 rounded-xl overflow-hidden border shadow-sm bg-white">
              <img
                :src="imagePreview"
                class="w-full h-full object-cover"
                @error="imagePreview = ''"
              />
            </div>
            <button
              type="button"
              @click="removeImage"
              class="text-red-600 hover:text-red-800 transition flex items-center gap-1 text-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Remove Image
            </button>
          </div>
        </div>

      </div>

      <!-- Required Fields Hint -->
      <div class="mt-4 text-xs text-slate-400 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Fields marked with <span class="text-red-500">*</span> are required
      </div>

      <!-- BUTTONS -->
      <div class="flex gap-3 mt-6 pt-4 border-t">
        <button
          @click="saveProduct"
          :disabled="saving"
          class="btn-primary flex items-center gap-2"
        >
          <svg v-if="saving" class="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
          </svg>
          {{ isEditing ? 'Update Product' : 'Save Product' }}
        </button>

        <button
          @click="cancel"
          class="btn-secondary flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Cancel
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();

const productId = computed(() => route.params.id);
const isEditing = computed(() => !!productId.value);

const loading = ref(false);
const saving = ref(false);
const error = ref("");
const imagePreview = ref("");

const product = ref({
  name: "",
  barcode: "",
  category: "",
  price: "",
  stock: "",
  image: ""
});

const categories = [
  "Drinks", "Snacks", "Health", "Household",
  "Groceries", "Electronics", "Clothing", "Beauty", "Uncategorized"
];

const updateImagePreview = () => {
  imagePreview.value = product.value.image;
};

const removeImage = () => {
  product.value.image = "";
  imagePreview.value = "";
};

const fetchProduct = async () => {
  if (!productId.value) return;

  loading.value = true;
  try {
    const res = await axios.get(`http://localhost:3002/products/${productId.value}`);

    product.value = {
      name: res.data.name || "",
      barcode: res.data.barcode || "",
      category: res.data.category || "",
      price: String(res.data.price || 0),
      stock: String(res.data.stock || 0),
      image: res.data.image || ""
    };

    imagePreview.value = res.data.image || "";
  } catch (err) {
    console.error(err);
    error.value = "Failed to load product";
  } finally {
    loading.value = false;
  }
};

const saveProduct = async () => {
  if (!product.value.name || !product.value.barcode || !product.value.price) {
    alert("Please fill required fields (Name, Barcode, Price)");
    return;
  }

  saving.value = true;
  error.value = "";

  const data = {
    name: product.value.name,
    barcode: product.value.barcode,
    category: product.value.category || "Uncategorized",
    price: parseFloat(product.value.price),
    stock: parseInt(product.value.stock) || 0,
    image: product.value.image || null
  };

  try {
    if (isEditing.value) {
      await axios.put(`http://localhost:3002/products/${productId.value}`, data);
      alert("Product updated successfully");
    } else {
      await axios.post("http://localhost:3002/products", data);
      alert("Product created successfully");
    }
    router.push({ name: "products" });
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || err.message || "Save failed";
    alert(error.value);
  } finally {
    saving.value = false;
  }
};

const cancel = () => {
  router.push({ name: "products" });
};

onMounted(() => {
  fetchProduct();
});
</script>

<style scoped>
.label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 4px;
}

.input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}

.input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.btn-primary {
  background: #2563eb;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #d1d5db;
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