import { useEffect, useState } from "react";
import Button from "./Button";

function App() {
  const [counter,setValue] = useState(0);
  const onClick=()=>setValue((prev)=>prev+1);
  
  const onlyOneLoad=()=>{
    console.log("counter changed")
  }
  console.log("first loaded");
  useEffect(onlyOneLoad,[counter]);
  return (
    <div className="App">
      <h1>{counter}</h1>
      <Button text={"this is button"} />
      <button onClick={onClick}>counter up!</button>
    </div>
  );
}

export default App;
