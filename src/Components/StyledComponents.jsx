import encartsvg from '../assets/mhfencart.svg';

export const PanelTitle = ({title}) => {
  return (
    <div className="relative flex items-center mb-8">
          <img src={encartsvg} className="absolute block m-auto -z-10 top-0 left-0 w-80 -translate-x-4" />
          <h1 className=" text-xl font-monsterhunter text-white">{title}</h1>
    </div>
  )
}