<template>
  <transition name="modal-fade">
    <div v-if="isVisible" class="modal-overlay" @click.self="$emit('cancel')">
      <div class="modal-content">
        <h3 class="modal-title">{{ title }}</h3>
        <p class="modal-message">{{ message }}</p>
        <div class="modal-actions">
          <button class="btn btn-confirm" @click="$emit('confirm')">Confirm</button>
          <button class="btn btn-cancel" @click="$emit('cancel')">Cancel</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ConfirmationModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Are you sure?',
    },
    message: {
      type: String,
      default: 'This action cannot be undone.',
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  text-align: center;
}
.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
}
.modal-message {
  margin-bottom: 2rem;
  color: #4b5563;
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-cancel {
  background-color: #e5e7eb;
  color: #374151;
}
.btn-cancel:hover {
  background-color: #d1d5db;
}
.btn-confirm {
  background-color: #ef4444;
  color: white;
}
.btn-confirm:hover {
  background-color: #dc2626;
}
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter, .modal-fade-leave-to {
  opacity: 0;
}
</style>