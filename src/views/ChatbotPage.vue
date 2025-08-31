<template>
  <div class="chatbot-container d-flex flex-column">
    <h2 class='p-3 pb-0'>Chatbot</h2>
    <div class='d-flex chatbot-height'>
      <div class="sidebar">
        <div class="sidebar-header">
          <button class="new-chat-btn btn btn-primary" @click="startNewConversation">
            + New Chat
          </button>
          <button class="search-btn btn btn-outline-success" @click="isSearchVisible = !isSearchVisible">Search</button>
        </div>
        <div v-if="isSearchVisible" class="input-group mb-3">
          <input 
            type="text" 
            class="form-control" 
            v-model="searchQuery" 
            placeholder="Search conversations..."
          >
          <button class="btn btn-outline-danger" type="button" @click="clearSearch">
            <i class="pi pi-times"></i> </button>
        </div>
        <div class="conversations-list">
          <div
            v-for="convo in filteredConversations"
            :key="convo.id"
            class="conversation-item"
            :class="{ 'active': convo.id === currentConversationId }"
            @click="selectConversation(convo.id)"
          >
            <span class="convo-title">{{ convo.title || 'New Chat' }}</span>
            <button class="delete-btn d-flex justify-content-center align-items-center" @click.stop="deleteConversation(convo.id)">
              <i class='pi pi-trash'></i>
            </button>
          </div>
        </div>
      </div>
      <div class="chat-window">
        <div class="messages-area" ref="messagesArea">
          <div v-if="messages.length === 0 && !isLoading" class="message assistant">
            Hello, welcome! How can I help you?
          </div>
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="message"
            :class="msg.role"
          >
            {{ msg.content }}
          </div>
          <div v-if="isLoading" class="message assistant me-3">
            <span class="typing-hint">{{ typingHint }}</span>
            <span class="typing-indicator"></span>
          </div>
        </div>
        <div class="input-area">
          <textarea
            v-model="newMessage"
            @keydown.enter.prevent="sendMessage"
            placeholder="Please enter your message"
            rows="1"
          ></textarea>
          <button @click="sendMessage" :disabled="isLoading || !newMessage">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
          </button>
        </div>
      </div>
    </div>
    <ConfirmationModal
      :isVisible="showDeleteModal"
      title="Delete Conversation"
      message="Are you sure you want to delete this conversation and all its messages?"
      @confirm="handleDeleteConfirm"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ConfirmationModal from '../components/ConfirmationModal.vue';

export default {
  name: 'ChatbotPage',
  components: {
    ConfirmationModal,
  },
  data() {
    return {
      newMessage: '',
      showDeleteModal: false,
      conversationToDeleteId: null,
      isSearchVisible: false,
      searchQuery: '',
      typingHint: 'Thinking',
      typingIntervalId: null,
      typingPhrases: [
        'Thinking',
        'Analyzing the data',
        'Almost ready'
      ]
    };
  },
  computed: {
    ...mapState('chatbot', [
      'conversations',
      'messages',
      'currentConversationId',
      'isLoading',
    ]),
    filteredConversations() {
      if (!this.searchQuery.trim()) {
        return this.conversations;
      }
      const lowerCaseQuery = this.searchQuery.toLowerCase();
      return this.conversations.filter(convo => {
        const title = convo.title || 'New Chat';
        return title.toLowerCase().includes(lowerCaseQuery);
      });
    }
  },
  watch: {
    isLoading(newValue) {
      if (newValue) {
        let phraseIndex = 0;
        this.typingHint = this.typingPhrases[phraseIndex];
        this.typingIntervalId = setInterval(() => {
          phraseIndex = (phraseIndex + 1) % this.typingPhrases.length;
          this.typingHint = this.typingPhrases[phraseIndex];
        }, 2500);
      } else {
        if (this.typingIntervalId) {
          clearInterval(this.typingIntervalId);
          this.typingIntervalId = null;
        }
      }
    },
    messages() {
      this.$nextTick(() => {
        const area = this.$refs.messagesArea;
        if (area) {
          area.scrollTop = area.scrollHeight;
        }
      });
    }
  },
  created() {
    this.fetchConversations();
  },
  methods: {
    ...mapActions('chatbot', [
      'fetchConversations',
      'startNewConversation',
      'selectConversation',
      'deleteConversationAction'
    ]),
    
    sendMessage() {
      if (!this.newMessage.trim()) return;
      this.$store.dispatch('chatbot/sendMessage', this.newMessage.trim());
      this.newMessage = '';
    },
    deleteConversation(convoId) {
      this.conversationToDeleteId = convoId;
      this.showDeleteModal = true;
    },
    handleDeleteConfirm() {
      this.$store.dispatch('chatbot/deleteConversation', this.conversationToDeleteId);
      this.cancelDelete();
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.conversationToDeleteId = null;
    },
    clearSearch() {
      this.searchQuery = '';
    },
  }
};
</script>

