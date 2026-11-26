export interface ContactPayload {
  name: string
  email: string
  message: string
}

export interface EmailSendResult {
  ok: boolean
  message: string
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdegbjoy'

interface FormspreeResponse {
  ok?: boolean
  error?: string
  errors?: Array<{ field?: string; message?: string }>
}

/**
 * Sends a contact form submission directly to Gmail via Formspree.
 */
export async function sendContactMessage(
  payload: ContactPayload,
): Promise<EmailSendResult> {
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        _replyto: payload.email,
        _subject: `Portfolio Message from ${payload.name}`,
        message: payload.message,
      }),
    })

    const rawText = await response.text()
    let data: FormspreeResponse = {}
    if (rawText) {
      try {
        data = JSON.parse(rawText) as FormspreeResponse
      } catch {
        data = {}
      }
    }

    if (!response.ok) {
      const errorList = data.errors
        ?.map((entry) => entry.message)
        .filter(Boolean)
        .join(', ')
      return {
        ok: false,
        message:
          errorList ||
          data.error ||
          `Could not send message right now (${response.status}). Please try again or copy my Gmail.`,
      }
    }

    return {
      ok: true,
      message: 'Message sent! Thanks for reaching out - I will get back to you soon.',
    }
  } catch {
    return {
      ok: false,
      message: 'Network error while sending message. Please try again or copy my Gmail directly.',
    }
  }
}
