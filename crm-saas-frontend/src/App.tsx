import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const isAuth = !!localStorage.getItem("token");

  return isAuth ? <Dashboard /> : <Login />;
}

export default App;