<template>
  <div class="segments-page">
    <div class="page-header">
      <h2>Segment Management</h2>
    </div>
    <div class="segments-layout">
      <div class="create-segment-panel">
        <div class="panel-header">
          <h3>Create a New Segment with AI</h3>
          <p>Describe the group of users you want to target in plain language.</p>
        </div>
        <div class="form-group">
          <textarea
            v-model="aiPrompt"
            rows="4"
            placeholder="e.g., 'All software developers from Bursa who are interested in tech'"
          ></textarea>
        </div>
        <button class="btn-generate" @click="generateSegment" :disabled="isGenerating">
          <span v-if="isGenerating">Generating...</span>
          <span v-else>
            <i class="pi pi-sparkles"></i> Generate Segment
          </span>
        </button>
      </div>
      <div class="saved-segments-panel">
        <div class="panel-header">
          <h3>Saved Segments</h3>
        </div>
        <div v-if="loadingSegments" class="loading-state">Loading segments...</div>
        <div v-else-if="segments.length === 0" class="empty-state">No segments created yet.</div>
        <div v-else class="segments-list">
          <div v-for="segment in segments" :key="segment.id" class="segment-item">
            <div class="segment-info">
              <span class="segment-name">{{ segment.name }}</span>
              <span class="segment-count">{{ segment.emails.length }} users</span>
            </div>
            <div class="segment-actions d-flex gap-2">
              <button class="btn-action btn-view" @click="openUsersModal(segment)">
                <i class="pi pi-users"></i>
              </button>
              <button class="btn-action btn-delete" @click="deleteSegment(segment.id)">
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmationModal
      :isVisible="showDeleteModal"
      title="Delete Segment"
      message="Are you sure you want to delete this segment?"
      @confirm="handleDeleteConfirm"
      @cancel="cancelDelete"
    />
    <SegmentUsersModal
      :isVisible="showUsersModal"
      :segment="selectedSegment"
      :all-users="users"
      @close="closeUsersModal"
      @remove-user="handleUserRemoved"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ConfirmationModal from '../components/ConfirmationModal.vue';
import SegmentUsersModal from '../components/SegmentUsersModal.vue';

export default {
  name: 'SegmentsPage',
  components: {
    ConfirmationModal,
    SegmentUsersModal,
  },
  data() {
    return {
      aiPrompt: '',
      showDeleteModal: false,
      segmentToDeleteId: null,
      showUsersModal: false,
      selectedSegment: null,
    };
  },
  computed: {
    ...mapState({
      segments: state => state.segments.segments,
      loadingSegments: state => state.segments.loading,
      isGenerating: state => state.segments.isGenerating,
      users: state => state.users.users,
    })
  },
  created() {
    this.fetchSegments();
    this.fetchUsers();
  },
  methods: {
    ...mapActions('segments', [
      'fetchSegments',
      'deleteSegment',
      'removeUserFromSegment'
    ]),
    ...mapActions('users', [
      'fetchUsers'
    ]),
    
    generateSegment() {
      this.$store.dispatch('segments/generateSegment', this.aiPrompt).then(() => {
        this.aiPrompt = '';
      });
    },
    openDeleteModal(segmentId) {
      this.segmentToDeleteId = segmentId;
      this.showDeleteModal = true;
    },
    handleDeleteConfirm() {
      this.deleteSegment(this.segmentToDeleteId);
      this.cancelDelete();
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.segmentToDeleteId = null;
    },
    openUsersModal(segment) {
      this.selectedSegment = segment;
      this.showUsersModal = true;
    },
    closeUsersModal() {
      this.showUsersModal = false;
      this.selectedSegment = null;
    },
    async handleUserRemoved({ segmentId, emailToRemove }) {
      await this.removeUserFromSegment({ segmentId, emailToRemove });
      if (this.selectedSegment && this.selectedSegment.id === segmentId) {
        this.selectedSegment.emails = this.selectedSegment.emails.filter(e => e !== emailToRemove);
      }
    }
  }
}
</script>

<style scoped>
.segments-page {
  padding: 2rem;
}
.page-header {
  margin-bottom: 2rem;
}
.page-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
}
.segments-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: flex-start;
}
.create-segment-panel, .saved-segments-panel {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.panel-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
.panel-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}
.panel-header p {
  margin: 0;
  color: #6b7280;
}
.form-group {
  padding: 1.5rem;
}
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}
.btn-generate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: calc(100% - 3rem);
  margin: 0 1.5rem 1.5rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
}
.btn-generate:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
}
.empty-state, .loading-state {
  padding: 3rem 1.5rem;
  text-align: center;
  color: #6b7280;
}
.segments-list {
  padding: 0.5rem;
  max-height: 450px;
  overflow-y: auto;
}
.segment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 6px;
}
.segment-item:hover {
  background-color: #f9fafb;
}
.segment-name {
  font-weight: 500;
}
.segment-count {
  margin-left: 0.75rem;
  background-color: #eef2ff;
  color: #4338ca;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
}
.btn-action {
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 50%;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-delete {
  background-color: #FEE2E2;
  color: #b91c1c;
}
.btn-delete:hover {
  color: white;
  background-color: #EF4444;
}
.btn-action.btn-view {
  background-color: #eef2ff;
  color: #4338ca;
}
.btn-action.btn-view:hover {
  background-color: #3561f4;
  color: white;
}
</style>