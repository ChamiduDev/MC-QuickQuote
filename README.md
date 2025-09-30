# Quotation Generator Web App

A **modern, responsive web application** built with **Next.js** that allows you to create and export professional quotations/invoices **without a backend**. Everything runs in the browser, and data is stored locally.

---

## 🔥 Features

### Company & Client Info
- Enter company name, address, contact, and upload logo.
- Enter client name, company, and contact details.
- Customize header and footer text.

### Quotation / Line Items
- Add multiple items: Description / Technology / Qty / Unit Price / Total.
- Auto-calculates subtotal, discount, tax, and grand total.
- Editable currency symbol (default: LKR or USD).
- Reorder, delete, and duplicate items.

### Customization
- Upload company logo for preview.
- Change colors, fonts, and layout (3 template styles: modern, minimal, corporate).
- Add notes or terms & conditions.
- Save/load templates locally (localStorage or IndexedDB).

### Live Preview
- Live A4-size preview as you edit.
- Print-ready layout with page breaks.

### Export Options
- **PDF** export via `html2canvas` + `jsPDF`.
- **Word (.docx)** export via `docx` npm package.
- Print option with clean `@media print` styling.

### UI / UX
- Clean, modern design using **Tailwind CSS**.
- Two-pane layout: editor (left) and live preview (right).
- Responsive on desktop & mobile.
- Managed with React Hook Form.

---

## ⚙️ Tech Stack

- **Next.js**
- **React**
- **Tailwind CSS**
- `html2canvas` + `jspdf` for PDF export
- `docx` (or `docxtemplater` + `PizZip`) for Word export
- `file-saver` for file downloads
- Data persistence: localStorage / IndexedDB

---

## 💡 Nice-to-Have

- Multiple templates/themes
- Currency & number formatting
- Import/export JSON for reuse
- Optional dark mode

---

## 🛠️ Installation

```bash
git clone https://github.com/yourusername/quotation-generator.git
cd quotation-generator
npm install
npm run dev
