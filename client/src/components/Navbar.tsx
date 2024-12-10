import {useState} from "react";
const Navbar = ({conversation, isOpen, session, closeNav}) => {
  const [currentConvId, setCurrentConvId] = useState<boolean>(null);

  const handleConversationSelect = (id) => {
    setCurrentConvId(id);
    setIsOpen(false);
  };
   return (
    <nav
      className={`h-full font-sans fixed w-52 top-0 left-0 bg-zinc-700 z-10 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:w-44`}
    >
      <div className="w-full h-full flex flex-col text-white">
        <button
          onClick={closeNav}
          className="md:hidden self-end p-2 text-lg text-white bg-zinc-600 hover:bg-zinc-500 rounded-full m-2"
        >
          ✕
        </button>
        <div className="flex-grow flex p-3"><strong>Today</strong></div>
        {conversation.map((conv) => (
         <div key={conv.id}>
           <span>{conv}</span>
         </div>
        ))}
      {session.map((se) => (
         <div key={session[0].id} className="self-end flex w-full block justify-evenly items-center mb-5">
        <img src="/user.png" className="w-10 rounded-full" />
        <p>{session[0].email.split("@")[0]}</p>
        </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
