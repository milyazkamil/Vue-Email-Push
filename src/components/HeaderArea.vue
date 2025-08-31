<template>
  <header class="header">
    <div class="search-bar">
      <input type="text" placeholder="Search...">
    </div>
    <div class="user-info d-flex align-items-center gap-3">
      <span>Profile: {{ userName }}</span>
      <button class='btn btn-sm btn-outline-primary d-flex align-items-center gap-1'>
        <span class='fw-semibold'>Log Out</span>
        <i class='fw-semibold pi pi-sign-out'></i>
      </button>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HeaderArea',
  computed: {
    ...mapGetters(['userName'])
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e8e8e8;
}
.search-bar input {
  border: 1px solid #d9d9d9;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  min-width: 300px;
}
</style>