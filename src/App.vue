<template>
  <MainLayout v-if="route.meta.layout !== 'empty'">
    <router-view />
  </MainLayout>
  <router-view v-else />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import MainLayout from '@/components/layouts/MainLayout.vue'

const route = useRoute()
</script>
