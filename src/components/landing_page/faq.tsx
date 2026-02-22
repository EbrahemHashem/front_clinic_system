
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Fix: Explicitly handle key in props to allow standard React props like key when used in lists with inline type definitions.
const FAQItem = ({ question, answer }: { question: string, answer: string, key?: React.Key }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-800 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-bold text-slate-200 group-hover:text-orange-500 transition-colors">
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-orange-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-orange-500" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-slate-400 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "Is My Clinic secure for clinic data?",
      answer: "Yes. My Clinic uses encrypted data storage, secure transport, and role-based permissions to protect patient and operational data."
    },
    {
      question: "How long does it take to migrate my current data?",
      answer: "Most migrations take 2 to 5 business days depending on data size. We help migrate patients, appointments, billing records, and team data."
    },
    {
      question: "Can I use My Clinic on my tablet or mobile device?",
      answer: "Yes. My Clinic works on desktop, tablet, and mobile browsers so your team can manage clinic operations from anywhere."
    },
    {
      question: "Do you offer multi-location support?",
      answer: "Yes. Enterprise plans support multiple branches with centralized reporting, branch-level controls, and consolidated management."
    },
    {
      question: "What kind of support do you provide?",
      answer: "All plans include ongoing support. Professional and Enterprise plans include faster response times and priority support channels."
    }
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-400">Everything you need to know about using My Clinic for daily clinic management.</p>
        </div>
        <div className="bg-slate-900/50 rounded-[2.5rem] border border-slate-800 p-8 md:p-12 shadow-2xl">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
