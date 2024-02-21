import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";


// Sve rute u /(main) ce imati NavigationSidebar, i ostatak stranice (children).
const MainLayout = async ({ children }: { children: React.ReactNode; }) => {
  return ( 
    <div className="h-full">
      <div className="w-full h-[72px] z-30 fixed inset-x-0">
        <NavigationSidebar />
      </div>

      {/* pt-[72px]  -- da se ne bi sidebar uz gornju ivicu ekrana iscrtavao preko chat-a */}
      <main className="h-full pt-[72px] w-full">
        {children}
      </main>
    </div>
   );
}
 

export default MainLayout;