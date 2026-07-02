import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient"; // note: still has typo — should be axiosClient
import { Send, Loader2 } from 'lucide-react';

function ChatAi({ Problem }) {
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Hi, How can I help you?" }] },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { message: "" }
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = async (data) => {
    if (!data.message?.trim()) return;

    // Add user message (keeping your original parts structure)
    const userMsg = { role: 'user', parts: [{ text: data.message.trim() }] };
    setMessages(prev => [...prev, userMsg]);
    reset();
    setIsLoading(true);

    try {
      // Send full updated history
      const response = await axiosClient.post("/ai/chat", {
        messages: [...messages, userMsg],   // ← fixed: now includes latest user message
        title: Problem.title,
        description: Problem.description,
        testCases: Problem.visibleTestCases,
        startCode: Problem.startCode
      });

      const aiText = response.data.message || response.data.content || "No response";

      setMessages(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: aiText }]
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: "Error from AI Chatbot" }]
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="relative  flex flex-col h-full w-full bg-[#1a1a1a]">
      {/* Messages – grows and scrolls */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin font-semibold">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`
                max-w-[80%] px-4 py-3 rounded-2xl shadow 
                ${msg.role === 'user'
                  ? 'bg-primary text-primary-content rounded-br-none'
                  : 'bg-base-200 text-base-content rounded-bl-none'
                }
              `}
            >
              {msg.parts?.[0]?.text || "—"}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-base-200 px-5 py-3 rounded-2xl rounded-bl-none shadow flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm opacity-70">Thinking...</span>
            </div>
          </div>
        )}
  <div className="bottom-0 bg-base-100">
  <form 
    onSubmit={handleSubmit(onSubmit)}
    className="flex gap-2 absolute bottom-0 w-[90%] overflow-x-hidden pl-2"
  >
    <input
      ref={inputRef}
      placeholder="Type your message..."
      className={`border rounded-2xl flex-1 input input-bordered ${
        errors.message ? "input-error" : ""
      }`}
      disabled={isLoading}
      {...register("message", { required: true, minLength: 1 })}
      autoComplete="off"
    />

    <button
      type="submit"
      className={`btn btn-circle btn-primary h-11 w-11
        ${isLoading ? "btn-disabled" : ""}
        hover:scale-105 transition-transform`}
      disabled={isLoading || errors.message}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Send size={18} />
      )}
    </button>
  </form>
</div>
  <div ref={messagesEndRef} />
        
        

   </div>
   
  </div>
  );
}

export default ChatAi;