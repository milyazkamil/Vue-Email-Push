<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="header">
      <div class="logo" v-show="!isCollapsed">
        <router-link class='text-decoration-none' to="/">
          <img src="../assets/logo.png" alt="Vue Logo">
          <span>Notifinity</span>
        </router-link>
      </div>
      <button class="toggle-btn" @click="toggleSidebar">
        <i v-if="isCollapsed" class='pi pi-angle-right'></i>
        <i v-else class='pi pi-angle-left'></i>
      </button>
    </div>
    <nav class="navigation">
      <ul>
        <li>
          <router-link to="/">
            <i class="icon pi pi-user"></i>
            <span class="text" v-show="!isCollapsed">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/email-push">
            <i class="icon pi pi-send"></i>
            <span class="text" v-show="!isCollapsed">E-mail Push</span>
          </router-link>
        </li>
        <li>
          <router-link to="/chatbot">
            <i class="icon pi pi-microchip-ai"></i>
            <span class="text" v-show="!isCollapsed">Chatbot</span>
          </router-link>
        </li>
        <li>
          <router-link to="/templates">
            <i class="icon pi pi-sparkles"></i>
            <span class="text" v-show="!isCollapsed">Create Template</span>
          </router-link>
        </li>
        <li>
          <router-link to="/all-templates">
            <i class="icon pi pi-objects-column"></i>
            <span class="text" v-show="!isCollapsed">All Templates</span>
          </router-link>
        </li>
        <li>
          <router-link to="/users">
            <i class="icon pi pi-users"></i>
            <span class="text" v-show="!isCollapsed">Users</span>
          </router-link>
        </li>
        <li>
          <router-link to="/segments">
            <i class="icon pi pi-sitemap"></i>
            <span class="text" v-show="!isCollapsed">Segments</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'SidebarArea',
  data() {
    return {
      isCollapsed: false
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
      this.$emit('toggle-sidebar', this.isCollapsed);
    }
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #ffffff;
  padding: 1rem 0.5rem;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  width: 250px;
  transition: width 0.3s ease, padding 0.3s ease;
  overflow: hidden;
  box-sizing: border-box;
}
.sidebar.collapsed {
  width: 80px;
  padding: 1rem 0.5rem;
  align-items: center;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 2rem;
  padding: 0 0.5rem;
  box-sizing: border-box;
}
.sidebar.collapsed .header {
  justify-content: center;
}
.logo {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.logo img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.logo span {
  font-weight: bold;
  font-size: 1.5rem;
  background-image: linear-gradient(to right, #FEB140, #FE537C, #6a11cb, #46C6E0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.toggle-btn {
  background: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #555;
  flex-shrink: 0;
}
.toggle-btn:hover {
  background-color: #f0f2f5;
}
.navigation ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}
.navigation li a {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin: 0 0.5rem;
  border-radius: 8px;
  text-decoration: none;
  color: #555;
  font-weight: 500;
  transition: background-color 0.3s, color 0.3s;
  white-space: nowrap;
}
.sidebar.collapsed .navigation li a {
  justify-content: center;
  padding: 1rem 0;
}
.navigation li a:hover,
.navigation li a.router-link-exact-active {
  background-color: #e6f7ff;
  color: #1890ff;
}
.icon {
  min-width: 40px;
  text-align: center;
}
.text {
  margin-left: 10px;
}
</style>