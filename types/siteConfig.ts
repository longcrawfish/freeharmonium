export type ThemeColor = {
  media: string
  color: string
}
export type SiteConfig = {
  name: string
  tagLine?: string
  description?: string
  url: string
  socialLinks?: {
    github?: string
    bluesky?: string
    twitter?: string
    twitterZh?: string
    discord?: string
    email?: string
  }
  themeColors?: string | ThemeColor[]
  defaultNextTheme?: string
  icons: {
    icon: string
    shortcut?: string
    apple?: string
  }
}
