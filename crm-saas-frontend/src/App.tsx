import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isAuth] = useState(!!localStorage.getItem("token"));
  const [isLogin, setIsLogin] = useState(true);

  if (isAuth) return <Dashboard />;

  return isLogin ? (
    <Login switchToRegister={() => setIsLogin(false)} />
  ) : (
    <Register switchToLogin={() => setIsLogin(true)} />
  );
}

export default App;