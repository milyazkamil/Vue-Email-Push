<template>
  <div class="users-page">
    <div class="page-header">
      <h2>User Management</h2>
      <button class="btn btn-outline-primary" @click="openAddUserModal">
        <i class="pi pi-plus"></i> Add New User
      </button>
    </div>
    <div v-if="loading" class="loading-state">Loading users...</div>
    <div v-else class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Job</th>
            <th>Location</th>
            <th>Interests</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }} {{ user.surname }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.job }}</td>
            <td>{{ user.location }}</td>
            <td>
              <span v-for="interest in user.interests" :key="interest" class="interest-tag">
                {{ interest }}
              </span>
            </td>
            <td class="actions">
              <button class="btn-action btn-edit" @click="openEditUserModal(user)">
                <i class="pi pi-pencil"></i>
              </button>
              <button class="btn-action btn-delete" @click="openDeleteModal(user.id)">
                <i class="pi pi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <UserModal
      :isVisible="showUserModal"
      :user="userToEdit"
      :is-editing="isEditing"
      @close="closeUserModal"
      @save="saveUser"
    />
    <ConfirmationModal
      :isVisible="showDeleteModal"
      title="Delete User"
      message="Are you sure you want to delete this user?"
      @confirm="handleDeleteConfirm"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import UserModal from '../components/UserModal.vue';
import ConfirmationModal from '../components/ConfirmationModal.vue';

const defaultUser = {
  name: '', surname: '', email: '', age: null, gender: 'Male', 
  job: '', company: '', location: '', interests: []
};

export default {
  name: 'UsersPage',
  components: {
    UserModal,
    ConfirmationModal,
  },
  data() {
    return {
      showUserModal: false,
      isEditing: false,
      userToEdit: { ...defaultUser },
      showDeleteModal: false,
      userToDeleteId: null,
    };
  },
  computed: {
    ...mapState('users', {
      users: state => state.users,
      loading: state => state.loading,
    })
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    ...mapActions('users', [
      'fetchUsers',
      'addUser',
      'updateUser',
      'deleteUser'
    ]),
    
    openAddUserModal() {
      this.isEditing = false;
      this.userToEdit = { ...defaultUser };
      this.showUserModal = true;
    },
    openEditUserModal(user) {
      this.isEditing = true;
      this.userToEdit = { ...user }; 
      this.showUserModal = true;
    },
    closeUserModal() {
      this.showUserModal = false;
    },
    saveUser(user) {
      if (this.isEditing) {
        this.updateUser(user);
      } else {
        this.addUser(user);
      }
      this.closeUserModal();
    },
    openDeleteModal(userId) {
      this.userToDeleteId = userId;
      this.showDeleteModal = true;
    },
    async handleDeleteConfirm() {
      await this.deleteUser(this.userToDeleteId);
      this.cancelDelete();
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.userToDeleteId = null;
    }
  }
}
</script>

<style scoped>
.users-page {
  padding: 2rem;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.page-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
}
.table-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
}
.user-table th, .user-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}
.user-table th {
  background-color: #f9fafb;
  font-weight: 600;
  font-size: 0.875rem;
  color: #4b5563;
}
.user-table tbody tr:last-child td {
  border-bottom: none;
}
.interest-tag {
  display: inline-block;
  background-color: #eef2ff;
  color: #4338ca;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
  margin-right: 4px;
  margin-bottom: 4px;
}
.actions {
  display: flex;
  gap: 10px;
}
.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-edit {
  background-color: #eef2ff;
  color: #4338ca;
}
.btn-edit:hover {
  background-color: #3561f4;
  color: white;
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