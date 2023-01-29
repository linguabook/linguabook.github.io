import { ColorModeScript } from "@chakra-ui/react";
import { Suspense } from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const rootElement = document.querySelector('#root');
if (!rootElement) throw new Error('Root element not found')

const root = createRoot(rootElement);

root.render(
  <>
    <ColorModeScript />
    <Suspense fallback={<div>loading...</div>}>
      <App />
    </Suspense>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
