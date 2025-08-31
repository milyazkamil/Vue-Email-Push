<template>
  <div class="email-sender-page">
    <div>
      <h2 class="form-title">Send a Custom Email</h2>
      <div class="sender-layout">
        <div class="templates-sidebar">
          <label class="form-label step-label mb-3">1. Choose a Template</label>
          <div v-if="isLoading" class="loading-text">Loading...</div>
          <div class="template-grid">
            <div
              v-for="template in templates"
              :key="template.id"
              class="template-card"
              :class="{ 'selected': form.selectedTemplateId === template.id }"
              @click="selectTemplate(template)"
            >
              <div class="preview-wrapper">
                <div class="preview-content" v-html="template.html"></div>
                <div class="preview-overlay"></div>
              </div>
              <div class="template-name">{{ template.name }}</div>
            </div>
          </div>
        </div>
        <div class="form-content">
          <form @submit.prevent="sendEmail" class="step-section">
            <label class="form-label step-label mb-3">2. Choose Recipients & Send</label>
            <div class="form-group">
              <label class="form-label">Send To:</label>
              <div class="send-mode-toggle">
                <button type="button" :class="{active: sendMode === 'segment'}" @click="sendMode = 'segment'">A Segment</button>
                <button type="button" :class="{active: sendMode === 'single'}" @click="sendMode = 'single'">A Single Person</button>
              </div>
            </div>
            <div class="details-grid">
              <div class="form-group">
                <label for="from_name" class="form-label">Name</label>
                <input type="text" id="from_name" v-model="form.from_name" required placeholder="Milyaz Kamil" class="form-input">
              </div>
              <div v-if="sendMode === 'segment'" class="form-group">
                <label for="segment-select" class="form-label">Recipient Segment</label>
                <select id="segment-select" v-model="selectedSegmentId" class="form-input" required>
                  <option disabled value="">-- Please select a segment --</option>
                  <option v-for="segment in segments" :key="segment.id" :value="segment.id">
                    {{ segment.name }} ({{ segment.emails.length }} users)
                  </option>
                </select>
              </div>
              <template v-if="sendMode === 'single'">
                <div class="form-group">
                  <label for="user-select" class="form-label">Select Existing User</label>
                  <select id="user-select" v-model="selectedUserId" @change="populateEmailFromUser" class="form-input">
                    <option value="">-- Or type manually below --</option>
                    <option v-for="user in users" :key="user.id" :value="user.id">
                      {{ user.name }} {{ user.surname }} ({{ user.email }})
                    </option>
                  </select>
                </div>
                <div class="form-group full-width">
                  <label for="to_email" class="form-label">Recipient Email</label>
                  <input type="email" id="to_email" v-model="form.to_email" required placeholder="milyazkamil@gmail.com" class="form-input">
                </div>
              </template>
              <div class="form-group full-width">
                <label for="subject" class="form-label">Subject</label>
                <input type="text" id="subject" v-model="form.subject" required placeholder="Your email subject" class="form-input">
              </div>
            </div>
            <div>
              <button type="submit" :disabled="isSending || !form.selectedTemplateId" class="submit-button">
                 <span v-if="isSending">Sending...</span>
                 <span v-else>Send Email</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'EmailSenderPage',
  data() {
    return {
      sendMode: 'segment',
      form: {
        from_name: '',
        to_email: '',
        subject: '',
        selectedTemplateId: '',
      },
      selectedSegmentId: '',
      selectedUserId: '',
    };
  },
  computed: {
    ...mapState({
      templates: state => state.templates.templates,
      segments: state => state.segments.segments,
      users: state => state.users.users,
      isLoading: state => state.templates.loading,
      isSending: state => state.sender.isSending,
    }),
    ...mapGetters('segments', ['allSegments']),
  },
  created() {
    this.$store.dispatch('templates/fetchTemplates');
    this.$store.dispatch('segments/fetchSegments');
    this.$store.dispatch('users/fetchUsers');
  },
  methods: {
    selectTemplate(template) {
      this.form.selectedTemplateId = template.id;
    },
    populateEmailFromUser() {
      if (!this.selectedUserId) {
        this.form.to_email = '';
        return;
      }
      const selected = this.users.find(u => u.id === this.selectedUserId);
      if (selected) {
        this.form.to_email = selected.email;
      }
    },
    sendEmail() {
      if (!this.form.selectedTemplateId) {
        return this.$toast.warning('Please select a template first.');
      }
      
      if (this.sendMode === 'segment') {
        if (!this.selectedSegmentId) {
          return this.$toast.warning('Please select a segment.');
        }
        this.$store.dispatch('sender/sendCampaign', { 
          form: this.form, 
          selectedSegmentId: this.selectedSegmentId 
        });
      } else {
        if (!this.form.to_email) {
          return this.$toast.warning('Please select or enter a recipient email.');
        }
        const template = this.templates.find(t => t.id === this.form.selectedTemplateId);
        this.$store.dispatch('sender/sendSingleEmail', {
          form: { ...this.form, custom_body: template.html }
        });
      }
    }
  }
}
</script>

<style scoped>
.email-sender-page {
  padding: 1rem;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.form-title {
  margin-bottom: 2rem;
}
.sender-layout {
  display: flex;
  gap: 2rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}
.templates-sidebar {
  flex: 0 0 50%;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 1.5rem;
  border-right: 1px solid #e5e7eb;
}
.form-content {
  flex-grow: 1;
}
.step-label {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
  display: block;
}
.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}
.template-card {
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1);
}
.template-card:hover {
  border-color: #9ca3af;
  transform: translateY(-4px);
  box-shadow: 0 4px 10px 0 rgba(0,0,0,0.1);
}
.template-card.selected {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.4);
}
.preview-wrapper {
  height: 180px;
  background-color: #f9fafb;
  overflow: hidden;
  position: relative;
}
.preview-content {
  transform: scale(0.35);
  transform-origin: top left;
  width: 285.7%;
  height: 285.7%;
}
.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.template-name {
  padding: 0.75rem;
  font-weight: 500;
  color: #374151;
  background-color: #fff;
  border-top: 1px solid #e5e7eb;
}
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.form-group.full-width {
  grid-column: 1 / -1;
}
.form-label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}
.form-input {
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}
.submit-button {
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  background-color: #4f46e5;
  color: white;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}
.submit-button:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
}
.loading-text {
  color: #6b7280;
}
.send-mode-toggle {
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
  width: fit-content;
  margin-bottom: 1.5rem;
}
.send-mode-toggle button {
  background-color: #fff;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.2s;
}
.send-mode-toggle button:first-child {
  border-right: 1px solid #d1d5db;
}
.send-mode-toggle button.active {
  background-color: #4f46e5;
  color: #fff;
}
</style>