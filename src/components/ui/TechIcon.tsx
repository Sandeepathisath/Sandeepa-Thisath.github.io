import type { ReactNode } from 'react'
import { Code2, Container, Database, Globe, Server } from 'lucide-react'

interface TechIconProps {
  name: string
  className?: string
}

function renderBrandSvg(key: string): ReactNode | null {
  if (key.includes('react')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#0ea5e9]" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="10" ry="4.1" />
        <ellipse cx="12" cy="12" rx="10" ry="4.1" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.1" transform="rotate(120 12 12)" />
      </svg>
    )
  }

  if (key.includes('next')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--text-primary)]" fill="none">
        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 16V8l7.5 9.5M15 8v5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (key.includes('typescript')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#3b82f6]" fill="currentColor">
        <rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6.5 11h5m-2.5 0v6.5M16.8 11.7c-.5-.5-1.1-.7-1.9-.7-1.1 0-1.9.6-1.9 1.5 0 1 .7 1.4 2 1.7 1.1.3 1.7.7 1.7 1.6 0 1-.9 1.7-2.2 1.7-1 0-1.8-.3-2.4-.9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (key.includes('javascript')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#ca8a04]" fill="currentColor">
        <rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.5 10.5v5.2c0 1.2-.6 1.8-1.7 1.8-.7 0-1.2-.2-1.6-.6M17.2 11.4c-.4-.4-1-.6-1.6-.6-.9 0-1.5.5-1.5 1.2 0 .8.6 1.1 1.6 1.4 1 .3 1.6.7 1.6 1.6 0 .9-.8 1.5-1.9 1.5-.8 0-1.5-.2-2-.7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (key.includes('java')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#ea580c]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 12h9.5v3.2a4.5 4.5 0 0 1-4.5 4.5h-.5a4.5 4.5 0 0 1-4.5-4.5V12z" fill="currentColor" fillOpacity="0.16" />
        <path d="M16 13h1.8a2.2 2.2 0 0 1 0 4.4H16" />
        <path d="M9.5 4.5c-.8 1 .8 2 0 3M13 4c-.8 1 .8 2 0 3.2" />
      </svg>
    )
  }

  if (key.includes('tailwind')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#06b6d4]" fill="currentColor">
        <path d="M12 6.5c-2.67 0-4.33 1.33-5 4 1-.1.87-1.08 2.67-.63.76.19 1.31.74 1.91 1.35C12.57 12.22 13.7 13.33 16 13.33c2.67 0 4.33-1.33 5-4-1 .1-.87 1.08-2.67.63-.76-.19-1.31-.74-1.91-1.35C15.43 7.61 14.3 6.5 12 6.5zm-5 5.67c-2.67 0-4.33 1.33-5 4 1-.1.87 1.08 2.67-.63.76.19 1.31.74 1.91 1.35.99 1 2.12 2.11 4.42 2.11 2.67 0 4.33-1.33 5-4-1 .1-.87 1.08-2.67.63-.76-.19-1.31-.74-1.91-1.35-.99-1-2.12-2.11-4.42-2.11z" />
      </svg>
    )
  }

  if (key.includes('electron')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#0284c7]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="9.5" ry="4.2" transform="rotate(35 12 12)" />
        <ellipse cx="12" cy="12" rx="9.5" ry="4.2" transform="rotate(-35 12 12)" />
        <circle cx="18.2" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (key.includes('node')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#10b981]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
        <path d="M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4L12 2.8z" fill="currentColor" fillOpacity="0.16" />
        <path d="M9.5 14.5v-5l5 5v-5" strokeLinecap="round" />
      </svg>
    )
  }

  if (key.includes('spring')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#16a34a]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.5 4.5C14 4.5 7.5 8 6 14.5c-.5 2.3.5 4.2 2.8 4.8 4.5 1.2 10.7-2.6 10.7-14.8z" fill="currentColor" fillOpacity="0.16" />
        <path d="M6.5 17.5c3-3 6.5-5.5 11-7" />
      </svg>
    )
  }

  if (key.includes('c#') || key.includes('.net')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#7c3aed]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3z" fill="currentColor" fillOpacity="0.16" />
        <path d="M11 10.2a2.6 2.6 0 1 0 0 3.6M14.5 9.8v4.4M16.5 9.8v4.4M13.5 11.2h4M13.5 12.8h4" />
      </svg>
    )
  }

  if (key.includes('mysql') || key.includes('sqlite') || key.includes('postgres')) {
    return (
      <Database
        className={`h-4 w-4 ${
          key.includes('mysql')
            ? 'text-[#0284c7]'
            : key.includes('sqlite')
              ? 'text-[#2563eb]'
              : 'text-[#6366f1]'
        }`}
      />
    )
  }

  if (key.includes('docker')) {
    return <Container className="h-4 w-4 text-[#0ea5e9]" />
  }

  if (key.includes('linux')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#d97706]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c-2.6 0-4.2 2-4.2 5 0 2-.9 3.5-1.8 5.2-.8 1.5-.8 3.6.7 4.8 1.4 1.1 3.2 1.5 5.3 1.5s3.9-.4 5.3-1.5c1.5-1.2 1.5-3.3.7-4.8-.9-1.7-1.8-3.2-1.8-5.2 0-3-1.6-5-4.2-5z" fill="currentColor" fillOpacity="0.16" />
        <circle cx="10.2" cy="7.5" r="0.6" fill="currentColor" />
        <circle cx="13.8" cy="7.5" r="0.6" fill="currentColor" />
        <path d="M10.4 9.8 12 11l1.6-1.2" />
      </svg>
    )
  }

  if (key.includes('git')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#e11d48]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="6" r="2.2" />
        <circle cx="17" cy="8" r="2.2" />
        <circle cx="7" cy="18" r="2.2" />
        <path d="M7 8.2v7.6M17 10.2c0 3.2-3 4.3-10 4.3" />
      </svg>
    )
  }

  if (key.includes('rest') || key.includes('api')) {
    return <Server className="h-4 w-4 text-[var(--accent-primary)]" />
  }

  if (key.includes('vs code') || key.includes('vscode')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#2563eb]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
        <path d="M16.5 3.5 20 5.2v13.6l-3.5 1.7L6.2 12l10.3-8.5z" fill="currentColor" fillOpacity="0.16" />
        <path d="m4 8.5 12.5 8.8M4 15.5 16.5 6.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (key.includes('three')) {
    return <Globe className="h-4 w-4 text-[var(--accent-secondary)]" />
  }

  return null
}

export function TechIcon({ name, className = '' }: TechIconProps) {
  const normalized = name.trim().toLowerCase()
  const icon = renderBrandSvg(normalized) ?? <Code2 className="h-4 w-4 text-[var(--accent-primary)]" />

  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${className}`} aria-hidden="true">
      {icon}
    </span>
  )
}
