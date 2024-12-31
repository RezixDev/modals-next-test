// components/ChatMessages.js
export default function ChatMessages({ messages, isLoading }) {
  return (
    <div className="space-y-4 mb-4 h-[500px] overflow-y-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            message.role === 'user' 
              ? 'bg-blue-100 ml-auto max-w-[80%]' 
              : message.role === 'system'
              ? 'bg-red-100 mx-auto max-w-[80%]'
              : 'bg-gray-100 mr-auto max-w-[80%]'
          }`}
        >
          <p className="text-sm font-semibold mb-1">
            {message.role === 'user' ? 'You' : 
             message.role === 'system' ? 'System' : 'Assistant'}
          </p>
          <p>{message.content}</p>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}