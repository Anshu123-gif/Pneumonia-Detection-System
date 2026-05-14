# PneumoGuard AI: Pneumonia Detection Web App

This project is a full-stack AI-powered medical application that uses Deep Learning to detect pneumonia from chest X-rays.

## 🚀 Key Features
- **AI Diagnosis**: Real-time screening using Google Gemini 1.5 Flash (vision).
- **Explainable AI**: Generates radiological observations and reasoning.
- **Medical Reports**: Downloadable PDF reports with diagnosis details.
- **Modern UI**: Clean, responsive dashboard built with React 19 and Tailwind 4.
- **Dual Backend Support**: Express (Live) and FastAPI (Reference).

---

## 🛠️ Installation & Setup (Local Windows/MacOS)

### 1. Prerequisites
- **Python 3.10+** (For the Deep Learning model training)
- **Node.js 18+** (For the Web Application)
- **VS Code** (Recommended Editor)
- **Gemini API Key** (Get it from [aistudio.google.com](https://aistudio.google.com/))

### 2. Frontend & Backend Setup (Node.js)
```bash
# Clone the project and enter directory
npm install

# Create a .env file and add your key
# GEMINI_API_KEY=your_key_here

# Start the application
npm run dev
```

### 3. Python Backend Setup (Optional Reference)
```bash
cd src/backend_python
pip install fastapi uvicorn tensorflow pillow python-multipart
uvicorn main:app --reload
```

---

## 💻 VS Code Setup Steps
1. **Extensions**: Install `Prettier`, `ESLint`, and `Python` (by Microsoft).
2. **Terminal**: Use the integrated terminal (`Ctrl + \``) to run the commands above.
3. **Environment**: Ensure your Python interpreter is set to 3.10+ in the bottom right corner.

---

## 🎓 Interview & Viva Questions (FAQs)

**Q1: What is the significance of using MobileNetV2?**
*A: MobileNetV2 uses Depthwise Separable Convolutions, making it extremely efficient for mobile and web apps where computational resources might be limited.*

**Q2: How does the AI generate reasoning for the diagnosis?**
*A: While the CNN provides the classification, we use Gemini 1.5 Flash's multimodal capabilities to analyze the visual markers (like opacities and lung density) and explain "why" the model arrived at that result.*

**Q3: What is the purpose of the 'AveragePooling2D' layer in the model?**
*A: It reduces the spatial dimensions of the feature map, helping the model focus on global features rather than local noise, which improves generalization.*

**Q4: How do you handle imbalanced data in medical datasets?**
*A: We use data augmentation (Rotation, Zoom, Flip) and sometimes Class Weights during training to ensure the model doesn't overfit the more frequent 'Normal' class.*

---

## 📂 Folder Structure
- `/src`: Frontend React source code.
- `/server.ts`: Express backend serving the API.
- `/COLAB_TUTORIAL.md`: Training logic for the Deep Learning model.
- `/metadata.json`: App identification and permissions.
