export const NumeralInput = ({label, defaultValue, onChange}) => {
  return(
    <div>
      <label className="block">{label}</label>
      <input className="bg-opacity-0 bg-black rounded text-white border-violet-900 focus:ring-violet-500 focus:border-violet-500"  type="number" value={defaultValue} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

export const CheckBoxInput = ({label, defaultValue, onChange}) => {
  return(
    <div>
      <label>{label}</label>
      <input className="bg-gray-400 rounded h-5 w-5 text-violet-400 focus:ring-violet-600 focus:border-none" type="checkbox" checked={defaultValue} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

export const TextArea = ({label, defaultValue, onChange, rows}) => {
  return(
    <div>
      <label className="block">{label}</label>
      <textarea value={defaultValue} onChange={(e) => onChange(e.target.value)} rows={rows} cols={35} />
    </div>
  )
}