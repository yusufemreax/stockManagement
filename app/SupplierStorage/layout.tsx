import { ModalProvider } from "@/providers/model-provider";

export default function StorageLayout({
    children,
}: {
    children: React.ReactNode; 
}) {
    return (
        <div className="p-4">
            
            {children}
        </div>)
}