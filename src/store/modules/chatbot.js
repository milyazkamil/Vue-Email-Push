import { db } from '../../firebase';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { callAIAPI } from '../../services/aiService';
import Vue from 'vue';

const state = {
  conversations: [],
  messages: [],
  currentConversationId: null,
  isLoading: false,
  unsubscribeMessages: null,
};

const mutations = {
  SET_CONVERSATIONS(state, conversations) {
    state.conversations = conversations;
  },
  SET_MESSAGES(state, messages) {
    state.messages = messages;
  },
  ADD_MESSAGE(state, message) {
    state.messages.push(message);
  },
  SET_CURRENT_CONVERSATION_ID(state, id) {
    state.currentConversationId = id;
  },
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },
  SET_UNSUBSCRIBE_MESSAGES(state, unsubscribe) {
    if (state.unsubscribeMessages) {
      state.unsubscribeMessages();
    }
    state.unsubscribeMessages = unsubscribe;
  },
  REMOVE_CONVERSATION(state, convoId) {
    state.conversations = state.conversations.filter(c => c.id !== convoId);
  }
};

const actions = {
  async fetchConversations({ commit }) {
    const q = query(collection(db, 'conversations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const conversations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    commit('SET_CONVERSATIONS', conversations);
  },

  startNewConversation({ commit }) {
    commit('SET_UNSUBSCRIBE_MESSAGES', null);
    commit('SET_CURRENT_CONVERSATION_ID', null);
    commit('SET_MESSAGES', []);
  },

  selectConversation({ commit }, convoId) {
    commit('SET_CURRENT_CONVERSATION_ID', convoId);
    commit('SET_MESSAGES', []);

    const messagesRef = collection(db, 'conversations', convoId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => doc.data());
      commit('SET_MESSAGES', messages);
    });
    commit('SET_UNSUBSCRIBE_MESSAGES', unsubscribe);
  },

  async sendMessage({ commit, dispatch, state }, userMessageContent) {
    commit('ADD_MESSAGE', { role: 'user', content: userMessageContent });
    commit('SET_LOADING', true);

    let convoId = state.currentConversationId;

    if (!convoId) {
      const convoDocRef = await addDoc(collection(db, 'conversations'), {
        title: userMessageContent.substring(0, 30),
        createdAt: serverTimestamp(),
      });
      convoId = convoDocRef.id;
      commit('SET_CURRENT_CONVERSATION_ID', convoId);
      dispatch('fetchConversations');
      dispatch('selectConversation', convoId);
    }
    
    await addDoc(collection(db, 'conversations', convoId, 'messages'), {
      role: 'user',
      content: userMessageContent,
      timestamp: serverTimestamp(),
    });

    const aiResponse = await callAIAPI(state.messages);
    
    await addDoc(collection(db, 'conversations', convoId, 'messages'), {
      role: 'assistant',
      content: aiResponse.trim(),
      timestamp: serverTimestamp(),
    });
    
    commit('SET_LOADING', false);
  },

  async deleteConversation({ commit, dispatch, state }, convoId) {
    try {
      const messagesRef = collection(db, 'conversations', convoId, 'messages');
      const messagesSnapshot = await getDocs(messagesRef);
      await Promise.all(messagesSnapshot.docs.map(doc => deleteDoc(doc.ref)));

      await deleteDoc(doc(db, 'conversations', convoId));
      
      commit('REMOVE_CONVERSATION', convoId);
      
      if (state.currentConversationId === convoId) {
        dispatch('startNewConversation');
      }

      Vue.prototype.$toast.success("Conversation deleted successfully!");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      Vue.prototype.$toast.error("An error occurred while deleting the conversation.");
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};