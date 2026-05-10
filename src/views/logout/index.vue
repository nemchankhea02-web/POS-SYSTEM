<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  const ok = window.confirm("Do you want to leave?");

  if (ok) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  } else {
    router.back(); // stay in previous page
  }
});
</script>

<template>
  <div class="p-6">Logging out...</div>
</template>