import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import NavBarModal from './NavBarModal';
import { format, isToday, isYesterday, differenceInDays, differenceInYears, parseISO } from 'date-fns';

interface Conversation {
  _id: string;
  groupName: string;
  messages: { sender: string; message: string; timestamp: string }[];
}

interface User {
  id?: string;
  email?: string;
}

interface NavbarProps {
  conversations: Conversation[];
  isOpen: boolean;
  session: User | null;
  closeNav: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ conversations, isOpen, session, closeNav }) => {
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [toggleSettings, setToggleSettings] = useState<boolean>(false);
  
  const groupedConversations = useMemo(() => {
    const grouped: Record<string, Conversation[]> = { 
      Today: [],
      Yesterday: [],
      "Last 7 Days": [],
      "Last 30 Days": [],
      "Last Year": [],
      Older: [],
    };

    conversations.forEach((conv) => {
      const lastMessage = conv.messages[conv.messages.length - 1];
      const timestamp = lastMessage?.timestamp || null;
     if (timestamp) {
        const date = parseISO(timestamp);
        const daysAgo = differenceInDays(new Date(), date);

        if (isToday(date)) {
          grouped.Today.push(conv);
        } else if (isYesterday(date)) {
          grouped.Yesterday.push(conv);
        } else if (daysAgo <= 7) {
          grouped["Last 7 Days"].push(conv);
        } else if (daysAgo <= 30) {
          grouped["Last 30 Days"].push(conv);
        } else if (differenceInYears(new Date(), date) === 0) {
          grouped["Last Year"].push(conv);
        } else {
          grouped.Older.push(conv);
        }
      } else {
        grouped.Older.push(conv); 
      }
      
    });

    return grouped;
  }, [conversations]);

  return (
    <nav
      className={`h-full fixed w-60 top-0 left-0 bg-zinc-700 z-10 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:w-44`}
      aria-label="Sidebar"
    >
      <div className="flex flex-col h-full text-white">
        <button
          onClick={closeNav}
          className="md:hidden self-end p-2 m-2 text-lg bg-zinc-700 hover:bg-zinc-600 rounded-full"
          aria-label="Close navigation"
        >
          ✕
        </button>

        <header className="px-4 py-3 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">Conversations</h2>
        </header>

        <div className="flex-grow overflow-y-auto">
          {Object.entries(groupedConversations).map(([group, convs]) => (
            <section key={group} className="mb-4">
              <h3 className="px-4 py-2 text-sm font-medium text-zinc-400">{group}</h3>
              {convs.length > 0 ? (
                convs.map((conv) => (
                  <article key={conv._id} className="group">
                    <Link
                      to={`/c/${conv._id}`}
                      onClick={() => {
                        setCurrentConvId(conv._id);
                        closeNav();
                      }}
                      className={`px-4 py-3 flex justify-between items-center hover:bg-zinc-700 ${
                        currentConvId === conv._id ? "bg-zinc-700" : ""
                      }`}
                    >
                      <p className="truncate">{conv.groupName || "Untitled Conversation"}</p>
                      <button
                        className="p-2 text-zinc-400 hover:text-white focus:outline-none"
                        aria-label="More options"
                      >
                        ...
                      </button>
                    </Link>
                  </article>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-zinc-400">No conversations</p>
              )}
            </section>
          ))}
        </div>

        {toggleSettings && <NavBarModal session={session?.email || null} />}

        {session?.email ? (
          <footer
            onClick={() => setToggleSettings(!toggleSettings)}
            className="flex items-center px-4 py-3 bg-zinc-900 border-t border-zinc-700 cursor-pointer"
          >
            <img
              src="/user.png"
              alt="User Avatar"
              className="w-8 h-8 rounded-full mr-3"
            />
            <p className="truncate text-sm font-medium">{session.email.split("@")[0]}</p>
          </footer>
        ) : (
          <footer className="px-4 py-3 text-sm text-zinc-400">No user data</footer>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
