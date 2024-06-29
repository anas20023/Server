document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('open-form');
    const timerContainer = document.getElementById('timer-container');
    const timerElement = document.getElementById('timer');
    const timerKey = 'timerStartTime';
    
    submitButton.addEventListener('click', function() {
      // Hide the submit button
      submitButton.classList.add('hidden');
      // Show the timer container
      timerContainer.classList.remove('hidden');
      
      // Check if there's already a timer running
      const storedStartTime = localStorage.getItem(timerKey);
      let startTime;
      if (storedStartTime) {
        startTime = parseInt(storedStartTime, 10);
      } else {
        startTime = Date.now(); // Timestamp when timer starts
        localStorage.setItem(timerKey, startTime);
      }
      
      const countdown = setInterval(function() {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const remainingSeconds = 5 * 60 - elapsedSeconds;
        
        if (remainingSeconds <= 0) {
          clearInterval(countdown);
          timerElement.textContent = 'Timer finished!';
          
          // Show the submit button again
          submitButton.classList.remove('hidden');
          
          // Hide the timer container
          timerContainer.classList.add('hidden');
          
          // Clear localStorage
          localStorage.removeItem(timerKey);
        } else {
          const minutes = Math.floor(remainingSeconds / 60);
          const seconds = remainingSeconds % 60;
          timerElement.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }
      }, 1000);
    });
    
    // Check if there's an ongoing timer on page load
    const storedStartTime = localStorage.getItem(timerKey);
    if (storedStartTime) {
      submitButton.classList.add('hidden');
      timerContainer.classList.remove('hidden');
      
      const startTime = parseInt(storedStartTime, 10);
      
      const countdown = setInterval(function() {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const remainingSeconds = 5 * 60 - elapsedSeconds;
        
        if (remainingSeconds <= 0) {
          clearInterval(countdown);
          timerElement.textContent = 'Timer finished!';
          
          // Show the submit button again
          submitButton.classList.remove('hidden');
          
          // Hide the timer container
          timerContainer.classList.add('hidden');
          
          // Clear localStorage
          localStorage.removeItem(timerKey);
        } else {
          const minutes = Math.floor(remainingSeconds / 60);
          const seconds = remainingSeconds % 60;
          timerElement.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }
      }, 1000);
    }
  });