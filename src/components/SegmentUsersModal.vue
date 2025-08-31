<template>
  <transition name="modal-fade">
    <div v-if="isVisible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <h3 class="modal-title">Users in "{{ segment.name }}"</h3>
        <div class="user-list">
          <div v-if="usersInSegment.length === 0" class="empty-state">
            This segment has no users.
          </div>
          <div v-for="user in usersInSegment" :key="user.id" class="user-item">
            <div class="user-info">
              <span class="user-name">{{ user.name }} {{ user.surname }}</span>
              <span class="user-email">{{ user.email }}</span>
            </div>
            <button class="btn-action btn-delete" @click="removeUser(user.email)">
              <i class='pi pi-trash'></i>
            </button>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-closes btn btn-outline-danger" @click="$emit('close')">Close</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SegmentUsersModal',
  props: {
    isVisible: Boolean,
    segment: Object,
    allUsers: Array,
  },
  computed: {
    usersInSegment() {
      if (!this.segment || !this.segment.emails || !this.allUsers) {
        return [];
      }
      return this.allUsers.filter(user => this.segment.emails.includes(user.email));
    }
  },
  methods: {
    removeUser(email) {
      this.$emit('remove-user', { 
        segmentId: this.segment.id, 
        emailToRemove: email 
      });
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6); display: flex;
  justify-content: center; align-items: center; z-index: 1000;
}
.modal-content {
  background: white; padding: 2rem; border-radius: 8px;
  width: 90%; max-width: 500px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}
.modal-title {
  font-size: 1.5rem; font-weight: 600; margin-top: 0; margin-bottom: 1.5rem;
}
.user-list {
  max-height: 400px;
  overflow-y: auto;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}
.user-item:last-child {
  border-bottom: none;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.user-name {
  font-weight: 500;
}
.user-email {
  font-size: 0.875rem;
  color: #6b7280;
}
.modal-actions {
  display: flex; justify-content: flex-end; margin-top: 1.5rem;
}
.btn-close {
  background-color: #e5e7eb; padding: 10px 24px;
  border: none; border-radius: 6px; font-weight: 500; cursor: pointer;
}
.empty-state {
  text-align: center; padding: 2rem; color: #6b7280;
}
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter, .modal-fade-leave-to {
  opacity: 0;
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
</style>