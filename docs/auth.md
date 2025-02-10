
# Table of Contents

1.  [Validation Middlewares](#validation-middlewares)
    1.  [How It Works](#org7bfde5e)
    2.  [Validate With Auth](#org91f09ae)
        1.  [Auth Token](#org64cef19)
        2.  [Refresh Token](#orge03c461)

Authentication is implemented using JSON Web Tokens (JWT) in the [validation middlewares](#validation-middlewares).

The user session is stored in a database table called **auth**, which contains the `refreshToken` and `userId`.


<a id="validation-middlewares"></a>

# Validation Middlewares

Validation middlewares are responsible for validating fields and user authentication in requests.


<a id="org7bfde5e"></a>

## How It Works

There are two validation middlewares: `validate` and `validateWithAuth`.

The `validate` middleware checks the fields using `express-validator`.
The `validateWithAuth` middleware first uses the `validate` middleware to validate the fields and then validates the user tokens.


<a id="org91f09ae"></a>

## Validate With Auth

This middleware is responsible for handling authorization in most routes.

The middleware first checks for tokens (`refreshToken` and `authToken`) in the request cookies.

Once all token checks are successfully passed, it sets the `userId` property on the request.

> ℹ️ ****Info:**** The `userId` property is not native to the Express package. It is an extended interface for the request, defined in `/types/index.d.ts`.


<a id="org64cef19"></a>

### Auth Token

For the auth token, the middleware verifies whether it is valid and not expired.
If the token is expired, it refreshes it and sets the new cookie in the response.


<a id="orge03c461"></a>

### Refresh Token

If the refresh token is invalid, the middleware clears the token cookies and removes the authorized session from the database.

