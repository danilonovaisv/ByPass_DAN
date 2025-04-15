import React, { useState } from 'react';
import { Link2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { bypassSchema } from '../lib/validation';
import type { BypassResponse } from '../types';

export function BypassForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const validatedUrl = bypassSchema.parse({ url });
      
      const response = await fetch('/api/bypass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedUrl),
      });

      const data: BypassResponse = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      if (data.final_url) {
        setResult(data.final_url);
        toast.success('Successfully retrieved Telegram link!');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
      <div className="space-y-2">
        <label 
          htmlFor="url" 
          className="block text-sm font-medium text-gray-700"
        >
          Enter Shortened/Monetized URL
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="url"
            id="url"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
            placeholder="https://example.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            Processing...
          </>
        ) : (
          <>
            <Link2 className="-ml-1 mr-2 h-5 w-5" />
            Get Telegram Link
          </>
        )}
      </button>

      {result && (
        <div className="mt-4 p-4 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm font-medium text-green-800">Direct Telegram Link:</p>
          <a
            href={result}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-sm text-blue-600 hover:text-blue-800 break-all"
          >
            {result}
          </a>
        </div>
      )}
    </form>
  );
}