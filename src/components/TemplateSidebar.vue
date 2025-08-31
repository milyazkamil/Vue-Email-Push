<template>
  <div class="sidebar">
    <div class="tabs">
      <button :class="{ active: activeTab === 'content' }" @click="activeTab = 'content'">Content</button>
      <button :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'" :disabled="!selectedBlock">Settings</button>
    </div>
    <div v-if="activeTab === 'content'" class="tab-content">
      <draggable
        :list="contentBlocks"
        :clone="cloneBlock"
        item-key="type"
        :group="{ name: 'blocks', pull: 'clone', put: false }"
        :sort="false"
        class="content-blocks-list"
      >
        <div v-for="element in contentBlocks" :key="element.type" class="content-block-item">
          <div class="block-title">{{ element.name }}</div>
          <div class="block-icon">
            <i :class="element.icon"></i>
          </div>
        </div>
      </draggable>
    </div>
    <div v-if="activeTab === 'settings' && selectedBlock" class="tab-content">
      <SettingsPanel 
        :block="selectedBlock"
        @update-block="$emit('update-block', $event)"
        @ai-generation-start="$emit('ai-generation-start')" 
        @ai-generation-end="$emit('ai-generation-end')"
      />
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import SettingsPanel from './SettingsPanel.vue';

export default {
  components: {
    draggable,
    SettingsPanel,
  },
  props: {
    selectedBlock: Object,
  },
  data() {
    return {
      activeTab: 'content',
      contentBlocks: [
        { name: 'Metin', type: 'text', content: 'This is some text.', icon: 'pi pi-align-justify' },
        { name: 'Görsel', type: 'image', src: "https://images.unsplash.com/photo-1713885639308-d953cc619ffd?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", icon: 'pi pi-image' },
        { name: 'Ayraç', type: 'divider', styles: { padding: '10px 0', borderTopWidth: '2px', 
          borderTopStyle: 'solid', 
          borderTopColor: '#cccccc' 
        }, icon: 'pi pi-minus' },
          { name: 'Buton', type: 'button', content: 'Click Me', icon: 'pi pi-bolt', href: '#', styles: {
            backgroundColor: '#007bff',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '50px'
          } 
        },
        { 
          name: 'HTML', 
          type: 'html', 
          content: `<div style="max-width:420px;margin:20px auto;padding:20px;
            border:1px solid #ddd;border-radius:12px;
            background:#fff;font-family:sans-serif;text-align:center;">
            <img src="https://images.unsplash.com/photo-1440778303588-435521a205bc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Campaign Banner"
                style="max-width:100%;border-radius:8px;margin-bottom:15px;">
            <h2 style="margin:0 0 12px;font-size:22px;color:#2563eb;">
              ☀️ Summer Campaign 🌴
            </h2>
            <p style="margin:0 0 16px;font-size:15px;color:#555;line-height:1.5;">
              🎉 Join our exclusive summer deals and save up to 
              <strong>40%</strong> 🛍️  
              Hurry up — offer ends soon ⏰
            </p>
            <a href="#"
              style="display:inline-block;padding:10px 18px;
                      background:#2563eb;color:#fff;text-decoration:none;
                      border-radius:6px;font-weight:600;">
              🚀 Shop Now
            </a>
          </div>
          `, 
          icon: 'pi pi-code' 
        },
        { 
          name: 'Sosyal', 
          type: 'social', 
          icon: 'pi pi-share-alt',
          iconColor: '#000000',
          socials: [
            { name: 'Facebook', iconClass: 'pi pi-facebook', url: '#', visible: true, imgUrl: 'https://img.icons8.com/?size=100&id=118467&format=png&color=000000' },
            { name: 'Twitter', iconClass: 'pi pi-twitter', url: '#', visible: true, imgUrl: 'https://img.icons8.com/?size=100&id=phOKFKYpe00C&format=png&color=000000' },
            { name: 'LinkedIn', iconClass: 'pi pi-linkedin', url: '#', visible: true, imgUrl: 'https://img.icons8.com/?size=100&id=8808&format=png&color=000000' },
            { name: 'Instagram', iconClass: 'pi pi-instagram', url: '#', visible: true, imgUrl: 'https://img.icons8.com/?size=100&id=32309&format=png&color=000000' },
            { name: 'Youtube', iconClass: 'pi pi-youtube', url: '#', visible: true, imgUrl: 'https://img.icons8.com/?size=100&id=37326&format=png&color=000000' },
          ],
          styles: {
            textAlign: 'center',
            padding: '10px',
          }
        },
      ],
    };
  },
  watch: {
    selectedBlock(newVal) {
      if (newVal) {
        this.activeTab = 'settings';
      }
    },
  },
  methods: {
    cloneBlock(block) {
      return JSON.parse(JSON.stringify(block));
    }
  }
};
</script>

<style scoped>
.sidebar { 
  width: 350px; 
  background-color: #fff; 
  border-left: 1px solid #ddd; 
  display: flex; 
  flex-direction: column;
  overflow: hidden;
}
.tabs { 
  display: flex;
  flex-shrink: 0;
}
.tabs button { 
  flex-grow: 1; 
  padding: 15px; 
  border: none; 
  background-color: #f8f9fa; 
  cursor: pointer; 
  border-bottom: 1px solid #ddd; 
}
.tabs button.active { 
  background-color: #fff; 
  border-bottom: 2px solid #007bff; 
}
.tabs button:disabled { 
  color: #ccc; 
  cursor: not-allowed; 
}
.tab-content { 
  padding: 15px; 
  overflow-y: auto;
  flex-grow: 1;
  min-height: 0;
}
.content-blocks-list { 
  display: grid; 
  grid-template-columns: 1fr 1fr 1fr; 
  gap: 10px; 
}
.content-block-item { 
  display: flex;
  flex-direction: column;
  background-color: #fff; 
  border: 1px solid #ddd; 
  border-radius: 4px; 
  cursor: grab; 
  height: 100px;
  transition: all 0.2s ease-in-out;
}
.content-block-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.block-title {
  padding: 8px 10px;
  text-align: center;
  color: #0d6efd;
  font-weight: 500;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
}
.block-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  color: #6c757d;
}
.block-icon i {
  font-size: 2.5rem;
}
</style>