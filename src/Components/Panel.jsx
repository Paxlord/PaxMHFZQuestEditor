const Panel = ({children, onSave, onRevert}) => {

  return(
    <div className="relative h-full bg-zinc-500 bg-opacity-60 backdrop-blur-sm rounded p-4 shadow-lg">
      {children}

      <div className="flex justify-end items-center mt-3">
        {/* <span onClick={() => onRevert()}className="mr-4 text-gray-700 hover:underline cursor-pointer">Revert</span> */}
        <button onClick={() => onSave()} className="transition px-4 py-1 hover:shadow-md bg-green-500 shadow-sm rounded text-white hover:bg-green-600 active:bg-green-700">Save</button>
      </div>
    </div>
  )

}

export default Panel;