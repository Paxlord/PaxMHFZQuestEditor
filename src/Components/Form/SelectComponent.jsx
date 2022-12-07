const SelectComponent = ({options, defaultValue, title}) => {
  return(
    <div>
      <p>{title}</p>
      <select value={defaultValue}>
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