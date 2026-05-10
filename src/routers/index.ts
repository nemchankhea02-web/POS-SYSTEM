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

  // Decode token payload
  let role = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch (e) {
      localStorage.removeItem("token"); // invalid token
    }
  }

  // Protected route → requires login
  if (to.meta.requiresAuth && !token) {
    next({ name: "login" });
  }
  // Login page → already logged in
  else if (to.name === "login" && token) {
    next({ name: "dashboard" });
  }
  // Admin-only page → check role
  else if (to.meta.adminOnly && role !== "admin") {
    alert("Access denied. Admins only.");
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;