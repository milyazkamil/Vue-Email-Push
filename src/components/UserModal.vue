<template>
  <transition name="modal-fade">
    <div v-if="isVisible" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <h3 class="modal-title">{{ isEditing ? 'Edit User' : 'Add New User' }}</h3>
        <form @submit.prevent="save" class="user-form">
          <div class="form-grid">
            <div class="form-group">
              <label>Name</label>
              <input type="text" v-model="editableUser.name" placeholder='Milyaz' required>
            </div>
            <div class="form-group">
              <label>Surname</label>
              <input type="text" v-model="editableUser.surname" placeholder='Kamil' required>
            </div>
            <div class="form-group full-width">
              <label>Email</label>
              <input type="email" v-model="editableUser.email" placeholder='milyaz@gmail.com' required>
            </div>
            <div class="form-group">
              <label>Age</label>
              <input type="number" v-model.number="editableUser.age" placeholder='24'>
            </div>
             <div class="form-group">
              <label>Gender</label>
              <select v-model="editableUser.gender">
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div class="form-group">
              <label>Job</label>
              <input type="text" v-model="editableUser.job" placeholder='Software Developer'>
            </div>
            <div class="form-group">
              <label>Company</label>
              <input type="text" v-model="editableUser.company" placeholder='Related Digital'>
            </div>
            <div class="form-group full-width">
              <label>Location (City)</label>
              <input type="text" v-model="editableUser.location" placeholder='Bursa'>
            </div>
            <div class="form-group full-width">
              <label>Interests (comma-separated)</label>
              <input type="text" v-model="interestsString" placeholder="e.g., tech, sports, music">
            </div>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn btn-outline-success">Save User</button>
            <button type="button" class="btn btn-outline-danger" @click="close">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'UserModal',
  props: {
    isVisible: Boolean,
    user: Object,
    isEditing: Boolean,
  },
  data() {
    return {
      editableUser: {},
      interestsString: '',
    };
  },
  watch: {
    user: {
      handler(newUser) {
        this.editableUser = JSON.parse(JSON.stringify(newUser || {}));
        this.interestsString = this.editableUser.interests ? this.editableUser.interests.join(', ') : '';
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    save() {
      this.editableUser.interests = this.interestsString
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
      this.$emit('save', this.editableUser);
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
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}
.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1.5rem;
}
.user-form {
  margin: 0;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group.full-width {
  grid-column: 1 / -1;
}
.form-group label {
  margin-bottom: 5px;
  font-size: 0.875rem;
  font-weight: 500;
}
.form-group input, .form-group select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter, .modal-fade-leave-to {
  opacity: 0;
}
</style>