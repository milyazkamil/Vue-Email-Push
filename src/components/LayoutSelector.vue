<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="layout-selector-modal">
      <h3 class='text-center'>Select a Layout</h3>
      <div class="layouts-grid">
        <div class="layout-option" @click="selectLayout(1)"><div class="col"></div></div>
        <div class="layout-option" @click="selectLayout(2)"><div class="col"></div><div class="col"></div></div>
        <div class="layout-option" @click="selectLayout(3)"><div class="col"></div><div class="col"></div><div class="col"></div></div>
        <div class="layout-option" @click="selectLayout(4)" style="grid-template-columns: 1fr 1fr 1fr 1fr;"><div class="col"></div><div class="col"></div><div class="col"></div><div class="col"></div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    selectLayout(columnCount) {
      this.$emit('select', columnCount);
    },
  },
};
</script>

<style scoped>
.modal-overlay { 
  position: fixed; 
  top: 0; 
  left: 0;
  width: 100%; 
  height: 100%; 
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  z-index: 1000;
}
.layout-selector-modal { 
  background: white; 
  padding: 20px; 
  border-radius: 8px; 
  width: 500px; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.2); 
}
.layouts-grid { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 15px; 
  margin-top: 15px;
}
.layout-option { 
  border: 2px dashed #ccc; 
  padding: 10px; 
  border-radius: 5px; 
  cursor: pointer; 
  display: grid; 
  gap: 5px; 
  grid-template-columns: 1fr 1fr; 
  min-height: 50px; 
}
.layout-option:hover { 
  border-color: #007bff; 
}
.layout-option .col { 
  background-color: #e9ecef; 
  border-radius: 3px; 
}
.layout-option:nth-child(1) { 
  grid-template-columns: 1fr; 
}
.layout-option:nth-child(3) { 
  grid-template-columns: 1fr 1fr 1fr; 
}
</style>