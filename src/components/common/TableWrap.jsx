import React from 'react'

export function TableWrap({ children, minWidth = 'min-w-[680px]' }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${minWidth} text-left text-xs`}>
        {children}
      </table>
    </div>
  )
}

