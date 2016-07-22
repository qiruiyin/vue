import * as React from "react";
import * as ReactDOM from "react-dom";

import { HelloComponent } from "./Hello";
import { HomeComponent } from "./home";

// ReactDOM.render(
//     <HelloComponent compiler="TypeScript" framework="React" />,
//     document.getElementById("demo")
// );

ReactDOM.render(
    <HomeComponent />,
    document.querySelector('.container')
);