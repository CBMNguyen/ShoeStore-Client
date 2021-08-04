import Header from "components/Header";
import NotFound from "components/NotFound";
import Home from "features/Home";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
