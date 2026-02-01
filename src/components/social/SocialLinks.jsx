import React from 'react';
import { 
  Facebook, Twitter, Instagram, Youtube, 
  MessageCircle, Send, Globe, Mail
} from 'lucide-react';

const SOCIAL_LINKS = [
  { 
    name: 'فيسبوك', 
    icon: Facebook, 
    url: 'https://facebook.com', 
    color: 'hover:bg-blue-600 hover:text-white',
    bgColor: 'bg-blue-100 text-blue-600'
  },
  { 
    name: 'تويتر', 
    icon: Twitter, 
    url: 'https://twitter.com', 
    color: 'hover:bg-sky-500 hover:text-white',
    bgColor: 'bg-sky-100 text-sky-600'
  },
  { 
    name: 'انستغرام', 
    icon: Instagram, 
    url: 'https://instagram.com', 
    color: 'hover:bg-pink-600 hover:text-white',
    bgColor: 'bg-pink-100 text-pink-600'
  },
  { 
    name: 'يوتيوب', 
    icon: Youtube, 
    url: 'https://youtube.com', 
    color: 'hover:bg-red-600 hover:text-white',
    bgColor: 'bg-red-100 text-red-600'
  },
  { 
    name: 'واتساب', 
    icon: MessageCircle, 
    url: 'https://wa.me/', 
    color: 'hover:bg-green-600 hover:text-white',
    bgColor: 'bg-green-100 text-green-600'
  },
  { 
    name: 'تيليجرام', 
    icon: Send, 
    url: 'https://t.me/', 
    color: 'hover:bg-blue-500 hover:text-white',
    bgColor: 'bg-blue-100 text-blue-500'
  },
];

export default function SocialLinks({ variant = 'footer' }) {
  if (variant === 'footer') {
    return (
      <div className="flex justify-center gap-4 flex-wrap">
        {SOCIAL_LINKS.map(social => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${social.bgColor} ${social.color}`}
              title={social.name}
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-3 flex-wrap">
      {SOCIAL_LINKS.map(social => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${social.bgColor} ${social.color}`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{social.name}</span>
          </a>
        );
      })}
    </div>
  );
}