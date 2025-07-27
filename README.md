# TOS Simplifier Frontend

A  web application that simplifies Terms of Service documents.

## Features

- 📄 **PDF Upload**: Drag and drop or click to upload PDF files
- 🎯 **Simplification Levels**: Choose from 8th grade or 12th grade level

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tos-simplifier-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your API base URL
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload a PDF**: Click the upload area or drag and drop a PDF file containing Terms of Service
2. **Select Level**: Choose between 8th grade or 12th grade simplification level
3. **Simplify**: Click the "Simplify Document" button to process your file (this may take a few moments)
4. **View Results**: Explore the simplified content organized in tabs by section

## API Integration

The frontend integrates with a real backend API at `http://167.71.128.30/simplify` that accepts:
- `file`: PDF file (multipart/form-data)
- `level`: Simplification level (8th or 12th)

The backend URL is configured via the `API_BASE_URL` environment variable.

### Example API Request
```bash
curl -X POST "http://167.71.128.30/simplify?level=8th" -F "file=@duolingo-tos.pdf"
```

The API returns a JSON response with simplified sections organized by category.

## Project Structure

```
src/
├── app/
│   ├── api/simplify/
│   │   └── route.ts          # Mock API endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main application page
├── components/
│   └── ui/                   # shadcn/ui components
└── lib/
    └── utils.ts              # Utility functions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

To add new shadcn/ui components:
```bash
npx shadcn@latest add <component-name>
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
