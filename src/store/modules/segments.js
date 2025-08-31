import { db } from '../../firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, doc, deleteDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import axios from 'axios';
import Vue from 'vue';

const state = {
  segments: [],
  loading: false,
  isGenerating: false,
};

const mutations = {
  SET_SEGMENTS(state, segments) {
    state.segments = segments;
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading;
  },
  SET_GENERATING(state, isGenerating) {
    state.isGenerating = isGenerating;
  },
  REMOVE_USER_FROM_SEGMENT(state, { segmentId, emailToRemove }) {
    const segment = state.segments.find(s => s.id === segmentId);
    if (segment) {
      segment.emails = segment.emails.filter(e => e !== emailToRemove);
    }
  }
};

const actions = {
  async fetchSegments({ commit }) {
    commit('SET_LOADING', true);
    try {
      const q = query(collection(db, 'segments'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      commit('SET_SEGMENTS', querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching segments:", error);
      Vue.prototype.$toast.error("Could not load segments.");
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async generateSegment({ commit, rootState, dispatch }, aiPrompt) {
    if (!aiPrompt.trim()) {
      return Vue.prototype.$toast.warning("Please describe the segment you want to create.");
    }
    const allUsers = rootState.users.users;
    if (allUsers.length === 0) {
      return Vue.prototype.$toast.error("No users found to create a segment from.");
    }
    
    commit('SET_GENERATING', true);
    try {
      const usersJson = JSON.stringify(allUsers);
      const API_KEY = "AIzaSyB5QHNzoqnb4hebySr0kX3uXSgPZodcbjs";
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${API_KEY}`;

      const fullPrompt = `Analyze the JSON array of users and create a segment based on the request: "${aiPrompt}". Your response MUST be a single, valid JSON object with two keys: "segment_name" (a short name for this segment) and "user_emails" (an array of email strings of matching users). Here is the list of all users: ${usersJson}`;

      const payload = { contents: [{ parts: [{ text: fullPrompt }] }] };
      const response = await axios.post(API_URL, payload);
      const aiResponseText = response.data.candidates[0].content.parts[0].text;
      
      let cleanJsonString = aiResponseText;
      const jsonMatch = aiResponseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        cleanJsonString = jsonMatch[1];
      }
      const newSegment = JSON.parse(cleanJsonString);

      if (!newSegment.segment_name || !newSegment.user_emails) {
        throw new Error("AI returned an invalid format.");
      }

      await addDoc(collection(db, 'segments'), {
        name: newSegment.segment_name,
        emails: newSegment.user_emails,
        createdAt: serverTimestamp(),
      });
      
      Vue.prototype.$toast.success(`Segment "${newSegment.segment_name}" created successfully!`);
      dispatch('fetchSegments');
    } catch (error) {
      console.error("Error generating segment:", error);
      Vue.prototype.$toast.error("Failed to generate segment.");
    } finally {
      commit('SET_GENERATING', false);
    }
  },

  async deleteSegment({ dispatch }, segmentId) {
    try {
      await deleteDoc(doc(db, 'segments', segmentId));
      Vue.prototype.$toast.success("Segment deleted successfully!");
      dispatch('fetchSegments');
    } catch (error) {
      console.error("Error deleting segment:", error);
      Vue.prototype.$toast.error("Failed to delete segment.");
    }
  },

  async removeUserFromSegment({ commit }, { segmentId, emailToRemove }) {
    try {
      const segmentRef = doc(db, 'segments', segmentId);
      await updateDoc(segmentRef, {
        emails: arrayRemove(emailToRemove)
      });
      commit('REMOVE_USER_FROM_SEGMENT', { segmentId, emailToRemove });
      Vue.prototype.$toast.success("User removed from segment.");
    } catch (error) {
      console.error("Error removing user from segment:", error);
      Vue.prototype.$toast.error("Failed to remove user.");
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};