import Link from "next/link";

export function MainNav(){
    const routes = [
        {
            href:`/Storage`,
            label:'Storage'
        },
    ];

    return(
        <nav>
            {routes.map((route)=>(
                <Link key={route.href} href={route.href}>{route.label}</Link>

            ))}
        </nav>
    )
}