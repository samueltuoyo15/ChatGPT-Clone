const Navbar = ({ isOpen }) => {
  return (
    <nav
      className={`h-full fixed w-52 top-0 left-0 bg-zinc-700 z-10 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:w-44`}
    >
      <div className="w-full h-full flex justify-center items-center text-white">
        Navbar
      </div>
    </nav>
  );
};

export default Navbar;
