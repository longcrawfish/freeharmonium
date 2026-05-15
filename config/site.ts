import { SiteConfig } from "@/types/siteConfig";

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://freeharmonium.com";

export const SOURCE_CODE_URL = "https://github.com/weijunext/nextjs-starter";
export const PRO_VERSION = "https://nexty.dev";

const TWITTER_URL = 'https://x.com/weijunext'
const BSKY_URL = 'https://bsky.app/profile/judewei.bsky.social'
const EMAIL_URL = 'weijunext@gmail.com'
const GITHUB_URL = 'https://github.com/weijunext'
const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL

export const siteConfig: SiteConfig = {
  name: "Free Harmonium",
  tagLine: 'Playable harmonium in the browser',
  description:
    "Play harmonium with your computer keyboard, touch screen, or MIDI keyboard directly in the browser.",
  url: BASE_URL,
  authors: [
    {
      name: "weijunext",
      url: "https://weijunext.com",
    }
  ],
  creator: '@weijunext',
  socialLinks: {
    discord: DISCORD_URL,
    twitter: TWITTER_URL,
    github: GITHUB_URL,
    bluesky: BSKY_URL,
    email: EMAIL_URL
  },
  themeColors: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  defaultNextTheme: 'system', // next-theme option: system | dark | light
  icons: {
    icon: "/webharmonium/icons/webharmonium_192.png",
    shortcut: "/webharmonium/icons/webharmonium_192.png",
    apple: "/webharmonium/icons/webharmonium_192.png",
  },
}
