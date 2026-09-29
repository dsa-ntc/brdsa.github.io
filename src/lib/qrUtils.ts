import type { QRPreset } from '$lib/types';
const DEFAULT_LOGO = '/images/brdsa-qr-logo.png';

const IMAGE_SIZE_START = 0.6;
const IMAGE_SIZE_FLOOR = 0.2;
const IMAGE_SIZE_STEP = 0.05;

function logoPath(preset: QRPreset) {
	return preset.image ?? DEFAULT_LOGO;
}

function presetToQROptions(preset: QRPreset, url: string, size?: number) {
	return {
		...preset.props,
		...(size !== undefined ? { width: size, height: size } : {}),
		data: url,
		image: logoPath(preset),
		imageOptions: {
			...preset.props.imageOptions,
			crossOrigin: 'anonymous' as const,
		},
		backgroundOptions: {
			color: preset.style.background ?? '#ffffff',
		},
	};
}

async function scanBlob(blob: Blob): Promise<string | null> {
	const QrScanner = (await import('qr-scanner')).default;
	try {
		const result = await QrScanner.scanImage(blob, { returnDetailedScanResult: true });
		return result.data;
	} catch {
		return null;
	}
}

export async function renderQRToBlob(url: string, preset: QRPreset): Promise<Blob> {
	// Dynamic import keeps qr-code-styling out of the SSR bundle
	const { default: QRCodeStyling } = await import('qr-code-styling');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const qr = new (QRCodeStyling as any)(presetToQROptions(preset, url));
	const blob: Blob | null = await qr.getRawData('png');
	if (!blob) throw new Error(`QR generation returned null for ${url}`);
	return blob;
}

export async function renderQRToBlobVerified(url: string, preset: QRPreset): Promise<Blob> {
	let imageSize = IMAGE_SIZE_START;

	while (imageSize >= IMAGE_SIZE_FLOOR) {
		const adjusted: QRPreset = {
			...preset,
			props: {
				...preset.props,
				imageOptions: { ...preset.props.imageOptions, imageSize },
			},
		};
		const blob = await renderQRToBlob(url, adjusted);
		const scanned = await scanBlob(blob);
		if (scanned === url) return blob;
		imageSize = Math.round((imageSize - IMAGE_SIZE_STEP) * 100) / 100;
	}

	// Floor reached without a clean scan — return at floor size anyway rather than failing
	return renderQRToBlob(url, {
		...preset,
		props: {
			...preset.props,
			imageOptions: { ...preset.props.imageOptions, imageSize: IMAGE_SIZE_FLOOR },
		},
	});
}

export async function renderQRPreview(
	url: string,
	preset: QRPreset,
	element: HTMLElement,
	size = 150
) {
	const { default: QRCodeStyling } = await import('qr-code-styling');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const qr = new (QRCodeStyling as any)(presetToQROptions(preset, url, size));
	qr.append(element);
}

export function sanitizeFilename(url: string): string {
	return url
		.replace(/^https?:\/\//, '')
		.replace(/[/?=&#.]/g, '-')
		// Anything else unsafe in a zip entry name (spaces, quotes, colons, ...)
		.replace(/[^a-zA-Z0-9_-]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

/** One row of work: a URL plus the presets selected for that URL alone. */
export interface QRJob {
	url: string;
	/** Optional folder name; falls back to a sanitized form of the URL. */
	label?: string;
	presets: QRPreset[];
}

export function countJobImages(jobs: QRJob[]): number {
	return jobs.reduce((n, job) => n + job.presets.length, 0);
}

export async function buildZip(
	jobs: QRJob[],
	onProgress?: (done: number, total: number) => void
): Promise<Blob> {
	const { default: JSZip } = await import('jszip');

	const zip = new JSZip();
	const total = countJobImages(jobs);
	let done = 0;
	const usedNames = new Set<string>();

	for (const job of jobs) {
		if (job.presets.length === 0) continue;

		// Distinct folder per row, so two rows sharing a URL don't collide
		const base = sanitizeFilename(job.label?.trim() || job.url) || 'qr';
		let name = base;
		let n = 2;
		while (usedNames.has(name)) name = `${base}-${n++}`;
		usedNames.add(name);

		const folder = zip.folder(name)!;
		for (const preset of job.presets) {
			const blob = await renderQRToBlobVerified(job.url, preset);
			folder.file(`${preset.id}.png`, blob);
			onProgress?.(++done, total);
		}
	}

	return zip.generateAsync({ type: 'blob' });
}

export async function exportPresetJson(preset: QRPreset): Promise<void> {
	const { saveAs } = await import('file-saver');

	const logoResp = await fetch(logoPath(preset));
	const logoBlob = await logoResp.blob();
	const logoDataUri = await new Promise<string>((resolve) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.readAsDataURL(logoBlob);
	});

	const exportObj = {
		props: {
			...preset.props,
			image: logoDataUri,
			data: 'https://brdsa.org',
		},
		style: preset.style,
		frame: null,
	};

	const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
	saveAs(blob, `${preset.id}.json`);
}
