# University Academic Records Portal (MIT817)

A premium, high-fidelity web application designed for students and university administrators to manage academic lifecycles with precision and security. Built with a modern, role-aware architecture and a professional glassmorphic aesthetic.

## 🚀 Key Features

### 🎓 Student Portal
- **Academic Results**: Session-wise grade tracking and cumulative performance summaries.
- **CGPA Calculator**: Interactive tool for calculating current standings and future projections.
- **Digital Credentials**: Blockchain-verified, globally verifiable academic certificates and diplomas.
- **Official Transcripts**: Secure request system for official academic transcripts with tracking history.
- **Personal Profile**: Comprehensive student profile management, including security settings and a document vault.

### 🛡️ Administrator Dashboard
- **Administrative Overview**: Real-time metrics for total students, pending requests, and issued credentials.
- **Transcript Management**: Professional interface for the registrar office to review and authorize transcript applications.
- **Record Accuracy**: Visual reporting on data integrity and automation efficiency.

### 🏠 Landing Page
- **Unified Entry**: A premium entry point with distinct authentication paths for students and institutional staff.
- **Feature Showcase**: High-impact messaging and modular highlights of the portal's capabilities.

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite)
- **Styling**: Vanilla CSS (Modular) with CSS Variables for theme consistency.
- **Routing**: React Router DOM (Nested, Role-Aware Routes).
- **Icons/Graphics**: Custom SVG iconography and high-integrity academic branding.

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI components (Sidebar, TopBar, DashboardLayout)
├── context/             # App-level state management
├── pages/               # Feature-specific page components
│   ├── AdminDashboard/  # Registry-level overview
│   ├── StudentDashboard/# Academic home for students
│   ├── Results/         # Grade management
│   ├── CGPACalculator/  # Interactive performance tool
│   ├── ...              # Other core pages
├── App.jsx              # Main routing and layout configuration
└── main.jsx             # Entry point
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ridbay/MIT-807-Project.git
   ```
2. Navigate to the project directory:
   ```bash
   cd mit817
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production
To create an optimized production build:
```bash
npm run build
```

## 📝 License
This project was created as part of the MIT817 academic course. All rights reserved.
