"use client"
import Sidebar from '@/components/Sidebar'
import { useRawMaterialModal } from '@/hooks/use-rawMaterial-modal'
import Image from 'next/image'
import { useEffect } from 'react';

export default function Home() {
  return (
    <div className="flex">
      <main className="p-4">
        <h1 className="text-2xl font-bold text-blue-500">Merhaba, Next.js ve Tailwind CSS!</h1>
        <p className="text-gray-700 mt-2">Bu bir örnek uygulamadır.</p>
      </main>
    </div>
  )
}
