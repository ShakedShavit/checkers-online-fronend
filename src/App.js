import AppRouter from "./components/router/AppRouter";
import socketio from './server/socketio';

function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
