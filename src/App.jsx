import React, { useState } from "react";
import "./App.css";
// import { translateWithGemini } from "./googleGeminiService"; // Import the function for Google Gemini translation
import { Configuration, OpenAIApi } from "openai";
import { BeatLoader } from "react-spinners";



const App = () => {
  const [formData, setFormData] = useState({ language: "Hindi", message: "" });
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [languageStats, setLanguageStats] = useState({});

  // const apiKey = import.meta.env.VITE_OPENAI_KEY;
  // if (!apiKey) {
  //   console.error("API key is missing. Please set the VITE_OPENAI_KEY environment variable.");
  // }

  // const configuration = new Configuration({
  //   apiKey: apiKey,
  // });
  // const openai = new OpenAIApi(configuration);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const translate = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('https://backend-vaeh.onrender.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send formData as JSON
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
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


  return (
    <div className="container">
      <h1>TRANSLATION</h1>

      <form onSubmit={handleOnSubmit}>
        <div className="choices">
          <input
            type="radio"
            id="hi"
            name="language"
            value="hi"
            checked={formData.language === "hi"}
            onChange={handleInputChange}
          />
          <label htmlFor="hi">Hindi</label>

          <input
            type="radio"
            id="es"
            name="language"
            value="es"
            checked={formData.language === "es"}
            onChange={handleInputChange}
          />
          <label htmlFor="es">Spanish</label>

          <input
            type="radio"
            id="ja"
            name="language"
            value="ja"
            checked={formData.language === "ja"}
            onChange={handleInputChange}
          />
          <label htmlFor="ja">Japanese</label>

          <input
            type="radio"
            id="fr"
            name="language"
            value="fr"
            defaultChecked={formData.language === "fr"}
            onChange={handleInputChange}
          />
          <label htmlFor="fr">french</label>


          <input
            type="radio"
            id="de"
            name="language"
            value="de"
            checked={formData.language === "de"}
            onChange={handleInputChange}
          />
          <label htmlFor="de">german</label>
        </div>

        <div className="choices">
          <input
            type="radio"
            id="gpt-3.5-turbo"
            name="model"
            value="gpt-3.5-turbo"
            checked={formData.model === "gpt-3.5-turbo"}
            onChange={handleInputChange}
          />
          <label htmlFor="gpt-3.5-turbo"> GPT   3.5 T</label>

          <input
            type="radio"
            id="gpt-4"
            name="model"
            value="gpt-4"
            checked={formData.model === "gpt-4"}
            onChange={handleInputChange}
          />
          <label htmlFor="gpt-4">GPT-4</label>

          <input
            type="radio"
            id="gpt-4-turbo"
            name="model"
            value="gpt-4-turbo"
            checked={formData.model === "gpt-4-turbo"}
            onChange={handleInputChange}
          />
          <label htmlFor="gpt-4-turbo">GPT-4 T</label>

          <input
            type="radio"
            id="gemini-1.5-pro"
            name="model"
            value="gemini-1.5-pro"
            checked={formData.model === "gemini-1.5-pro"}
            onChange={handleInputChange}
          />
          <label htmlFor="gemini-1.5-pro">Gemini-1.5 pro</label>

          <input
            type="radio"
            id="gemini-1.5-flash"
            name="model"
            value="gemini-1.5-flash"
            checked={formData.model === "g-1.5-flash"}
            onChange={handleInputChange}
          />
          <label htmlFor="gemini-1.5-flash">Gemini-1.5 flash</label>

          <input
            type="radio"
            id="deepl"
            name="model"
            value="deepl" 
            checked={formData.model === "deepl"}
            onChange={handleInputChange}
          />
          <label htmlFor="deepl">DeepL</label>

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



      <div className={`notification ${showNotification ? "active" : ""}`}>
        Copied to clipboard!
      </div>
    </div>
  );
};

export default App;