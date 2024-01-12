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
const getData = async (): Promise<Supplier[]> => {
  try {
    const response: AxiosResponse<Supplier[]> = await axios.get('https://localhost:7290/Storage/GetStorageDetail',{httpsAgent: agent});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default async function Home() {
  const data: Supplier[] = await getData();
  return (
    <div className='flex'>
        <DataTable columns={columns} data={data}/>
    </div>
  )
}
