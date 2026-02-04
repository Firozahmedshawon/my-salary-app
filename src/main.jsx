import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // নিশ্চিত করুন এই ফাইলে tailwind ইম্পোর্ট করা আছে

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
