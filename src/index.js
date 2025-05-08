import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Function to process content
async function processContent() {
  try {
    // Create a new worker to process content
    const worker = new Worker('/process-content-worker.js');
    
    // Send request to worker
    worker.postMessage({ type: 'PROCESS_CONTENT' });
    
    // Wait for response
    return new Promise((resolve, reject) => {
      worker.onmessage = (event) => {
        if (event.data.success) {
          resolve(event.data);
        } else {
          reject(event.data.error);
        }
      };
      
      worker.onerror = (error) => {
        reject(error.message);
      };
    });
  } catch (error) {
    console.error('Error processing content:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Process content on every page load
window.addEventListener('load', async () => {
  try {
    const result = await processContent();
    if (result.success) {
      console.log('Content processed successfully on page load');
    } else {
      console.error('Failed to process content on page load:', result.error);
    }
  } catch (error) {
    console.error('Error processing content:', error);
  }
});

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
        // Listen for messages from service worker
        registration.active?.postMessage({ type: 'PROCESS_CONTENT' });
      })
      .catch(err => console.log('ServiceWorker registration failed: ', err));
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
