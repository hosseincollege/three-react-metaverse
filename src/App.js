// src/App.js
import React, { useState } from 'react';
import ResistanceWorld from './ResistanceWorld';
import './index.css';

function App() {
  // وضعیت برای بررسی اینکه آیا کاربر دکمه ورود را زده یا نه
  const [started, setStarted] = useState(false);

  return (
    <div className="App">
      {/* لایه رابط کاربری (نوشته‌ها و دکمه) */}
      <div className={`ui-overlay ${started ? 'fade-out' : ''}`}>
        <h1>Islamic Metaverse</h1>
        <p>جهانی برای نمایش حقیقت، عدالت و مقاومت</p>
        
        {!started && (
          <button className="enter-button" onClick={() => setStarted(true)}>
            ورود به میدان
          </button>
        )}
      </div>

      {/* لود کردن جهان سه بعدی */}
      <ResistanceWorld />
    </div>
  );
}

export default App;
