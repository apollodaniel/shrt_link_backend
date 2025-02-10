
# Table of Contents

1.  [Auth Controller Tests](#auth-tests)
2.  [User Controller Tests](#user-tests)
3.  [URL Controller Tests](#url-tests)
4.  [Validation Controller Tests](#validation-tests)

This section covers the project&rsquo;s test files, which use Jest to ensure modules and features work as expected.

The use of mocks for requests and responses is heavily employed to test controllers on routes.


<a id="auth-tests"></a>

# Auth Controller Tests

This section documents the tests for the \`AuthController\` in the project. The main focus is on verifying user authentication operations such as registration, login, logout, and token management.

The tests cover the following scenarios:

1.  Verifying that a user can be registered and the appropriate tokens are returned.
2.  Ensuring that when a user is registered, the correct authentication cookies are set.
3.  Testing the complete lifecycle of user authentication: registration, logout, and subsequent login, ensuring all steps execute without errors and cookies are handled correctly.


<a id="user-tests"></a>

# User Controller Tests

This section documents the tests for user-related functionalities in the project, with a focus on ensuring correct registration, user behavior, and interaction with the authentication system.

The tests cover the following scenarios:

1.  Verifying that user registration returns the necessary tokens (\`authToken\` and \`refreshToken\`).
2.  Ensuring that the correct cookies are set during user registration, particularly for authentication and refresh tokens.
3.  Testing the full user authentication lifecycle: registration, logout, and login, ensuring cookies are managed correctly across all stages.


<a id="url-tests"></a>

# URL Controller Tests

This section documents the tests for the \`UrlController\` in the project. The primary focus is to validate the functionality of URL creation, retrieval, deletion, and redirection.

The tests cover the following scenarios:

1.  Verifying the presence of valid authentication tokens.
2.  Ensuring correct URL creation and storage in the database.
3.  Retrieving a specific URL by its ID and ensuring the correct response.
4.  Ensuring all URLs associated with a user are correctly returned.
5.  Testing URL deletion and ensuring the URL is removed from the database.
6.  Verifying URL redirection and tracking statistics on access.
7.  Ensuring URL redirection works even when IP or User-Agent information is missing.
8.  Verifying that the URL summary is correctly returned.


<a id="validation-tests"></a>

# Validation Controller Tests

This section documents the tests for the \`ValidationController\` in the project. The focus is on validating tokens, handling expiration, and managing invalid tokens.

The tests cover the following scenarios:

1.  Validating authentication by checking for valid tokens and ensuring the validation process proceeds correctly.
2.  Ensuring proper handling when an authentication token expires, with revalidation taking place.
3.  Verifying the system&rsquo;s behavior when an invalid \`refreshToken\` is provided, ensuring it is cleared and the correct error response is issued.

