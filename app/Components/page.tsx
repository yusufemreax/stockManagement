
import Table from './Table'
import { ScrollArea } from '@/components/ui/scroll-area'
export default async function Home() {
  return(
    <ScrollArea className='h-full overflow-y-auto pr-5'>
      <Table/>
    </ScrollArea>
  )
}
