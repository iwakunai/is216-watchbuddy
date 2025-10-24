<template>
  <nav class="bg-[#0b1220] border-b border-white/5 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
    <div class="max-w-[1200px] mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <RouterLink to="/" class="text-xl font-bold bg-gradient-to-r from-white to-[#cfd8ff] bg-clip-text text-transparent">
          MovieApp
        </RouterLink>

        <!-- Navigation Links -->
        <div class="flex items-center gap-1">
          <RouterLink 
            to="/" 
            class="nav-link"
            exact-active-class="nav-link-active"
          >
            Home
          </RouterLink>
          
          <RouterLink 
            to="/movies" 
            class="nav-link"
            active-class="nav-link-active"
          >
            Movies
          </RouterLink>
          
          <RouterLink 
            to="/tv" 
            class="nav-link"
            active-class="nav-link-active"
          >
            TV Shows
          </RouterLink>
          
          <RouterLink 
            to="/watchparty" 
            class="nav-link"
            active-class="nav-link-active"
          >
            Watch Party
          </RouterLink>
          
          <RouterLink 
            to="/profile" 
            class="nav-link"
            active-class="nav-link-active"
          >
            Profile
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  padding: 8px 16px;
  border-radius: 8px;
  color: #98a1b3;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  display: inline-block;
}

.nav-link:hover {
  color: #eaf0ff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-link-active {
  color: #6b6bff;
  background: rgba(107, 107, 255, 0.1);
}
</style>