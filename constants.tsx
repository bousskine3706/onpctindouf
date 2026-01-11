
import React from 'react';

export const APP_NAME = "نظام الجرد الرقمي للتراث الثقافي – تندوف";
export const AGENCY_NAME = "الديوان الوطني للحظيرة الثقافية لتندوف";

export const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" stroke="#1e293b" strokeWidth="2"/>
    <path d="M50 20L80 70H20L50 20Z" fill="#b45309" opacity="0.8"/>
    <path d="M50 40L65 65H35L50 40Z" fill="#1e293b"/>
    <rect x="48" y="75" width="4" height="10" fill="#1e293b"/>
    <text x="50" y="95" textAnchor="middle" fontSize="6" fill="#1e293b" fontWeight="bold">TINDOUF</text>
  </svg>
);

export const COLORS = {
  primary: '#b45309', // Amber-700
  secondary: '#1e293b', // Slate-800
  accent: '#0f766e', // Teal-700
  bg: '#f8fafc',
  text: '#1e293b'
};
