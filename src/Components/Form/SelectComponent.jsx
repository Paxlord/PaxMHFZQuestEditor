const SelectComponent = ({options, defaultValue, title, onChange}) => {
  return(
    <div>
      <p>{title}</p>
      <select value={defaultValue} onChange={(e) => onChange(e.target.value)} >
        {
          options.map((option) => {
            return <option value={option.value}>{option.label}</option>
          })
        }
      </select>
    </div>
  )
}

export default SelectComponent;