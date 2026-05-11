<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <div class="max-w-6xl mx-auto">
      
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800">Checkout</h1>
        <p class="text-slate-500 text-sm">Complete your sale</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- LEFT: Customer & Payment Info -->
        <div class="space-y-5">
          
          <!-- Customer Information -->
          <div class="bg-white rounded-xl shadow-lg p-5">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <h3 class="font-bold text-lg text-slate-800">Customer Information</h3>
            </div>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input 
                  v-model="customerName"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  v-model="customerPhone"
                  type="tel"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                <input 
                  v-model="customerEmail"
                  type="email"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="bg-white rounded-xl shadow-lg p-5">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
              <h3 class="font-bold text-lg text-slate-800">Payment Information</h3>
            </div>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <div class="grid grid-cols-2 gap-3">
                  <button 
                    v-for="method in paymentMethods" 
                    :key="method.value"
                    @click="paymentMethod = method.value"
                    :class="[
                      'py-2 px-3 rounded-lg border font-medium transition flex items-center justify-center gap-1',
                      paymentMethod === method.value 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    <span>{{ method.icon }}</span>
                    {{ method.label }}
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="selectedCurrency" value="USD" class="w-4 h-4 text-blue-600">
                    <span class="text-sm">🇺🇸 USD ($)</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="selectedCurrency" value="KHR" class="w-4 h-4 text-orange-600">
                    <span class="text-sm">🇰🇭 KHR (៛)</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="paymentStatus" value="Paid" class="w-4 h-4 text-green-600">
                    <span class="text-sm">Paid</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="paymentStatus" value="Pending" class="w-4 h-4 text-yellow-600">
                    <span class="text-sm">Pending</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="paymentStatus" value="Unpaid" class="w-4 h-4 text-red-600">
                    <span class="text-sm">Unpaid</span>
                  </label>
                </div>
              </div>
              <div v-if="paymentMethod === 'Bank Transfer'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                <input 
                  v-model="referenceNumber"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Enter transaction reference"
                />
              </div>
              <!-- Exchange Rate Info -->
              <div v-if="selectedCurrency === 'KHR'" class="mt-2 p-2 bg-yellow-50 rounded-lg text-xs text-yellow-700">
                Exchange Rate: 1 USD = 4,100 KHR
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT: Cart Summary -->
        <div class="bg-white rounded-xl shadow-lg p-5 sticky top-6 h-fit">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 class="font-bold text-lg text-slate-800">Order Summary</h3>
          </div>

          <!-- Cart Items -->
          <div class="max-h-80 overflow-y-auto space-y-3 mb-4">
            <div v-for="item in cart" :key="item.id" class="flex justify-between items-center border-b border-gray-100 pb-2">
              <div>
                <p class="text-sm font-semibold">{{ item.name }}</p>
                <p class="text-xs text-gray-500">Qty: {{ item.qty }} × {{ formatPrice(item.price) }}</p>
              </div>
              <div class="font-semibold" :class="selectedCurrency === 'KHR' ? 'text-orange-600' : 'text-blue-600'">
                {{ formatPrice(item.price * item.qty) }}
              </div>
            </div>
            <div v-if="cart.length === 0" class="text-center text-gray-400 py-8">
              <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <p>No items in cart</p>
              <router-link to="/sale" class="text-blue-600 text-sm mt-2 inline-block">Go back to sale →</router-link>
            </div>
          </div>

          <!-- Totals -->
          <div class="border-t pt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal</span>
              <span>{{ formatPrice(subtotalAmount) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">VAT (5%)</span>
              <span>{{ formatPrice(vatAmount) }}</span>
            </div>
            <div class="flex justify-between text-xl font-bold border-t pt-2 mt-2" :class="selectedCurrency === 'KHR' ? 'text-orange-600' : 'text-blue-600'">
              <span>Total Amount</span>
              <span>{{ formatPrice(totalAmount) }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-5 space-y-3">
            <button 
              @click="confirmOrder" 
              :disabled="cart.length === 0 || saving"
              class="w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
              :class="cart.length === 0 || saving
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'"
            >
              <svg v-if="!saving" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div v-if="saving" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {{ saving ? 'Processing...' : 'Confirm Order & Print Invoice' }}
            </button>
            <router-link to="/sale" class="block w-full text-center py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Sale Page
            </router-link>
          </div>
        </div>

      </div>

      <!-- Invoice Modal -->
      <div v-if="showInvoice" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="showInvoice = false">
        <div class="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-fadeIn">
          <div id="invoice-content" class="p-6 bg-white font-mono text-sm">
            <div class="text-center mb-4">
              <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" :class="selectedCurrency === 'KHR' ? 'bg-orange-600' : 'bg-blue-600'">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 class="text-xl font-bold uppercase tracking-wide">POS SYSTEM</h2>
              <p class="text-xs text-gray-500 mt-1">Your Store Address</p>
              <p class="text-xs text-gray-500">Tel: 123-456-7890</p>
            </div>

            <div class="border-t border-b border-dashed border-gray-300 py-2 mb-3 text-xs">
              <div class="flex justify-between"><span class="text-gray-500">Invoice No:</span><span class="font-bold">{{ invoiceNumber }}</span></div>
              <div class="flex justify-between mt-1"><span class="text-gray-500">Date:</span><span>{{ invoiceDate }} {{ invoiceTime }}</span></div>
              <div class="flex justify-between mt-1"><span class="text-gray-500">Cashier:</span><span>{{ cashierName }}</span></div>
              <div class="flex justify-between mt-1"><span class="text-gray-500">Customer:</span><span>{{ customerName || 'Walk-in Customer' }}</span></div>
              <div class="flex justify-between mt-1"><span class="text-gray-500">Currency:</span><span class="font-bold">{{ selectedCurrency === 'KHR' ? '៛ KHR' : '$ USD' }}</span></div>
            </div>

            <table class="w-full mb-4 text-xs">
              <thead>
                <tr class="border-b border-dashed border-gray-300">
                  <th class="text-left py-1">Item</th>
                  <th class="text-center py-1">Qty</th>
                  <th class="text-right py-1">Price</th>
                  <th class="text-right py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cart" :key="item.id" class="border-b border-gray-100">
                  <td class="py-1">{{ item.name }}</td>
                  <td class="text-center">{{ item.qty }}</td>
                  <td class="text-right">{{ formatPrice(item.price) }}</td>
                  <td class="text-right font-semibold">{{ formatPrice(item.price * item.qty) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr><td colspan="3" class="text-right pt-2"><span class="text-gray-500">Subtotal:</span></td><td class="text-right pt-2">{{ formatPrice(subtotalAmount) }}</td></tr>
                <tr><td colspan="3" class="text-right"><span class="text-gray-500">VAT (5%):</span></td><td class="text-right">{{ formatPrice(vatAmount) }}</td></tr>
                <tr class="border-t border-dashed border-gray-300"><td colspan="3" class="text-right pt-1 font-bold">TOTAL:</td><td class="text-right pt-1 font-bold" :class="selectedCurrency === 'KHR' ? 'text-orange-600' : 'text-blue-600'">{{ formatPrice(totalAmount) }}</td></tr>
              </tfoot>
            </table>

            <div class="text-center mt-4 pt-3 border-t border-dashed border-gray-300">
              <p class="text-sm font-semibold">Thank you for your business!</p>
              <div class="flex justify-center gap-4 mt-2 text-xs">
                <span class="text-gray-500">Payment: {{ paymentMethod }}</span>
                <span class="text-gray-500">| Status: {{ paymentStatus }}</span>
              </div>
            </div>
          </div>

          <div class="p-4 bg-gray-50 flex gap-2 border-t">
            <button @click="printInvoice" class="flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition" :class="selectedCurrency === 'KHR' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              Print
            </button>
            <button @click="closeInvoice" class="flex-1 bg-gray-300 py-2 rounded-lg font-bold hover:bg-gray-400 transition">Close</button>
          </div>
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
const cart = ref([]);
const customerName = ref("");
const customerPhone = ref("");
const customerEmail = ref("");
const paymentMethod = ref("Cash");
const paymentStatus = ref("Paid");
const referenceNumber = ref("");
const showInvoice = ref(false);
const invoiceNumber = ref("");
const invoiceDate = ref("");
const invoiceTime = ref("");
const cashierName = ref("Admin");
const saving = ref(false);
const selectedCurrency = ref("USD");
const exchangeRate = ref(4100); // 1 USD = 4100 KHR

const paymentMethods = [
  { value: "Cash", label: "Cash", icon: "💵" },
  { value: "ABA Bank", label: "ABA Bank", icon: "🏦" },
  { value: "ACLEDA", label: "ACLEDA", icon: "🏦" },
  { value: "Wing", label: "Wing", icon: "💰" },
  { value: "Bank Transfer", label: "Bank Transfer", icon: "🏦" }
];

const formatPrice = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return selectedCurrency.value === "KHR" ? "៛0" : "$0.00";
  
  if (selectedCurrency.value === "KHR") {
    const khrAmount = num * exchangeRate.value;
    return `៛${Math.round(khrAmount).toLocaleString()}`;
  }
  return `$${num.toFixed(2)}`;
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

const confirmOrder = async () => {
  if (cart.value.length === 0) {
    alert("Cart is empty!");
    return;
  }

  if (paymentStatus.value !== "Paid") {
    alert("Payment must be marked as 'Paid' to complete order!");
    return;
  }

  saving.value = true;

  try {
    const response = await axios.post("http://localhost:3002/sales", {
      total_amount: totalAmount.value,
      payment_method: paymentMethod.value,
      customer_name: customerName.value || "Walk-in Customer",
      customer_phone: customerPhone.value,
      customer_email: customerEmail.value,
      payment_status: paymentStatus.value,
      reference_number: referenceNumber.value,
      currency: selectedCurrency.value,
      items: cart.value.map(i => ({ 
        product_id: i.id, 
        qty: i.qty, 
        unit_price: i.price, 
        total_price: i.price * i.qty 
      }))
    });

    if (response.data.success) {
      generateInvoice();
      showInvoice.value = true;
      
      sessionStorage.removeItem("checkoutCart");
      
      const pointsEarned = Math.floor(totalAmount.value / 10);
      console.log(`Sale completed! Points earned: ${pointsEarned}`);
    }
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Checkout failed! Please try again. " + (error.response?.data?.message || ""));
  } finally {
    saving.value = false;
  }
};

const generateInvoice = () => {
  invoiceNumber.value = "INV-" + Date.now().toString().slice(-8);
  const now = new Date();
  invoiceDate.value = now.toLocaleDateString();
  invoiceTime.value = now.toLocaleTimeString();
  
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const userData = JSON.parse(user);
      cashierName.value = userData.username || "Admin";
    } catch(e) {}
  }
};

const printInvoice = () => {
  const content = document.getElementById("invoice-content")?.innerHTML;
  const printWindow = window.open("", "", "height=600,width=450");
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head><title>Invoice</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; padding: 20px; font-size: 12px; line-height: 1.4; }
        .text-center { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        td, th { padding: 6px 4px; }
        th { border-bottom: 1px dashed #999; text-align: left; }
        tbody tr { border-bottom: 1px solid #eee; }
        .border-dashed { border-style: dashed; }
        .border-t { border-top: 1px dashed #999; }
        .border-b { border-bottom: 1px dashed #999; }
        .font-bold { font-weight: bold; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .text-orange-600 { color: #ea580c; }
        .text-blue-600 { color: #2563eb; }
      </style>
      </head>
      <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }
};

const closeInvoice = () => {
  showInvoice.value = false;
  router.push("/sale");
};

onMounted(() => {
  const savedCart = sessionStorage.getItem("checkoutCart");
  if (savedCart) {
    cart.value = JSON.parse(savedCart);
  } else {
    alert("No items in cart! Redirecting to sale page...");
    router.push("/sale");
  }
});
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