const processContent = async () => {
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
};

// Export the function for use in the main app
window.processContent = processContent;
