"use client";

import { useState, useRef, useEffect } from "react";
import { Message, ChatResponse } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import ReactMarkdown from "react-markdown";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useLocalStorage<Message[]>(
		"chat-messages",
		[]
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim()) return;

		setError(null);
		setIsLoading(true);

		const newMessage: Message = {
			role: "user",
			content: input,
			timestamp: Date.now(),
		};

		const newMessages = [...messages, newMessage];
		setMessages(newMessages);
		setInput("");

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ messages: newMessages }),
			});

			const data = (await response.json()) as ChatResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			const assistantMessage: Message = {
				role: "assistant",
				content: data.response,
				timestamp: Date.now(),
			};

			setMessages([...newMessages, assistantMessage]);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Chat with GPT-4</h1>

			<div className="flex-1 overflow-y-auto mb-4 space-y-4">
				{messages.map((msg, index) => (
					<div
						key={msg.timestamp}
						className={`p-4 rounded-lg ${
							msg.role === "user" ? "bg-blue-100 ml-8" : "bg-gray-100 mr-8"
						}`}
					>
						<div className="font-semibold mb-2">
							{msg.role === "user" ? "You" : "Assistant"}
						</div>
						<ReactMarkdown className="prose">{msg.content}</ReactMarkdown>
					</div>
				))}

				{isLoading && (
					<div className="flex items-center space-x-2 text-gray-500">
						<div className="animate-bounce">●</div>
						<div className="animate-bounce delay-100">●</div>
						<div className="animate-bounce delay-200">●</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{error && (
				<Alert variant="destructive" className="mb-4">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="flex space-x-2">
				<textarea
					className="flex-1 p-2 border rounded-lg resize-none"
					rows={2}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="Type your message..."
					disabled={isLoading}
				/>
				<button
					onClick={handleSend}
					disabled={isLoading || !input.trim()}
					className={`px-4 py-2 rounded-lg ${
						isLoading || !input.trim()
							? "bg-gray-300 cursor-not-allowed"
							: "bg-blue-500 hover:bg-blue-600 text-white"
					}`}
				>
					Send
				</button>
			</div>
		</div>
	);
}
