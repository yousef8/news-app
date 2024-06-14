import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <div className="container-lg">
        <h1>Hello World</h1>
      </div>
    </>
  );
}

export default App;
