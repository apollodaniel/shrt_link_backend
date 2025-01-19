export function generateUrlId(maxSize: number): string {
	let id = [];
	for (let i = 0; i < maxSize; i++) {
		const sum = Math.floor(Math.random() * 3);
		switch (sum) {
			case 2:
				id.push(
					String.fromCharCode(
						Math.floor(Math.random() * (90 - 65) + 65),
					),
				);
				break;
			case 1:
				id.push(
					String.fromCharCode(
						Math.floor(Math.random() * (122 - 97) + 97),
					),
				);
				break;
			default:
				id.push(Math.floor(Math.random() * 9).toString());
				break;
		}
	}
	return id.join('');
}
