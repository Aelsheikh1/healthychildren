self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'PROCESS_CONTENT') {
    try {
      // Process videos
      const videoResponse = await fetch('/process-videos');
      if (!videoResponse.ok) {
        throw new Error('Failed to process videos');
      }

      // Process tips
      const tipsResponse = await fetch('/process-tips');
      if (!tipsResponse.ok) {
        throw new Error('Failed to process tips');
      }

      // Send success message
      self.postMessage({
        success: true,
        message: 'Content processed successfully'
      });
    } catch (error) {
      console.error('Error processing content:', error);
      self.postMessage({
        success: false,
        error: error.message
      });
    }
  }
});
