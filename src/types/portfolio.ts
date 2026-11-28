export type SocialIconKey = 'linkedin' | 'github' | 'mail'

export interface SocialLink {
  name: string
  url: string
  handle: string
  icon: SocialIconKey
}

export interface FocusPillar {
  tag: string
  title: string
  description: string
}

export interface Profile {
  name: string
  role: string
  headline: string
  subheadline: string
  bio: string
  location: string
  availability: string
  email: string
  linkedinUrl: string
  avatar: string
  avatarIsTransparent?: boolean
  cvUrl: string
  cvFileName: string
  socials: SocialLink[]
  focusPillars: FocusPillar[]
}

export interface ProjectHighlightItem {
  label: string
  value: string
}

export interface ProjectGalleryItem {
  src: string
  caption?: string
  badge?: string
}

export interface ProjectDetails {
  overview: string
  problem: string
  solution: string
  features: string[]
  highlights?: ProjectHighlightItem[]
  videoUrl?: string
  videoTitle?: string
  videoPoster?: string
  gallery?: Array<string | ProjectGalleryItem>
}

export interface Project {
  id: string
  title: string
  tagline: string
  shortDescription: string
  role: string
  year: string
  status: 'featured' | 'building' | 'coming-soon'
  tech: string[]
  accentColor: string
  coverImage?: string
  githubUrl?: string
  liveUrl?: string
  details: ProjectDetails
}

export interface SkillCategory {
  category: string
  items: string[]
}
