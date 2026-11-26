import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FileText, Loader2, Minus, Plus, X } from 'lucide-react'
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

const MIN_ZOOM = 0.75
const MAX_ZOOM = 1.5
const ZOOM_STEP = 0.15

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
    <div
      style={{ boxShadow: '0 12px 28px -12px var(--glass-shadow)' }}
      className="overflow-hidden rounded-xl bg-white ring-1 ring-black/10"
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}

export function CvModal({ isOpen, onClose }: CvModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fitWidth, setFitWidth] = useState(840)
  const [zoom, setZoom] = useState(1)

  // Keyboard Escape, +/- zoom shortcuts & body scroll lock
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
      setZoom(1)
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

  // Track inner container width so PDF fills nearly the full glass frame with minimal margin
  useEffect(() => {
    if (!isOpen) return

    const updateWidth = () => {
      if (!containerRef.current) return
      const style = window.getComputedStyle(containerRef.current)
      const padX =
        parseFloat(style.paddingLeft || '0') + parseFloat(style.paddingRight || '0')
      const available = containerRef.current.clientWidth - padX - 2
      setFitWidth(Math.max(240, Math.floor(available)))
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

  const targetWidth = Math.round(fitWidth * zoom)
  const zoomPercent = Math.round(zoom * 100)

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
          style={{ backgroundColor: 'var(--liquid-backdrop)' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 backdrop-blur-sm sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            className="apple-liquid-frame relative flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px]"
          >
            {/* Compact Liquid Glass Header */}
            <div
              style={{ backgroundColor: 'var(--liquid-header-bg)' }}
              className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--liquid-frame-border)] px-3.5 py-2.5 backdrop-blur-xl sm:px-5"
            >
              <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <FileText className="h-4 w-4 shrink-0 text-[var(--accent-primary)]" />
                <span className="truncate">{profile.name} — CV</span>
                {numPages > 0 && (
                  <span className="apple-pill hidden rounded-full px-2.5 py-0.5 text-xs font-normal text-[var(--text-secondary)] sm:inline-block">
                    {numPages} {numPages === 1 ? 'page' : 'pages'}
                  </span>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                {/* Clean Zoom Pill */}
                {pdfDoc && !loading && !error && (
                  <div className="apple-pill inline-flex items-center rounded-full p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        setZoom((prev) => Math.max(MIN_ZOOM, +(prev - ZOOM_STEP).toFixed(2)))
                      }
                      disabled={zoom <= MIN_ZOOM}
                      aria-label="Zoom out CV"
                      className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoom(1)}
                      title="Reset zoom to fit width"
                      className="min-w-[44px] cursor-pointer px-1 text-center text-[11px] font-medium text-[var(--text-primary)]"
                    >
                      {zoomPercent}%
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setZoom((prev) => Math.min(MAX_ZOOM, +(prev + ZOOM_STEP).toFixed(2)))
                      }
                      disabled={zoom >= MAX_ZOOM}
                      aria-label="Zoom in CV"
                      className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close CV preview"
                  className="apple-pill inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tightly Framed Liquid Glass Body Holding Solid Crisp White PDF Pages */}
            <div
              ref={containerRef}
              style={{ scrollbarGutter: 'stable' }}
              className="relative z-10 min-h-0 flex-1 overflow-auto p-2 sm:p-3"
            >
              {loading && (
                <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-3 text-sm text-[var(--text-secondary)]">
                  <Loader2 className="h-6 w-6 animate-spin text-[var(--accent-primary)]" />
                  <span>Loading CV preview...</span>
                </div>
              )}

              {error && !loading && (
                <div
                  style={{ color: 'var(--status-error-text)' }}
                  className="flex h-full min-h-[260px] items-center justify-center p-6 text-center text-sm"
                >
                  {error}
                </div>
              )}

              {!loading && !error && pdfDoc && (
                <div className="mx-auto flex w-fit flex-col items-center gap-2.5 sm:gap-3">
                  {Array.from({ length: numPages }, (_, index) => (
                    <PdfPageCanvas
                      key={index + 1}
                      pdf={pdfDoc}
                      pageNumber={index + 1}
                      targetWidth={targetWidth}
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
