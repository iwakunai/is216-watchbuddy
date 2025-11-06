<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUser } from '@clerk/vue'
import { getUserReviews, deleteMovieReview, deleteTvReview } from '@/lib/supabaseRatingsReviews'
import { useRouter } from 'vue-router'
import type { CombinedReview } from '@/composables/review'

const { user } = useUser()
const router = useRouter()
const allReviews = ref<CombinedReview[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const filterType = ref<'all' | 'movie' | 'tv'>('all')
const expandedReviews = ref<Set<string>>(new Set())
const deletingReviews = ref<Set<string>>(new Set())

const filteredReviews = computed(() => {
  if (filterType.value === 'all') return allReviews.value
  return allReviews.value.filter(review => review.media_type === filterType.value)
})

async function loadReviews() {
  if (!user.value) return
  
  loading.value = true
  error.value = null
  
  try {
    allReviews.value = await getUserReviews(user.value.id, 'all')
  } catch (err) {
    
    error.value = 'Failed to load reviews'
  } finally {
    loading.value = false
  }
}

function navigateToDetail(review: CombinedReview) {
  const path = review.media_type === 'movie' ? '/movie' : '/tv'
  router.push(`${path}/${review.tmdb_id}`)
}

function toggleExpanded(reviewId: string, event: Event) {
  event.stopPropagation()
  if (expandedReviews.value.has(reviewId)) {
    expandedReviews.value.delete(reviewId)
  } else {
    expandedReviews.value.add(reviewId)
  }
}

function isExpanded(reviewId: string) {
  return expandedReviews.value.has(reviewId)
}

function shouldShowReadMore(text: string) {
  return text.length > 200
}

async function deleteReview(review: CombinedReview, event: Event) {
  event.stopPropagation()
  
  if (!user.value) return
  
  // Confirm deletion
  if (!confirm(`Are you sure you want to delete your review for "${review.title}"?`)) {
    return
  }
  
  deletingReviews.value.add(review.id)
  
  try {
    // Delete based on media type
    if (review.media_type === 'movie') {
      await deleteMovieReview(user.value.id, review.id)
    } else {
      await deleteTvReview(user.value.id, review.id)
    }
    
    // Remove from local state
    allReviews.value = allReviews.value.filter(r => r.id !== review.id)
  } catch (err) {
    error.value = 'Failed to delete review. Please try again.'
  } finally {
    deletingReviews.value.delete(review.id)
  }
}

function isDeleting(reviewId: string) {
  return deletingReviews.value.has(reviewId)
}

onMounted(() => {
  loadReviews()
})
</script>

<template>
  <div class="bg-white/5 dark:bg-gray-900/30 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
    <div class="mb-6">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100">My Ratings & Reviews</h3>
      <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">Your ratings and reviews for movies and TV shows</p>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
      <button
        @click="filterType = 'all'"
        :class="[
          'px-4 py-2 font-medium transition-colors border-b-2',
          filterType === 'all'
            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        ]"
      >
        All ({{ allReviews.length }})
      </button>
      <button
        @click="filterType = 'movie'"
        :class="[
          'px-4 py-2 font-medium transition-colors border-b-2',
          filterType === 'movie'
            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        ]"
      >
        Movies ({{ allReviews.filter(r => r.media_type === 'movie').length }})
      </button>
      <button
        @click="filterType = 'tv'"
        :class="[
          'px-4 py-2 font-medium transition-colors border-b-2',
          filterType === 'tv'
            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        ]"
      >
        TV Shows ({{ allReviews.filter(r => r.media_type === 'tv').length }})
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      <p class="ml-3 text-gray-600 dark:text-gray-400">Loading reviews...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
      <p class="text-red-800 dark:text-red-200">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredReviews.length === 0" class="text-center py-12">
      <div class="text-gray-400 dark:text-gray-500 text-5xl mb-4">📝</div>
      <p class="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">
        No {{ filterType === 'all' ? '' : filterType === 'movie' ? 'movie' : 'TV show' }} reviews yet
      </p>
      <p class="text-gray-500 dark:text-gray-500 text-sm">
        Start watching and reviewing your favorite content!
      </p>
    </div>

    <!-- Reviews List -->
    <div v-else class="space-y-4">
      <div 
        v-for="review in filteredReviews" 
        :key="review.id"
        class="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border border-gray-200 dark:border-gray-700 group relative"
      >
        <!-- Delete Button -->
        <button
          @click="deleteReview(review, $event)"
          :disabled="isDeleting(review.id)"
          class="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
          title="Delete review"
        >
          <svg v-if="!isDeleting(review.id)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>

        <div class="flex items-start gap-4">
          <!-- Poster -->
          <div 
            @click="navigateToDetail(review)"
            class="w-20 h-30 flex-shrink-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-md shadow-sm overflow-hidden cursor-pointer"
          >
            <img 
              v-if="review.poster" 
              :src="review.poster" 
              :alt="review.title" 
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
              No Image
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <!-- Title and Metadata (Left Aligned) -->
            <div class="mb-3">
              <h4 
                @click="navigateToDetail(review)"
                class="font-bold text-gray-900 dark:text-gray-100 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
              >
                {{ review.title }}
              </h4>
              <div class="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span class="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded capitalize">
                  {{ review.media_type }}
                </span>
                <span v-if="review.year">{{ review.year }}</span>
                <span>•</span>
                <span>{{ review.reviewedDate }}</span>
              </div>
            </div>

            <!-- Review Text -->
            <div class="relative">
              <p :class="[
                'text-sm text-gray-700 dark:text-gray-300 leading-relaxed',
                !isExpanded(review.id) && shouldShowReadMore(review.review_text) ? 'line-clamp-3' : ''
              ]">
                {{ review.review_text }}
              </p>
              
              <!-- Read More Button -->
              <button
                v-if="shouldShowReadMore(review.review_text)"
                @click="toggleExpanded(review.id, $event)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium mt-2"
              >
                {{ isExpanded(review.id) ? 'Show less' : 'Read more' }}
              </button>
            </div>

            <!-- Rating at Bottom Right -->
            <div class="flex justify-end mt-4">
              <div class="flex items-center gap-1 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg shadow-sm">
                <span v-for="i in 10" :key="i" class="text-base">
                  {{ i <= review.rating ? '⭐' : '☆' }}
                </span>
                <span class="ml-2 text-sm font-bold text-gray-900 dark:text-gray-100">
                  {{ review.rating }}/10
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
