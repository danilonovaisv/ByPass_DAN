import { z } from 'zod';

export const bypassSchema = z.object({
  url: z.string().url().refine(
    (url) => {
      const supportedDomains = [
        'suaurl.com',
        'lollty.com',
        'best-links.org',
        'link-center.net',
        'quins.us',
        'easy4money.com',
        'go.postazap.com',
        'droplink.co',
        'suaads.com'
      ];
      return supportedDomains.some(domain => url.includes(domain));
    },
    {
      message: 'URL must be from a supported shortener service'
    }
  )
});

export const validateTelegramUrl = (url: string): boolean => {
  const telegramRegex = /^https:\/\/t\.me\/(\+|)[a-zA-Z0-9_]+$/;
  return telegramRegex.test(url);
};