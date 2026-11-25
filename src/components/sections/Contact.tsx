import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  Send,
} from 'lucide-react'
import { motion } from 'motion/react'
import { profile } from '../../data/profile'
import { sendContactMessage } from '../../services/emailService'
import { GitHubIcon, LinkedInIcon } from '../ui/BrandIcons'
import { GlassCard } from '../ui/GlassCard'

function normalizeHref(url: string): string {
  if (/^(https?:|mailto:|tel:|\/)/i.test(url)) return url
  return `https://${url}`
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const githubSocial = profile.socials.find((item) => item.icon === 'github')
  const linkedinHref = normalizeHref(profile.linkedinUrl)

  const clearFeedbackIfError = () => {
    if (feedback?.type === 'error') {
      setFeedback(null)
    }
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setFeedback({
        type: 'error',
        text: `Clipboard access blocked. Email: ${profile.email}`,
      })
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback(null)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()

    if (trimmedName.length < 2) {
      setFeedback({ type: 'error', text: 'Please enter your name (at least 2 characters).' })
      return
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setFeedback({ type: 'error', text: 'Please enter a valid email address.' })
      return
    }
    if (trimmedMessage.length < 10) {
      setFeedback({ type: 'error', text: 'Please write a short message (at least 10 characters).' })
      return
    }

    setSubmitting(true)
    const result = await sendContactMessage({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    })
    setSubmitting(false)

    if (result.ok) {
      setName('')
      setEmail('')
      setMessage('')
      setFeedback({ type: 'success', text: result.message })
    } else {
      setFeedback({ type: 'error', text: result.message })
    }
  }

  return (
    <section
      id="contact"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-12 pt-7 sm:px-6 sm:pb-14 sm:pt-9 2xl:max-w-7xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
            Contact
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Let&apos;s connect &amp; build something useful.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          {/* Left: Gmail Contact Form + One-Click Copy Gmail */}
          <div className="lg:col-span-7">
            <GlassCard className="h-full p-6 sm:p-8">
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Send a message
                  </h3>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="apple-pill inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span style={{ color: 'var(--status-success-text)' }}>Copied Gmail</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                        <span>Copy Gmail</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                      Your Name
                    </span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => {
                        clearFeedbackIfError()
                        setName(e.target.value)
                      }}
                      placeholder="Your name"
                      style={{ backgroundColor: 'var(--input-bg)' }}
                      className="w-full rounded-2xl border border-[var(--glass-border)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                    />
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                      Your Email
                    </span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        clearFeedbackIfError()
                        setEmail(e.target.value)
                      }}
                      placeholder="you@example.com"
                      style={{ backgroundColor: 'var(--input-bg)' }}
                      className="w-full rounded-2xl border border-[var(--glass-border)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                    />
                  </label>
                </div>

                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    Message
                  </span>
                  <textarea
                    name="message"
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      clearFeedbackIfError()
                      setMessage(e.target.value)
                    }}
                    placeholder="Share a project idea, internship opportunity, or just say hello..."
                    style={{ backgroundColor: 'var(--input-bg)' }}
                    className="w-full resize-y rounded-2xl border border-[var(--glass-border)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                  />
                </label>

                {feedback && (
                  <div
                    role="status"
                    style={{
                      color:
                        feedback.type === 'success'
                          ? 'var(--status-success-text)'
                          : 'var(--status-error-text)',
                      backgroundColor:
                        feedback.type === 'success'
                          ? 'var(--status-success-bg)'
                          : 'var(--status-error-bg)',
                      borderColor:
                        feedback.type === 'success'
                          ? 'var(--status-success-border)'
                          : 'var(--status-error-border)',
                    }}
                    className="flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-xs leading-relaxed sm:text-sm"
                  >
                    {feedback.type === 'success' ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    <span>{feedback.text}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--accent-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--accent-ink)] shadow-sm transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-1.5 rounded-md text-xs text-[var(--text-muted)] transition hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                  >
                    <Mail className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                    <span>{profile.email}</span>
                  </a>
                </div>
              </form>
            </GlassCard>
          </div>

          {/* Right: LinkedIn Spotlight Card + Quick Social Cards */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <GlassCard strong interactive className="flex-1 p-6 sm:p-7">
              <div className="flex h-full flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="apple-pill inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-[var(--accent-secondary)]">
                      <LinkedInIcon className="h-3.5 w-3.5" />
                      <span>LinkedIn Spotlight</span>
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {profile.location}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {profile.role}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                    {profile.availability}. Feel free to connect on LinkedIn for internships,
                    collaboration, or software engineering conversations.
                  </p>
                </div>

                <a
                  href={linkedinHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-secondary)] px-5 py-3 text-sm font-semibold text-[var(--accent-ink)] transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-secondary)] active:scale-[0.99]"
                >
                  <LinkedInIcon className="h-4 w-4" />
                  <span>Connect on LinkedIn</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </GlassCard>

            {/* GitHub & Direct Gmail Links */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {githubSocial && (
                <a
                  href={normalizeHref(githubSocial.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                >
                  <GlassCard interactive className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="apple-pill flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--text-primary)]">
                          <GitHubIcon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[var(--text-primary)]">
                            GitHub
                          </div>
                          <div className="truncate text-xs text-[var(--text-muted)]">
                            {githubSocial.handle}
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                    </div>
                  </GlassCard>
                </a>
              )}

              <a
                href={`mailto:${profile.email}`}
                className="block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              >
                <GlassCard interactive className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="apple-pill flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--accent-primary)]">
                        <Mail className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[var(--text-primary)]">
                          Direct Gmail
                        </div>
                        <div className="truncate text-xs text-[var(--text-muted)]">
                          {profile.email}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                  </div>
                </GlassCard>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
