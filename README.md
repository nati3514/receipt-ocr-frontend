# Receipt OCR Frontend

A modern web application for uploading, managing, and analyzing receipts using OCR technology. Built with Next.js, React, and Apollo Client.

## Features

- Upload receipt images for processing
- View and manage receipt history
- Automatic store name and total amount extraction
- Categorized spending overview
- Real-time updates with GraphQL
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend Framework**: Next.js 14 with React 19
- **State Management**: Apollo Client
- **Styling**: Tailwind CSS with shadcn/ui components
- **Form Handling**: React Hook Form
- **Icons**: Lucide Icons
- **Date Handling**: date-fns
- **API**: GraphQL with file upload support

## Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Access to the Receipt OCR API (or local instance)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/receipt-ocr-frontend.git
   cd receipt-ocr-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
receipt-ocr-frontend/
├── app/                  # App router pages
├── components/           # Reusable UI components
├── lib/
│   ├── config/          # Configuration files
│   ├── graphql/         # GraphQL queries and mutations
│   └── utils/           # Utility functions
├── public/              # Static files
└── types/               # TypeScript type definitions
```

## Environment Variables

| Variable Name                | Description                          | Default Value       |
|------------------------------|--------------------------------------|---------------------|
| `NEXT_PUBLIC_API_BASE_URL`   | Base URL for the API server          | `http://localhost:4000` |

## Available Scripts

- `dev` - Start the development server
- `build` - Build the application for production
- `start` - Start the production server
- `lint` - Run ESLint

## API Integration

This frontend is designed to work with a GraphQL API.

