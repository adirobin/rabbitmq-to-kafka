import logo from './logo.svg';
import './App.css';
import VesselList from "./components/VesselList";
import AddVessel from "./components/AddVessel";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
            <VesselList />
        </div>
        <div>
            <AddVessel />
        </div>
      </header>
    </div>
  );
}

export default App;
