<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <div class="flex gap-6">

      <!-- LEFT: Product Selection -->
      <div class="flex-1">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Sale Page</h1>
          <p class="text-slate-500 text-sm">Select products to add to cart</p>
        </div>

        <!-- Search & Categories -->
        <div class="bg-white p-4 rounded-xl shadow-sm mb-4">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              v-model="search"
              placeholder="Search product by name or barcode..."
              class="w-full border border-gray-300 pl-10 pr-4 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div class="flex gap-2 mt-3 overflow-x-auto pb-2">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectedCategory = cat"
              class="px-4 py-1.5 rounded-full border text-sm whitespace-nowrap transition"
              :class="selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-100 border-gray-300'"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-10">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="text-gray-500 mt-2">Loading products...</p>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 text-center cursor-pointer"
            @click="addToCart(product)"
          >
            <div class="h-24 w-full mb-3 flex items-center justify-center bg-gray-50 rounded-lg">
              <img v-if="product.image" :src="product.image" class="max-h-full object-contain" />
              <div v-else class="text-4xl">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
            <h3 class="text-sm font-semibold text-slate-800 h-10 overflow-hidden">{{ product.name }}</h3>
            <p class="text-blue-600 font-bold text-lg mt-1">${{ formatPrice(product.price) }}</p>
            <p class="text-xs mt-1" :class="product.stock <= 5 ? 'text-red-500 font-bold' : 'text-gray-500'">
              Stock: {{ product.stock }}
              <span v-if="product.stock <= 5" class="ml-1">⚠️</span>
            </p>
            <button
              :disabled="product.stock <= 0"
              class="mt-3 w-full py-2 rounded-lg text-sm font-medium transition"
              :class="product.stock <= 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'"
            >
              {{ product.stock <= 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT: Cart Preview -->
      <div class="w-96 bg-white rounded-xl shadow-lg p-5 flex flex-col sticky top-6 h-[calc(100vh-3rem)]">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <h3 class="font-bold text-xl text-slate-800">Cart Preview</h3>
          </div>
          <span class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">{{ cart.length }} items</span>
        </div>

        <div class="flex-1 overflow-y-auto space-y-3">
          <div v-for="item in cart" :key="item.id" class="flex justify-between items-start border-b border-gray-100 pb-3">
            <div class="flex-1">
              <p class="text-sm font-semibold text-slate-800">{{ item.name }}</p>
              <p class="text-xs text-gray-500">${{ formatPrice(item.price) }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button @click="decrease(item)" class="w-7 h-7 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-gray-600 font-bold">−</button>
              <span class="text-sm font-bold w-8 text-center">{{ item.qty }}</span>
              <button 
                @click="increase(item)" 
                :disabled="item.qty >= item.remainingStock"
                class="w-7 h-7 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-gray-600 font-bold"
                :class="item.qty >= item.remainingStock ? 'opacity-50 cursor-not-allowed' : ''"
              >
                +
              </button>
              <div class="w-20 text-right text-sm font-bold text-blue-600">${{ formatPrice(item.price * item.qty) }}</div>
            </div>
          </div>
          <div v-if="cart.length === 0" class="text-center text-gray-400 py-10">
            <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <p>No items in cart</p>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="border-t pt-4 mt-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">Subtotal</span>
            <span class="font-semibold">${{ formatPrice(subtotalAmount) }}</span>
          </div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">VAT (5%)</span>
            <span class="font-semibold">${{ formatPrice(vatAmount) }}</span>
          </div>
          <div class="flex justify-between text-xl font-bold text-blue-600 border-t pt-3 mt-2">
            <span>Total</span>
            <span>${{ formatPrice(totalAmount) }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-5 space-y-3">
          <button 
            @click="proceedToCheckout" 
            :disabled="cart.length === 0" 
            class="w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
            :class="cart.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Proceed to Checkout
          </button>
          <button @click="clearCart" class="w-full py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Clear Cart
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from '../plugins/api.js'; 
const router = useRouter();
const products = ref([]);
const cart = ref([]);
const search = ref("");
const selectedCategory = ref("All");
const loading = ref(false);
const categories = ["All", "Drinks", "Snacks", "Household", "Health", "Electronics"];

const formatPrice = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? "0.00" : num.toFixed(2);
};

const getProductStock = (productId) => {
  const product = products.value.find(p => p.id === productId);
  return product ? product.stock : 0;
};

const subtotalAmount = computed(() => {
  return cart.value.reduce((acc, item) => acc + (item.price * item.qty), 0);
});

const vatAmount = computed(() => {
  return subtotalAmount.value * 0.05;
});

const totalAmount = computed(() => {
  return subtotalAmount.value + vatAmount.value;
});

const filteredProducts = computed(() => {
  return products.value.filter(p => 
    (selectedCategory.value === "All" || p.category === selectedCategory.value) && 
    (p.name.toLowerCase().includes(search.value.toLowerCase()) || 
     p.barcode?.toLowerCase().includes(search.value.toLowerCase()))
  );
});

const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await axios.get("http://localhost:3002/products");
    products.value = res.data;
    updateCartStock();
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    loading.value = false;
  }
};

const updateCartStock = () => {
  cart.value.forEach(item => {
    const currentStock = getProductStock(item.id);
    item.remainingStock = currentStock;
    if (item.qty > currentStock) item.qty = currentStock;
  });
  cart.value = cart.value.filter(item => item.qty > 0);
};

const addToCart = (product) => {
  if (product.stock <= 0) {
    alert(`"${product.name}" is out of stock!`);
    return;
  }
  
  const item = cart.value.find(i => i.id === product.id);
  if (item) {
    if (item.qty < product.stock) {
      item.qty++;
      item.remainingStock = product.stock - item.qty;
    } else {
      alert(`Cannot add more "${product.name}". Only ${product.stock} in stock!`);
    }
  } else {
    cart.value.push({ 
      ...product, 
      qty: 1, 
      price: parseFloat(product.price),
      remainingStock: product.stock - 1
    });
  }
};

const increase = (item) => {
  const currentStock = getProductStock(item.id);
  if (item.qty < currentStock) {
    item.qty++;
    item.remainingStock = currentStock - item.qty;
  } else {
    alert(`Cannot add more "${item.name}". Only ${currentStock} in stock!`);
  }
};

const decrease = (item) => {
  if (item.qty > 1) {
    item.qty--;
    const currentStock = getProductStock(item.id);
    item.remainingStock = currentStock - item.qty;
  } else {
    cart.value = cart.value.filter(i => i.id !== item.id);
  }
};

const clearCart = () => {
  if (confirm("Clear all items from cart?")) {
    cart.value = [];
  }
};

const proceedToCheckout = () => {
  if (cart.value.length === 0) {
    alert("Cart is empty!");
    return;
  }
  sessionStorage.setItem("checkoutCart", JSON.stringify(cart.value));
  router.push("/checkout");
};

onMounted(() => {
  fetchProducts();
});
</script>