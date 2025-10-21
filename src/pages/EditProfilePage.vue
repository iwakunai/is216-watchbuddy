<template>
  <div class="min-h-screen bg-gray-50 text-black">
    <BaseNavBar />

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-semibold text-black mb-4">Your profile</h1>

      <div class="bg-white rounded-xl shadow-sm border">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Avatar and helper -->
            <div class="space-y-3">
              <div class="relative w-24 h-24">
                <img id="avatarPreview" :src="avatarUrl" alt="avatar" class="w-24 h-24 rounded-lg object-cover bg-gray-200" />
                <button type="button" class="absolute -bottom-2 -right-2 bg-blue-600  rounded-full w-7 h-7 flex items-center justify-center shadow" @click="avatarInput?.click()">✎</button>
              </div>
              <input ref="avatarInput" type="file" accept="image/png,image/jpeg" class="hidden" @change="onAvatarSelected" />
              <p class="text-sm text-gray-500">Only .jpg, .png, .jpeg files are allowed</p>
            </div>

            <!-- Details -->
            <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="md:col-span-2">
                <label class="block text-sm text-gray-700 mb-1">Username</label>
                <input v-model="form.username" type="text" class="w-full border rounded-md px-3 py-2" placeholder="sanji_vinsmoke" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">First Name</label>
                <input v-model="form.firstName" type="text" class="w-full border rounded-md px-3 py-2" placeholder="Sanji" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Last Name</label>
                <input v-model="form.lastName" type="text" class="w-full border rounded-md px-3 py-2" placeholder="Vinsmoke" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm text-gray-700 mb-1">Email</label>
                <input v-model="form.email" type="email" class="w-full border rounded-md px-3 py-2" placeholder="masterchef@strawhats.com" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm text-gray-700 mb-1">Phone Number</label>
                <input v-model="form.phone" type="tel" class="w-full border rounded-md px-3 py-2" placeholder="99887745" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm text-gray-700 mb-1">Current Password</label>
                <input v-model="form.currentPassword" type="password" class="w-full border rounded-md px-3 py-2" />
              </div>
            </div>
          </div>

          <div class="mt-10">
            <h2 class="text-base font-semibold text-gray-900 mb-3">Change Password</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm text-gray-700 mb-1">New Password</label>
                <input v-model="form.newPassword" type="password" class="w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Confirm New Password</label>
                <input v-model="form.confirmPassword" type="password" class="w-full border rounded-md px-3 py-2" />
              </div>
            </div>
          </div>

          <div class="mt-10 flex flex-wrap gap-3">
            <button class="bg-blue-600  px-3 py-1.5 rounded-md text-sm" @click="updateProfile()">Update Profile</button>
            <button class="border px-3 py-1.5 rounded-md text-sm" @click="resetForm()">Reset Changes</button>
            <button class="border border-red-600 text-red-600 px-3 py-1.5 rounded-md text-sm" @click="deleteAccount()">Delete Account</button>
          </div>
        </div>
      </div>
    </div>

    <BaseFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
const avatarUrl = ''
const avatarInput = ref<HTMLInputElement | null>(null)

const onAvatarSelected = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const data = String(reader.result)
    form.value.avatarDataUrl = data
    ;(document.querySelector('#avatarPreview') as HTMLImageElement | null)?.setAttribute('src', data)
  }
  reader.readAsDataURL(file)
}

const resetForm = () => {
  form.value = { ...initial }
}
const updateProfile = () => {
  // Persist to localStorage (replace with backend later)
  localStorage.setItem('wb_profile', JSON.stringify(form.value))
}
const deleteAccount = () => {
  // TODO: integrate with backend
}

onMounted(() => {
  const saved = localStorage.getItem('wb_profile')
  if (saved) {
    const parsed = JSON.parse(saved)
    form.value = { ...initial, ...parsed }
    if (parsed.avatarDataUrl) {
      ;(document.querySelector('#avatarPreview') as HTMLImageElement | null)?.setAttribute('src', parsed.avatarDataUrl)
    }
  }
})
</script>

<style scoped>
</style>


