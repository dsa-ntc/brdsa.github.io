/** A single block of the show. `id` is only for list keying/drag and drop, never exported. */
export interface Segment {
	id: string;
	title: string;
	seconds: number;
}

export interface ShowDetails {
	title: string;
	airDate: string;
	hosts: string;
	director: string;
	technicalDirector: string;
	audioEngineer: string;
	/** Target length of the whole show, in seconds. */
	runtime: number;
	/** Wall clock time the recording starts, "HH:MM" (the value of <input type="time">). */
	recordingTime: string;
}

export interface ShowPlan {
	details: ShowDetails;
	segments: Segment[];
}

/** A segment plus its computed position in the show. Offsets are seconds from the top of the show. */
export interface ScheduledSegment extends Segment {
	begin: number;
	end: number;
	/** Formatted wall clock times, or null when no recording time is set. */
	clockBegin: string | null;
	clockEnd: string | null;
}

const DAY = 24 * 60 * 60;

let nextSegmentId = 0;
export function makeSegment(title = "", seconds = 5 * 60): Segment {
	return { id: `segment-${nextSegmentId++}`, title, seconds };
}

export function defaultPlan(): ShowPlan {
	return {
		details: {
			title: "BRDSA Radio Show",
			airDate: "",
			hosts: "",
			director: "",
			technicalDirector: "",
			audioEngineer: "",
			runtime: 30 * 60,
			recordingTime: ""
		},
		segments: [
			makeSegment("cold open", 30),
			makeSegment("host intro", 60),
			makeSegment("topic intro", 2 * 60),
			makeSegment("community", 5 * 60),
			makeSegment("foreign policy", 5 * 60),
			makeSegment("democracy", 5 * 60),
			makeSegment("outro, plugs", 2 * 60)
		]
	};
}

/** mm:ss, minutes unbounded (a 75 minute show is "75:00"). */
export function formatDuration(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Formats an offset from the top of the show; negative values keep their sign. */
export function formatOffset(seconds: number): string {
	return seconds < 0 ? `-${formatDuration(-seconds)}` : formatDuration(seconds);
}

function parseClock(time: string): number | null {
	const match = time.match(/^(\d{1,2}):(\d{2})/);
	if (!match) return null;
	return Number(match[1]) * 3600 + Number(match[2]) * 60;
}

function formatClock(secondsOfDay: number): string {
	const t = ((secondsOfDay % DAY) + DAY) % DAY;
	const h = Math.floor(t / 3600);
	const m = Math.floor((t % 3600) / 60);
	const s = t % 60;
	const suffix = h < 12 ? "AM" : "PM";
	return `${h % 12 || 12}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} ${suffix}`;
}

export function schedule(plan: ShowPlan): ScheduledSegment[] {
	const start = parseClock(plan.details.recordingTime);
	let elapsed = 0;
	return plan.segments.map((segment) => {
		const begin = elapsed;
		elapsed += segment.seconds;
		return {
			...segment,
			begin,
			end: elapsed,
			clockBegin: start === null ? null : formatClock(start + begin),
			clockEnd: start === null ? null : formatClock(start + elapsed)
		};
	});
}

export function totalSeconds(segments: Segment[]): number {
	return segments.reduce((sum, s) => sum + s.seconds, 0);
}

function csvCell(value: string): string {
	return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export function toCsv(plan: ShowPlan): string {
	const rows = [
		["Segment", "Duration", "Begin", "End", "Clock begin", "Clock end"],
		...schedule(plan).map((s) => [
			s.title,
			formatDuration(s.seconds),
			formatDuration(s.begin),
			formatDuration(s.end),
			s.clockBegin ?? "",
			s.clockEnd ?? ""
		])
	];
	return rows.map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

// Sharing: the whole plan travels in the URL hash as base64url JSON, so a link is all a co-host needs.
// Segment ids are not encoded; they are regenerated on load.

const HASH_PLAN = "p";
const HASH_VIEW = "view";

interface EncodedPlan {
	d: ShowDetails;
	s: [string, number][];
}

function toBase64Url(text: string): string {
	const bytes = new TextEncoder().encode(text);
	return btoa(String.fromCharCode(...bytes))
		.replaceAll("+", "-")
		.replaceAll("/", "_")
		.replaceAll("=", "");
}

function fromBase64Url(encoded: string): string {
	const binary = atob(encoded.replaceAll("-", "+").replaceAll("_", "/"));
	return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

export function encodeHash(plan: ShowPlan, view: boolean): string {
	const payload: EncodedPlan = {
		d: plan.details,
		s: plan.segments.map((s) => [s.title, s.seconds])
	};
	const params = new URLSearchParams({ [HASH_PLAN]: toBase64Url(JSON.stringify(payload)) });
	if (view) params.set(HASH_VIEW, "1");
	return `#${params}`;
}

/** Reads a plan back out of a URL hash. Returns null for an empty or unreadable hash. */
export function decodeHash(hash: string): { plan: ShowPlan; view: boolean } | null {
	const params = new URLSearchParams(hash.replace(/^#/, ""));
	const encoded = params.get(HASH_PLAN);
	if (!encoded) return null;
	try {
		const { d, s } = JSON.parse(fromBase64Url(encoded)) as EncodedPlan;
		const fallback = defaultPlan().details;
		const text = (value: unknown, or: string) => (typeof value === "string" ? value : or);
		const seconds = (value: unknown) =>
			Number.isFinite(value) && (value as number) >= 0 ? Math.floor(value as number) : 0;
		return {
			view: params.get(HASH_VIEW) === "1",
			plan: {
				details: {
					title: text(d.title, fallback.title),
					airDate: text(d.airDate, ""),
					hosts: text(d.hosts, ""),
					director: text(d.director, ""),
					technicalDirector: text(d.technicalDirector, ""),
					audioEngineer: text(d.audioEngineer, ""),
					runtime: Number.isFinite(d.runtime) ? seconds(d.runtime) : fallback.runtime,
					recordingTime: text(d.recordingTime, "")
				},
				segments: s.map(([title, secs]) => makeSegment(text(title, ""), seconds(secs)))
			}
		};
	} catch {
		return null;
	}
}
