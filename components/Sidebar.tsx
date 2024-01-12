// components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {

  const routes = [
    {
      href: "/",
      label: "Ana Sayfa"
    },
    {
      href: "/Storage",
      label: "Ambar"
    },{
      href: "/RawMaterials",
      label: "Hammaddeler"
    },{
      href: "/Transports",
      label: "Nakliyeler"
    },
    {
      href: "/Suppliers",
      label: "Tedarikçiler"
    },
    {
      href: "/Productions",
      label: "Üretimler"
    },
    {
      href: "/Components",
      label: "Parçalar"
    },
  ]
  return (
    <aside className="bg-gray-800 text-white p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Stok Yönetimi</h2>
      </div>
      <nav>
        <ul>
          {routes.map((route)=>(
            <li key={route.href} className="mb-2">
              <Link href={route.href} className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
                {route.label}
              </Link>
            </li>
          ))}
          
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
