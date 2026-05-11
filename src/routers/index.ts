// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Layout from "../layouts/layout.vue";

// -------------------------
// Routes
// -------------------------
const routes: RouteRecordRaw[] = [
  // Public Login Page
  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/login.vue"),
  },

  // Protected Routes (Dashboard + POS)
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    meta: { requiresAuth: true },
    children: [
      { path: "dashboard", name: "dashboard", component: () => import("../views/dashboard/index.vue") },
      { path: "sale", name: "sale", component: () => import("../views/saleandcheckout/index.vue") },
      { path: "checkout", name: "checkout", component: () => import("../views/saleandcheckout/checkout.vue") },
      { path: "customers", name: "customers", component: () => import("../views/Customer/index.vue") },
      { path: "products", name: "products", component: () => import("../views/products/index.vue") },
      { path: "addproduct/:id?", name: "addproduct", component: () => import("../views/products/addproduct.vue"), meta: { adminOnly: true } },
      { path: "stocktracking", name: "stocktracking", component: () => import("../views/stocktracking/index.vue") },
      { path: "salesreport", name: "salesreport", component: () => import("../views/report/index.vue") },
      { path: "productreport", name: "productreport", component: () => import("../views/report/productreport.vue") },
      { path: "saletracking", name: "saletracking", component: () => import("../views/report/saletracking.vue") },
      { path: "customerreport", name: "customerreport", component: () => import("../views/report/customerreport.vue") },
      { path: "notification", name: "notification", component: () => import("../views/notification/index.vue") },
      { path: "user", name: "user", component: () => import("../views/users/index.vue"), meta: { adminOnly: true } },
      { path: "setting", name: "setting", component: () => import("../views/setting/index.vue") },
      {path: "companyprofile", name: "companyprofile", component: () => import("../views/setting/companyprofile.vue") },
      { path: "logout", name: "logout", component: () => import("../views/logout/index.vue") },
    ],
  },

  // Catch-all → login
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

// -------------------------
// Router
// -------------------------
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// -------------------------
// Global Auth & Role Guard
// -------------------------
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("token");

  // ១. Decode Role ឱ្យមានសុវត្ថិភាព (ឆែកកុំឱ្យវា Error នាំឱ្យគាំងកូដ)
  let role = null;
  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        role = payload.role;
      }
    } catch (e) {
  localStorage.removeItem('token'); // លុបចោលដើម្បីឈប់ឱ្យវាវិលជុំ
  return next({ name: 'login' });
}
  }

  // ២. លក្ខខណ្ឌការពារការវិលជុំ (Infinite Loop Fix)
  // ប្រសិនបើកំពុងទៅទំព័រ Login ហើយអត់មាន Token ទេ ឱ្យវាទៅមុខចុះ (ឈប់ Redirect ទៀត)
  if (to.name === "login" && !token) {
    return next();
  }

  // ៣. បើព្យាយាមចូលទំព័រដែលត្រូវការ Auth តែអត់មាន Token
  if (to.meta.requiresAuth && !token) {
    return next({ name: "login" });
  }

  // ៤. បើមាន Token ហើយ តែនៅព្យាយាមចូលទំព័រ Login ទៀត ឱ្យរុញទៅ Dashboard
  if (to.name === "login" && token) {
    return next({ name: "dashboard" });
  }

  // ៥. ឆែក Role សម្រាប់ Admin
  if (to.meta.adminOnly && role !== "admin") {
    alert("Access denied. Admins only.");
    return next({ name: "dashboard" });
  }

  // បើក្រៅពីលក្ខខណ្ឌខាងលើ ឱ្យទៅមុខបន្តធម្មតា
  next();
});
export default router;