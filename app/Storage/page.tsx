import { DataTable } from '@/components/DataTable'
import { Table } from '@/components/ui/table'
import Image from 'next/image'
import { columns} from './columns'
import https from 'https'
import axios, { AxiosResponse } from 'axios'
import { Button } from '@/components/ui/button'
const agent = new https.Agent({  
  rejectUnauthorized: false
});
const getData = async (): Promise<Storage[]> => {
  try {
    const response: AxiosResponse<Storage[]> = await axios.get('https://localhost:7290/Storage/GetStorageDetail',{httpsAgent: agent});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default async function Home() {
  const data: Storage[] = await getData();
  return (
    <div className='flex'>
        <DataTable columns={columns} data={data}/>
    </div>
  )
}
