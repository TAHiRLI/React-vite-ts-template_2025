import { Select, MenuItem, FormControl } from '@mui/material';
import { useEffect } from 'react';
import ru from "../../assets/images/ru.png";
import en from "../../assets/images/en.png";
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

// Define option type
interface LangOption {
  image: string;
  value: string;
  text: string;
}

const LangSelect = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Define available languages
  const options: LangOption[] = [
    { image: ru, value: "ru", text: "Russian" },
    { image: en, value: "en", text: "English" },
  ];
  
  // Default language
  const defaultLang = "en";
  
  // Function to get language from localStorage
  const getStoredLang = (): string => {
    return localStorage.getItem('selectedLanguage') || defaultLang;
  };
  
  // Function to set language in localStorage
  const setStoredLang = (lang: string): void => {
    localStorage.setItem('selectedLanguage', lang);
  };
  
  // Function to get language from URL
  const getUrlLang = (): string | null => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('lang');
  };
  
  // Function to update URL with language parameter
  const updateUrlLang = (lang: string): void => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('lang', lang);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    }, { replace: true });
  };
  
  // Initialize language based on URL or localStorage
  useEffect(() => {
    const urlLang = getUrlLang();
    const storedLang = getStoredLang();
    
    if (urlLang) {
      // Check if the URL language is supported
      const isSupported = options.some(option => option.value === urlLang);
      if (isSupported) {
        // If URL language is supported, use it and update localStorage
        i18n.changeLanguage(urlLang);
        setStoredLang(urlLang);
      } else {
        // If URL language is not supported, use default and update URL
        i18n.changeLanguage(defaultLang);
        setStoredLang(defaultLang);
        updateUrlLang(defaultLang);
      }
    } else {
      // If no URL language, use localStorage language and update URL
      i18n.changeLanguage(storedLang);
      updateUrlLang(storedLang);
    }
  }, [location.search]);
  
  // Handle language change
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    const newLang = event.target.value as string;
    i18n.changeLanguage(newLang);
    setStoredLang(newLang);
    updateUrlLang(newLang);
  };

  // Find current language option with non-null assertion
  const getCurrentLangOption = (): LangOption => {
    const currentLang = i18n.language;
    // We know one of these will always return a value because we have a default option
    const option = options.find(option => option.value === currentLang) || 
                  options.find(option => option.value === defaultLang) || 
                  options[0]; // Fallback to first option as last resort
    return option;
  };
  
  return (
    <FormControl variant="standard" size="small">
      <Select
        value={i18n.language}
        onChange={handleChange}
        className="lang-select"
        renderValue={() => {
          const selectedOption = getCurrentLangOption();
          return (
            <div className="flex items-center">
              <img src={selectedOption.image} alt={selectedOption.text} width={25} />
              <span className="ms-3 text-sm">{selectedOption.text}</span>
            </div>
          );
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <div className="flex items-center">
              <img src={option.image} alt={option.text} width={25} />
              <span className="ms-3 text-sm">{option.text}</span>
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LangSelect;