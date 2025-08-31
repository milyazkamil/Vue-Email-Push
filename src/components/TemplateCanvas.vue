<template>
  <div class="template-canvas">
    <div v-if="isAiGenerating" class="loading-overlay">
      <div class="spinner"></div>
    </div>
    <draggable v-model="localRows" item-key="id" class="row-container" handle=".drag-handle-row">
      <div v-for="row in localRows" :key="row.id" class="template-row">
        <div class="drag-handle-row">⠿</div>
        <button v-if="isRowEmpty(row)" class="delete-btn delete-row-btn" @click.stop="$emit('delete-row', row.id)">
          <i class="pi pi-trash"></i>
        </button>
        <div class="column-wrapper" :style="{ gridTemplateColumns: `repeat(${row.columns.length}, 1fr)` }">
          <div v-for="col in row.columns" :key="col.id" class="template-column">
            <draggable v-model="col.blocks" item-key="id" class="block-container" group="blocks" @add="onAdd($event, col.blocks)">
              <div
                v-for="block in col.blocks"
                :key="block.id"
                class="content-block"
                @click="$emit('select-block', block)"
                :class="{ 'selected': selectedBlockId === block.id }"
              >
                <button class="delete-btn delete-block-btn" @click.stop="$emit('delete-block', { rowId: row.id, colId: col.id, blockId: block.id })">
                  <i class="pi pi-trash"></i>
                </button>
                <p v-if="block.type === 'text'" :style="block.styles">{{ block.content }}</p>
                <div v-if="block.type === 'image'" :style="{ textAlign: block.styles.textAlign }">
                  <img :src="block.src" :style="getImageStyles(block)" alt="user image"/>
                </div>
                <div v-if="block.type === 'button'" :style="{ textAlign: block.styles.textAlign }">
                  <button :style="getButtonStyles(block)">{{ block.content }}</button>
                </div>
                <div v-if="block.type === 'social'" :style="block.styles">
                  <a v-for="(social, index) in block.socials" :key="index" href="#" @click.prevent style="display: inline-block; padding: 0 5px;">
                    <img v-if="social.visible" :src="social.imgUrl" :alt="social.name" width="32" height="32" style="border:0;">
                  </a>
                </div>
                <div v-if="block.type === 'divider'" :style="block.styles"></div>
                <div v-if="block.type === 'html'" v-html="block.content" :style="block.styles"></div>
              </div>
            </draggable>
          </div>
        </div>
      </div>
    </draggable>
    <div class="add-row-button-wrapper">
      <button @click="$emit('add-row')" class="add-button">+</button>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { v4 as uuidv4 } from 'uuid';

export default {
  components: {
    draggable,
  },
  props: {
    rows: Array,
    selectedBlockId: String,
    isAiGenerating: Boolean,
  },
  computed: {
    localRows: {
      get() {
        return this.rows;
      },
      set(value) {
        this.$emit('update:rows', value);
      },
    },
  },
  methods: {
    onAdd(event, list) {
      const newIndex = event.newIndex;
      const item = list[newIndex];

      let baseStyles = {};
      if (item.type === 'text') {
        baseStyles = { 
          padding: '10px', 
          textAlign: 'left', 
          backgroundColor: 'transparent', 
          fontSize: '16px',
          color: '#000000'
        };
      } else if (item.type === 'image') {
        baseStyles = { 
          padding: '0px', 
          textAlign: 'center',  
          width: '25%', 
          height: 'auto',
          borderRadius: '0px'
        };
      } else if (item.type === 'button') {
        baseStyles = { 
          backgroundColor: '#007bff', 
          color: '#ffffff', 
          padding: '10px 20px', 
          border: 'none',
          textAlign: 'center',
          borderRadius: '4px'
        };
      }
      const finalStyles = { ...baseStyles, ...(item.styles || {}) };
      
      const newBlock = { 
        ...item, 
        id: uuidv4(), 
        styles: finalStyles
      };

      list.splice(newIndex, 1, newBlock);
    },
    getImageStyles(block) {
      const styles = { ...block.styles };
      delete styles.textAlign;
      return styles;
    },
    getButtonStyles(block) {
      const styles = { ...block.styles };
      delete styles.textAlign;
      return styles;
    },
    isRowEmpty(row) {
      if (!row || !row.columns) return true;
      const totalBlocks = row.columns.reduce((sum, column) => sum + column.blocks.length, 0);
      return totalBlocks === 0;
    },
    getSocialBlockStyles(block) {
      const styles = { ...block.styles };
      const alignMap = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end'
      };
      styles.justifyContent = alignMap[styles.textAlign] || 'center';
      delete styles.textAlign;
      return styles;
    },
  },
};
</script>

<style scoped>
.template-canvas {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  min-height: 100%;
  padding: 20px;
  position: relative; 
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 20;
  border-radius: 8px;
}
.loading-overlay p {
  margin-top: 1rem;
  font-weight: 500;
  color: #374151;
}
.spinner {
  width: 70px;
  height: 70px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.add-row-button-wrapper {
  text-align: center;
  padding: 20px;
  border: 2px dashed #ccc;
  margin-top: 10px;
  border-radius: 5px;
}
.add-button {
  background-color: #007bff;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
}
.template-row {
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 10px;
  position: relative;
}
.drag-handle-row {
  position: absolute;
  top: 50%;
  left: -25px;
  transform: translateY(-50%);
  cursor: move;
  color: #999;
}
.column-wrapper {
  display: grid;
  gap: 10px;
}
.template-column {
  background-color: #f8f9fa;
  min-height: 100px;
  padding: 5px;
}
.block-container {
  min-height: 90px;
  height: 100%;
}
.content-block {
  padding: 10px;
  border: 1px dashed transparent;
  cursor: pointer;
  position: relative;
}
.content-block:hover {
  border-color: #007bff;
}
.content-block.selected {
  border: 2px solid #007bff;
}
.content-block img {
  max-width: 100%;
  display: inline-block;
}
.social-block-preview {
  gap: 15px;
}
.delete-btn {
  position: absolute;
  width: 28px;
  height: 28px;
  background-color: #FEE2E2;
  color: #b91c1c;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s ease-in-out;
}
.delete-btn:hover {
  color: white;
  background-color: #EF4444;
}
.delete-btn i {
  font-size: 0.9rem;
}
.delete-row-btn {
  top: 5px;
  right: 5px;
}
.delete-block-btn {
  top: 5px;
  right: 5px;
}
.template-row:hover > .delete-row-btn,
.content-block:hover > .delete-block-btn {
  visibility: visible;
  opacity: 1;
}
</style>