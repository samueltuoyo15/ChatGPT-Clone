const Navbar = ({ isOpen, closeNav}) => {
  return (
    <nav
      className={`h-full fixed w-52 top-0 left-0 bg-zinc-700 z-10 transition-transform ${
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
        <div className="flex-grow flex justify-center items-center">Navbar</div>
      </div>
    </nav>
  );
};

export default Navbar;
