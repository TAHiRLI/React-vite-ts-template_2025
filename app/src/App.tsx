import './App.css'

import { ColorModeProvider } from './context/colorMode.context';
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import store from './store/store';
import { router } from './router/router';

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme()`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}
function App() {

  return (
    <Provider store={store}>
      <ColorModeProvider>
        <RouterProvider router={router} />
      </ColorModeProvider>
    </Provider>
  )
}

export default App
