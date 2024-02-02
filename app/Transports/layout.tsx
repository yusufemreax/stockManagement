import { ModalProvider } from "@/providers/model-provider";

export default function TransportsLayout({
    children,
}: {
    children: React.ReactNode; 
}) {
    return (
        <div className="p-4">
            
            {children}
        </div>)
}