<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
    <BaseNavBar />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900">Profile Settings</h1>
        <p class="text-gray-600 mt-2">Manage your account information and preferences</p>
      </div>

      <!-- Profile Picture Section -->
      <div class="bg-white rounded-xl shadow-md p-8 mb-6 border border-gray-100">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
          Profile Picture
        </h2>
        
        <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
          <!-- Avatar Preview -->
          <div class="flex-shrink-0">
            <div class="relative">
              <img 
                id="avatarPreview" 
                :src="avatarUrl || defaultAvatar" 
                alt="Profile Picture" 
                class="w-32 h-32 rounded-2xl object-cover bg-gray-300 shadow-lg ring-4 ring-blue-100" 
              />
              <button 
                type="button" 
                class="absolute -bottom-3 -right-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all hover:scale-110" 
                @click="avatarInput?.click()"
                title="Change profile picture"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
            </div>
            <input 
              ref="avatarInput" 
              type="file" 
              accept="image/png,image/jpeg,image/jpg" 
              class="hidden" 
              @change="onAvatarSelected" 
            />
          </div>

          <!-- Upload Instructions -->
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Upload a new picture</h3>
            <p class="text-gray-600 mb-4">
              Choose a profile picture that represents you. This will be visible to other users on the platform.
            </p>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-blue-800 font-medium">
                Supported formats: PNG, JPG, JPEG (Max 5MB)
              </p>
            </div>
            <button 
              type="button"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              @click="avatarInput?.click()"
            >
              Choose File
            </button>
          </div>
        </div>
      </div>

      <!-- Personal Information Section -->
      <div class="bg-white rounded-xl shadow-md p-8 mb-6 border border-gray-100">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-1 h-6 bg-green-600 rounded-full mr-3"></span>
          Personal Information
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Username -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input 
              v-model="form.username" 
              type="text" 
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
              placeholder="your_username"
            />
            <p class="text-xs text-gray-500 mt-1">Your unique identifier on WatchBuddy</p>
          </div>

          <!-- First Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
            <input 
              v-model="form.firstName" 
              type="text" 
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
              placeholder="John"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
            <input 
              v-model="form.lastName" 
              type="text" 
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
              placeholder="Doe"
            />
          </div>

          <!-- Email -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input 
              v-model="form.email" 
              type="email" 
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
              placeholder="john@example.com"
            />
            <p class="text-xs text-gray-500 mt-1">We'll never share your email with anyone else</p>
          </div>

          <!-- Phone Number -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input 
              v-model="form.phone" 
              type="tel" 
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
              placeholder="+65 12345678"
            />
            <p class="text-xs text-gray-500 mt-1">Optional: Used for account recovery</p>
          </div>
        </div>
      </div>

      <!-- Security Section -->
      <div class="bg-white rounded-xl shadow-md p-8 mb-6 border border-gray-100">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-1 h-6 bg-amber-600 rounded-full mr-3"></span>
          Security & Password
        </h2>
        
        <!-- Current Password -->
        <div class="mb-8 pb-8 border-b border-gray-200">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
          <input 
            v-model="form.currentPassword" 
            type="password" 
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" 
            placeholder="Enter your current password"
          />
          <p class="text-xs text-gray-500 mt-1">Required to make changes to your account</p>
        </div>

        <!-- Change Password Section -->
        <div>
          <h3 class="text-base font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Change Password
          </h3>
          <p class="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- New Password -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <input 
                v-model="form.newPassword" 
                type="password" 
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" 
                placeholder="••••••••"
              />
              <p class="text-xs text-gray-500 mt-1">At least 8 characters</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
              <input 
                v-model="form.confirmPassword" 
                type="password" 
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" 
                placeholder="••••••••"
              />
              <p class="text-xs text-gray-500 mt-1">Must match the password above</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <button 
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5" 
          @click="updateProfile()"
        >
          Save Changes
        </button>
        <button 
          class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-all duration-200" 
          @click="resetForm()"
        >
          Reset Changes
        </button>
      </div>

      <!-- Danger Zone -->
      <div class="bg-red-50 border-2 border-red-200 rounded-xl p-8">
        <h2 class="text-xl font-bold text-red-900 mb-2 flex items-center">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 4v2m0-14a9 9 0 110 18 9 9 0 010-18zm0 0a9 9 0 110 18 9 9 0 010-18z"></path>
          </svg>
          Danger Zone
        </h2>
        <p class="text-red-800 mb-4">
          Deleting your account is permanent and cannot be undone. All your data, including watchlists, ratings, and badges will be permanently deleted.
        </p>
        <button 
          class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg" 
          @click="confirmDeleteAccount()"
        >
          Delete Account
        </button>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="isDeleteConfirmOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        @click.self="isDeleteConfirmOpen = false"
      >
        <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="bg-red-50 px-6 py-5 border-b border-red-200">
            <h3 class="text-lg font-bold text-red-900 flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Delete Account?
            </h3>
          </div>
          <div class="p-6">
            <p class="text-gray-700 mb-4">
              This action cannot be undone. Your account and all associated data will be permanently deleted.
            </p>
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p class="text-sm text-red-800 font-medium">
                Type <span class="font-bold">DELETE</span> to confirm
              </p>
              <input 
                v-model="deleteConfirmText" 
                type="text" 
                class="w-full border border-red-300 rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                placeholder="DELETE"
              />
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <button 
              class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors" 
              @click="isDeleteConfirmOpen = false"
            >
              Cancel
            </button>
            <button 
              class="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="deleteConfirmText !== 'DELETE'"
              @click="deleteAccount()"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <BaseFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import BaseNavBar from '@/components/BaseNavBar.vue'
