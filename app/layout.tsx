import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/providers/model-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Axoy Stok Takip',
  description: 'Stok Yönetiminizin Adresi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <ClerkProvider>
    <html lang="en">
      <body className={`${inter.className} flex flex-row justify-start h-screen`}>
       
        <Sidebar/>
        <main id='layoutMain' className="flex flex-row overflow-hidden">
          {children}
        </main>
      </body>
    </html>
    // </ClerkProvider>
  )
}
