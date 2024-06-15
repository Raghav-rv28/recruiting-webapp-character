import "./App.css";
import { useState } from "react";
import Character from "./character";
function App() {
  const [characters, setCharacters] = useState(1);
  return (
    <div className="App-section">
      <div className="navbar">
        <button
          onClick={() => {
            setCharacters((prev) => prev + 1);
          }}
        >
          Add New Character
        </button>
      </div>
      <div>
        {Array.from({ length: characters }, (_, index) => index + 1).map(
          (val) => {
            console.log(val);
            return (
              <div key={val}>
                <Character val={val} />
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

export default App;
