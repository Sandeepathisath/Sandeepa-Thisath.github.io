import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FileText, Loader2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { profile } from '../../data/profile'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

interface CvModalProps {
  isOpen: boolean
  onClose: () => void
}

interface PdfPageCanvasProps {
  pdf: PDFDocumentProxy
  pageNumber: number
  targetWidth: number
}

function PdfPageCanvas({ pdf, pageNumber, targetWidth }: PdfPageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let active = true
    let renderTask: RenderTask | null = null

    const renderPage = async () => {
      const canvas = canvasRef.current
      if (!canvas || targetWidth <= 0) return

      try {
        const page = await pdf.getPage(pageNumber)
        if (!active) return

        const baseViewport = page.getViewport({ scale: 1 })
        const fitScale = targetWidth / baseViewport.width
        const dpr = Math.min(window.devicePixelRatio || 1, 2)

        const displayViewport = page.getViewport({ scale: fitScale })
        const renderViewport = page.getViewport({ scale: fitScale * dpr })

        const context = canvas.getContext('2d')
        if (!context) return

        canvas.width = Math.floor(renderViewport.width)
        canvas.height = Math.floor(renderViewport.height)
        canvas.style.width = `${Math.floor(displayViewport.width)}px`
        canvas.style.height = `${Math.floor(displayViewport.height)}px`

        renderTask = page.render({
          canvas,
          canvasContext: context,
          viewport: renderViewport,
        })

        await renderTask.promise
      } catch (err) {
        if (err instanceof Error && err.name === 'RenderingCancelledException') {
          return
        }
      }
    }

    void renderPage()

    return () => {
      active = false
      renderTask?.cancel()
    }
  }, [pdf, pageNumber, targetWidth])

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/40 ring-1 ring-white/15">
      <canvas ref={canvasRef} className="block max-w-full" />
    </div>
  )
}

export function CvModal({ isOpen, onClose }: CvModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageWidth, setPageWidth] = useState(720)

  // Keyboard Escape & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  // Load PDF bytes via virtual JS module (bypasses download-manager interception)
  useEffect(() => {
    if (!isOpen) return

    let cancelled = false
    let loadingTask: PDFDocumentLoadingTask | null = null
    let loadedDoc: PDFDocumentProxy | null = null

    const loadPdf = async () => {
      setLoading(true)
      setError(null)
      try {
        const { default: base64 } = await import('virtual:cv-pdf')
        if (cancelled) return

        if (!base64) {
          throw new Error('CV PDF file was not found in public/cv/.')
        }

        const binary = window.atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i)
        }

        loadingTask = pdfjsLib.getDocument({ data: bytes })
        loadedDoc = await loadingTask.promise
        if (cancelled) {
          void loadingTask.destroy()
          return
        }

        setPdfDoc(loadedDoc)
        setNumPages(loadedDoc.numPages)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Unable to display CV PDF.')
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadPdf()

    return () => {
      cancelled = true
      void loadedDoc?.cleanup()
      void loadingTask?.destroy()
      setPdfDoc(null)
      setNumPages(0)
    }
  }, [isOpen])

  // Track responsive container width for sharp page scaling on desktop, tablet & mobile
  useEffect(() => {
    if (!isOpen) return

    const updateWidth = () => {
      if (!containerRef.current) return
      const horizontalPadding = window.innerWidth < 640 ? 24 : 48
      const available = containerRef.current.clientWidth - horizontalPadding
      setPageWidth(Math.max(240, Math.min(available, 780)))
    }

    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    window.addEventListener('resize', updateWidth, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateWidth)
    }
  }, [isOpen])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Curriculum Vitae Preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            className="apple-glass-strong flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl"
          >
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/12 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-primary)]">
                <FileText className="h-4 w-4 text-[var(--accent-primary)]" />
                <span>{profile.name} — CV</span>
                {numPages > 0 && (
                  <span className="apple-pill rounded-full px-2.5 py-0.5 text-xs font-normal text-[var(--text-secondary)]">
                    {numPages} {numPages === 1 ? 'page' : 'pages'}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close CV preview"
                className="apple-pill inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-white/15 hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Multi-Page Canvas Viewer */}
            <div
              ref={containerRef}
              className="min-h-0 flex-1 overflow-y-auto bg-[#090d14]/70 px-3 py-5 sm:px-6 sm:py-6"
            >
              {loading && (
                <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-3 text-sm text-[var(--text-secondary)]">
                  <Loader2 className="h-6 w-6 animate-spin text-[var(--accent-primary)]" />
                  <span>Loading CV preview...</span>
                </div>
              )}

              {error && !loading && (
                <div className="flex h-full min-h-[260px] items-center justify-center p-6 text-center text-sm text-rose-300">
                  {error}
                </div>
              )}

              {!loading && !error && pdfDoc && (
                <div className="mx-auto flex flex-col items-center gap-5">
                  {Array.from({ length: numPages }, (_, index) => (
                    <PdfPageCanvas
                      key={index + 1}
                      pdf={pdfDoc}
                      pageNumber={index + 1}
                      targetWidth={pageWidth}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
