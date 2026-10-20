document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabs = document.querySelectorAll('.tab');
    const challengeContent = document.querySelector('.challenge-content');
    const hintsContainer = document.querySelector('.hints-container');
    const submissionsContent = document.createElement('div');
    const hintBtn = document.querySelector('.hint-btn');
    const resetBtn = document.querySelector('.btn-outline:nth-child(1)');
    const aiAssistBtn = document.querySelector('.btn-outline:nth-child(2)');
    const runTestsBtn = document.querySelector('.btn-primary:nth-child(3)');
    const submitBtn = document.querySelector('.btn-primary:nth-child(4)');
    const languageSelector = document.getElementById('language');
    const editor = document.querySelector('.editor pre code');
    const consoleContent = document.querySelector('.console-content');
    const clearConsoleBtn = document.querySelector('.console-actions button');
    const aiSuggestion = document.querySelector('.ai-suggestion');
    const lineNumbers = document.querySelector('.line-numbers');
  
    // Original "Hello World" code for beginning
    const originalCode = {
      javascript: `// Hello World Program
  console.log("Hello, World!");
  
  function greet(name) {
    return "Hello, " + name + "!";
  }
  
  // You can modify this message
  const message = "Welcome to Aegiis Challenges";
  console.log(message);`,
      python: `# Hello World Program
  print("Hello, World!")
  
  def greet(name):
      return f"Hello, {name}!"
  
  # You can modify this message
  message = "Welcome to Aegiis Challenges"
  print(message)`,
      php: `<?php
  // Hello World Program
  echo "Hello, World!";
  
  function greet($name) {
      return "Hello, " . $name . "!";
  }
  
  // You can modify this message
  $message = "Welcome to Aegiis Challenges";
  echo $message;
  ?>`
    };
  
    // Simulated test cases
    const testCases = [
      { 
        name: "SQL Injection Attack", 
        username: "admin' --", 
        password: "anything", 
        shouldPass: false,
        failMessage: "Test failed: Username = \"admin' --\" bypassed authentication"
      },
      { 
        name: "Valid Credentials", 
        username: "admin", 
        password: "correctPassword", 
        shouldPass: true,
        failMessage: "Test failed: Valid credentials did not pass authentication"
      },
      { 
        name: "Invalid Credentials", 
        username: "admin", 
        password: "wrongPassword", 
        shouldPass: true,
        failMessage: "Test failed: Invalid credentials were accepted"
      },
      { 
        name: "SQL Injection with UNION", 
        username: "admin' UNION SELECT * FROM users --", 
        password: "anything", 
        shouldPass: false,
        failMessage: "Test failed: UNION-based SQL injection attack succeeded"
      }
    ];
  
    // Solution examples (for validation)
    const solutionExamples = {
      javascript: [
        `function authenticateUser(username, password) {
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    
    const user = database.execute(query, [username, password]);
    
    if (user.length > 0) {
      return { success: true, user: user[0] };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  }`,
        `function authenticateUser(username, password) {
    // Use parametrized queries to prevent SQL injection
    const stmt = database.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
    
    const user = stmt.all(username, password);
    
    if (user.length > 0) {
      return { success: true, user: user[0] };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  }`
      ],
      python: [
        `def authenticate_user(username, password):
      query = "SELECT * FROM users WHERE username = %s AND password = %s"
      
      user = database.execute(query, (username, password))
      
      if len(user) > 0:
          return {"success": True, "user": user[0]}
      else:
          return {"success": False, "message": "Invalid credentials"}`
      ],
      php: [
        `function authenticateUser($username, $password) {
      $stmt = $database->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
      $stmt->bind_param("ss", $username, $password);
      $stmt->execute();
      
      $result = $stmt->get_result();
      
      if ($result->num_rows > 0) {
          $user = $result->fetch_assoc();
          return ['success' => true, 'user' => $user];
      } else {
          return ['success' => false, 'message' => 'Invalid credentials'];
      }
  }`
      ]
    };
  
    // Hints array
    const hints = [
      "Use parameterized queries or prepared statements instead of concatenating user input directly into the SQL query.",
      "Consider using database-specific methods for query parameter binding to protect against SQL injection.",
      "Even with parameterized queries, make sure to implement proper authentication methods like hashing passwords and using secure session management."
    ];
  
    // Initialize the editor with the JavaScript Hello World code
    updateEditor(originalCode.javascript);
    
    // Initialize the console with a welcome message
    appendToConsole("// Welcome to Aegiis Code Editor!");
    appendToConsole("// Edit the Hello World program and click Submit to run it.");
  
    // Update line numbers based on code length
    function updateLineNumbers(code) {
      const lineCount = code.split('\n').length;
      let lineNumbersHTML = '';
      for (let i = 1; i <= lineCount; i++) {
        lineNumbersHTML += i + '<br>';
      }
      lineNumbers.innerHTML = lineNumbersHTML;
    }
  
    // Function to update the editor content
    function updateEditor(code) {
      editor.textContent = code;
      updateLineNumbers(code);
    }
  
    // Make the editor editable
    editor.contentEditable = true;
    editor.spellcheck = false;
    editor.addEventListener('input', function() {
      updateLineNumbers(editor.textContent);
    });
  
    // Prevent tab key from moving focus
    editor.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        document.execCommand('insertText', false, '  ');
      }
    });
    
    // Tab switching functionality
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Show appropriate content based on tab clicked
        if (index === 0) { // Description tab
          challengeContent.style.display = 'block';
          hintsContainer.style.display = 'block';
          submissionsContent.style.display = 'none';
        } else if (index === 1) { // Hints tab
          challengeContent.style.display = 'none';
          hintsContainer.style.display = 'block';
          submissionsContent.style.display = 'none';
          // Show all hints when hints tab is clicked
          showAllHints();
        } else if (index === 2) { // Submissions tab
          challengeContent.style.display = 'none';
          hintsContainer.style.display = 'none';
          
          // Setup submissions content if not already done
          if (!document.body.contains(submissionsContent)) {
            submissionsContent.classList.add('challenge-content');
            submissionsContent.innerHTML = `
              <h3>Your Submissions</h3>
              <p>You have made 2 submissions for this challenge:</p>
              <div class="test-cases">
                <div class="test-case failed">
                  <p><strong>Submission #1:</strong> April 14, 2025 - 3 out of 4 tests passed</p>
                </div>
                <div class="test-case passed">
                  <p><strong>Submission #2:</strong> April 15, 2025 - All tests passed</p>
                </div>
              </div>
            `;
            challengeContent.parentNode.appendChild(submissionsContent);
          }
          
          submissionsContent.style.display = 'block';
        }
      });
    });
    
    // Hint button functionality
    let currentHint = 0;
    hintBtn.addEventListener('click', () => {
      if (currentHint < hints.length) {
        // Create or update hint display
        let hintDisplay = document.querySelector('.hint-display');
        if (!hintDisplay) {
          hintDisplay = document.createElement('div');
          hintDisplay.className = 'hint-display';
          hintDisplay.style.marginTop = '1rem';
          hintDisplay.style.padding = '1rem';
          hintDisplay.style.backgroundColor = 'var(--gray)';
          hintDisplay.style.borderRadius = '4px';
          hintDisplay.style.borderLeft = '3px solid var(--primary)';
          hintsContainer.appendChild(hintDisplay);
        }
        
        hintDisplay.textContent = hints[currentHint];
        currentHint++;
        
        // Update hint button text
        if (currentHint < hints.length) {
          hintBtn.textContent = `Show Hint (${currentHint + 1}/${hints.length})`;
        } else {
          hintBtn.textContent = 'All Hints Shown';
          hintBtn.disabled = true;
        }
      }
    });
    
    // Function to show all hints at once
    function showAllHints() {
      let hintsContent = document.querySelector('.hints-content');
      if (!hintsContent) {
        hintsContent = document.createElement('div');
        hintsContent.className = 'hints-content';
        
        let hintsHtml = '<h3>Hints</h3>';
        hints.forEach((hint, index) => {
          hintsHtml += `<div class="hint-display" style="margin-top: 1rem; padding: 1rem; background-color: var(--gray); border-radius: 4px; border-left: 3px solid var(--primary);">
            <strong>Hint ${index + 1}:</strong> ${hint}
          </div>`;
        });
        
        hintsContent.innerHTML = hintsHtml;
        hintsContainer.appendChild(hintsContent);
      }
      
      hintsContent.style.display = 'block';
    }
    
    // Reset button functionality
    resetBtn.addEventListener('click', () => {
      const currentLanguage = languageSelector.value;
      updateEditor(originalCode[currentLanguage]);
      
      // Add a message to the console
      appendToConsole('// Code has been reset to original vulnerable code');
    });
    
    // Language selector functionality
    languageSelector.addEventListener('change', () => {
      const selectedLanguage = languageSelector.value;
      updateEditor(originalCode[selectedLanguage]);
      
      // Add a message to the console
      appendToConsole(`// Switched to ${selectedLanguage} language`);
    });
    
    // AI Assist button functionality
    aiAssistBtn.addEventListener('click', () => {
      const currentLanguage = languageSelector.value;
      
      // Simulate AI suggestions based on the selected language
      const suggestions = {
        javascript: "Replace string concatenation with parameterized queries using '?' placeholder and an array of parameters.",
        python: "Use parameterized queries with '%s' placeholders and pass parameters as a tuple.",
        php: "Use prepared statements with 'bind_param' to safely handle user input."
      };
      
      // Display suggestion in console
      appendToConsole(`// AI Assistant Suggestion for ${currentLanguage}:`);
      appendToConsole(`// ${suggestions[currentLanguage]}`);
      
      // Show a code example
      const exampleIndex = Math.floor(Math.random() * solutionExamples[currentLanguage].length);
      appendToConsole('// Example implementation:');
      appendToConsole(`/*\n${solutionExamples[currentLanguage][exampleIndex]}\n*/`);
      
      // Show an animated suggestion bubble
      aiSuggestion.classList.add('pulse');
      setTimeout(() => {
        aiSuggestion.classList.remove('pulse');
      }, 3000);
    });
    
    // Run Tests button functionality
    runTestsBtn.addEventListener('click', () => {
      const currentCode = editor.textContent;
      const currentLanguage = languageSelector.value;
      
      // Clear previous test results
      clearConsole();
      appendToConsole('// Running tests...');
      
      // Simulate testing with a slight delay
      setTimeout(() => {
        // Extract print/console.log statements for testing
        let outputLines = [];
        try {
          if (currentLanguage === 'javascript') {
            const regex = /console\.log\(['"](.*?)['"]\)/g;
            let match;
            while ((match = regex.exec(currentCode)) !== null) {
              outputLines.push(match[1]);
            }
          } else if (currentLanguage === 'python') {
            const regex = /print\(['"](.*?)['"]\)/g;
            let match;
            while ((match = regex.exec(currentCode)) !== null) {
              outputLines.push(match[1]);
            }
          } else if (currentLanguage === 'php') {
            const regex = /echo ['"](.*?)['"]/g;
            let match;
            while ((match = regex.exec(currentCode)) !== null) {
              outputLines.push(match[1]);
            }
          }
        } catch (e) {
          console.error("Error extracting outputs", e);
        }
        
        // Show output in console
        appendToConsole('// Test Results:', 'console-success');
        
        const testResults = document.createElement('div');
        testResults.className = 'test-cases';
        
        // Create test case for each output line
        if (outputLines.length > 0) {
          outputLines.forEach((line, index) => {
            const testCase = document.createElement('div');
            testCase.className = 'test-case passed';
            testCase.innerHTML = `<p>Test ${index + 1}: Output "${line}" verified</p>`;
            testResults.appendChild(testCase);
          });
          appendToConsole(`// All ${outputLines.length} outputs verified!`, 'console-success');
        } else {
          const testCase = document.createElement('div');
          testCase.className = 'test-case failed';
          testCase.innerHTML = `<p>No output statements found. Add console.log(), print(), or echo statements.</p>`;
          testResults.appendChild(testCase);
          appendToConsole('// No output to test. Please add print statements.', 'console-error');
        }
        
        consoleContent.appendChild(testResults);
      }, 1000);
    });
    
    // Submit button functionality
    submitBtn.addEventListener('click', () => {
      const currentCode = editor.textContent;
      const currentLanguage = languageSelector.value;
      
      // Clear console
      clearConsole();
      appendToConsole('// Submitting your solution...');
      
      // Simulate submission with delay
      setTimeout(() => {
        // Extract printed/console.log content from the code
        let output = "Hello, World!"; // Default output
        
        try {
          // Extract the text from inside console.log, print, or echo
          if (currentLanguage === 'javascript') {
            const matches = currentCode.match(/console\.log\(['"](.*?)['"]\)/g);
            if (matches && matches.length > 0) {
              // Get the last console.log message
              const lastMatch = matches[matches.length - 1];
              output = lastMatch.match(/console\.log\(['"](.*?)['"]\)/)[1];
            }
          } else if (currentLanguage === 'python') {
            const matches = currentCode.match(/print\(['"](.*?)['"]\)/g);
            if (matches && matches.length > 0) {
              // Get the last print message
              const lastMatch = matches[matches.length - 1];
              output = lastMatch.match(/print\(['"](.*?)['"]\)/)[1];
            }
          } else if (currentLanguage === 'php') {
            const matches = currentCode.match(/echo ['"](.*?)['"]/g);
            if (matches && matches.length > 0) {
              // Get the last echo message
              const lastMatch = matches[matches.length - 1];
              output = lastMatch.match(/echo ['"](.*?)['"]/)[1];
            }
          }
        } catch (e) {
          console.error("Error parsing output", e);
        }
        
        // Display the output
        appendToConsole('// Program output:', 'console-success');
        appendToConsole(`// ${output}`, 'console-success');
        
        // Create a confetti effect to celebrate
        createConfetti();
        
        // Show success message
        appendToConsole('// Solution submitted successfully!', 'console-success');
        appendToConsole('// Your code ran without errors. Great job!', 'console-success');
      }, 1000);
    });
    
    // AI Suggestion click functionality
    aiSuggestion.addEventListener('click', () => {
      const currentLanguage = languageSelector.value;
      
      // Clear console and show suggestion
      clearConsole();
      appendToConsole('// AI Suggestion:');
      appendToConsole('// Consider using parameterized queries to prevent SQL injection attacks.');
      appendToConsole('// Example implementation:');
      
      // Show code example based on the current language
      const exampleIndex = Math.floor(Math.random() * solutionExamples[currentLanguage].length);
      appendToConsole(`/*\n${solutionExamples[currentLanguage][exampleIndex]}\n*/`);
    });
    
    // Clear Console button functionality
    clearConsoleBtn.addEventListener('click', clearConsole);
    
    // Function to append message to console
    function appendToConsole(message, className = '') {
      const p = document.createElement('p');
      p.textContent = message;
      if (className) {
        p.className = className;
      }
      consoleContent.appendChild(p);
      
      // Auto-scroll to bottom
      consoleContent.scrollTop = consoleContent.scrollHeight;
    }
    
    // Function to clear console
    function clearConsole() {
      consoleContent.innerHTML = '';
    }
    
    // Function to create confetti effect on successful submission
    function createConfetti() {
      // Add confetti container if not exists
      let confettiContainer = document.querySelector('.confetti-container');
      if (!confettiContainer) {
        confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';
        document.body.appendChild(confettiContainer);
      }
      
      // Create confetti pieces
      const colors = ['#FF6B00', '#FF8A3D', '#FFD600', '#00C853', '#F44336'];
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -20 + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Animation
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        
        // Append to container
        confettiContainer.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
          confetti.remove();
        }, 5000);
      }
      
      // Add fall animation if not exists
      if (!document.querySelector('#confetti-animation')) {
        const style = document.createElement('style');
        style.id = 'confetti-animation';
        style.textContent = `
          @keyframes fall {
            0% {
              transform: translateY(0) rotate(0);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Remove container after all confetti are gone
      setTimeout(() => {
        confettiContainer.remove();
      }, 7000);
    }
  });