const Panel = ({children, onSave, onRevert}) => {

  return(
    <div className="h-full bg-gray-500 rounded p-4">
      {children}

      <div className="flex justify-end items-center mt-3">
        <span className="mr-4 text-gray-700 hover:underline cursor-pointer">Revert</span>
        <button onClick={() => onSave()} className="transition px-4 py-1 hover:shadow-md bg-violet-400 shadow-sm rounded text-white hover:bg-violet-500 active:bg-violet-600">Save</button>
      </div>
    </div>
  )

}

export default Panel;