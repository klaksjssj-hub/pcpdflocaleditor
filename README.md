# 🚀 localpdf - Full-Stack iLovePDF Replica & PDF Suite

A modern, high-performance, full-stack web application replicating and enhancing the core functionality of **iLovePDF.com**. Built with a privacy-first philosophy, **localpdf** offers both lightning-fast client-side (in-browser) offline processing and high-fidelity cloud microservices.

![localpdf Overview](https://img.shields.io/badge/localpdf-v1.0.0-e5322d?style=for-the-badge)
![React 18](https://img.shields.io/badge/React-18-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?style=for-the-badge)
![Express](https://img.shields.io/badge/Express-4.19-000000?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=for-the-badge)

---

## 📑 Table of Contents
1. [Core Features](#-core-features)
2. [Dual-Engine Architecture](#-dual-engine-architecture)
3. [Tech Stack](#-tech-stack)
4. [Database Schema Design](#-database-schema-design)
5. [REST API Documentation & Swagger](#-rest-api-documentation--swagger)
6. [Getting Started (Local Development)](#-getting-started-local-development)
7. [Running Tests](#-running-tests)
8. [Docker & Production Deployment](#-docker--production-deployment)
9. [Project Directory Structure](#-project-directory-structure)

---

## ✨ Core Features

### 1. 🗂️ PDF Merge Tool
- Upload multiple PDF files simultaneously.
- Interactive reordering list with up/down controls and instant drag positioning.
- Real-time preview thumbnails and page counters.
- Merge into a single PDF with customizable page order.
- Instant download with time-to-process metrics.

### 2. ✂️ PDF Split Tool
- **Split by Ranges**: e.g., `1-3, 5, 8-10` creates separate PDFs bundled into a single ZIP archive.
- **Extract Pages**: Interactive visual page picker lets you click specific pages to extract.
- **Split Every N Pages**: Uniformly splits a massive document every $N$ pages.

### 3. 📉 PDF Compress Tool
- Three optimization profiles:
  - **Extreme Compression**: Maximum file size reduction (up to 90% savings).
  - **Recommended Compression**: Optimal balance between small footprint and crisp vector/text quality.
  - **Less Compression**: Light compression preserving original high-DPI print quality.
- Real-time before-and-after size comparison badge and percentage savings counter.

### 4. 🔄 PDF Converter Tools
- **PDF to Word (.docx)**: Extracts text paragraphs, structural headings, and builds native Microsoft Word `.docx` documents.
- **PDF to Excel (.xlsx)**: Parses tabular data and structured lines into multi-column Excel spreadsheets.
- **PDF to HTML**: Generates semantic, styled, responsive HTML web pages.
- **Images to PDF**: Transforms batches of JPG, PNG, and WEBP images into a unified PDF document.

### 5. ✏️ PDF Editor & Page Organizer
- **Watermarks**: Custom text or image watermarks with angle rotation, adjustable opacity (10% to 100%), and color stamps.
- **Page Rotation**: Rotate individual pages or all pages simultaneously in 90° increments.
- **Page Deletion**: Visual thumbnail grid allows removing unwanted pages before export.
- **Page Reordering**: Rearrange page sequence with interactive movement controls.

### 6. 🔒 PDF Security (Protect & Unlock)
- **Password Protection**: Encrypt PDFs with user/owner passwords and standard Adobe security flags.
- **Password Removal / Unlock**: Remove encryption and permission restrictions from known password-protected PDFs.

### 7. ✍️ Electronic Signature (E-Sign)
- **Three Signature Modes**:
  1. *Draw*: Responsive HTML5 canvas with custom pen stroke widths and ink colors (Black, Navy Blue, Crimson).
  2. *Type*: Instant cursive typography signature generator.
  3. *Upload*: Upload signature images (PNG/JPG with transparency).
- **Interactive Document Placement**: Visual placement box positioned directly on any page in the document.

### 8. 🔍 Neural Optical Character Recognition (OCR)
- Powered by `Tesseract.js` neural engine.
- Extracts editable text from scanned PDFs and raster images.
- Multi-language support: English (`eng`), Spanish (`spa`), French (`fra`), German (`deu`), Hindi (`hin`).
- 1-click **Copy to Clipboard** and **Download Searchable PDF** export.

### 9. 📊 User Analytics & Automation Dashboard
- Real-time KPI statistics: Total operations, total files processed, total megabytes saved, average latency.
- Recent operations history table with download links active for 24 hours.
- Saved automation templates for one-click repetitive workflows.

### 10. 🌐 Internationalization (i18n) & Dark Mode
- Full interface localization in English, Spanish, French, German, and Hindi.
- Seamless Dark Mode toggle with persistent storage and system preference detection.

---

## ⚡ Dual-Engine Architecture

**localpdf** introduces a hybrid processing model:
1. **Client-Side Engine (Offline Fast)**: Utilizes `pdf-lib` compiled to WebAssembly/JavaScript directly in the user's browser. Files **never leave the user's machine** — providing absolute privacy and zero latency.
2. **Cloud Server Engine (High-Fidelity)**: Utilizes Node.js Express microservices for intensive conversions (DOCX, XLSX, OCR) and server-side automation pipelines.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 18 with TypeScript
  - Tailwind CSS 3.4 (with custom `@tailwindcss` tokens and dark mode)
  - Lucide React (modern vector icons)
  - `pdf-lib` (in-browser document manipulation)
  - `canvas-confetti` (interactive celebration animations)
  - Vite 5 (instant Hot Module Replacement)
- **Backend**:
  - Node.js & Express with TypeScript
  - `pdf-lib` (pure JavaScript PDF manipulation & encryption)
  - `docx` & `exceljs` (native office file generation)
  - `pdf-parse` (fast stream-based text extraction)
  - `tesseract.js` (Optical Character Recognition)
  - `multer` (streamed multi-part uploads with MIME validation)
  - `archiver` (deflate compression for ZIP bundles)
  - `swagger-ui-express` (interactive OpenAPI 3.0 documentation)
- **Database & Storage**:
  - Dual support: Lightweight zero-dependency file-based persistent store + PostgreSQL / SQLite via SQL scripts and Prisma schema (`schema.prisma`).
  - Automated 24-hour file cleanup worker.
- **Testing & Tooling**:
  - Jest & Supertest (automated API integration testing)
  - Docker & Docker Compose (multi-stage alpine containers)
  - GitHub Actions CI/CD pipeline

---

## 🗄️ Database Schema Design

The application includes production-grade database schemas for **PostgreSQL**, **SQLite**, and **Prisma ORM**.

### Entity Relationship Model

```
+------------------+         +-----------------------+         +---------------------+
|      Users       | <----+  |     FileMetadata      | <----+  |  OperationHistory   |
+------------------+      |  +-----------------------+      |  +---------------------+
| id (UUID, PK)    |      |  | id (UUID, PK)         |      |  | id (UUID, PK)       |
| email (Unique)   |      |  | user_id (FK)          |      |  | user_id (FK)        |
| password_hash    |      +--| original_name         |      +--| tool_type           |
| tier             |         | stored_name           |         | input_file_ids      |
| storage_used     |         | mime_type             |         | output_file_id (FK) |
| created_at       |         | file_size_bytes       |         | status              |
+------------------+         | page_count            |         | processing_time_ms  |
         |                   | storage_path          |         | created_at          |
         v                   | expires_at            |         +---------------------+
+------------------+         | created_at            |
|  SavedTemplates  |         +-----------------------+
+------------------+
| id (UUID, PK)    |
| user_id (FK)     |
| name             |
| tool_type        |
| config_json      |
+------------------+
```

Schema files included:
- `server/src/db/schema.sql` (Raw SQL with indexes and foreign keys)
- `server/src/db/schema.prisma` (Prisma schema with models and relations)
- `server/src/db/store.ts` (Active repository layer with auto-cleanup)

---

## 📖 REST API Documentation & Swagger

When the backend server runs, interactive OpenAPI 3.0 documentation is available at:
👉 **`http://localhost:5000/api-docs`**

### Summary of REST Endpoints:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/upload` | `POST` | Upload up to 20 files (`multipart/form-data`) |
| `/api/merge` | `POST` | Merge multiple PDFs into one document |
| `/api/split` | `POST` | Split PDF by ranges, extraction, or every $N$ pages |
| `/api/compress` | `POST` | Compress PDF with `low`, `medium`, or `high` ratio |
| `/api/convert` | `POST` | Convert PDF to Word, Excel, HTML, or Images to PDF |
| `/api/edit` | `POST` | Add watermarks, rotate pages, reorder or delete |
| `/api/protect/protect` | `POST` | Encrypt PDF with password and permission flags |
| `/api/protect/unlock` | `POST` | Decrypt and remove password restrictions |
| `/api/sign` | `POST` | Place drawn/typed electronic signatures |
| `/api/ocr` | `POST` | Optical character recognition & searchable PDF |
| `/api/download/:fileId` | `GET` | Stream processed file to client |
| `/api/file/:fileId` | `DELETE` | Immediately purge a temporary file |
| `/api/history` | `GET` | Retrieve user operations history |
| `/api/stats` | `GET` | Aggregated dashboard analytics |
| `/api/templates` | `GET/POST`| Fetch or save custom automation templates |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js >= 18.0.0 (Tested on Node.js v20.18.0)
- npm >= 9.0.0

### Installation

1. **Clone or navigate into the repository**:
   ```bash
   cd scratch/localpdf
   ```

2. **Install all dependencies** (root, backend, and frontend):
   ```bash
   npm run install:all
   ```

3. **Start both Backend and Frontend concurrently**:
   ```bash
   npm run dev
   ```

   - **Frontend UI**: `http://localhost:3000`
   - **Backend API**: `http://localhost:5000`
   - **Swagger Docs**: `http://localhost:5000/api-docs`

---

## 🧪 Running Tests

The test suite validates file uploads, merging, splitting, compressing, watermarking, signing, and security:

```bash
# Run server test suite with Jest & Supertest
npm test
```

Sample output:
```text
PASS tests/api.test.ts
  localpdf API Integration Tests
    √ GET /health - Service health check (115 ms)
    √ POST /api/upload - Upload multiple PDF files (90 ms)
    √ POST /api/merge - Merge two PDFs into one (269 ms)
    √ POST /api/split - Split PDF by range (29 ms)
    √ POST /api/compress - Compress PDF (32 ms)
    √ POST /api/edit - Add watermark & rotate page (53 ms)
    √ POST /api/protect/protect - Encrypt and protect PDF (29 ms)
    √ POST /api/sign - Place signature on PDF page (34 ms)
    √ GET /api/stats - Check usage analytics (14 ms)

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```

---

## 🐳 Docker & Production Deployment

To spin up the complete production environment (PostgreSQL database, Node.js Express server, and Nginx React frontend):

```bash
docker-compose up --build -d
```

Access the containerized application:
- Web App: `http://localhost:3000`
- API Backend: `http://localhost:5000`
- PostgreSQL: `localhost:5432`

---

## 📁 Project Directory Structure

```
localpdf/
├── client/                     # Frontend (React 18 + TypeScript + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, DropZone, PageThumbnailGrid, SignaturePad, etc.
│   │   ├── context/            # ThemeContext (dark/light), I18nContext (multi-language)
│   │   ├── pages/              # Home, Merge, Split, Compress, Convert, Edit, Protect, Sign, OCR, Dashboard, ApiDocs
│   │   ├── services/           # apiClient (REST) & ClientPdfEngine (browser offline)
│   │   ├── types/              # Shared TypeScript definitions
│   │   ├── App.tsx             # Routing & master layout
│   │   ├── index.css           # Tailwind design tokens
│   │   └── main.tsx            # React root mount
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                     # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/             # Environment, directory paths, file limits
│   │   ├── db/                 # SQL schema, Prisma schema, persistent metadata store
│   │   ├── middleware/         # Multer secure upload filters
│   │   ├── routes/             # Merge, Split, Compress, Convert, Edit, Protect, Sign, OCR, File routes
│   │   ├── services/           # PdfService, ConvertService, OcrService, StorageService
│   │   ├── swagger/            # OpenAPI 3.0 JSON specification
│   │   └── index.ts            # Express server initialization
│   ├── tests/                  # Jest integration test suite (api.test.ts)
│   ├── uploads/                # Ephemeral uploads directory
│   ├── processed/              # Processed output directory
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── .github/workflows/          # GitHub Actions CI/CD configuration
├── docker-compose.yml          # Multi-container orchestration
├── Dockerfile.server           # Multi-stage server image
├── Dockerfile.client           # Nginx production client image
├── package.json                # Root coordinator
└── README.md                   # Documentation
```

---

## 📜 License
MIT License. Built for seamless PDF workflows everywhere.
