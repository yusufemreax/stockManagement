
import { ScrollArea } from '@/components/ui/scroll-area'
import Table from './Table'
export default async function Home() {
  return(
    <ScrollArea className='h-full overflow-y-auto pr-5'>
        <Table/>
      </ScrollArea>
  )
}
