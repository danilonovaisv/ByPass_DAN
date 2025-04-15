import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { BypassForm } from './components/BypassForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Telegram Link Bypass
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Extract direct Telegram links from shortened or monetized URLs safely and quickly.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
          <BypassForm />
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-1">
            <ExternalLink className="h-4 w-4" />
            Supports multiple URL shortener services
          </p>
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Use responsibly. We do not store or log any user data.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;