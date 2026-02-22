
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
      question: "Is My Clinic HIPAA compliant?",
      answer: "Yes, absolutely. My Clinic is fully HIPAA compliant. We use bank-grade AES-256 encryption for all data at rest and TLS 1.3 for data in transit. We also sign Business Associate Agreements (BAAs) with all our covered entity clients."
    },
    {
      question: "How long does it take to migrate my current data?",
      answer: "Most migrations take between 2 to 5 business days. Our dedicated migration team handles everything from patient records to clinical charts and billing history. We support imports from all major legacy dental software."
    },
    {
      question: "Can I use My Clinic on my tablet or mobile device?",
      answer: "Yes, My Clinic is a cloud-native platform. It works seamlessly on iPads, Android tablets, and smartphones via any modern web browser, allowing you to manage your clinic from anywhere."
    },
    {
      question: "Do you offer multi-location support?",
      answer: "Yes, our Enterprise plan is designed specifically for multi-location dental networks. It provides centralized reporting, shared patient records, and location-specific billing settings."
    },
    {
      question: "What kind of support do you provide?",
      answer: "All plans include 24/7 email support. Our Professional and Enterprise plans include priority phone and live chat support with a dedicated customer success manager."
    }
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-400">Everything you need to know about the platform and our clinical tools.</p>
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
