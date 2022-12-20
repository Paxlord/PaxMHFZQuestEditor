export const NumeralInput = ({label, defaultValue, onChange}) => {
  return(
    <div>
      <label className="block">{label}</label>
      <input type="number" value={defaultValue} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

export const CheckBoxInput = ({label, defaultValue, onChange}) => {
  return(
    <div>
      <label>{label}</label>
      <input type="checkbox" checked={defaultValue} onChange={(e) => onChange(e.target.value)} />
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