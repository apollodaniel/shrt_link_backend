import { Url } from '../urls/urls.entity';

export type IPLocation = {
	status: string;
	country: string;
	countryCode: string;
	region: string;
	regionName: string;
	city: string;
	zip: string;
	lat: number;
	lon: number;
	timezone: string;
	isp: string;
	org: string;
	as: string;
	query: string;
};

export type UrlSummary = {
	countByCountry: { country: string; count: number }[];
	countByDevice: { device: string; count: number }[];
	countByBrowser: { browser: string; count: number }[];
	countByDay: { day: number; count: number }[];
	countByTimeOfDay: { hour: number; count: number }[];
	totalClicks: number;
	url: Url;
};
