import React, { useState } from "react";
import "./App.css";
import { BeatLoader } from "react-spinners";

const App = () => {
  const [formData, setFormData] = useState({ language: "", message: "" });
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [languageStats, setLanguageStats] = useState({});

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const translate = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://translation-app-912s.onrender.com/api/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Send formData as JSON
        }
      );

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
    } catch (error) {
      setError("An error occurred while translating. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

    // Call the translate function
    translate();
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(translation)
      .then(() => displayNotification())
      .catch((err) => console.error("failed to copy: ", err));
  };

  const displayNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

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
    { label: "Hindi", value: "hi" }, // Add Hindi manually
  ];
  // Create a mapping for language names
  const languageNames = Object.fromEntries(
    Languages.map((lang) => [lang.value, lang.label])
  );

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
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            <option value="deepl">DeepL</option>
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
              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
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

      <div className={`notification ${showNotification ? "active" : ""}`}>
        Copied to clipboard!
      </div>
    </div>
  );
};

export default App;
