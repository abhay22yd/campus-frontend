import React from "react";

// Added isAdmin prop to control who sees the buttons
function ComplaintList({ complaints = [], onDelete, onResolve, isAdmin }) {
  const list = complaints || [];

  if (list.length === 0) {
    return (
      <div className="surface text-center p-10 w-full">
        <p className="muted font-medium">No complaints found. Campus is peaceful.</p>
      </div>
    );
  }

  return (
    <div className="w-full grid gap-4 md:gap-5">
      {list.map((item) => (
        <div key={item._id || item.id} className="surface p-5 md:p-6 relative overflow-hidden">
          {/* Status Indicator Bar */}
          <div className={`absolute top-0 left-0 w-1 h-full ${
            item.status === 'Resolved' ? 'bg-green-500' : 'bg-blue-500'
          }`}></div>

          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col gap-1">
              <span className={`w-fit text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                item.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {item.category || "General"}
              </span>
              <p className="text-[11px] muted font-medium italic">
                By: {item.user?.name || "Unknown Student"}
              </p>
            </div>
            <span className="muted text-[10px] font-mono">ID: {(item._id || "").toString().slice(-5)}</span>
          </div>

          <h3 className="text-xl font-bold mb-1">{item.title}</h3>
          <p className="muted text-sm leading-relaxed">{item.description}</p>

          <div className="mt-6 pt-4 border-t flex justify-between items-center" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${item.status === 'Resolved' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <span className="text-xs font-bold uppercase tracking-wider">{item.status}</span>
            </div>

            <div className="flex gap-4">
              {isAdmin && item.status !== "Resolved" && (
                <button 
                  onClick={() => onResolve(item._id)} 
                  className="text-green-500 text-xs font-black hover:underline transition-all"
                >
                  Resolve
                </button>
              )}
              
              {isAdmin && (
                <button 
                  onClick={() => onDelete(item._id)} 
                  className="text-red-400 text-xs font-bold hover:text-red-500 transition-all"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ComplaintList;