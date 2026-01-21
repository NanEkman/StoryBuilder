import React from 'react'

export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-lg border bg-white shadow-sm p-6 ${className}`}>
      {children}
    </div>
  )
}
