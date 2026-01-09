import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './../App.css';

// Import only reliable icons from react-icons
import { FiSend, FiRefreshCw, FiActivity, FiCheckCircle } from 'react-icons/fi';
import { FiTarget, FiBarChart2, FiBriefcase, FiClock } from 'react-icons/fi';
import { FiFileText, FiSettings, FiCloud } from 'react-icons/fi';
import { FiHelpCircle, FiStar, FiZap, FiChevronRight } from 'react-icons/fi';
import { FiInfo, FiAlertCircle, FiPackage } from 'react-icons/fi';

import { AiOutlineRobot, AiOutlineQuestionCircle } from 'react-icons/ai';
import { AiOutlineTool, AiOutlineDatabase } from 'react-icons/ai';
import { AiOutlineLineChart, AiOutlineBulb } from 'react-icons/ai';

import { BsLightningCharge, BsCalendarCheck } from 'react-icons/bs';
import { BsClipboardData, BsGraphUp } from 'react-icons/bs';

// Create a custom Icon component to handle missing icons
const Icon = ({ name, className = '', size = 20 }) => {
  const icons = {
    // Fi Icons
    send: <FiSend className={className} size={size} />,
    refresh: <FiRefreshCw className={className} size={size} />,
    activity: <FiActivity className={className} size={size} />,
    check: <FiCheckCircle className={className} size={size} />,
    target: <FiTarget className={className} size={size} />,
    chart: <FiBarChart2 className={className} size={size} />,
    briefcase: <FiBriefcase className={className} size={size} />,
    clock: <FiClock className={className} size={size} />,
    document: <FiFileText className={className} size={size} />,
    settings: <FiSettings className={className} size={size} />,
    cloud: <FiCloud className={className} size={size} />,
    question: <FiHelpCircle className={className} size={size} />,
    star: <FiStar className={className} size={size} />,
    zap: <FiZap className={className} size={size} />,
    chevronRight: <FiChevronRight className={className} size={size} />,
    info: <FiInfo className={className} size={size} />,
    alert: <FiAlertCircle className={className} size={size} />,
    package: <FiPackage className={className} size={size} />,
    
    // Ai Icons
    robot: <AiOutlineRobot className={className} size={size} />,
    questionCircle: <AiOutlineQuestionCircle className={className} size={size} />,
    tool: <AiOutlineTool className={className} size={size} />,
    database: <AiOutlineDatabase className={className} size={size} />,
    lineChart: <AiOutlineLineChart className={className} size={size} />,
    lightbulb: <AiOutlineBulb className={className} size={size} />,
    
    // Bs Icons
    lightning: <BsLightningCharge className={className} size={size} />,
    calendarCheck: <BsCalendarCheck className={className} size={size} />,
    clipboard: <BsClipboardData className={className} size={size} />,
    graphUp: <BsGraphUp className={className} size={size} />,
    
    // Fallback icon
    default: <FiHelpCircle className={className} size={size} />,
  };
  
  return icons[name] || icons.default;
};

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm **aiCSAP** - your AI SAP Implementation Consultant. I analyze your needs and provide comprehensive SAP implementation blueprints. Tell me about your SAP requirements, and I'll create a tailored blueprint for you.", 
      sender: 'bot',
      metadata: {
        classification: 'general',
        suggestions: ["Create SAP implementation blueprint", "SAP technical requirements", "Implementation timeline planning", "Process optimization consulting"],
        language: 'en',
        isConsultation: true,
        consultationStage: 'initial'
      }
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [consultationState, setConsultationState] = useState({
    isActive: false,
    isClarifying: false,
    isBlueprint: false,
    isCompleted: false,
    currentQuestion: 0,
    totalQuestions: 0,
    answers: {},
    blueprintStage: 'initial' // initial, analyzing, generating, complete
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'bot') {
      const metadata = lastMessage.metadata;
      
      if (metadata) {
        const classification = metadata.classification || '';
        const isBlueprint = classification.includes('blueprint');
        const isClarifying = classification === 'clarification_question';
        const isCompleted = metadata.consultationCompleted || classification === 'blueprint_completed';
        
        // Update consultation state based on metadata
        const newConsultationState = {
          isActive: metadata.needsMoreInfo && !metadata.isFinalAnswer,
          isClarifying: isClarifying,
          isBlueprint: isBlueprint,
          isCompleted: isCompleted,
          currentQuestion: metadata.questionNumber || 0,
          totalQuestions: metadata.totalQuestions || 0,
          answers: {
            ...consultationState.answers,
            ...(metadata.currentQuestionId && messages[messages.length - 2]?.sender === 'user' && {
              [metadata.currentQuestionId]: messages[messages.length - 2]?.text
            })
          },
          blueprintStage: isBlueprint ? 'generating' : 
                        isCompleted ? 'complete' : 
                        isClarifying ? 'clarifying' : 'initial'
        };
        
        setConsultationState(newConsultationState);
        
        // Reset consultation after completion (optional)
        if (metadata.consultationCompleted) {
          setTimeout(() => {
            setConsultationState({
              isActive: false,
              isClarifying: false,
              isBlueprint: false,
              isCompleted: true,
              currentQuestion: 0,
              totalQuestions: 0,
              answers: {},
              blueprintStage: 'complete'
            });
          }, 10000);
        }
      }
    }
  }, [messages]);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;
    const DEFAULT_LANGUAGE = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en';


    const getBotResponse = async (userInput) => {
    try {
        const payload = {
        message: userInput,
        session_id: sessionId,
        language: DEFAULT_LANGUAGE,
        timestamp: new Date().toISOString(),
        };

        const response = await axios.post(
        `${API_BASE_URL}/public/chatbot/`, 
        payload,
        {
            headers: { 'Content-Type': 'application/json' },
            timeout: parseInt(API_TIMEOUT),
        }
        );

        
        return response.data;
    } catch (error) {
        console.error('Error getting bot response:', error);
        throw error;
    }
    };
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setTimeout(() => {
      handleSend(suggestion);
    }, 100);
  };

  const handleSend = async (customInput = null) => {
    const messageToSend = customInput || input.trim();
    if (!messageToSend) return;

    const userMessage = { 
      text: messageToSend, 
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    if (!customInput) {
      setInput('');
    }
    setIsLoading(true);

    try {
      const response = await getBotResponse(messageToSend);
      
      if (response.success) {
        if (response.data.session_id && !sessionId) {
          setSessionId(response.data.session_id);
        }
        
        // Update consultation state based on response
        const classification = response.data.classification || '';
        const isBlueprint = classification.includes('blueprint');
        const isClarifying = classification === 'clarification_question';
        const isCompleted = response.data.consultation_completed || classification === 'blueprint_completed';
        
        const newConsultationState = {
          isActive: response.data.needs_more_info && !response.data.is_final_answer,
          isClarifying: isClarifying,
          isBlueprint: isBlueprint,
          isCompleted: isCompleted,
          currentQuestion: response.data.question_number || 0,
          totalQuestions: response.data.total_questions || 0,
          answers: {
            ...consultationState.answers,
            ...(response.data.current_question_id && {
              [response.data.current_question_id]: messageToSend
            })
          },
          blueprintStage: isBlueprint ? 'generating' : 
                        isCompleted ? 'complete' : 
                        isClarifying ? 'clarifying' : 'analyzing'
        };
        
        setConsultationState(newConsultationState);
        
        const botMessage = {
          text: response.data.response,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          metadata: {
            classification: response.data.classification || 'general',
            suggestions: response.data.suggestions || [],
            language: response.data.language || 'en',
            sessionId: response.data.session_id,
            responseTime: response.data.timestamp,
            isConsultation: response.data.consultation_mode || false,
            needsMoreInfo: response.data.needs_more_info || false,
            clarifyingQuestions: response.data.clarifying_questions || [],
            isFinalAnswer: response.data.is_final_answer || false,
            consultationStage: response.data.consultation_stage || 'initial',
            source: response.data.source || 'aicsap_smart',
            currentQuestionId: response.data.current_question_id,
            questionNumber: response.data.question_number,
            totalQuestions: response.data.total_questions,
            consultationCompleted: response.data.consultation_completed || false
          }
        };
        
        setMessages(prev => [...prev, botMessage]);
        
      } else {
        setMessages(prev => [...prev, {
          text: response.data?.response || "Sorry, I couldn't process your request. Please try again.",
          sender: 'bot',
          isError: true,
          timestamp: new Date().toISOString()
        }]);
      }
      
    } catch (error) {
      console.error('Unexpected error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, an unexpected error occurred. Please try again.", 
        sender: 'bot',
        isError: true,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([{ 
      text: "Hello! I'm **aiCSAP** - your AI SAP Implementation Consultant. I analyze your needs and provide comprehensive SAP implementation blueprints. Tell me about your SAP requirements, and I'll create a tailored blueprint for you.", 
      sender: 'bot',
      metadata: {
        classification: 'general',
        suggestions: ["Create SAP implementation blueprint", "SAP technical requirements", "Implementation timeline planning", "Process optimization consulting"],
        language: 'en',
        isConsultation: true,
        consultationStage: 'initial'
      }
    }]);
    setSessionId(null);
    setConsultationState({
      isActive: false,
      isClarifying: false,
      isBlueprint: false,
      isCompleted: false,
      currentQuestion: 0,
      totalQuestions: 0,
      answers: {},
      blueprintStage: 'initial'
    });
    setInput('');
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getProgressText = () => {
    if (consultationState.isBlueprint && consultationState.blueprintStage === 'generating') {
      return 'Generating blueprint...';
    }
    
    if (consultationState.isClarifying) {
      if (consultationState.totalQuestions === 0) {
        return 'Analyzing your request...';
      }
      
      if (consultationState.currentQuestion === 0) {
        return 'Starting clarification...';
      }
      
      return `Clarification ${consultationState.currentQuestion} of ${consultationState.totalQuestions}`;
    }
    
    if (consultationState.isCompleted) {
      return 'Blueprint complete!';
    }
    
    if (consultationState.isActive) {
      return 'Consultation in progress...';
    }
    
    return 'Ready for blueprint consultation';
  };

  const getProgressPercentage = () => {
    if (consultationState.isBlueprint && consultationState.blueprintStage === 'generating') {
      return 80; // Generating stage
    }
    
    if (consultationState.isClarifying) {
      // Calculate based on answered clarification questions
      const answeredQuestions = Object.keys(consultationState.answers).length;
      
      if (consultationState.totalQuestions > 0) {
        return Math.round((answeredQuestions / consultationState.totalQuestions) * 100);
      }
      
      return 20; // Analyzing stage
    }
    
    if (consultationState.isCompleted) {
      return 100;
    }
    
    if (consultationState.isActive) {
      return 40; // Consultation in progress
    }
    
    return 0; // Ready state
  };

  const getStageIcon = () => {
    if (consultationState.isBlueprint && consultationState.blueprintStage === 'generating') {
      return 'document';
    }
    
    if (consultationState.isClarifying) {
      return 'questionCircle';
    }
    
    if (consultationState.isCompleted) {
      return 'check';
    }
    
    if (consultationState.isActive) {
      return 'activity';
    }
    
    return 'robot';
  };

  const getStageTitle = () => {
    if (consultationState.isBlueprint && consultationState.blueprintStage === 'generating') {
      return 'Blueprint Generation';
    }
    
    if (consultationState.isClarifying) {
      return 'Clarification Progress';
    }
    
    if (consultationState.isCompleted) {
      return 'Blueprint Complete';
    }
    
    if (consultationState.isActive) {
      return 'Consultation Progress';
    }
    
    return 'Ready for Consultation';
  };

  const renderProgressIndicator = () => {
    const progress = getProgressPercentage();
    const isActive = consultationState.isActive || 
                     consultationState.isClarifying || 
                     consultationState.isBlueprint || 
                     consultationState.isCompleted;
    
    if (!isActive) return null;
    
    const stageIcon = getStageIcon();
    const stageTitle = getStageTitle();
    
    return (
      <div className="consultation-progress">
        <div className="progress-header">
          <span className="progress-title">
            <Icon name={stageIcon} className="progress-icon" />
            {stageTitle}
          </span>
          <span className="progress-text">{getProgressText()}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {consultationState.isClarifying && consultationState.totalQuestions > 0 && (
          <div className="progress-steps">
            {Array.from({ length: consultationState.totalQuestions }).map((_, index) => {
              const stepNumber = index + 1;
              let stepClass = '';
              
              if (stepNumber < consultationState.currentQuestion) {
                stepClass = 'completed';
              } else if (stepNumber === consultationState.currentQuestion) {
                stepClass = 'current';
              }
              
              return (
                <div 
                  key={index}
                  className={`progress-step ${stepClass}`}
                  data-tooltip={`Clarification ${stepNumber}`}
                >
                  <div className="step-number">
                    {stepNumber}
                  </div>
                  <div className="step-label">Q{stepNumber}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const getSuggestionIcon = (suggestion) => {
    const suggestionLower = suggestion.toLowerCase();
    
    if (suggestionLower.includes('blueprint') || suggestionLower.includes('proposal')) return 'document';
    if (suggestionLower.includes('timeline') || suggestionLower.includes('schedule')) return 'clock';
    if (suggestionLower.includes('technical') || suggestionLower.includes('requirements')) return 'settings';
    if (suggestionLower.includes('consultation') || suggestionLower.includes('implementation')) return 'briefcase';
    if (suggestionLower.includes('sap') || suggestionLower.includes('erp')) return 'cloud';
    if (suggestionLower.includes('process') || suggestionLower.includes('optimization')) return 'lineChart';
    if (suggestionLower.includes('new') || suggestionLower.includes('restart')) return 'refresh';
    if (suggestionLower.includes('data') || suggestionLower.includes('analytics')) return 'database';
    if (suggestionLower.includes('help') || suggestionLower.includes('support')) return 'question';
    if (suggestionLower.includes('start') || suggestionLower.includes('begin')) return 'zap';
    if (suggestionLower.includes('ai') || suggestionLower.includes('intelligent')) return 'robot';
    
    return 'briefcase';
  };

  const getInputPlaceholder = () => {
    if (consultationState.isClarifying) {
      return "Type your answer here or select from suggestions above...";
    }
    
    if (consultationState.isCompleted) {
      return "Ask about any aspect of your blueprint or start a new consultation...";
    }
    
    if (consultationState.isBlueprint && consultationState.blueprintStage === 'generating') {
      return "Generating your blueprint...";
    }
    
    return "Describe your SAP needs to get a comprehensive implementation blueprint...";
  };

  const getFooterTip = () => {
    if (consultationState.isClarifying) {
      return 'Select suggestions or type your custom answer';
    }
    
    if (consultationState.isCompleted) {
      return 'Explore different aspects of your blueprint or start a new consultation';
    }
    
    if (consultationState.isActive || consultationState.isBlueprint) {
      return 'I\'m analyzing your request to create the best blueprint';
    }
    
    return 'Start by describing your SAP implementation needs for a comprehensive blueprint';
  };

  const getSessionStatus = () => {
    if (consultationState.isClarifying) {
      return 'Clarification in Progress';
    }
    
    if (consultationState.isBlueprint && consultationState.blueprintStage === 'generating') {
      return 'Blueprint Generation';
    }
    
    if (consultationState.isCompleted) {
      return 'Blueprint Ready';
    }
    
    if (consultationState.isActive) {
      return 'Consultation Active';
    }
    
    return 'Ready for Blueprint';
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-left">
          <div className="ai-logo">
            <Icon name="robot" className="logo-icon" size={24} />
          </div>
          <div className="header-info">
            <h3>
              <Icon name="robot" className="header-icon" size={20} />
              aiCSAP Blueprint Consultant
             
            </h3>
            <div className="session-id">
              <Icon name="cloud" className="session-icon" size={14} />
              {getSessionStatus()}
              {sessionId && ` • ${sessionId.substring(0, 8)}...`}
            </div>
          </div>
        </div>
        <div className="header-controls">
          <div className="api-status">
            <span className="status-dot"></span>
            {isLoading ? 'Processing...' : 'Connected'}
          </div>
          <button 
            onClick={handleClear} 
            className="clear-btn"
            data-tooltip="Start a new blueprint consultation"
          >
            <Icon name="refresh" className="btn-icon" size={16} />
            <span className="btn-text">New Blueprint</span>
          </button>
        </div>
      </div>
      
      
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.sender} ${msg.isError ? 'error' : ''} ${
              msg.metadata?.classification?.includes('blueprint') ? 'blueprint' : 
              msg.metadata?.classification === 'clarification_question' ? 'clarifying' :
              msg.metadata?.isConsultation ? 'consultation' : ''
            } ${msg.metadata?.consultationCompleted ? 'consultation-completed' : ''}`}
          >
            {msg.sender === 'bot' && (
              <div className="bot-avatar">
                <Icon name="robot" className="avatar-icon" size={20} />
              </div>
            )}
            <div className="message-content">
              <div className="message-bubble">
                <div className="message-text">
                  {msg.text}
                  {msg.metadata?.classification === 'clarification_question' && (
                    <span className="clarification-badge" title="Clarification Question">
                      <Icon name="questionCircle" className="clarification-icon" size={12} />
                    </span>
                  )}
                  {msg.metadata?.classification?.includes('blueprint') && !msg.metadata?.consultationCompleted && (
                    <span className="blueprint-badge" title="Blueprint Generation">
                      <Icon name="document" className="blueprint-icon" size={12} />
                    </span>
                  )}
                </div>
                
                {msg.metadata?.questionNumber && msg.metadata?.totalQuestions && (
                  <div className="question-indicator">
                    <Icon name="questionCircle" className="question-icon" size={16} />
                    <span className="question-number">
                      Clarification {msg.metadata.questionNumber}/{msg.metadata.totalQuestions}
                    </span>
                  </div>
                )}
                
                {msg.metadata?.suggestions?.length > 0 && msg.sender === 'bot' && (
                  <div className="suggestions-container">
                    <div className="suggestions-label">
                      <Icon name={msg.metadata.needsMoreInfo ? "lightbulb" : "star"} className="suggestions-label-icon" size={16} />
                      {msg.metadata.needsMoreInfo ? "Suggested answers:" : "Next steps:"}
                    </div>
                    <div className="suggestions-list">
                      {msg.metadata.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="suggestion-chip"
                          onClick={() => handleSuggestionClick(suggestion)}
                          disabled={isLoading}
                          data-tooltip={`Select: ${suggestion}`}
                        >
                          <Icon 
                            name={getSuggestionIcon(suggestion)} 
                            className="suggestion-icon" 
                            size={16} 
                          />
                          <span className="suggestion-text">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="message-time">
                <Icon name="clock" className="time-icon" size={12} />
                {formatTime(msg.timestamp)}
                {msg.metadata?.source && (
                  <span className="response-source" title="Analysis Source">
                    <Icon name="chart" className="response-icon" size={12} />
                    <span className="response-text">
                      {msg.metadata.source.includes('smart') ? 'Smart Analysis' : 
                       msg.metadata.source.includes('blueprint') ? 'Blueprint' : 
                       'AI Analysis'}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot typing-indicator">
            <div className="bot-avatar">
              <Icon name="robot" className="avatar-icon" size={20} />
            </div>
            <div className="message-content">
              <div className="message-bubble">
                <div className="typing-dots">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
                <span className="typing-text">
                  {consultationState.isClarifying 
                    ? 'Processing your clarification...' 
                    : consultationState.isBlueprint
                    ? 'Generating your blueprint...'
                    : 'Analyzing your request...'}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={getInputPlaceholder()}
          disabled={isLoading || (consultationState.isBlueprint && consultationState.blueprintStage === 'generating')}
          rows={2}
        />
        <button 
          onClick={() => handleSend()} 
          disabled={!input.trim() || isLoading || (consultationState.isBlueprint && consultationState.blueprintStage === 'generating')}
          className="send-btn"
          title="Send message"
          data-tooltip="Send message"
        >
          <Icon name={isLoading ? "activity" : "send"} className="send-icon" size={20} />
        </button>
      </div>
      
      <div className="chatbot-footer">
        <div className="stats">
          <div className="stat" data-tooltip="Consultation Stage">
            <Icon name="target" className="stat-icon" size={16} />
            <span className="stat-text">
              {consultationState.isClarifying 
                ? `Clarification ${consultationState.currentQuestion}/${consultationState.totalQuestions}` 
                : consultationState.isCompleted 
                ? 'Blueprint Complete' 
                : consultationState.isBlueprint
                ? 'Generating Blueprint'
                : 'Ready'}
            </span>
          </div>
  
        </div>
        <div className="footer-note">
          <Icon name="lightbulb" className="tip-icon" size={16} />
          <small>
            <strong>Tip:</strong> {getFooterTip()}
          </small>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;