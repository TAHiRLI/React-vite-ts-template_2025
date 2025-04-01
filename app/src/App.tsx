import { ColorModeProvider } from "./context/colorMode.context";
import './App.css'

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
    <>
      <ColorModeProvider>
        REACT-VITE-TS-TEMPLATE_2025
      </ColorModeProvider> 
    </>
  )
}

export default App
