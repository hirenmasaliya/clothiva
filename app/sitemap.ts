import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://clothiva-amber.vercel.app'

  // Core Marketing Routes
  const routes = [
    '',
    '/shop',
    '/story',
    '/privacy',
    '/terms',
    '/cart',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
  
  return [...routes]
}