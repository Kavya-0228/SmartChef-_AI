import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'system', content: 'Hi! I am SmartChef. How can I help you with cooking or nutrition today?' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    const newContext = [...messages, { role: 'user', content: userMsg }];
    setMessages(newContext);
    setIsLoading(true);

    try {
      // Exclude the initial local system greeting from the context sent to API to avoid duplication,
      // API already has a system prompt
      const apiContext = newContext.slice(1).map(m => ({ role: m.role === 'system' ? 'assistant' : m.role, content: m.content }));
      
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        message: userMsg,
        context: apiContext.slice(0, -1) // Excluding the last message as it's sent separately
      });
      setMessages([...newContext, { role: 'system', content: res.data.reply }]);
    } catch (error) {
      setMessages([...newContext, { role: 'system', content: 'Oops! I am having trouble answering right now. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-primary-500 text-white rounded-full shadow-2xl hover:bg-primary-600 transition-colors z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 glass dark:glass-dark rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px] z-50 border border-gray-200 dark:border-gray-700"
          >
            <div className="bg-primary-500 p-4 text-white flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <h3 className="font-bold text-lg">SmartChef AI</h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex max-w-[80%] ${msg.role === 'user' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
                  <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary-500 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 rounded-tl-none'}`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="mr-auto p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about recipes, diets..."
                className="flex-1 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
