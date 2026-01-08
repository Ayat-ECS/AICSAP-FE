import React from 'react';
import Chatbot from './components/Chatbot';
import './App.css';
import { FiTarget, FiTrendingUp, FiShield, FiZap } from 'react-icons/fi';
import { AiOutlineRobot } from 'react-icons/ai';
import { BsLightningCharge } from 'react-icons/bs';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <AiOutlineRobot className="header-icon" />
          aiCSAP Blueprint
        </h1>
        <p>AI-Powered SAP Implementation Blueprint Consultant</p>
        <div className="feature-badges">
          <div className="feature-badge">
            <BsLightningCharge className="badge-icon" />
            <span>Smart Analysis</span>
          </div>
          <div className="feature-badge">
            <FiZap className="badge-icon" />
            <span>Minimal Questions</span>
          </div>
          <div className="feature-badge">
            <FiTarget className="badge-icon" />
            <span>Comprehensive Blueprints</span>
          </div>
          <div className="feature-badge">
            <FiShield className="badge-icon" />
            <span>No Pricing Questions</span>
          </div>
        </div>
      </header>
      
      <div className="chatbot-wrapper">
        <div className="chatbot-container">
          <Chatbot />
        </div>
      </div>
      
      <div className="features-section">
        <h3>How aiCSAP Blueprint Works</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <BsLightningCharge />
            </div>
            <h4>Smart Analysis</h4>
          <p>I analyze your request to understand your SAP implementation needs and provide tailored recommendations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiZap />
            </div>
            <h4>Efficient Process</h4>
            <p>Get comprehensive blueprints with minimal questions, saving you time and effort.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiTarget />
            </div>
            <h4>Precise Recommendations</h4>
            <p>Receive detailed SAP module suggestions, implementation steps, and best practices.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiShield />
            </div>
            <h4>Focus on Solutions</h4>
            <p>We focus solely on technical implementation strategies, avoiding pricing discussions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiTrendingUp />
            </div>
            <h4>Scalable Architecture</h4>
            <p>Design SAP solutions that grow with your business needs and requirements.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <AiOutlineRobot />
            </div>
            <h4>AI-Powered Insights</h4>
            <p>Leverage artificial intelligence for optimal SAP implementation strategies.</p>
          </div>
        </div>
      </div>
      
    
    </div>
  );
}

export default App;