import BaseFooter from '@/components/BaseFooter.vue'

const initial = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  username: '',
  avatarDataUrl: ''
}

const form = ref({ ...initial })
const avatarUrl = ref('')
const avatarInput = ref<HTMLInputElement | null>(null)
const isDeleteConfirmOpen = ref(false)
const deleteConfirmText = ref('')

const defaultAvatar = 'https://via.placeholder.com/128?text=Avatar'

// Password validation
const isPasswordValid = computed(() => {
  if (!form.value.newPassword && !form.value.confirmPassword) {
    return true // Password change is optional
  }
  return form.value.newPassword === form.value.confirmPassword && form.value.newPassword.length >= 8
})

const onAvatarSelected = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const data = String(reader.result)
    form.value.avatarDataUrl = data
    avatarUrl.value = data
    ;(document.querySelector('#avatarPreview') as HTMLImageElement | null)?.setAttribute('src', data)
  }
  reader.readAsDataURL(file)
}

const resetForm = () => {
  form.value = { ...initial }
  deleteConfirmText.value = ''
  const saved = localStorage.getItem('wb_profile')
  if (saved) {
    const parsed = JSON.parse(saved)
    form.value = { ...initial, ...parsed }
    if (parsed.avatarDataUrl) {
      avatarUrl.value = parsed.avatarDataUrl
    }
  }
}

const updateProfile = () => {
  // Validate form
  if (!form.value.username || !form.value.email) {
    alert('Please fill in all required fields')
    return
  }

  if (!isPasswordValid.value) {
    alert('Passwords do not match or are too short (minimum 8 characters)')
    return
  }

  // Persist to localStorage (replace with backend later)
  localStorage.setItem('wb_profile', JSON.stringify(form.value))
  alert('Profile updated successfully!')
}

const confirmDeleteAccount = () => {
  isDeleteConfirmOpen.value = true
  deleteConfirmText.value = ''
}

const deleteAccount = () => {
  if (deleteConfirmText.value !== 'DELETE') {
    alert('Please type DELETE to confirm')
    return
  }

  // TODO: integrate with backend
  localStorage.removeItem('wb_profile')
  alert('Account deleted successfully')
  // Redirect to home page
  // router.push('/')
}

onMounted(() => {
  const saved = localStorage.getItem('wb_profile')
  if (saved) {
    const parsed = JSON.parse(saved)
    form.value = { ...initial, ...parsed }
    if (parsed.avatarDataUrl) {
      avatarUrl.value = parsed.avatarDataUrl
    }
  }
})
</script>

<style scoped>
</style>

