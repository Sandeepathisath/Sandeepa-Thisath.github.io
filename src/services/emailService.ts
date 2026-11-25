import { profile } from '../data/profile'

export interface ContactPayload {
  name: string
  email: string
  message: string
}

export interface EmailSendResult {
  ok: boolean
  notConfigured?: boolean
  message: string
}

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

/**
 * Sends a contact form submission directly to Gmail via Web3Forms.
 * Configure VITE_WEB3FORMS_ACCESS_KEY inside `.env.local` (never committed).
 */
export async function sendContactMessage(
  payload: ContactPayload,
): Promise<EmailSendResult> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim()

  if (!accessKey) {
    return {
      ok: false,
      notConfigured: true,
      message:
        'Contact form key is not configured yet. Copy my Gmail address or email me directly while setting up VITE_WEB3FORMS_ACCESS_KEY in .env.local.',
    }
  }

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Portfolio Message from ${payload.name}`,
        from_name: payload.name,
        replyto: payload.email,
        email: payload.email,
        message: payload.message,
        to_email: profile.email,
      }),
    })

    const data = (await response.json()) as { success?: boolean; message?: string }

    if (!response.ok || !data.success) {
      return {
        ok: false,
        message: data.message ?? 'Could not send message right now. Please try again or copy my Gmail.',
      }
    }

    return {
      ok: true,
      message: 'Message sent! Thanks for reaching out—I will get back to you soon.',
    }
  } catch {
    return {
      ok: false,
      message: 'Network error while sending message. Please try again or copy my Gmail directly.',
    }
  }
}
