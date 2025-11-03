<template>
  <!-- Loading State -->
  <div v-if="loading" class="text-center py-8 text-[#98a1b3]">
    <div
      class="border-t-[#6b6bff] border-l-[rgba(255,255,255,0.06)] border-r-[rgba(255,255,255,0.04)] border-b-[rgba(255,255,255,0.02)] border-solid border-4 rounded-full animate-spin w-8 h-8 mx-auto"
    ></div>
    Loading reviews...
  </div>

  <!-- No Reviews State -->
  <div v-else-if="reviews.length === 0" class="text-center py-8 text-[#98a1b3]">
    No reviews yet. Be the first to review this movie!
  </div>

  <!-- Reviews List -->
  <div
    v-else
    class="max-h-[400px] overflow-y-auto p-4 space-y-4 bg-[#111827]/40 rounded-2xl border border-[#2a2f3b]"
  >
    <div
      v-for="review in reviews"
      :key="review.id"
      class="p-4 rounded-xl bg-[#1e293b] border border-gray-700 transition hover:bg-[#273549]"
    >
      <div class="flex items-start gap-4">
        <div
          class="w-10 h-10 rounded-full overflow-hidden bg-[#6b6bff]/20 flex-shrink-0"
        >
          <img
            v-if="review.userAvatar"
            :src="review.userAvatar"
            :alt="review.userName"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-[#6b6bff]/20 text-white font-bold"
          >
            {{ review.userName.charAt(0).toUpperCase() }}
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <span class="font-semibold text-white truncate">{{
              review.userName
            }}</span>
            <span
              class="px-2 py-1 rounded bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-semibold"
              >⭐ {{ review.rating }}/10</span
            >
            <span class="text-xs text-[#98a1b3]">{{
              formatDate(review.createdAt)
            }}</span>
            <span
              v-if="review.source === 'tmdb'"
              class="px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs"
              >TMDB</span
            >
            <span
              v-else
              class="px-2 py-1 rounded bg-green-500/20 text-green-300 border border-green-500/30 text-xs"
              >WatchBuddy</span
            >
          </div>

          <p class="text-left text-[#d7dde8] leading-relaxed break-words">
            {{
              showFull[review.id]
                ? review.comment
                : truncate(review.comment, 180)
            }}
            <button
              v-if="review.comment.length > 180"
              @click="toggleExpand(review.id)"
              class="text-[#6b6bff] hover:underline ml-1 text-sm"
            >
              {{ showFull[review.id] ? "Show less" : "Read more" }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Review Form -->
  <div
    v-if="!userHasReviewed"
    class="max-h-[400px] mt-5 overflow-y-auto p-4 space-y-4 bg-[#111827]/40 rounded-2xl border border-[#2a2f3b]"
  >
    <h3 class="text-lg font-semibold mb-4 text-white">Write a Review</h3>
    <form @submit.prevent="onSubmitReview" class="space-y-4">
      <div class="flex justify-center space-x-1 select-none">
        <template v-for="star in 10" :key="star">
          <svg
            @click="formData.rating = star"
            @mouseover="hoverRating = star"
            @mouseleave="hoverRating = 0"
            xmlns="http://www.w3.org/2000/svg"
            :class="
              star <= (hoverRating || formData.rating)
                ? 'text-yellow-400'
                : 'text-gray-400'
            "
            fill="currentColor"
            viewBox="0 0 20 20"
            stroke="none"
            class="w-6 h-6 cursor-pointer hover:text-yellow-300 transition-colors"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.167c.969 0 1.371 1.24.588 1.81l-3.374 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.538 1.117l-3.374-2.454a1 1 0 00-1.176 0l-3.374 2.454c-.783.57-1.838-.195-1.538-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.038 9.384c-.783-.57-.38-1.81.588-1.81h4.167a1 1 0 00.95-.69l1.286-3.957z"
            />
          </svg>
        </template>
      </div>

      <div>
        <label class="block mb-2 text-sm text-[#98a1b3]" for="comment"
          >Comment</label
        >
        <textarea
          v-model="formData.comment"
          id="comment"
          rows="4"
          required
          class="w-full px-4 py-2 rounded-lg bg-white/4 border border-white/6 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#6b6bff]"
          placeholder="Write your review..."
        ></textarea>
      </div>
      <button
        type="submit"
        :disabled="submitting"
        class="px-6 py-2 rounded-lg bg-[#6b6bff] hover:bg-[#5a5aff] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ submitting ? "Submitting..." : "Submit Review" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { fetchReviews, submitReview } from "@/lib/movieReviewsApi";
import { useAuth } from "@clerk/vue";

const { userId } = useAuth();

interface Review {
  id: string;
  movieId: number;
  userId: string | null;
  userName: string;
  userAvatar: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  source: "user" | "tmdb";
}

const hoverRating = ref(0);

const props = defineProps<{ movieId: number }>();

const reviews = ref<Review[]>([]);
const loading = ref(true);
const submitting = ref(false);
const userStore = useUserStore();
const showFull = ref<Record<string, boolean>>({});

const formData = ref({
  rating: 0,
  comment: "",
});

const userHasReviewed = computed(() => {
  if (!userStore.userInfo?.id) return false;
  return reviews.value.some((r) => r.userId === String(userStore.userInfo.id));
});

// Methods
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function toggleExpand(id: string) {
  showFull.value[id] = !showFull.value[id];
}

function truncate(text: string, length: number) {
  if (!text) return "";
  return text.length > length ? text.slice(0, length) + "..." : text;
}

async function loadReviews() {
  loading.value = true;
  reviews.value = await fetchReviews(props.movieId);
  loading.value = false;
}

async function onSubmitReview() {
  console.log(userId.value);
  if (!userStore.userInfo?.id) {
    alert("Please log in to submit a review");
    return;
  }
  submitting.value = true;
  try {
    const newReview = await submitReview(
      props.movieId,
      userId.value,
      formData.value.rating,
      formData.value.comment
    );
    if (newReview) {
      reviews.value.unshift(newReview);
      formData.value = { rating: 0, comment: "" };
    }
  } catch (error: any) {
    alert(error.message || "Failed to submit review. Please try again.");
  }
  submitting.value = false;
}

onMounted(() => {
  loadReviews();
});
</script>
