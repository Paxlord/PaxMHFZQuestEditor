const Panel = ({children}) => {

  return(
    <div className="h-full bg-gray-500 rounded p-4">
      {children}

      <div className="flex justify-end items-center mt-3">
        <span className="mr-4 text-gray-700 hover:underline cursor-pointer">Revert</span>
        <button className="px-4 py-1 bg-violet-400 shadow-sm rounded text-white">Save</button>
      </div>
    </div>
  )

}

export default Panel;