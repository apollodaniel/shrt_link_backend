export interface ErrorEntry {
	code: string;
	field?: string; // for the case of using it as an field error
	message: string;
	statusCode: number;
}
