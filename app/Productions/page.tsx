
import { DataTable } from '@/components/DataTable'
import { Table } from '@/components/ui/table'
import Image from 'next/image'
import { columns } from './columns'
import https from 'https'
import axios, { AxiosResponse } from 'axios'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import DoTable from './Table'
import { ScrollArea } from '@/components/ui/scroll-area'
const agent = new https.Agent({  
  rejectUnauthorized: false
});

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
  return(
    <ScrollArea className='h-full overflow-y-auto pr-5'>
        <DoTable/>
      </ScrollArea>
  )
}
