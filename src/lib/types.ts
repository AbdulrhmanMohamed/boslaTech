export interface Site {
	siteName: string;
	tagline: string;
	description: string;
	ogImage: string;
	nav: { home: string; about: string; services: string; portfolio: string; contact: string };
	langLabel: { en: string; ar: string };
	registeredAs: string;
	commercialRegistration: string;
	registeredAddress: string;
}

export interface Hero {
	headline: string;
	subheadline: string;
	ctaPrimary: { label: string; href: string };
	ctaSecondary: { label: string; href: string };
	image: { url: string; alt: string };
	trustBadge: {
		badge1: string;
		badge2: string;
	};
	benefits: string[];
	urgencyText: string;
}

export interface Metric {
	value: string;
	label: string;
}

export interface Vision {
	title: string;
	headline: string;
	content: string;
	region: string;
	icon: string;
}

export interface Mission {
	title: string;
	headline: string;
	content: string;
	icon: string;
}

export interface Section2Item {
	head: string;
	content: string;
}

export interface Section2 {
	head: string;
	sub: string;
	items: Section2Item[];
}

export interface Service {
	title: string;
	description: string;
	icon: string;
}

export interface Section4Item {
	head: string;
	content: string;
}

export interface Section4 {
	head: string;
	sub: string;
	items: Section4Item[];
}

export interface Client {
	title: string;
	subtitle: string;
	empty: string;
	logos: string[];
}

export interface Home {
	hero: Hero; // TODO: Refine this interface based on home.i18n.json
	highlights: any[];
	metrics: Metric[];
	vision: Vision;
	mission: Mission;
	section2: Section2;
	services: Service[];
	section4: Section4;
	clients: Client;
	portfolio: any;
	servicesPage: any;
	testimonials: any;
	cta: any;
}
