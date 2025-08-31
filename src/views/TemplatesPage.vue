<template>
  <div class="template-builder-container">
    <div class="main-content">
      <div class="header-bar pe-3">
        <h2>Template Builder</h2>
        <div class='d-flex gap-3'>
          <input 
            type="text" 
            :value="templateName"
            @input="updateTemplateName($event.target.value)"
            placeholder="Enter Template Name..."
            class="template-name-input"
          />
          <button @click="saveTemplate">Save Template</button>
        </div>
      </div>
      <div class="canvas-wrapper">
        <TemplateCanvas
          :rows="template.rows"
          :selected-block-id="selectedBlock ? selectedBlock.id : null"
          :is-ai-generating="isAiGenerating"
          @update:rows="updateRows"
          @add-row="showLayoutSelector = true"
          @select-block="setSelectedBlock"
          @delete-row="deleteRow"
          @delete-block="deleteBlock"
        />
      </div>
    </div>
    <TemplateSidebar
      :selected-block="selectedBlock"
      @update-block="updateBlock"
      @ai-generation-start="setAiGenerating(true)"
      @ai-generation-end="setAiGenerating(false)"
    />
    <LayoutSelector
      v-if="showLayoutSelector"
      @select="addRow"
      @close="showLayoutSelector = false"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import TemplateCanvas from '../components/TemplateCanvas.vue';
import TemplateSidebar from '../components/TemplateSidebar.vue';
import LayoutSelector from '../components/LayoutSelector.vue';

export default {
  name: 'TemplatesPage',
  components: { TemplateCanvas, TemplateSidebar, LayoutSelector },
  data() {
    return {
      showLayoutSelector: false,
    };
  },
  computed: {
    ...mapState('builder', [
      'templateName',
      'template',
      'selectedBlock',
      'isAiGenerating',
    ]),
  },
  methods: {
    ...mapMutations('builder', {
      updateTemplateName: 'SET_TEMPLATE_NAME',
      setSelectedBlock: 'SET_SELECTED_BLOCK',
      updateBlock: 'UPDATE_BLOCK',
      deleteRow: 'DELETE_ROW',
      deleteBlock: 'DELETE_BLOCK',
      setAiGenerating: 'SET_AI_GENERATING',
      updateRows: 'UPDATE_ROWS'
    }),
    ...mapActions('builder', [
      'saveTemplate'
    ]),
    addRow(columnCount) {
      this.$store.commit('builder/ADD_ROW', columnCount);
      this.showLayoutSelector = false;
    },
  }
};
</script>

<style scoped>
.template-builder-container {
  display: grid; 
  grid-template-columns: 1fr 350px;
  height: calc(100vh - 150px);
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.main-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  flex-shrink: 0;
  gap: 1rem;
}
.template-name-input {
  width: 200px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
}
.header-bar button {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}
.canvas-wrapper {
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
  overflow-x: auto;
  background-color: #f3f4f6;
  margin-top: 1rem;
  border-radius: 4px;
}
</style>