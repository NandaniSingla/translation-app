import React, { useState, useEffect } from "react";
import "./App.css";
import { BeatLoader } from "react-spinners";

// Constants
const Languages = [
  { label: "Bulgarian", value: "bg" },
  { label: "Czech", value: "cs" },
  { label: "Danish", value: "da" },
  { label: "Dutch", value: "nl" },
  { label: "English (American)", value: "en-US" },
  { label: "English (British)", value: "en-GB" },
  { label: "Estonian", value: "et" },
  { label: "Finnish", value: "fi" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Greek", value: "el" },
  { label: "Hungarian", value: "hu" },
  { label: "Indonesian", value: "id" },
  { label: "Italian", value: "it" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Latvian", value: "lv" },
  { label: "Lithuanian", value: "lt" },
  { label: "Polish", value: "pl" },
  { label: "Portuguese (European)", value: "pt-PT" },
  { label: "Portuguese (Brazilian)", value: "pt-BR" },
  { label: "Romanian", value: "ro" },
  { label: "Russian", value: "ru" },
  { label: "Slovak", value: "sk" },
  { label: "Slovenian", value: "sl" },
  { label: "Spanish", value: "es" },
  { label: "Swedish", value: "sv" },
  { label: "Turkish", value: "tr" },
  { label: "Ukrainian", value: "uk" },
  { label: "Chinese (Simplified)", value: "zh" },
  { label: "Hindi", value: "hi" },
];

const Models = [
  { label: "GPT-3.5 Turbo ", value: "gpt-3.5-turbo" },
  { label: "GPT-4", value: "gpt-4" },
  { label: "GPT-4 Turbo", value: "gpt-4-turbo" },
  { label: "Gemini 1.5 Pro", value: "gemini-1.5-pro" },
  { label: "Gemini 1.5 Flash", value: "gemini-1.5-flash" },
  { label: "DeepL", value: "deepl" },
  { label: "Gemini 1.5 Pro 002", value: "emini-1.5-pro-002" },
  { label: "Gemini 1.5 Flash 002", value: "gemini-1.5-flash-002" },
];

// App component
const App = () => {
  const [formData, setFormData] = useState({
    language: "",
    message: "",
    model: "",
  });
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [languageStats, setLanguageStats] = useState({});
  const [history, setHistory] = useState([]);
  const [favoriteTranslations, setFavoriteTranslations] = useState({});

  // Create a mapping for language names
  const languageNames = Object.fromEntries(
    Languages.map((lang) => [lang.value, lang.label])
  );

  // Load favorite translations from local storage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteTranslations");
    if (storedFavorites) {
      setFavoriteTranslations(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorite translations to local storage
  useEffect(() => {
    localStorage.setItem(
      "favoriteTranslations",
      JSON.stringify(favoriteTranslations)
    );
  }, [favoriteTranslations]);

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Handle translation
  const translate = async () => {
    setIsLoading(true);

    try {
      // Fetch request to backend through the proxy
      const response = await fetch("http://localhost:5000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send formData as JSON
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTranslation(data.translatedText);
      // Update language statistics
      setLanguageStats((prevStats) => ({
        ...prevStats,
        [formData.language]: (prevStats[formData.language] || 0) + 1,
      }));
      // Add to translation history
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          language: formData.language,
          message: formData.message,
          translation: data.translatedText,
        },
      ]);
    } catch (error) {
      setError("An error occurred while translating. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleOnSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.message) {
      setError("Please enter the message.");
      return;
    }

    if (!formData.language) {
      setError("Please select a language.");
      return;
    }

    if (!formData.model) {
      setError("Please select a model.");
      return;
    }

    // Call the translate function
    translate();
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard
      .writeText(translation)
      .then(() => displayNotification())
      .catch((err) => console.error("failed to copy: ", err));
  };

  // Display notification
  const displayNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Handle favorite translation
  const handleFavorite = () => {
    // Add to favorite translations
    setFavoriteTranslations((prevFavorites) => ({
      ...prevFavorites,
      [formData.language]: [
        ...(prevFavorites[formData.language] || []),
        { message: formData.message, translation: translation },
      ],
    }));
  };

  return (
    <div className="container">
      <h1>TRANSLATION</h1>
      <form onSubmit={handleOnSubmit}>
        <div className="dropdown">
          <label htmlFor="language">Select Lang:</label>
          <select
            name="language"
            id="language"
            value={formData.language}
            onChange={handleInputChange}
          >
            {Languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="dropdown">
          <label htmlFor="model">Select Model:</label>
          <select
            name="model"
            id="model"
            value={formData.model}
            onChange={handleInputChange}
          >
            {Models.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="message"
          placeholder="Type your message here.."
          value={formData.message}
          onChange={handleInputChange}
        ></textarea>

        {error && <div className="error">{error}</div>}

        <button type="submit">Translate</button>
      </form>
      <div className="translation">
        <div className="copy-btn" onClick={handleCopy}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1 .108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
            />
          </svg>
        </div>
        {isLoading ? <BeatLoader size={12} color={"red"} /> : translation}
      </div>

      <div className="language-stats">
        <h2>Language Stats</h2>
        <ul>
          {Object.entries(languageStats).map(([languageCode, count]) => (
            <li key={languageCode}>
              <span>
                {languageNames[languageCode] || languageCode}: {count}{" "}
                translations
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="translation-history">
        <h2>Translation History</h2>
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              <span>
                {languageNames[item.language] || item.language}: {item.message}{" "}
                {item.translation}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="favorite-translations">
        <h2>Favorite Translations</h2>
        <ul>
          {Object.entries(favoriteTranslations).map(
            ([languageCode, translations]) => (
              <li key={languageCode}>
                <span>
                  {languageNames[languageCode] || languageCode}:
                  <ul>
                    {translations.map((item, index) => (
                      <li key={index}>
                        <span>
                          {item.message} {item.translation}
                        </span>
                      </li>
                    ))}
                  </ul>
                </span>
              </li>
            )
          )}
        </ul>
      </div>

      <div className={`notification ${showNotification ? "active" : ""}`}>
        Copied to clipboard!
      </div>

      <button onClick={handleFavorite}>Add to Favorites</button>
    </div>
  );
};

export default App;
