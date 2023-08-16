import {useState} from 'react';
import { BiPaste } from 'react-icons/bi';

export const NumeralInput = ({label, defaultValue, onChange, size}) => {

  const sizeToUnit = (size) => {
    switch(size){
      case "sm":
        return "w-16";
      case "xs":
        return "w-24";
      case "md":
        return "w-36";
      case "lg":
        return "w-48";
      case "xl":
        return "w-56";
      case "full":
        return "w-full";
      default:
        return "w-36";
    }
  }

  const PasteFromClipboard = async () => {
    onChange(await navigator.clipboard.readText());
  }

  return(
    <div className={`${size === "full"?"flex-1":""}`}>
      <div className='flex justify-between items-center'>
        <label className="block text-gray-100">{label}</label>
        <BiPaste 
          className='text-white hover:text-green-500 hover:cursor-pointer opacity-30 hover:opacity-100 transition'
          onClick={() => PasteFromClipboard()}
        />
      </div>
      <input size={1} className={`shadow-sm border-none text-gray-100 bg-zinc-300 bg-opacity-30 rounded focus:shadow-lg focus:ring-green-500 focus:border-green-500 ${sizeToUnit(size)} `}  type="number" value={defaultValue} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

export const TextInput = ({label, defaultValue, onChange, size}) => {

  const sizeToUnit = (size) => {
    switch(size){
      case "sm":
        return "w-16";
      case "xs":
        return "w-24";
      case "md":
        return "w-36";
      case "lg":
        return "w-48";
      case "full":
        return "w-full";
      default:
        return "w-36";
    }
  }

  return(
    <div className={`${size === "full"?"flex-1":""}`}>
      <label className="block text-gray-100">{label}</label>
      <input size={1} className={`shadow-sm border-none text-gray-100 bg-zinc-300 bg-opacity-30 rounded focus:shadow-lg focus:ring-green-500 focus:border-green-500 ${sizeToUnit(size)} `}  type="text" value={defaultValue} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

export const CheckBoxInput = ({label, defaultValue, onChange}) => {
  return(
    <div className="">
      <input className="bg-zinc-300 bg-opacity-30  rounded h-5 w-5 text-green-600 focus:ring-green-600 focus:border-none" type="checkbox" checked={defaultValue} onChange={(e) => onChange(e.target.value)} />
      <label className="text-gray-100 ml-2">{label}</label>
    </div>
  )
}

export const TextArea = ({label, defaultValue, onChange, rows, chara_count}) => {

  const [nbChara, setNbChara] = useState(defaultValue?defaultValue.length:null);

  return(
    <div>
      <div className='flex gap-x-2 mb-1'>
        <label className="block text-white">{label}</label>
        {chara_count && <p className='text-green-400 font-light italic'>({nbChara} characters)</p>}
      </div>
      <textarea className={`shadow-sm border-none text-gray-100 bg-zinc-300 bg-opacity-30 rounded focus:shadow-lg focus:ring-green-500 focus:border-green-500`} onChange={(e) => {onChange(e.target.value); setNbChara(e.target.value.length)}} value={defaultValue} rows={rows} cols={35} />
    </div>
  )
}