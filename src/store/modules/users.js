import { db } from '../../firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, doc, updateDoc, deleteDoc, getDoc, where, arrayRemove } from 'firebase/firestore';
import Vue from 'vue';

const state = {
  users: [],
  loading: false,
};

const getters = {
  allUsers: (state) => state.users,
  isLoadingUsers: (state) => state.loading,
};

const mutations = {
  SET_USERS(state, users) {
    state.users = users;
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading;
  },
  ADD_USER(state, user) {
    state.users.unshift(user);
  },
  UPDATE_USER(state, updatedUser) {
    const index = state.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser);
    }
  },
  REMOVE_USER(state, userId) {
    state.users = state.users.filter(user => user.id !== userId);
  }
};

const actions = {
  async fetchUsers({ commit }) {
    commit('SET_LOADING', true);
    try {
      const usersCol = collection(db, 'users');
      const q = query(usersCol, orderBy('createdAt', 'desc'));
      const userSnapshot = await getDocs(q);
      const users = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commit('SET_USERS', users);
    } catch (error) {
      console.error("Error fetching users:", error);
      Vue.prototype.$toast.error("Could not fetch users.");
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async addUser({ commit }, user) {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...user,
        createdAt: serverTimestamp(),
      });
      commit('ADD_USER', { id: docRef.id, ...user, createdAt: new Date() });
      Vue.prototype.$toast.success("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      Vue.prototype.$toast.error("Failed to add user.");
    }
  },

  async updateUser({ commit }, user) {
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, user);
      commit('UPDATE_USER', user);
      Vue.prototype.$toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      Vue.prototype.$toast.error("Failed to update user.");
    }
  },

  async deleteUser({ dispatch }, userId) {
    try {
      const userRef = doc(db, 'users', userId);
      
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        throw new Error("User not found");
      }
      const userEmail = userSnap.data().email;

      await deleteDoc(userRef);
      
      const segmentsRef = collection(db, 'segments');
      const q = query(segmentsRef, where('emails', 'array-contains', userEmail));
      const segmentsSnapshot = await getDocs(q);
      
      const updatePromises = [];
      segmentsSnapshot.forEach((segmentDoc) => {
        updatePromises.push(updateDoc(segmentDoc.ref, {
          emails: arrayRemove(userEmail)
        }));
      });
      
      await Promise.all(updatePromises);
      
      Vue.prototype.$toast.success("User deleted and segments updated!");
      
      dispatch('fetchUsers');
      dispatch('segments/fetchSegments', null, { root: true });

    } catch (error) {
      console.error("Error deleting user and updating segments:", error);
      Vue.prototype.$toast.error("Failed to delete user.");
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};