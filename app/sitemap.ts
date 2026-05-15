import { siteConfig } from '@/config/site'
import { LOCALES } from '@/i18n/routing'
import { getPosts } from '@/lib/getBlogs'
import { MetadataRoute } from 'next'

const siteUrl = siteConfig.url

export const dynamic = 'force-static'

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | undefined

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    '',
    '/blog',
    '/about',
    '/privacy-policy',
    '/terms-of-service',
  ]

  // Generate multilingual pages
  const pages = LOCALES.flatMap(locale => {
    return staticPages.map(page => ({
      url: `${siteUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: page === '' ? 1.0 : 0.8,
    }))
  })

  const blogPosts = await Promise.all(
    LOCALES.map(async (locale) => {
      const { posts } = await getPosts(locale)
      return posts.map(post => ({
        url: `${siteUrl}/${locale}/blog${post.slug}`,
        lastModified: post.metadata.updatedAt || post.date,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }))
    })
  ).then(results => results.flat())

  return [
    ...pages,
    ...blogPosts,
  ]
}
