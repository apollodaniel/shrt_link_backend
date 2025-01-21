/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: 'node',
	transform: {
		'^.+.tsx?$': ['ts-jest', {}],
	},
	verbose: true, // Shows more information, including file paths in test results
	maxWorkers: 1, // Set to 1 for more reliable output, especially with async tests
	collectCoverage: false, // Helps in detecting which parts
};
