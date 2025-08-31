import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const state = {
  loading: true,
  stats: {
    templateCount: 0,
    emailCount: 0,
    conversationCount: 0,
    lastActivity: 'N/A',
    templateGoal: 100,
    emailGoal: 500,
    templateProgress: 0,
    emailProgress: 0,
  },
};

const mutations = {
  SET_STATS(state, newStats) {
    state.stats = { ...state.stats, ...newStats };
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading;
  },
};

const actions = {
  async fetchDashboardData({ commit, state }) {
    commit('SET_LOADING', true);
    try {
      const templatesCol = collection(db, 'templates');
      const allTemplatesSnapshot = await getDocs(templatesCol);
      const templateCount = allTemplatesSnapshot.size;
      const templateProgress = Math.min((templateCount / state.stats.templateGoal) * 100, 100);

      const lastTemplateQuery = query(templatesCol, orderBy('createdAt', 'desc'), limit(1));
      const lastTemplateSnapshot = await getDocs(lastTemplateQuery);
      let lastActivity = 'N/A';
      if (!lastTemplateSnapshot.empty) {
        const lastTemplate = lastTemplateSnapshot.docs[0].data();
        lastActivity = new Date(lastTemplate.createdAt.seconds * 1000).toLocaleDateString();
      }

      const conversationsSnapshot = await getDocs(collection(db, 'conversations'));
      const conversationCount = conversationsSnapshot.size;

      const emailCount = 335;
      const emailProgress = Math.min((emailCount / state.stats.emailGoal) * 100, 100);

      commit('SET_STATS', {
        templateCount,
        templateProgress,
        lastActivity,
        conversationCount,
        emailCount,
        emailProgress,
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      commit('SET_LOADING', false);
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};