<template>
  <div v-if="localBlock" class="settings-panel">
    <h4>Editing {{ localBlock.type }}</h4>
    <div v-if="localBlock.type === 'text'">
      <div class="form-group mb-3">
        <label>Padding</label>
        <input type="text" v-model="localBlock.styles.padding">
      </div>
      <div class="form-group mb-3">
        <label>Content</label>
        <textarea v-model="localBlock.content"></textarea>
      </div>
      <div class="form-group mb-3">
        <label>Font Size (e.g., 16px)</label>
        <input type="text" v-model="localBlock.styles.fontSize">
      </div>
      <div class="form-group mb-3">
        <label>Color</label>
        <input type="color" v-model="localBlock.styles.color">
      </div>
      <div class="form-group mb-3">
        <label>Background Color</label>
        <input type="color" v-model="localBlock.styles.backgroundColor">
      </div>
      <div class="form-group">
        <label>Alignment</label>
        <div class="alignment-group">
          <button @click="localBlock.styles.textAlign = 'left'" :class="{ 'active': localBlock.styles.textAlign === 'left' }">
            <i class="pi pi-align-left"></i>
          </button>
          <button @click="localBlock.styles.textAlign = 'center'" :class="{ 'active': localBlock.styles.textAlign === 'center' }">
            <i class="pi pi-align-center"></i>
          </button>
          <button @click="localBlock.styles.textAlign = 'right'" :class="{ 'active': localBlock.styles.textAlign === 'right' }">
            <i class="pi pi-align-right"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-if="localBlock.type === 'button'">
      <div class="form-group mb-3">
        <label>Padding</label>
        <input type="text" v-model="localBlock.styles.padding">
      </div>
      <div class="form-group mb-3">
        <label>Link URL</label>
        <input type="text" v-model="localBlock.href" placeholder="https://example.com">
      </div>
      <div class="form-group mb-3">
        <label>Text</label>
        <input type="text" v-model="localBlock.content">
      </div>
      <div class="form-group mb-3">
        <label>Border Radius</label>
        <input type="text" v-model="localBlock.styles.borderRadius" placeholder="e.g., 8px">
      </div>
      <div class="form-group mb-3">
        <label>Background Color</label>
        <input type="color" v-model="localBlock.styles.backgroundColor">
      </div>
      <div class="form-group mb-3">
        <label>Text Color</label>
        <input type="color" v-model="localBlock.styles.color">
      </div>
      <div class="form-group">
        <label>Alignment</label>
        <div class="alignment-group">
          <button @click="localBlock.styles.textAlign = 'left'" :class="{ 'active': localBlock.styles.textAlign === 'left' || !localBlock.styles.textAlign }">
            <i class="pi pi-align-left"></i>
          </button>
          <button @click="localBlock.styles.textAlign = 'center'" :class="{ 'active': localBlock.styles.textAlign === 'center' }">
            <i class="pi pi-align-center"></i>
          </button>
          <button @click="localBlock.styles.textAlign = 'right'" :class="{ 'active': localBlock.styles.textAlign === 'right' }">
            <i class="pi pi-align-right"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-if="localBlock.type === 'html'">
      <div class="form-group ai-section mb-3">
        <label>Describe the HTML you want:</label>
        <textarea 
          v-model="aiPrompt"
          rows="3" 
          placeholder="e.g., a welcome card with an image and a button"
        ></textarea>
        <button class="ai-button" @click="generateHtmlWithAI" :disabled="isAiLoading">
          <span v-if="isAiLoading">Generating...</span>
          <span v-else class="d-flex align-items-center justify-content-center gap-2">
            <i class="pi pi-sparkles"></i>
            <span>Ask AI</span>
          </span>
        </button>
      </div>
      <div class="form-group">
        <label>Custom HTML Code</label>
        <textarea 
          v-model="localBlock.content" 
          class="code-editor"
          rows="10" 
          placeholder="<p>Your <b>HTML</b> code here</p>"
        ></textarea>
      </div>
    </div>
    <div v-if="localBlock.type === 'image'">
      <div class="form-group mb-3">
        <label>Image URL</label>
        <input type="text" v-model="localBlock.src">
      </div>
      <div class="form-group mb-3">
        <label>Width</label>
        <input type="text" v-model="localBlock.styles.width" placeholder="e.g., 100%, 250px">
      </div>
      <div class="form-group mb-3">
        <label>Height</label>
        <input type="text" v-model="localBlock.styles.height" placeholder="e.g., auto, 200px">
      </div>
      <div class="form-group mb-3">
        <label>Border Radius</label>
        <input type="text" v-model="localBlock.styles.borderRadius" placeholder="e.g., 8px, 50%">
      </div>
      <div class="form-group">
        <label>Alignment</label>
        <div class="alignment-group">
          <button @click="localBlock.styles.textAlign = 'left'" :class="{ 'active': localBlock.styles.textAlign === 'left' }">
            <i class="pi pi-align-left"></i>
          </button>
          <button @click="localBlock.styles.textAlign = 'center'" :class="{ 'active': localBlock.styles.textAlign === 'center' }">
            <i class="pi pi-align-center"></i>
          </button>
          <button @click="localBlock.styles.textAlign = 'right'" :class="{ 'active': localBlock.styles.textAlign === 'right' }">
            <i class="pi pi-align-right"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-if="localBlock.type === 'divider'">
      <div class="form-group mb-3">
        <label>Padding</label>
        <input type="text" v-model="localBlock.styles.padding">
      </div>
      <div class="form-group mb-3">
        <label>Thickness</label>
        <input type="text" v-model="localBlock.styles.borderTopWidth" placeholder="e.g., 2px">
      </div>
      <div class="form-group">
        <label>Color</label>
        <input type="color" v-model="localBlock.styles.borderTopColor">
      </div>
    </div>
    <div v-if="localBlock.type === 'social'">
      <div class="form-group mb-3">
        <label>Icon Color</label>
        <input type="color" v-model="localBlock.iconColor">
      </div>
      <div class="form-group mb-3">
        <label>Alignment</label>
        <div class="alignment-group">
          <button @click="localBlock.styles.textAlign = 'left'" :class="{ 'active': localBlock.styles.textAlign === 'left' }">
            <i class="pi pi-align-left"></i>
          </button>
          <button @click="localBlock.styles.textAlign = 'center'" :class="{ 'active': localBlock.styles.textAlign === 'center' }">
            <i class="pi pi-align-center"></i>
          </button>
          <button @click="localBlock.styles.textAlign = 'right'" :class="{ 'active': localBlock.styles.textAlign === 'right' }">
            <i class="pi pi-align-right"></i>
          </button>
        </div>
      </div>
      <div v-for="(social, index) in localBlock.socials" :key="index" class="form-group-social">
        <label>
          <i :class="social.iconClass"></i> {{ social.name }}
        </label>
        <div class="social-input-group">
          <input type="checkbox" v-model="social.visible" class="social-toggle">
          <input 
            type="text" 
            v-model="social.url" 
            placeholder="https://..." 
            :disabled="!social.visible"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    block: Object,
  },
  data() {
    return {
      localBlock: null,
      aiPrompt: '',
      isAiLoading: false,
      isUpdatingFromProp: false,
    };
  },
  methods: {
    async generateHtmlWithAI() {
      if (!this.aiPrompt.trim()) {
        this.$toast.warning('Please enter a description for the AI.');
        return;
      }

      this.$emit('ai-generation-start');
      this.isAiLoading = true;
      let finalHtml = '';

      try {
        const PIXABAY_KEY = "51998538-0273da1661f21876edf669c12";
        const randomPage = Math.floor(Math.random() * 5) + 1; 
        
        const pixabayUrl = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(this.aiPrompt)}&image_type=photo&per_page=3&page=${randomPage}`;
        let imageUrl = "https://cdn.pixabay.com/photo/2017/05/13/17/32/table-2310293_640.jpg";

        try {
          const pixabayResponse = await axios.get(pixabayUrl);
          if (pixabayResponse.data.hits && pixabayResponse.data.hits.length > 0) {
            const randomIndex = Math.floor(Math.random() * pixabayResponse.data.hits.length);
            imageUrl = pixabayResponse.data.hits[randomIndex].webformatURL;
          }
        } catch (imageError) {
          console.error("Could not fetch image from Pixabay, using fallback.", imageError);
        }

        const API_KEY = "AIzaSyB5QHNzoqnb4hebySr0kX3uXSgPZodcbjs";
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${API_KEY}`;
        
        const goodExampleHtml = `
        <div style="max-width:420px;margin:20px auto;padding:20px;border:1px solid #ddd;border-radius:12px;background:#fff;font-family:sans-serif;text-align:center;">
          <img src="https://images.unsplash.com/photo-1440778303588-435521a205bc" alt="Campaign Banner" style="max-width:100%;border-radius:8px;margin-bottom:15px;">
          <h2 style="margin:0 0 12px;font-size:22px;color:#2563eb;">☀️ Summer Campaign 🌴</h2>
          <p style="margin:0 0 16px;font-size:15px;color:#555;line-height:1.5;">🎉 Join our exclusive summer deals and save up to <strong>40%</strong> 🛍️ Hurry up — offer ends soon ⏰</p>
          <a href="#" style="display:inline-block;padding:10px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">🚀 Shop Now</a>
        </div>`;

        const fullPrompt = `
          You are an expert email HTML designer. Your task is to generate a single, beautiful, and engaging email template block based on a user's request.
          **STYLE REQUIREMENTS:**
          1.  **Main Container:** The entire block must be wrapped in a single container div styled like a card. This card should have a subtle border, rounded corners (border-radius: 12px), a white background, and be centered.
          2.  **Images:** All images must be responsive (style="max-width:100%;") and have rounded corners (border-radius: 8px;).
          3.  **Buttons:** All links that are calls to action must be styled as modern buttons. Use an 'a' tag with inline styles for background color, padding, text color, and rounded corners.
          4.  **Typography:** Use a clean, modern, sans-serif font family.
          5.  **Emojis:** Use relevant and tasteful emojis to make the content more visually appealing and engaging.
          6.  **Code Format:** The response must be pure, email-safe HTML with inline CSS only. Do NOT include any explanations, markdown like \`\`\`, or any html/head/body tags.
          **MANDATORY IMAGE:**
          You MUST use this exact image URL for the main image in the template: ${imageUrl}
          **EXAMPLE of the style you must follow:**
          \`\`\`html
          ${goodExampleHtml}
          \`\`\`
          Now, using all the rules and the example above, create a new HTML block for the following user request: "${this.aiPrompt}"
        `;
        
        const payload = {
          contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        };

        const geminiResponse = await axios.post(geminiUrl, payload);
        let aiResponse = geminiResponse.data.candidates[0].content.parts[0].text;

        const codeBlockMatch = aiResponse.match(/```(?:html)?\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          aiResponse = codeBlockMatch[1].trim();
        }

        finalHtml = aiResponse;

      } catch (error) {
        console.error("Error during AI generation:", error);
        this.$toast.error('Failed to get a response from the AI.');
        finalHtml = '<p>Sorry, an error occurred.</p>';
      } finally {
        this.localBlock.content = finalHtml;
        this.isAiLoading = false;
        this.$emit('ai-generation-end');
      }
    }
  },
  watch: {
    block: {
      handler(newBlock) {
        if (newBlock) {
          this.isUpdatingFromProp = true;
          this.localBlock = JSON.parse(JSON.stringify(newBlock));
          this.$nextTick(() => {
            this.isUpdatingFromProp = false;
          });
        } else {
          this.localBlock = null;
        }
      },
      immediate: true,
      deep: true,
    },
    localBlock: {
      handler(updatedBlock) {
        if (this.isUpdatingFromProp) {
          return;
        }
        this.$emit('update-block', updatedBlock);
      },
      deep: true,
    },
    'localBlock.iconColor': function(newColor) {
      if (this.localBlock && this.localBlock.type === 'social') {
        const colorHex = newColor.substring(1);
        this.localBlock.socials.forEach(social => {
          const url = new URL(social.imgUrl);
          url.searchParams.set('color', colorHex);
          social.imgUrl = url.toString();
        });
      }
    }
  },
};
</script>

<style scoped>
.settings-panel { 
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
}
.form-group { 
  display: flex; 
  flex-direction: column; 
}
.form-group label { 
  margin-bottom: 5px; 
  font-size: 14px; 
  color: #555; 
}
.form-group input, .form-group textarea { 
  width: 100%; 
  padding: 8px; 
  border: 1px solid #ccc; 
  border-radius: 4px; 
  box-sizing: border-box; 
}
.form-group-social {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}
.form-group-social label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  font-weight: 500;
}
.social-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.social-toggle {
  width: 20px;
  height: 20px;
}
.social-input-group input[type="text"] {
  flex-grow: 1;
}
.alignment-group {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.alignment-group button {
  flex-grow: 1;
  background: #fff;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #333;
}
.alignment-group button:first-child {
  border-right: 1px solid #ccc;
}
.alignment-group button:last-child {
  border-left: 1px solid #ccc;
}
.alignment-group button.active {
  background-color: #007bff;
  color: white;
}
.alignment-group button i {
  font-size: 1.2rem;
}
.ai-section {
  background-color: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: 4px;
  padding: 15px;
}
.ai-button {
  margin-top: 10px;
  width: 100%;
  padding: 8px 16px;
  background-color: #3a31e7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}
.ai-button:hover {
  background-color: #241cb8;
}
.ai-button:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
}
</style>