import { FileText, Sliders, HelpCircle, Settings, DoorOpen } from "lucide-react";
interface NavBarModalProps {
  session: string | null; 
}

const NavBarModal: React.FC<NavBarModalProps> = ({session}) => {
  return (
    <div className="select-none w-full p-3 mb-4 bg-zinc-700 rounded shadow-2xl">
      {session}
      <div className="line-clamp-1 mb-4 text-white border-b border-zinc-500 pb-2">
      
      </div>

      {/* Options List */}
      <div>
        <ul className="space-y-1">
          <li className="flex items-center p-2 rounded hover:bg-zinc-600">
            <FileText className="inline mr-3 text-white" />
            <span className="text-white">My GPTs</span>
          </li>
          <li className="flex items-center p-2 rounded hover:bg-zinc-600">
            <Sliders className="inline mr-3 text-white" />
            <span className="text-white">Customize ChatGPT</span>
          </li>
          <li className="flex items-center p-2 rounded hover:bg-zinc-600">
            <HelpCircle className="inline mr-3 text-white" />
            <span className="text-white">Help and FAQ</span>
          </li>
          <li className="flex items-center p-2 rounded hover:bg-zinc-600">
            <Settings className="inline mr-3 text-white" />
            <span className="text-white">Settings</span>
          </li>
        </ul>
      </div>

      {/* Logout Section */}
      <div className="mt-4 border-t border-zinc-500 pt-2">
        <div
        onClick={() => {
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        window.location.href = "/"
        }}
        className="flex items-center p-2 rounded hover:bg-zinc-600">
          <DoorOpen className="inline mr-3 text-red-500" />
          <span className="text-red-500">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default NavBarModal;
