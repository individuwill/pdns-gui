import Image from 'next/image'
import ZoneControl from './_components/zone';
import PDNSAPI from '../src/pdns';

export default async function Home() {
  const pdnsApi = new PDNSAPI(
    process.env.PDNS_PROTOCOL!,
    process.env.PDNS_HOST!,
    process.env.PDNS_PORT!,
    process.env.PDNS_API_KEY!
    );

  const _allServers = await pdnsApi.getAll();
  const allServers = JSON.parse(JSON.stringify(_allServers));
  
  return (
    <div>
      <div className="navbar bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand">PowerDNS GUI</span>
        </div>
      </div>
      
      <div className="container">
        <ZoneControl servers={allServers} />
      </div>
      <div className="bg-info">
        <div className="container-fluid">
          <span>Copyright 2013 </span><a href="mailto:wsmith85@gmail.com">Contact</a>
        </div>
      </div>
    </div>
  )
}
