<template>
  <br></br>

      <div v-if="loading" class="text-center py-8 text-[#98a1b3]">
        <div class="loader-ring w-8 h-8 mx-auto"></div>
        Loading reviews...
      </div>
  
      <div v-else-if="reviews.length === 0" class="text-center py-8 text-[#98a1b3]">
        No reviews yet. Be the first to review this movie!
      </div>
  
      <div v-else class="max-h-[400px] overflow-y-auto space-y-4 p-4 bg-[#111827]/40 rounded-2xl border border-[#2a2f3b]">
        <div 
          v-for="review in reviews" 
          :key="review.id" 
          class="review-card text-sm text-[#d7dde8]"
        >
          <div class="flex items-start gap-4">
    
            <div class="review-avatar w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img 
                v-if="review.userAvatar" 
                :src="review.userAvatar" 
                :alt="review.userName"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-[#6b6bff]/20 text-white font-bold">
                {{ review.userName.charAt(0).toUpperCase() }}
              </div>
            </div>
  
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <span class="font-semibold text-white truncate">{{ review.userName }}</span>
                <span class="review-badge">
                  ⭐ {{ review.rating }}/10
                </span>
                <span class="text-xs text-[#98a1b3]">
                  {{ formatDate(review.createdAt) }}
                </span>
                <span 
                  v-if="review.source === 'tmdb'" 
                  class="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30"
                >
                  TMDB
                </span>
                <span 
                  v-else 
                  class="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 border border-green-500/30"
                >
                WatchBuddy
                </span>
              </div>
                <p class="text-[#d7dde8] leading-relaxed break-words">
                  {{ showFull[review.id] ? review.comment : truncate(review.comment, 180) }}
                  <button 
                    v-if="review.comment.length > 180" 
                    @click="toggleExpand(review.id)" 
                    class="text-[#6b6bff] hover:underline ml-1 inline text-sm"
                  >
                  {{ showFull[review.id] ? 'Show less' : 'Read more' }}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
  <br></br>
  <br></br>
  <div v-if="!userHasReviewed" class="review-form-panel mb-8">
        <h3 class="text-lg font-semibold text-white mb-4">Write a Review</h3>
        <form @submit.prevent="submitReview" class="space-y-4">
          <div>
            <label class="block text-sm text-[#98a1b3] mb-2">Rating (0-10)</label>
            <input 
              v-model.number="formData.rating" 
              type="number" 
              min="0" 
              max="10" 
              required
              class="w-full px-4 py-2 rounded-lg bg-white/4 border border-white/6 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6b6bff]"
              placeholder="Enter rating"
            />
          </div>
          <div>
            <label class="block text-sm text-[#98a1b3] mb-2">Comment</label>
            <textarea 
              v-model="formData.comment" 
              required
              rows="4"
              class="w-full px-4 py-2 rounded-lg bg-white/4 border border-white/6 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6b6bff] resize-none"
              placeholder="Write your review..."
            ></textarea>
          </div>
          <button 
            type="submit" 
            :disabled="submitting"
            class="px-6 py-2 rounded-lg bg-[#6b6bff] hover:bg-[#5a5aff] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Submitting...' : 'Submit Review' }}
          </button>
        </form>
      </div>
  
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { supabase } from '@/lib/supabaseClient'
  import { useUserStore } from '@/stores/user'
  
  interface Review {
    id: string
    movieId: number
    userId: string | null
    userName: string
    userAvatar: string | null
    rating: number
    comment: string
    createdAt: string
    source: 'user' | 'tmdb'
  }
  
  const props = defineProps<{
    movieId: number
  }>()
  
  const reviews = ref<Review[]>([])
  const loading = ref(true)
  const submitting = ref(false)
  const userStore = useUserStore()
  const showFull = ref<Record<string, boolean>>({})
  
  const formData = ref({
    rate: '',
    comment: ''
  })
  
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || ''
  
  // Computed
  const totalReviews = computed(() => reviews.value.length)
  const userReviews = computed(() => reviews.value.filter(r => r.source === 'user').length)
  const tmdbReviews = computed(() => reviews.value.filter(r => r.source === 'tmdb').length)
  const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0
    const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
    return sum / reviews.value.length
  })
  
  const userHasReviewed = computed(() => {
    if (!userStore.userInfo?.id) return false
    return reviews.value.some(r => r.userId === String(userStore.userInfo.id))
  })
  
  // Methods
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  function toggleExpand(id) {
    showFull.value[id] = !showFull.value[id]
  }

  function truncate(text, length) {
    if (!text) return ''
    return text.length > length ? text.slice(0, length) + '...' : text
  }
  
  async function fetchReviews() {
    loading.value = true
    try {
      // Fetch user reviews from Supabase
      const { data, error } = await supabase
        .from('movie_reviews')
        .select('*')
        .eq('movie_id', props.movieId)
        .order('created_at', { ascending: false })
  
      if (error) {
        console.error('Error fetching reviews:', error)
      }
  
      const userReviews = (data || []).map(r => ({
        id: r.id,
        movieId: r.movie_id,
        userId: r.user_id,
        userName: r.user_name,
        userAvatar: r.user_avatar,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at,
        source: 'user' as const
      }))
  
      // Fetch TMDB reviews
      let tmdbReviews: Review[] = []
      if (TMDB_API_KEY) {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${props.movieId}/reviews?api_key=${TMDB_API_KEY}`
          )
          if (response.ok) {
            const data = await response.json()
            tmdbReviews = (data.results || []).slice(0, 5).map((r: any) => ({
              id: r.id,
              movieId: props.movieId,
              userId: null,
              userName: r.author_details.username || r.author,
              userAvatar: null,
              rating: r.author_details.rating || 0,
              comment: r.content,
              createdAt: r.created_at,
              source: 'tmdb' as const
            }))
          }
        } catch (e) {
          console.warn('TMDB reviews fetch failed:', e)
        }
      }
  
      // Combine reviews
      reviews.value = [...userReviews, ...tmdbReviews]
    } catch (error) {
      console.error('Error in fetchReviews:', error)
    } finally {
      loading.value = false
    }
  }
  
  async function submitReview() {
    if (!userStore.userInfo?.id) {
      alert('Please log in to submit a review')
      return
    }
  
    submitting.value = true
    try {
      const { data, error } = await supabase
        .from('movie_reviews')
        .insert([
          {
            movie_id: props.movieId,
            user_id: String(userStore.userInfo.id),
            user_name: userStore.userInfo.username || 'Anonymous',
            rating: formData.value.rating,
            comment: formData.value.comment.trim()
          }
        ])
        .select()
        .single()
  
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          alert('You have already reviewed this movie!')
        } else {
          throw error
        }
      } else if (data) {
        // Add to reviews list
        reviews.value.unshift({
          id: data.id,
          movieId: data.movie_id,
          userId: data.user_id,
          userName: data.user_name,
          userAvatar: data.user_avatar,
          rating: data.rating,
          comment: data.comment,
          createdAt: data.created_at,
          source: 'user'
        })
  
        // Reset form
        formData.value = { rating: 5, comment: '' }
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      submitting.value = false
    }
  }
  
  onMounted(() => {
    fetchReviews()
  })
  </script>
  
  <style scoped>
  .reviews-section {
    color: #eaf0ff;
  }
  
  .section-title {
    background: linear-gradient(90deg, #fff, #cfd8ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .reviews-summary-panel {
    padding: 24px;
    border-radius: 16px;
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.2));
    border: 1px solid rgba(255,255,255,0.05);
  }
  
  .review-score-large {
    text-align: center;
    padding: 16px;
    border-radius: 12px;
    background: rgba(107,107,255,0.1);
    border: 1px solid rgba(107,107,255,0.2);
  }
  
  .review-form-panel {
    padding: 20px;
    border-radius: 12px;
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.2));
    border: 1px solid rgba(255,255,255,0.05);
  }
  
  .review-card {
    padding: 16px;
    border-radius: 12px;
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.2));
    border: 1px solid rgba(255,255,255,0.05);
    transition: all 0.3s;
  }
  
  .review-card:hover {
    background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.25));
    border-color: rgba(107,107,255,0.2);
  }
  
  .review-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: rgba(255,255,255,0.02);
  }
  
  .review-badge {
    padding: 4px 8px;
    border-radius: 6px;
    background: rgba(107,107,255,0.1);
    border: 1px solid rgba(107,107,255,0.2);
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
  }
  
  .loader-ring {
    border-top-color: #6b6bff;
    border-left-color: rgba(255,255,255,0.06);
    border-right-color: rgba(255,255,255,0.04);
    border-bottom-color: rgba(255,255,255,0.02);
    border-style: solid;
    border-width: 4px;
    border-radius: 999px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  </style>
  