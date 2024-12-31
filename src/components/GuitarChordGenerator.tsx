"use client";
import React, { useState, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChordDiagram } from "@/components/ChordDiagram"; // Import the ChordDiagram component

interface Chord {
	name: string;
	positions: number[];
	fingering: number[];
}

interface ChordResponse {
	chord: Chord;
	error?: string;
}

const GuitarChordGenerator: React.FC = () => {
	const [chord, setChord] = useState<Chord | undefined>();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null); // Ref for the input field

	// Common chord progressions
	const commonProgressions = ["C G Am F", "Am F C G", "Em C G D", "D A Bm G"];

	const generateChord = async (chordName: string) => {
		if (!chordName?.trim()) {
			setError("Please enter a chord name");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/generateChord", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ chord: chordName }),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData.error || `HTTP error! status: ${response.status}`
				);
			}

			const data: ChordResponse = await response.json().catch(() => {
				throw new Error("Failed to parse response from server");
			});

			if (data.error) {
				throw new Error(data.error);
			}

			if (!data.chord) {
				throw new Error("No chord data received");
			}

			console.log("API Response:", data); // Debugging: Log the API response
			setChord(data.chord);
		} catch (err) {
			console.error("Chord generation error:", err);
			setError(err instanceof Error ? err.message : "Failed to generate chord");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSend = () => {
		const inputValue = inputRef.current?.value.trim(); // Access the input value
		if (inputValue) {
			generateChord(inputValue);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold mb-4">AI Guitar Chord Generator</h2>
				<p className="text-gray-600 mb-6">
					Generate and visualize guitar chords using AI
				</p>
			</div>

			{/* Input Field */}
			<div className="flex gap-4 mb-6">
				<input
					type="text"
					placeholder="Enter chord (e.g. Am, C, G)"
					className="flex-1 p-2 border rounded"
					ref={inputRef} // Attach the ref to the input field
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							handleSend();
						}
					}}
				/>
				<button
					onClick={handleSend}
					className={`px-4 py-2 rounded-lg ${
						isLoading || !inputRef.current?.value.trim()
							? "bg-gray-300 cursor-not-allowed"
							: "bg-blue-500 hover:bg-blue-600 text-white"
					}`}
					disabled={isLoading || !inputRef.current?.value.trim()}
				>
					{isLoading ? "Generating..." : "Generate"}
				</button>
			</div>

			{/* Common Progressions */}
			<div className="space-y-2">
				<h3 className="font-semibold">Common Progressions:</h3>
				<div className="flex flex-wrap gap-2">
					{commonProgressions.map((prog, i) => (
						<button
							key={i}
							className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
							onClick={() => {
								const chords = prog.split(" ");
								const randomChord =
									chords[Math.floor(Math.random() * chords.length)];
								generateChord(randomChord);
							}}
						>
							{prog}
						</button>
					))}
				</div>
			</div>

			{/* Error Message */}
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Guitar Neck Visualization */}
			<div className="mt-8 border rounded-lg p-4 bg-white">
				{chord ? (
					<>
						<h3 className="text-xl font-bold mb-4 text-center">{chord.name}</h3>
						<ChordDiagram
							name={chord.name}
							positions={chord.positions}
							fingering={chord.fingering}
						/>
					</>
				) : (
					<div className="h-48 flex items-center justify-center text-gray-500">
						Enter a chord to see the fingering
					</div>
				)}
			</div>
		</div>
	);
};

export default GuitarChordGenerator;
