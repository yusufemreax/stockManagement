"use client"
import Sidebar from '@/components/Sidebar'
import { Label } from '@/components/ui/label';
import Image from 'next/image'
import { useEffect } from 'react';

export default function Home() {
  return (
    <div className="flex">
      <main className="p-4">
        <Label className='text-2xl font-bold'>LOHR İSTANBUL Stok Yönetimi</Label>
      </main>
    </div>
  )
}
