
# Table of Contents

1.  [Cookie Configuration](#org815eb3c)
    1.  [authToken Cookie](#org3ab1c64)
    2.  [refreshToken Cookie](#org53ecf89)
2.  [Conclusion](#org039efce)

In this project, cookies are used primarily for authorization, specifically HTTP-only cookies.

There are two main cookies used in this project: **authToken** and **refreshToken**. These cookies are set when a user logs in, registers a new account, or when they are refreshed during validation.

When the user logs out, the cookies are cleared using Express&rsquo; `clearCookie` method, which sets the cookie to an expired date.


<a id="org815eb3c"></a>

# Cookie Configuration

The configuration for the cookies can be found in the `auth.cookies.ts` file. Below is a breakdown of each cookie&rsquo;s configuration:


<a id="org3ab1c64"></a>

## authToken Cookie

The `authToken` cookie is used for maintaining the user&rsquo;s session after login. It has a short lifespan of 30 minutes and is configured with the following options:

-   **maxAge**: `30 * 60 * 1000` (30 minutes)
    
    This defines the expiration time of the cookie in milliseconds. The cookie will expire after 30 minutes, after which the user must reauthenticate.

-   **httpOnly**: `true`
    
    This flag ensures that the cookie is accessible only via HTTP requests, meaning it cannot be accessed through JavaScript. This enhances security by preventing client-side scripts from accessing the token.

-   **secure**: `true`
    
    The cookie will only be sent over HTTPS connections, ensuring that the token is not exposed over insecure channels.

-   **sameSite**: `'strict'`
    
    The cookie will be sent only in requests from the same origin as the website, adding an additional layer of protection against cross-site request forgery (CSRF) attacks.


<a id="org53ecf89"></a>

## refreshToken Cookie

The `refreshToken` cookie is used to refresh the session when the `authToken` expires. It has a longer lifespan of 30 days, allowing the user to remain logged in for an extended period. Its configuration options are as follows:

-   **maxAge**: `30 * 24 * 60 * 60 * 1000` (30 days)
    
    This defines the expiration time of the cookie in milliseconds. The refresh token will remain valid for 30 days, allowing users to refresh their session without needing to log in again.

-   **httpOnly**: `true`
    
    Just like the `authToken`, this ensures the refresh token is only accessible via HTTP requests and not exposed to JavaScript.

-   **secure**: `true`
    
    The cookie will be transmitted only over secure HTTPS connections, providing a safeguard against potential interception.

-   **sameSite**: `'strict'`
    
    The cookie will only be sent in requests originating from the same domain, mitigating CSRF risks.


<a id="org039efce"></a>

# Conclusion

Both the `authToken` and `refreshToken` cookies are set with security features like `httpOnly`, `secure`, and `sameSite` to protect against common security threats. The session management is handled through a combination of these two cookies, which ensure that users can stay logged in securely while minimizing the risk of unauthorized access.

