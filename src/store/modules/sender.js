import Vue from 'vue';

const state = {
  isSending: false,
};

const mutations = {
  SET_SENDING(state, isSending) {
    state.isSending = isSending;
  }
};

const actions = {
  async sendCampaign({ commit, rootState }, { form, selectedSegmentId }) {
    commit('SET_SENDING', true);

    const segment = rootState.segments.segments.find(s => s.id === selectedSegmentId);
    if (!segment || segment.emails.length === 0) {
      Vue.prototype.$toast.error('Selected segment is empty or invalid.');
      commit('SET_SENDING', false);
      return;
    }

    const emailsToSend = segment.emails;
    const template = rootState.templates.templates.find(t => t.id === form.selectedTemplateId);

    Vue.prototype.$toast.info(`Starting campaign to ${emailsToSend.length} user(s)...`);

    const serviceID = 'service_1rmscqv';
    const templateID = 'template_09xwsw3';
    let successCount = 0;
    let errorCount = 0;

    for (const email of emailsToSend) {
      const templateParams = {
        to_email: email,
        subject: form.subject,
        from_name: form.from_name,
        custom_body: template.html,
      };
      try {
        await window.emailjs.send(serviceID, templateID, templateParams);
        successCount++;
      } catch (err) {
        console.error(`Failed to send to ${email}:`, err);
        errorCount++;
      }
    }

    if (errorCount > 0) {
      Vue.prototype.$toast.error(`Campaign finished. ${successCount} sent, ${errorCount} failed.`);
    } else {
      Vue.prototype.$toast.success(`Campaign sent successfully to all ${successCount} user(s)!`);
    }

    commit('SET_SENDING', false);
  },

  async sendSingleEmail({ commit }, { form }) {
    commit('SET_SENDING', true);
    
    const serviceID = 'service_1rmscqv';
    const templateID = 'template_09xwsw3';

    try {
      await window.emailjs.send(serviceID, templateID, form);
      Vue.prototype.$toast.success('Custom email sent successfully!');
    } catch (err) {
      console.error('Email sending failed:', err);
      Vue.prototype.$toast.error('Failed to send message. Check console for details.');
    } finally {
      commit('SET_SENDING', false);
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};