<template>
  <div class="template-list-page">
    <h2 class='mb-3'>Saved Templates</h2>
    <div v-if="loading">Loading...</div>
    <div v-else class="templates-grid">
      <div v-for="template in templates" :key="template.id" class="template-card">
        <button class="delete-btn" @click="openDeleteModal(template.id)">
          <i class='pi pi-trash'></i>
        </button>
        <div class="card-content">
          <h3>{{ template.name }}</h3>
          <p>Created on: {{ formatDate(template.createdAt) }}</p>
        </div>
        <div class="template-preview p-1">
          <div class="preview-content" v-html="template.html"></div>
        </div>
      </div>
    </div>
    <ConfirmationModal
      :isVisible="showDeleteModal"
      title="Delete Template"
      message="Are you sure you want to delete this template? This action cannot be undone."
      @confirm="handleDeleteConfirm"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ConfirmationModal from '../components/ConfirmationModal.vue';

export default {
  name: 'TemplateListPage',
  components: {
    ConfirmationModal,
  },
  data() {
    return {
      showDeleteModal: false,
      templateToDeleteId: null,
    };
  },
  computed: {
    ...mapState('templates', {
      templates: state => state.templates,
      loading: state => state.loading,
    }),
  },
  created() {
    this.fetchTemplates();
  },
  methods: {
    ...mapActions('templates', [
      'fetchTemplates',
      'deleteTemplate'
    ]),

    openDeleteModal(templateId) {
      this.templateToDeleteId = templateId;
      this.showDeleteModal = true;
    },

    async handleDeleteConfirm() {
      await this.deleteTemplate(this.templateToDeleteId);
      this.cancelDelete();
    },
    
    cancelDelete() {
      this.showDeleteModal = false;
      this.templateToDeleteId = null;
    },
    
    formatDate(timestamp) {
      if (timestamp && timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
      }
      return 'Date not available';
    }
  }
}
</script>

<style scoped>
.template-list-page {
  background-color: #f9fafb;
  padding: 2rem;
  border-radius: 8px;
}
.templates-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}
.template-card {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  position: relative;
}
.template-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background-color: #FEE2E2;
  color: #b91c1c;
  font-size: 1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s ease-in-out;
}
.template-card:hover .delete-btn {
  visibility: visible;
  opacity: 1;
}
.btn-delete {
  background-color: #FEE2E2;
  color: #b91c1c;
}
.delete-btn:hover {
  color: white;
  background-color: #EF4444;
}
.card-content {
  padding: 15px;
  border-bottom: 1px solid #e5e7eb;
}
.card-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-content p {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
}
.template-preview {
  flex-grow: 1; 
  height: 200px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.preview-content {
  transform: scale(0.4); 
  transform-origin: top left;
  width: 250%;
  height: 250%;
}
</style>