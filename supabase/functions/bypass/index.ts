import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { z } from 'npm:zod@3.22.4';

const TIMEOUT = 30000; // 30 seconds
const MAX_REDIRECTS = 10;

const bypassSchema = z.object({
  url: z.string().url()
});

const validateTelegramUrl = (url: string): boolean => {
  const telegramRegex = /^https:\/\/t\.me\/(\+|)[a-zA-Z0-9_]+$/;
  return telegramRegex.test(url);
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function followRedirects(url: string, redirectCount = 0): Promise<string> {
  if (redirectCount >= MAX_REDIRECTS) {
    throw new Error('Too many redirects');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    clearTimeout(timeout);

    if (response.status === 301 || response.status === 302 || response.status === 307 || response.status === 308) {
      const location = response.headers.get('location');
      if (!location) throw new Error('Redirect location not found');
      return followRedirects(location, redirectCount + 1);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    const telegramMatch = text.match(/https:\/\/t\.me\/[+a-zA-Z0-9_]+/);
    
    if (!telegramMatch) {
      throw new Error('No Telegram link found');
    }

    const finalUrl = telegramMatch[0];
    if (!validateTelegramUrl(finalUrl)) {
      throw new Error('Invalid Telegram URL format');
    }

    return finalUrl;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const body = await req.json();
    const { url } = bypassSchema.parse(body);

    const finalUrl = await followRedirects(url);

    return new Response(
      JSON.stringify({ final_url: finalUrl }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      {
        status: error instanceof z.ZodError ? 400 : 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});