/**
 * Hook for managing page metadata (SEO) in React
 * This will be replaced with Next.js Metadata API during migration
 * but the usage pattern in pages remains the same
 */

import { useEffect } from 'react';

type MetaConfig = {
  title: string;
  description?: string;
};

/**
 * Updates document title and meta description
 * In Next.js, this will be replaced with export const metadata = {...}
 */
export function usePageMeta({ title, description }: MetaConfig) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta description
    if (description) {
      let metaTag = document.querySelector('meta[name="description"]');
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'description');
        document.head.appendChild(metaTag);
      }
      
      metaTag.setAttribute('content', description);
    }
  }, [title, description]);
}
