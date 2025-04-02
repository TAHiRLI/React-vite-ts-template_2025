import './App.css'

import { ColorModeProvider } from './context/colorMode.context';
import { Provider } from "react-redux";
import store from './store/store';

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
        REACT-VITE-TS-TEMPLATE_2025
      </ColorModeProvider>
    </Provider>
  )
}

export default App