<style scoped>
.chatbot-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.chatbot-height {
  height: calc(100vh - 220px);
}
.sidebar {
  width: 280px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  flex-shrink: 0;
}
.sidebar-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.new-chat-btn, .search-btn {
  flex-grow: 1;
}
.conversations-list {
  overflow-y: auto;
}
.conversation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
}
.conversation-item:hover {
  background-color: #f3f4f6;
}
.conversation-item.active {
  background-color: #eef2ff;
  font-weight: 600;
  color: #4338ca;
}
.convo-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
  padding-right: 0.5rem;
}
.delete-btn {
  background-color: #FEE2E2;
  color: #b91c1c;
  border: none;
  line-height: 1;
  padding: 0 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s;
  flex-shrink: 0;
  height: 28px;
  width: 28px;
}
.delete-btn:hover {
  color: white;
  background-color: #EF4444;
}
.conversation-item:hover .delete-btn {
  visibility: visible;
  opacity: 1;
}
.chat-window {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.messages-area {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.message {
  padding: 0.75rem 1.25rem;
  padding-right: 2rem;
  border-radius: 1.25rem;
  max-width: 75%;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.message.user {
  background-color: #4f46e5;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 0.25rem;
}
.message.assistant {
  background-color: #eef2ff;
  color: #1f2937;
  align-self: flex-start;
  border-bottom-left-radius: 0.25rem;
}
.input-area {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.input-area textarea {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  resize: none;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.5;
  max-height: 100px;
}
.input-area button {
  padding: 0.5rem;
  border: none;
  background-color: transparent;
  color: #4f46e5;
  cursor: pointer;
  border-radius: 50%;
}
.input-area button:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}
.typing-hint {
  margin-right: 0.5rem;
}
.typing-indicator {
  --dot-size: 5px;
  --gap: 5px;
  --lift: 4px;
  --speed: 1.2s;
  --glow: rgba(79, 70, 229, 0.35);
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: var(--dot-size);
  height: var(--dot-size);
  border-radius: 50%;
  background: currentColor;
  color: #4f46e5;
  opacity: .8;
  animation:
    ti-bounce var(--speed) ease-in-out infinite,
    ti-glow   var(--speed) ease-in-out infinite;
}
.typing-indicator::before,
.typing-indicator::after {
  content: "";
  position: absolute;
  top: 0;
  width: var(--dot-size);
  height: var(--dot-size);
  border-radius: 50%;
  background: currentColor;
  opacity: .8;
  will-change: transform, opacity, box-shadow;
}
.input-group .form-control,
.input-group .btn {
  border-color: #d1d5db; 
  box-shadow: none;
}
.input-group .form-control:focus {
  border-color: #4f46e5; 
  box-shadow: 0px 0px 2px 2px #4e46e512; 
}
.typing-indicator::before {
  left: calc(var(--dot-size) + var(--gap));
  animation:
    ti-bounce var(--speed) ease-in-out infinite .12s,
    ti-glow   var(--speed) ease-in-out infinite .12s;
}
.typing-indicator::after {
  left: calc((var(--dot-size) + var(--gap)) * 2);
  animation:
    ti-bounce var(--speed) ease-in-out infinite .24s,
    ti-glow   var(--speed) ease-in-out infinite .24s;
}
@keyframes ti-bounce {
  0%, 100% { transform: translateY(0) scale(1);     opacity: .65; }
  35%      { transform: translateY(calc(var(--lift) * -1)) scale(1.12); opacity: 1; }
  70%      { transform: translateY(0) scale(0.98);  opacity: .75; }
}
@keyframes ti-glow {
  0%, 100% { box-shadow: 0 0 0 rgba(0,0,0,0); }
  35%      { box-shadow: 0 6px 18px var(--glow); }
}
@media (prefers-reduced-motion: reduce) {
  .typing-indicator,
  .typing-indicator::before,
  .typing-indicator::after {
    animation: none;
    opacity: .6;
  }
}
</style>