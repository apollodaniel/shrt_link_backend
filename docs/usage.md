
# Table of Contents

1.  [Requirements](#Requirements)
    1.  [Git](#orgc2dab5b)
    2.  [Node.js](#orgbab090a)
    3.  [Yarn (recommended)](#orgbc956eb)
2.  [Running the Project](#running)
3.  [Auth](#Auth)
    1.  [Login](#orgb952769)
    2.  [Register](#orgffdb468)
    3.  [Logout](#org079b7af)
    4.  [Validation](#org6fdf333)
        1.  [Validating Fields](#org6ae6a51)
        2.  [Validating Authentication](#orgfb86689)
4.  [Users](#User)
    1.  [Retrieving User Info](#orgca08f45)
        1.  [By ID](#orgf0dad29)
        2.  [Current User](#org2646e73)
5.  [Urls](#Url)
    1.  [Adding a New URL](#orgf45def9)
    2.  [Deleting a URL](#org34b30a2)
    3.  [Retrieving URL Information](#org5d95ec0)
        1.  [Retrieving a Specific URL](#org861be3f)
        2.  [Retrieving Multiple URLs](#org776cbc6)
    4.  [Retrieving URL Summary](#orge6a8fca)
        1.  [Retrieving a Specific URL Summary](#orgaf1a4a2)
        2.  [Retrieving a General Summary](#orgdab3093)

This project serves as a backend for a link shortener platform. It integrates [Authorization](#Auth), [User Management](#User), and [URL Management](#Url).

It can be used with the [Frontend](https://github.com/apollodaniel/shrt_link_frontend) or by calling the API (using an HTTP client like Postman or Curl from the command line).


<a id="Requirements"></a>

# Requirements

To reproduce the project on your machine, you need to meet some requirements.

The primary requirements are a few essential tools needed to run the project.


<a id="orgc2dab5b"></a>

## Git

Git is a version control system used in this project. You will need it to clone the repository.

You can find the installation guide [in their repository](https://github.com/git/git/blob/master/INSTALL) or on their [official website](https://git-scm.com/).


<a id="orgbab090a"></a>

## Node.js

This project uses the Node.js runtime to execute JavaScript.

You can find the installation guide [here](https://nodejs.org/en).


<a id="orgbc956eb"></a>

## Yarn (recommended)

Yarn is a package manager for Node.js and serves as an alternative to the default npm.

This project uses Yarn because of its speed and better logging capabilities.

> The project scripts in `package.json` use Yarn to execute commands like `build` and `start:dev`.

You can find the installation guide [here](https://yarnpkg.com/).


<a id="running"></a>

# Running the Project

Once the [requirements](#Requirements) are met, you can run the project. You can either run it locally or host it (self-hosted or on a hosting platform).

> This guide only covers how to run it locally.

First, you need to clone the project repository and navigate to the project root:

    git clone https://github.com/apollodaniel/shrt_link_backend && cd shrt_link_backend

Once you have the project, install all Node.js dependencies:

    yarn install

or if you use npm:

    npm install

After installing the dependencies, you can start the project using:

    yarn start:dev

or if you use npm:

    npm run start:dev

The expected output should be:

    yarn run <yarn-version> # Yarn specific
    $ yarn run ts-node-dev --inspect --respawn src/index.ts
    $ <project-location>/shrt_link_backend/node_modules/.bin/ts-node-dev --inspect --respawn src/index.ts
    [INFO] 12:35:28 ts-node-dev ver. <ts-node-dev-version> (using ts-node ver. <ts-node-version>, TypeScript ver. <typescript-version>)
    Debugger listening on <debugger-websocket-url>
    For help, see: https://nodejs.org/en/docs/inspector
    Initialized AppDataSource
    Listening on port <express-port-defined-on-environment-variables>

Once running, you can test the backend by pinging the route `/api/v1/ping`.

For example:

    curl http://localhost:<defined-port>/api/v1/ping

Expected output:

    pong!

At this point, you can proceed to [authenticate a user](#Auth) and [register a URL](#Url) for testing.

> If you&rsquo;re using **Curl** or an HTTP client like **Postman**, ensure you handle JWT tokens correctly. They are saved as HTTP-only cookies, so you must copy cookies from the register/login response and include them in authenticated requests.


<a id="Auth"></a>

# Auth

Authentication routes handle authorization, authentication, and validation.

More details are available [here](auth.md).


<a id="orgb952769"></a>

## Login

Login is handled at `/auth/login`.

See the requirements in [Login](./routes/auth.md).

The expected response contains two cookies:

-   authToken (a JWT for authorization)
-   refreshToken (a JWT for refreshing the authToken)

More details on cookies are available [here](cookies.md).


<a id="orgffdb468"></a>

## Register

Registration is handled at `/auth/register`.

This process registers and logs in the user, resulting in an outcome similar to [Login](#orgb952769).


<a id="org079b7af"></a>

## Logout

Logout is handled at `/auth/logout`.

See the requirements in [Logout](./routes/auth.md).

The expected response contains two expired cookies:

-   authToken (a JWT for authorization)
-   refreshToken (a JWT for refreshing the authToken)

More details on cookies are available [here](cookies.md).


<a id="org6fdf333"></a>

## Validation

Validation occurs in two steps: field validation and authentication validation.


<a id="org6ae6a51"></a>

### Validating Fields

Field validation uses express-validator to enforce predefined schemas.

It is implemented as a middleware called `validate` from `ValidationController`. See more details [here](auth.md).


<a id="orgfb86689"></a>

### Validating Authentication

This step verifies request authorization and automatically refreshes expired tokens. More details [here](auth.md).


<a id="User"></a>

# Users

User routes handle user management (retrieving information, deleting accounts, etc.).

All user routes require authentication.


<a id="orgca08f45"></a>

## Retrieving User Info

User information can be retrieved by ID or based on the currently authenticated user.


<a id="orgf0dad29"></a>

### By ID

Retrieve user information by ID via `/users/:id`

See the requirements [here](./routes/users.md).

Expected JSON response:

    {
        "id": "7c754d32-939c-47e9-96be-a5a4d258c480",
        "firstName": "John",
        "lastName": "Doe",
        "email": "example@test.com",
        "creationDate": "2025-02-10T16:43:49.050Z"
    }


<a id="org2646e73"></a>

### Current User

Retrieve the current user&rsquo;s information via `/users/current`

> Authentication is required to access this endpoint.

See the requirements [here](./routes/users.md).


<a id="Url"></a>

# Urls

URL routes manage URL creation, deletion, retrieval, and statistics.

All URL routes require authentication.


<a id="orgf45def9"></a>

## Adding a New URL

Create a new URL using `/urls/`

See the requirements [here](routes/urls.md).

Expected response: HTTP 200.


<a id="org34b30a2"></a>

## Deleting a URL

Delete a URL via `/urls/:id`

See the requirements [here](routes/urls.md).

Expected response: HTTP 200.


<a id="org5d95ec0"></a>

## Retrieving URL Information

You can retrieve URL information in two ways: by getting a specific URL&rsquo;s details using its ID or by fetching all URLs owned by a user based on authentication.


<a id="org861be3f"></a>

### Retrieving a Specific URL

You can retrieve information about a specific URL at the route `/urls/:id`.

See the requirements [here](routes/urls.md).

The expected output is a JSON response that looks like this:

    {
        "id": "6BU5322",
        "originalUrl": "https://example.org",
        "creationDate": "2025-02-10T17:15:41.064Z"
    }


<a id="org776cbc6"></a>

### Retrieving Multiple URLs

You can retrieve information about multiple URLs at the route `/urls/`.

See the requirements [here](routes/urls.md).

The expected output is a JSON response that looks like this:

    [
        {
            "id": "6BU5322",
            "originalUrl": "https://example.org",
            "creationDate": "2025-02-10T17:15:41.064Z"
        },
        {
            "id": "F3J15f1",
            "originalUrl": "https://api.example.org",
            "creationDate": "2025-02-10T17:16:55.092Z"
        }
    ]


<a id="orge6a8fca"></a>

## Retrieving URL Summary

You can retrieve a URL summary in two ways: by getting a specific URL&rsquo;s summary using its ID or by fetching a general summary of all URLs based on user authentication.


<a id="orgaf1a4a2"></a>

### Retrieving a Specific URL Summary

You can retrieve a specific URL summary at the route `/urls/:id/summary`.

See the requirements [here](routes/urls.md).

The expected output is a JSON response that looks like this:

    {
        "countByCountry": [
            {
                "country": "Brazil",
                "count": 4
            }
        ],
        "countByDevice": [
            {
                "device": "Linux",
                "count": 3
            }
        ],
        "countByBrowser": [
            {
                "browser": "Chrome",
                "count": 2
            }
        ],
        "countByDay": [
            {
                "day": "2025-02-06T00:00:00.000Z",
                "count": 4
            }
        ],
        "countByTimeOfDay": [
            {
                "hour": "16",
                "count": 4
            }
        ],
        "totalClicks": 4
    }


<a id="orgdab3093"></a>

### Retrieving a General Summary

You can retrieve a general URL summary at the route `/url/summary`.

See the requirements [here](routes/urls.md).

The expected output is a JSON response that looks like this:

    {
        "countByCountry": [
            {
                "country": "Brazil",
                "count": 4
            }
        ],
        "countByDevice": [
            {
                "device": "Linux",
                "count": 3
            }
        ],
        "countByBrowser": [
            {
                "browser": "Chrome",
                "count": 2
            }
        ],
        "countByDay": [
            {
                "day": "2025-02-06T00:00:00.000Z",
                "count": 4
            }
        ],
        "countByTimeOfDay": [
            {
                "hour": "16",
                "count": 4
            }
        ],
        "totalClicks": 4,
        "countByUrlId": [
            {
                "urlId": "6BU5322",
                "count": 1
            },
            {
                "urlId": "F3J15f1",
                "count": 3
            }
        ]
    }

