export const NumeralInput = ({label, defaultValue, onChange}) => {
  return(
    <div>
      <label className="block">{label}</label>
      <input type="numeral" defaultValue={defaultValue} onChange={(e) => onChange(e.target.value)} />
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