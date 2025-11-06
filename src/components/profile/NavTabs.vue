
<script setup lang="ts">
import type { TabId } from '@/types/tabs';

const props = defineProps<{
  tabs: ReadonlyArray<{ id: TabId; name: string }>
  activeTab: TabId
}>()
const emit = defineEmits<{ (e: 'change', id: TabId): void }>()
</script>

<template>
  <div class="border-b border-gray-200 dark:border-gray-700 mb-6 bg-white/5 dark:bg-gray-900/30 rounded-t-lg shadow-sm overflow-x-auto overflow-y-hidden">
    <nav class="flex space-x-1 px-4 -mb-px" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        role="tab"
        :aria-selected="activeTab === tab.id"
        @click="emit('change', tab.id)"
        :class="[
          'py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap',
          activeTab === tab.id
            ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100'
            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
        ]"
      >{{ tab.name }}</button>
    </nav>
  </div>
</template>
