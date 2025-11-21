import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hairstyling Booking Platform',
  description: 'Book your mobile hairstyling appointments online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
