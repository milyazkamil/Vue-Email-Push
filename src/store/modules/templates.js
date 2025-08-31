import { db } from '../../firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import Vue from 'vue';

const state = {
  templates: [],
  loading: false,
};

const mutations = {
  SET_TEMPLATES(state, templates) {
    state.templates = templates;
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading;
  },
  ADD_TEMPLATE(state, template) {
    state.templates.unshift(template);
  },
  REMOVE_TEMPLATE(state, templateId) {
    state.templates = state.templates.filter(t => t.id !== templateId);
  }
};

const actions = {
  async fetchTemplates({ commit }) {
    commit('SET_LOADING', true);
    try {
      const q = query(collection(db, 'templates'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const templates = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commit('SET_TEMPLATES', templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      Vue.prototype.$toast.error("Could not load templates.");
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async addTemplate({ commit }, templateData) {
    try {
      const docRef = await addDoc(collection(db, 'templates'), {
        ...templateData,
        createdAt: serverTimestamp(),
      });
      commit('ADD_TEMPLATE', { id: docRef.id, ...templateData, createdAt: new Date() });
      Vue.prototype.$toast.success("Template saved successfully!");
    } catch (error) {
      console.error("Error adding template:", error);
      Vue.prototype.$toast.error("Error saving template.");
    }
  },

  async deleteTemplate({ commit }, templateId) {
    try {
      await deleteDoc(doc(db, 'templates', templateId));
      commit('REMOVE_TEMPLATE', templateId);
      Vue.prototype.$toast.success("Template deleted successfully!");
    } catch (error) {
      console.error("Error deleting template:", error);
      Vue.prototype.$toast.error("Failed to delete template.");
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};