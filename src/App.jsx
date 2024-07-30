import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
