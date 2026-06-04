import { ErrorBoundary } from '@components/common/ErrorBoundary'
import { PageSkeleton } from '@components/common/LoadingSkeleton'

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-bold text-primary-800">LuxWatch</h1>
            <nav className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Phase 1 - Foundation Complete</span>
            </nav>
          </div>
        </header>
        
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Welcome to LuxWatch POS System
            </h2>
            <p className="text-gray-600">
              Phase 1 foundation has been successfully set up with:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-gray-600">
              <li>React 19 + TypeScript + Vite</li>
              <li>Tailwind CSS with custom theme</li>
              <li>Shadcn UI components (Button, Input, Select, Dialog, Badge, Avatar, Tooltip)</li>
              <li>Custom common components (ErrorBoundary, LoadingSkeleton, EmptyState, PageHeader, SectionCard, StatCard)</li>
              <li>Zustand state management (appStore, authStore)</li>
              <li>TanStack Query setup with API hooks</li>
              <li>Axios API client with interceptors</li>
              <li>Zod validation schemas</li>
              <li>Type definitions for all API entities</li>
              <li>Utility functions and helpers</li>
              <li>Toast notifications (Sonner)</li>
            </ul>
            <div className="mt-6 flex gap-4">
              <button className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                Get Started
              </button>
              <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                View Documentation
              </button>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
