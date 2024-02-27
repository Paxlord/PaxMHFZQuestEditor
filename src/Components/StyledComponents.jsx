import encartsvg from "../assets/mhfencart.svg";

export const PanelTitle = ({ title }) => {
  return (
    <div className="relative flex items-center mb-8">
      <img
        src={encartsvg}
        className="absolute block m-auto -z-10 top-0 left-0 w-80 -translate-x-4"
      />
      <h1 className=" text-xl font-monsterhunter text-white">{title}</h1>
    </div>
  );
};

export const BasicButton = ({ disabled, children, onClick }) => {
  const activeStyle =
    "transition px-4 py-1 hover:shadow-md bg-green-500 shadow-sm rounded text-white hover:bg-green-600 active:bg-green-700";
  const disabledStyle =
    "transition px-4 py-1 bg-zinc-400 shadow-sm rounded text-white focus:outline-none";

  return (
    <button
      disabled={disabled}
      className={disabled ? disabledStyle : activeStyle}
      onClick={() => onClick()}
    >
      {children}
    </button>
  );
};
