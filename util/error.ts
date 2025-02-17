class HttpException extends Error {
	constructor(
		public code: number,
		message: string
	) {
		super(message);
	}
}

export { HttpException };
