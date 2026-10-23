import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { PageServerLoad } from './$types';

const NEWSLETTER_DIR = join('static', 'newsletters');

const MONTHS = [
	'january', 'february', 'march', 'april', 'may', 'june',
	'july', 'august', 'september', 'october', 'november', 'december'
];

export interface Newsletter {
	title: string;
	href: string;
}

export interface NewsletterYear {
	year: string;
	newsletters: Newsletter[];
}

/** "mid-march" -> "Mid-March" */
function prettify(name: string): string {
	return name
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('-');
}

/**
 * Filenames aren't sortable on their own and git doesn't preserve file timestamps,
 * so derive order from the name: "march" < "mid-march" < "april" < ...
 * Names that don't match a month return -1 and sort after the known ones.
 */
function rank(name: string): number {
	const mid = name.startsWith('mid-');
	const month = MONTHS.indexOf(mid ? name.slice(4) : name);
	return month === -1 ? -1 : month * 2 + (mid ? 1 : 0);
}

export const load: PageServerLoad = () => {
	const years: NewsletterYear[] = readdirSync(NEWSLETTER_DIR, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
		.map((year) => {
			const newsletters = readdirSync(join(NEWSLETTER_DIR, year))
				.filter((file) => file.toLowerCase().endsWith('.pdf'))
				.map((file) => file.slice(0, -'.pdf'.length))
				.sort((a, b) => rank(b) - rank(a) || a.localeCompare(b))
				.map((name) => ({
					title: prettify(name),
					href: `/newsletters/${year}/${name}.pdf`
				}));
			return { year, newsletters };
		})
		.filter((year) => year.newsletters.length > 0);

	return { years };
};
