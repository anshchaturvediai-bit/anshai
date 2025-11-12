import React, { useState, useCallback } from 'react';
import { generateWebsite, updateWebsite } from './services/geminiService';
import { ResultDisplay } from './components/ResultDisplay';
import { SparklesIcon, RefreshCcwIcon } from './components/icons';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isUpdateMode = generatedHtml.length > 0;

  const examplePrompts = [
    "A portfolio website for a photographer named Jane Doe, with a gallery section and a contact form.",
    "A landing page for a new mobile app called 'TaskFlow', highlighting its features and with a download button.",
    "A simple blog layout with a header, a list of posts with placeholder content, and a footer.",
    "A product page for a futuristic smartwatch, with a hero section, feature list, and a 'Buy Now' button."
  ];

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim()) {
      setError(`Please enter a ${isUpdateMode ? 'description of the changes' : 'description for your website'}.`);
      return;
    }
    setIsLoading(true);
    setError(null);
    if (!isUpdateMode) {
        setGeneratedHtml('');
    }

    try {
      let html;
      if (isUpdateMode) {
          html = await updateWebsite(prompt, generatedHtml);
      } else {
          html = await generateWebsite(prompt);
      }
      setGeneratedHtml(html);
      setPrompt(''); // Clear prompt on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isUpdateMode, generatedHtml]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };
  
  const handleExampleClick = (example: string) => {
      setPrompt(example);
  };

  const handleStartOver = () => {
      setGeneratedHtml('');
      setPrompt('');
      setError(null);
      setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <header className="w-full text-center py-6 border-b border-gray-700/50 shadow-lg bg-gray-900/80 backdrop-blur-sm">
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
          Anshai
        </h1>
        <p className="text-gray-400 mt-1">Generate & Iterate on a complete website with a single prompt.</p>
      </header>
      
      <main className="flex-grow flex flex-col p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-md">
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="prompt" className="block text-lg font-semibold text-gray-300">
                 {isUpdateMode ? 'Describe the changes you want to make:' : 'Describe the website you want to create:'}
                </label>
                {isUpdateMode && (
                    <button onClick={handleStartOver} className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-gray-300 bg-gray-700/50 rounded-md hover:bg-gray-600/50 transition-colors">
                        <RefreshCcwIcon className="w-4 h-4" />
                        Start Over
                    </button>
                )}
            </div>
            <textarea
              id="prompt"
              value={prompt}
              onChange={handlePromptChange}
              placeholder={isUpdateMode ? "e.g., Change the theme to light mode and add a pricing section." : "e.g., A modern landing page for a coffee shop with a dark theme..."}
              className="w-full h-28 p-4 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow resize-none"
              disabled={isLoading}
            />
            {!isUpdateMode && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {examplePrompts.map((p, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleExampleClick(p)}
                            disabled={isLoading}
                            className="px-3 py-1 text-xs bg-gray-700/60 text-gray-300 rounded-full hover:bg-gray-600/60 transition-colors disabled:opacity-50"
                        >
                            {p.length > 50 ? `${p.substring(0, 50)}...` : p}
                        </button>
                    ))}
                </div>
            )}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                >
                    <SparklesIcon className="w-5 h-5" />
                    {isLoading ? 'Generating...' : (isUpdateMode ? 'Update Website' : 'Generate Website')}
                </button>
                 {error && <p className="text-red-400 text-sm text-center sm:text-left">{error}</p>}
            </div>
          </div>
        </div>

        <div className="flex-grow mt-6 w-full max-w-7xl mx-auto min-h-[60vh]">
          <ResultDisplay htmlContent={generatedHtml} isLoading={isLoading} />
        </div>
      </main>

      <footer className="w-full text-center py-4 border-t border-gray-700/50 mt-8">
          <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Ansh Chaturvedi. All rights reserved.
          </p>
      </footer>
    </div>
  );
};

export default App;