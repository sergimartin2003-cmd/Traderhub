// Utility helpers for Norte (TraderHub)

/**
 * Merges class names, filtering out falsy values.
 * Lightweight replacement for clsx + tailwind-merge.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Formats a date using Intl.DateTimeFormat.
 */
export function formatDate(
  date: string | Date,
  locale = 'es-ES',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, options).format(d)
}

/**
 * Generates a random URL-safe ID (16 hex chars).
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

/**
 * Truncates a string to maxLen characters, appending '…' if needed.
 */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen - 1) + '…'
}

/**
 * Returns the initials of a name (up to 2 characters).
 * e.g. "John Doe" → "JD", "Maria" → "MA"
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Returns a human-readable relative time string.
 * e.g. "hace 3 minutos", "hace 2 días"
 */
export function timeAgo(date: string | Date, locale = 'es-ES'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = Date.now()
  const diffMs = now - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (diffSec < 60) return rtf.format(-diffSec, 'second')
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return rtf.format(-diffMin, 'minute')
  const diffHrs = Math.floor(diffMin / 60)
  if (diffHrs < 24) return rtf.format(-diffHrs, 'hour')
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays < 30) return rtf.format(-diffDays, 'day')
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return rtf.format(-diffMonths, 'month')
  const diffYears = Math.floor(diffMonths / 12)
  return rtf.format(-diffYears, 'year')
}
