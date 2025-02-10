
# Table of Contents

1.  [POST  `/auth/register/`](#register)
    1.  [Required Fields](#orgbbffc34)
        1.  [`firstName` **required**](#org2e1f3f0)
        2.  [`lastName` **required**](#orgcb1d974)
        3.  [`email` **required**](#org09ca9e1)
        4.  [`password` **required**](#org1d7eb49)
2.  [POST  `/auth/login/`](#login)
    1.  [Required Fields](#org4222e40)
        1.  [`email` **required**](#orgadf28ad)
        2.  [`password` **required**](#orgc336d0e)
3.  [POST  `/auth/logout/`](#logout)
    1.  [Required Fields](#orgd99045a)

Auth routes are located at `/api/v1/auth/`.


<a id="register"></a>

# POST  `/auth/register/`

Add a new URL.


<a id="orgbbffc34"></a>

## Required Fields


<a id="org2e1f3f0"></a>

### `firstName` **required**

The first name for the registration.

Type: string


<a id="orgcb1d974"></a>

### `lastName` **required**

The last name for the registration.

Type: string


<a id="org09ca9e1"></a>

### `email` **required**

The email for the registration.

Type: string


<a id="org1d7eb49"></a>

### `password` **required**

The password for the registration.

Type: string


<a id="login"></a>

# POST  `/auth/login/`

Add a new URL.


<a id="org4222e40"></a>

## Required Fields


<a id="orgadf28ad"></a>

### `email` **required**

The email for the authentication.

Type: string


<a id="orgc336d0e"></a>

### `password` **required**

The password for the authentication.

Type: string


<a id="logout"></a>

# POST  `/auth/logout/`

Add a new URL.

> **Authentication required**


<a id="orgd99045a"></a>

## Required Fields

No required fields

