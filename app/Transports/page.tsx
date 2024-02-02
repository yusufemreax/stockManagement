
import DoTable from './Table'
import { ScrollArea } from '@/components/ui/scroll-area'

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
  return(
      <ScrollArea className='h-full overflow-y-auto pr-5'>
        <DoTable/>
      </ScrollArea>
  )
}
