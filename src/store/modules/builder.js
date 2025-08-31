import { v4 as uuidv4 } from 'uuid';
import Vue from 'vue';

function toInlineStyles(styles) {
  if (!styles) return '';
  return Object.entries(styles)
    .map(([key, value]) => {
      if (value === null || value === undefined) return '';
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebabKey}:${value}`;
    })
    .filter(Boolean)
    .join(';');
}

const getDefaultTemplate = () => ({
  rows: [],
  styles: {
    backgroundColor: '#FFFFFF',
    width: '600px',
  }
});

const state = {
  templateName: 'New Template',
  template: getDefaultTemplate(),
  selectedBlock: null,
  isAiGenerating: false,
};

const mutations = {
  RESET_BUILDER(state) {
    state.templateName = 'New Template';
    state.template = getDefaultTemplate();
    state.selectedBlock = null;
  },
  SET_TEMPLATE_NAME(state, name) {
    state.templateName = name;
  },
  SET_SELECTED_BLOCK(state, block) {
    state.selectedBlock = block;
  },
  ADD_ROW(state, columnCount) {
    const newRow = {
      id: uuidv4(),
      columns: Array.from({ length: columnCount }, () => ({
        id: uuidv4(),
        blocks: []
      })),
      styles: {}
    };
    state.template.rows.push(newRow);
  },
  DELETE_ROW(state, rowId) {
    state.template.rows = state.template.rows.filter(row => row.id !== rowId);
    if (state.selectedBlock && !state.template.rows.some(r => r.columns.some(c => c.blocks.some(b => b.id === state.selectedBlock.id)))) {
      state.selectedBlock = null;
    }
  },
  UPDATE_BLOCK(state, updatedBlock) {
    for (const row of state.template.rows) {
      for (const col of row.columns) {
        const index = col.blocks.findIndex(b => b.id === updatedBlock.id);
        if (index !== -1) {
          col.blocks.splice(index, 1, updatedBlock);
          if (state.selectedBlock && state.selectedBlock.id === updatedBlock.id) {
            state.selectedBlock = updatedBlock;
          }
          return;
        }
      }
    }
  },
  DELETE_BLOCK(state, { rowId, colId, blockId }) {
    const row = state.template.rows.find(r => r.id === rowId);
    if (row) {
      const col = row.columns.find(c => c.id === colId);
      if (col) {
        const blockIndex = col.blocks.findIndex(b => b.id === blockId);
        if (blockIndex > -1) {
          if (state.selectedBlock && state.selectedBlock.id === blockId) {
            state.selectedBlock = null;
          }
          col.blocks.splice(blockIndex, 1);
        }
      }
    }
  },
  SET_AI_GENERATING(state, isLoading) {
    state.isAiGenerating = isLoading;
  },
  UPDATE_ROWS(state, newRows) {
    state.template.rows = newRows;
  }
};

const actions = {
  async saveTemplate({ state, dispatch, commit }) {
    if (!state.templateName.trim()) {
      Vue.prototype.$toast.warning("Please enter a template name.");
      return;
    }
    const html = await dispatch('generateHtml');
    const templateData = {
      name: state.templateName.trim(),
      html: html,
      jsonData: JSON.stringify(state.template)
    };
    await dispatch('templates/addTemplate', templateData, { root: true });
    commit('RESET_BUILDER');
  },

  generateHtml({ state }) {
    let html = `<table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:${state.template.styles.backgroundColor};"><tbody><tr><td>`;
    html += `<table align="center" width="600" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;"><tbody>`;
    state.template.rows.forEach(row => {
      html += `<tr><td style="${toInlineStyles(row.styles)}"><table width="100%" border="0" cellpadding="0" cellspacing="0"><tbody><tr>`;
      row.columns.forEach(col => {
        html += `<td valign="top" style="padding: 0;">`;
        col.blocks.forEach(block => {
          const style = toInlineStyles(block.styles);
          if (block.type === 'text') {
            html += `<p style="${style}">${block.content}</p>`;
          } else if (block.type === 'image') {
            const imageStyles = { ...block.styles };
            delete imageStyles.textAlign;
            const imageStyleString = toInlineStyles(imageStyles);
            html += `<div style="text-align: ${block.styles.textAlign || 'center'}; font-size: 0;"><img src="${block.src}" alt="image" style="${imageStyleString}" width="100%"/></div>`;
          } else if (block.type === 'button') {
            const buttonStyles = { ...block.styles };
            delete buttonStyles.textAlign;
            const buttonStyleString = toInlineStyles(buttonStyles);
            html += `<div style="text-align: ${block.styles.textAlign || 'center'};"><table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; display: inline-table;"><tr><td align="center" style="${buttonStyleString}" bgcolor="${block.styles.backgroundColor}"><a href="${block.href || '#'}" target="_blank" style="padding: 10px 20px; color: ${block.styles.color}; text-decoration: none; display: inline-block;">${block.content}</a></td></tr></table></div>`;
          } else if (block.type === 'divider') {
            html += `<div style="${toInlineStyles(block.styles)}"></div>`;
          } else if (block.type === 'html') {
            html += `<div style="${style}">${block.content}</div>`;
          } else if (block.type === 'social') {
            html += `<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="${style}">`;
            block.socials.forEach(social => {
              if (social.visible) {
                html += `<a href="${social.url || '#'}" target="_blank" style="display: inline-block; padding: 0 5px;"><img src="${social.imgUrl}" alt="${social.name}" width="32" height="32" style="border:0;"/></a>`;
              }
            });
            html += `</td></tr></table>`;
          }
        });
        html += `</td>`;
      });
      html += `</tr></tbody></table></td></tr>`;
    });
    html += `</tbody></table></td></tr></tbody></table>`;
    return html;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};