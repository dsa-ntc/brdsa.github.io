 export const config  = {
	title: 'Baton Rouge DSA',
	location: 'https://brdsa.org',
	tagLine: 'Homepage for Baton Rouge DSA (BRDSA)',
	description: 'Website for the Baton Rouge chapter of the Democratic Socialists of America (BRDSA)',
	author: "BRDSA",
	email: "brdsa@gmail.com",
	// title is visible, link is link, caption is put in tooltip <a href={link} title={caption}>{title}</a>
	headerLinks: [
		{ title: 'About', link: '/about', caption:'Learn about our organization' },
		{ title: 'Our Work', link: '/campaigns', caption:'Learn about what we do' },
		{ title: 'FITE', link: '/fite', caption:'Learn about Famine Is The Enemy (FITE)' },
		{ title: 'Get Involved', link: '/get-involved', caption:'Learn how you can get involved' },
		{ title: 'Donate', link: '/donate', caption:'Information about donating to BRDSA' },
		{ title: 'Statements', link: '/blog', caption:'See our statements and posts' },
	],
	socials:
	{
		Instagram: 'https://www.instagram.com/batonrougedsa',
		Bluesky: 'https://bsky.app/profile/batonrougedsa.bsky.social',
		Facebook: 'https://www.facebook.com/batonrougedsa',
		Twitter: 'https://twitter.com/BatonRougeDSA',
		GitHub: 'https://github.com/dsa-ntc/brdsa.github.io',
		EmailUs: 'mailto:batonrougedsa@gmail.com',
		Newsletter: 'https://actionnetwork.org/forms/join-brdsa',
	}
};
