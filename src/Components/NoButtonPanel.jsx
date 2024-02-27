const NoButtonPanel = ({ children }) => {
  return (
    <div className="relative h-full bg-zinc-500 bg-opacity-60 backdrop-blur-sm rounded p-4 shadow-lg">
      {children}
    </div>
  );
};

export default NoButtonPanel;
