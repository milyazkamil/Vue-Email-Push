import Vue from 'vue'
import Vuex from 'vuex'
import users from './modules/users';
import dashboard from './modules/dashboard';
import templates from './modules/templates';
import segments from './modules/segments';
import sender from './modules/sender';
import chatbot from './modules/chatbot';
import builder from './modules/builder';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name: 'Milyaz Kamil'
    }
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    userName: state => state.user.name
  },
  modules: {
    users,
    dashboard,
    templates,
    segments,
    sender,
    chatbot,
    builder,
  }
});