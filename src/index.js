import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import i18n from "./i18n";
import { unregister } from "./registerServiceWorker";
import "./index.css";
import "./fonts/index.css";

setTimeout(() => window.location.reload(true), 5 * 60 * 1000);

i18n().then(() => {
  ReactDOM.render(<BrowserRouter children={<Router/>}/>, document.querySelector("#root"));
});

unregister();
