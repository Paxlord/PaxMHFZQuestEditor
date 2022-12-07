export const NumeralInput = ({label, defaultValue}) => {
  return(
    <div>
      <label>{label}</label>
      <input type="numeral" defaultValue={defaultValue} />
    </div>
  )
}