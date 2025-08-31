<template>
  <div id="app" class="app-container" :style="gridStyle">
    <SidebarArea @toggle-sidebar="handleSidebarToggle" />
    <div class="main-content">
      <HeaderArea />
      <main class="content-area">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import SidebarArea from './components/SidebarArea.vue'
import HeaderArea from './components/HeaderArea.vue'

export default {
  name: 'App',
  components: {
    SidebarArea,
    HeaderArea
  },
  data() {
    return {
      isSidebarCollapsed: false
    };
  },
  computed: {
    gridStyle() {
      const sidebarWidth = this.isSidebarCollapsed ? '80px' : '250px';
      return {
        'grid-template-columns': `${sidebarWidth} 1fr`
      };
    }
  },
  methods: {
    handleSidebarToggle(isCollapsed) {
      this.isSidebarCollapsed = isCollapsed;
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f0f2f5;
}
.app-container {
  display: grid;
  height: 100vh;
  transition: grid-template-columns 0.3s ease;
}
.main-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.content-area {
  padding: 2rem;
  overflow-y: auto;
  flex-grow: 1;
}
</style>