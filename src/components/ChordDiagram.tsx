import React from "react";

interface ChordDiagramProps {
	name: string;
	positions: number[];
	fingering: number[];
	fretWidth?: number;
	stringSpacing?: number;
	sidePadding?: number;
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
	name,
	positions,
	fingering,
	fretWidth = 50,
	stringSpacing = 30,
	sidePadding = 40,
}) => {
	const strings = 6;
	const frets = 5;
	const height = stringSpacing * (strings - 1) + 80; // Added more padding for text
	const width = fretWidth * frets + sidePadding * 2;

	const renderDot = (stringIndex: number, position: number, finger: number) => {
		if (position === -1) return null;

		const y = sidePadding + stringSpacing * (strings - 1 - stringIndex); // Mirrored Y position
		const x =
			position === 0
				? sidePadding - 15 // Open string
				: sidePadding + (position - 0.5) * fretWidth; // Show from first fret

		return (
			<g key={`dot-${stringIndex}`}>
				{position === 0 ? (
					// Open string circle
					<circle
						cx={x}
						cy={y}
						r={8}
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					/>
				) : (
					// Fretted note
					<>
						<circle cx={x} cy={y} r={12} fill="currentColor" />
						<text
							x={x}
							y={y + 5}
							textAnchor="middle"
							fill="white"
							fontSize="12px"
							fontFamily="Arial"
						>
							{finger}
						</text>
					</>
				)}
			</g>
		);
	};

	const renderMutedString = (stringIndex: number) => {
		const y = sidePadding + stringSpacing * (strings - 1 - stringIndex); // Mirrored Y position
		const x = sidePadding - 15;

		return (
			<text
				key={`muted-${stringIndex}`}
				x={x}
				y={y + 5}
				textAnchor="middle"
				fontSize="24px"
				fontFamily="Arial"
			>
				×
			</text>
		);
	};

	return (
		<div className="relative">
			<svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				className="overflow-visible"
			>
				{/* Chord name */}
				<text
					x={sidePadding + fretWidth * 2}
					y={25}
					textAnchor="middle"
					fontSize="20px"
					fontWeight="bold"
					fontFamily="Arial"
				>
					{name}
				</text>

				{/* Fret numbers */}
				{Array.from({ length: frets }).map((_, i) => (
					<text
						key={`fret-num-${i}`}
						x={sidePadding + fretWidth * i + fretWidth / 2}
						y={height - 20} // Adjusted Y position for fret numbers
						textAnchor="middle"
						fontSize="14px"
						fontFamily="Arial"
					>
						{i + 1}
					</text>
				))}

				{/* Strings - horizontal lines */}
				{Array.from({ length: strings }).map((_, i) => (
					<line
						key={`string-${i}`}
						x1={sidePadding}
						y1={sidePadding + stringSpacing * (strings - 1 - i)} // Mirrored Y position
						x2={width - sidePadding}
						y2={sidePadding + stringSpacing * (strings - 1 - i)} // Mirrored Y position
						stroke="currentColor"
						strokeWidth={1}
					/>
				))}

				{/* Frets - vertical lines */}
				{Array.from({ length: frets + 1 }).map((_, i) => (
					<line
						key={`fret-${i}`}
						x1={sidePadding + i * fretWidth}
						y1={sidePadding}
						x2={sidePadding + i * fretWidth}
						y2={height - sidePadding - 0}
						stroke="currentColor"
						strokeWidth={i === 0 ? 3 : 1}
					/>
				))}

				{/* String labels (E A D G B e) */}
				{["E", "A", "D", "G", "B", "e"].map((label, i) => (
					<text
						key={`string-label-${i}`}
						x={15}
						y={sidePadding + stringSpacing * (strings - 1 - i) + 5} // Mirrored Y position
						textAnchor="middle"
						fontSize="14px"
						fontFamily="Arial"
					>
						{label}
					</text>
				))}

				{/* Dots and muted strings */}
				{positions.map((pos, i) =>
					pos === -1 ? renderMutedString(i) : renderDot(i, pos, fingering[i])
				)}
			</svg>
		</div>
	);
};
