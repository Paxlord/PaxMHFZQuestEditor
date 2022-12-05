import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
  const [numA, setNum1] = useState(0);
  const [numB, setNum2] = useState(0);

  const [res, setRes] = useState(null);

  const somme = async () => {
    setRes(await invoke("sum", {numA, numB}) );
  }

  return (
    <div className="flex flex-col gap-y-8 justify-center align-middle p-16">
      <h1 className="bg-red-400 text-center text-3xl">The Best calculator ever</h1>
      <div className="flex flex-row justify-center">
        <input type="numeral" className="border-4 border-indigo-400 rounded-lg" onChange={(e) => setNum1(parseInt(e.target.value)) } />
        +
        <input type="numeral" className="border-4 border-indigo-400 rounded-lg" onChange={(e) => setNum2(parseInt(e.target.value)) } />
      </div>
      <button onClick={() => somme()} className="bg-indigo-600 text-white rounded-md" >Calculate</button>
      <h1>{res}</h1>
    </div>
  );
}

export default App;
