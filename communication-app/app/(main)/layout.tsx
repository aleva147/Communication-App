import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";


// Sve rute u /(main) ce imati NavigationSidebar, i ostatak stranice (children).
const MainLayout = async ({ children }: { children: React.ReactNode; }) => {
  return ( 
    <div className="h-full">
      <div className="hidden md:flex w-full h-[72px] z-30 fixed inset-x-0">
        <NavigationSidebar />
      </div>

      <main className="md:pt-[72px] w-full">
        {children}
      </main>
    </div>
   );
}
 

export default MainLayout;