
import React from 'react';
import { useEffect, useState } from 'react';

const ApiDocs = () => {
  const [docs, setDocs] = useState('');

  useEffect(() => {
    fetch('/src/apiDocumentation.md')
      .then(response => response.text())
      .then(text => {
        setDocs(text);
      })
      .catch(error => {
        console.error('Error loading API documentation:', error);
        setDocs('Error loading API documentation');
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-pixel text-geeky-cyan mb-8">Documentación de la API</h1>
      
      <div className="bg-geeky-dark/80 p-6 rounded-lg border border-geeky-purple/30">
        <pre className="whitespace-pre-wrap font-mono text-sm text-white">
          {docs}
        </pre>
      </div>
    </div>
  );
};

export default ApiDocs;
