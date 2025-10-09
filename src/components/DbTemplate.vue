<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient'

async function getUserProfile() {
  const { data, error } = await supabase.from('profiles').select('*')
  // handle result
  if(error){
    console.error('Error fetching profiles:', error)
  }
  else{

  }
}

// Call function on mount
onMounted(() => {
  getUserProfile()
})

</script>



<style scoped>

</style>


