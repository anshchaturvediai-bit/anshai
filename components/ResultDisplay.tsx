import React, { useState } from 'react';
import { CopyIcon, CheckIcon, ExternalLinkIcon } from './icons';

interface ResultDisplayProps {
  htmlContent: string;
  isLoading: boolean;
}

const CodePanel: React.FC<{ htmlContent: string }> = ({ htmlContent }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!htmlContent) return;
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative h-full bg-gray-900/70 backdrop-blur-sm rounded-lg border border-gray-700 flex flex-col">
      <div className="flex justify-between items-center p-3 border-b border-gray-700 flex-shrink-0">
        <p className="text-sm font-medium text-gray-300">Generated Code</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-gray-300 bg-gray-700/50 rounded-md hover:bg-gray-600/50 transition-colors disabled:opacity-50"
          disabled={!htmlContent}
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4" />
              Copy Code
            </>
          )}
        </button>
      </div>
      <pre className="flex-grow overflow-auto p-4 text-sm text-gray-300">
        <code>{htmlContent}</code>
      </pre>
    </div>
  );
};

const PreviewPanel: React.FC<{ htmlContent: string }> = ({ htmlContent }) => {
  const handleOpenPreview = () => {
    if (!htmlContent) return;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };
  
  return (
    <div className="h-full bg-white rounded-lg border border-gray-700 overflow-hidden flex flex-col">
       <div className="p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0 flex justify-between items-center">
         <p className="text-sm font-medium text-gray-600">Live Preview</p>
         <button 
           onClick={handleOpenPreview}
           className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
           disabled={!htmlContent}
           aria-label="Open preview in new tab"
         >
            <ExternalLinkIcon className="w-4 h-4" />
         </button>
       </div>
      <iframe
        srcDoc={htmlContent}
        title="Website Preview"
        className="w-full flex-grow border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg font-semibold">Generating your website...</p>
        <p className="text-sm">This may take a moment. The AI is crafting your code.</p>
    </div>
);

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 mb-4"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        <h3 className="text-xl font-bold text-gray-300">Your Website Awaits</h3>
        <p className="mt-2 max-w-md">Describe your desired website in the prompt above, and see the magic happen here. Your live preview and code will appear after generation.</p>
    </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ htmlContent, isLoading }) => {
  if (isLoading) {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-800/50 rounded-lg border border-dashed border-gray-600">
             <LoadingSpinner />
        </div>
    );
  }

  if (!htmlContent) {
     return (
        <div className="w-full h-full flex items-center justify-center bg-gray-800/50 rounded-lg border border-dashed border-gray-600">
             <InitialState />
        </div>
     );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      <PreviewPanel htmlContent={htmlContent} />
      <CodePanel htmlContent={htmlContent} />
    </div>
  );
};
