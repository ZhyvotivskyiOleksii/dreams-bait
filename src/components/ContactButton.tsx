"use client";

import { useState } from "react";
import { Phone, MessageCircle, X } from "lucide-react";

export default function ContactButton() {
  const [isOpen, setIsOpen] = useState(false);

  const contacts = [
    {
      name: "Viber",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M11.398 0C9.654.013 5.898.208 3.65 2.291 1.733 4.178 1.093 6.987 1.031 10.45c-.062 3.463-.146 9.944 6.089 11.67l.007.002s-.007 1.874-.007 2.253c0 0-.035.542.342.657.458.138.73-.296.73-.296s.855-.97 1.931-2.186c3.166.278 5.604-.34 5.88-.428.639-.201 4.262-.671 4.853-5.477.609-4.957-.293-8.088-1.929-9.486l-.002-.003c-.481-.43-2.428-1.852-6.877-2.028 0 0-.295-.015-.65-.012zm.11 1.846c.296-.003.537.008.537.008 3.705.147 5.416 1.227 5.818 1.586 1.37 1.167 2.086 3.916 1.565 7.97-.481 3.918-3.358 4.166-3.89 4.333-.23.075-2.382.597-5.118.402 0 0-2.025 2.44-2.657 3.077-.1.102-.218.14-.3.122-.114-.024-.145-.14-.144-.31l.018-3.32s-5.093-1.219-5.045-9.57c.024-2.938.536-5.199 2.075-6.71 1.718-1.683 4.845-1.876 6.604-1.888l.536.3zm.337 2.706c-.06 0-.107.048-.106.107.001.06.05.107.11.107 1.381.006 2.534.472 3.429 1.384.882.898 1.356 2.084 1.41 3.526.003.06.053.105.113.103.059-.003.105-.053.102-.113-.058-1.513-.563-2.762-1.503-3.72-.952-.97-2.178-1.473-3.643-1.494h-.012zm-3.39.876c-.168-.007-.35.059-.52.21l-.001.001c-.28.251-.55.512-.802.79-.2.219-.308.439-.328.656-.013.157.025.31.093.46l.006.011c.341.734.756 1.43 1.244 2.08.653.895 1.404 1.715 2.246 2.453l.015.013.013.012c.738.842 1.558 1.593 2.453 2.247.65.487 1.345.901 2.079 1.243l.011.006c.15.068.303.106.46.093.217-.02.437-.128.656-.328.278-.252.54-.523.79-.802l.002-.002c.264-.3.31-.612.14-.875-.37-.57-.79-1.105-1.252-1.598l-.002-.002c-.229-.227-.503-.256-.752-.108l-.836.49c-.147.09-.32.1-.474.022l-.005-.002c-.444-.21-.859-.469-1.237-.777-.477-.379-.919-.801-1.32-1.26-.301-.35-.574-.72-.817-1.113l-.001-.003c-.071-.155-.058-.327.036-.47l.512-.817c.158-.249.14-.525-.076-.762-.493-.463-1.028-.883-1.598-1.253-.146-.093-.307-.12-.464-.095zm3.819.514c-.06-.002-.11.046-.112.106-.002.06.045.11.105.112.927.038 1.673.356 2.22.944.554.595.845 1.392.865 2.37.002.06.052.107.112.105.06-.002.107-.052.105-.112-.022-1.042-.338-1.903-.944-2.556-.6-.647-1.42-.996-2.44-1.037-.004 0-.008 0-.011 0zm.392 1.323c-.06-.003-.11.044-.113.104-.003.06.044.111.104.114.564.029.98.226 1.238.586.263.367.373.86.328 1.467-.005.06.04.112.1.117.06.005.112-.04.117-.1.05-.655-.07-1.208-.377-1.637-.301-.422-.778-.649-1.42-.681-.008 0-.008 0-.01 0z"/>
        </svg>
      ),
      href: "viber://chat?number=%2B380991234567",
      color: "#7360f2",
    },
    {
      name: "Telegram",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      href: "https://t.me/carppro",
      color: "#0088cc",
    },
    {
      name: "Телефон",
      icon: <Phone className="w-6 h-6" />,
      href: "tel:+380991234567",
      color: "#5cd915",
    },
  ];

  return (
    <div className="fixed z-50" style={{ right: '8px', bottom: '20px' }}>
      {/* Контакти */}
      <div className={`flex flex-col gap-3 mb-4 transition-all duration-500 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        {contacts.map((contact, index) => (
          <a
            key={contact.name}
            href={contact.href}
            target={contact.name === "Telegram" ? "_blank" : undefined}
            rel={contact.name === "Telegram" ? "noopener noreferrer" : undefined}
            className="flex items-center gap-3 group"
            style={{ 
              transitionDelay: isOpen ? `${index * 100}ms` : '0ms',
            }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: contact.color }}
            >
              {contact.icon}
            </div>
            <span className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {contact.name}
            </span>
          </a>
        ))}
      </div>

      {/* Головна кнопка */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-[#5cd915]/40 transition-all duration-300 hover:scale-110 hover:shadow-[#5cd915]/60"
        style={{ backgroundColor: '#5cd915' }}
      >
        {/* Анімовані кола радара */}
        {!isOpen && (
          <>
            {/* Пульсуюче коло 1 */}
            <span 
              className="absolute w-full h-full rounded-full opacity-40"
              style={{ 
                backgroundColor: '#5cd915',
                animation: 'radar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
              }} 
            />
            {/* Пульсуюче коло 2 - із затримкою */}
            <span 
              className="absolute w-full h-full rounded-full opacity-40"
              style={{ 
                backgroundColor: '#5cd915',
                animation: 'radar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 1s'
              }} 
            />
            {/* Внутрішнє світіння */}
            <span 
              className="absolute w-[80%] h-[80%] rounded-full opacity-60 animate-pulse"
              style={{ backgroundColor: '#5cd915' }} 
            />
          </>
        )}
        
        {/* Іконка */}
        <div className={`relative z-10 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </div>
      </button>
      
      {/* CSS для радар анімації */}
      <style jsx>{`
        @keyframes radar-ping {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

