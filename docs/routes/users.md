
# Table of Contents

1.  [GET  `/users/:id`](#getbyid)
    1.  [Required Fields](#orgf6eb3ff)
        1.  [`id` **required**](#orgfb5505c)
2.  [GET  `/users/current`](#getcurrent)
    1.  [Required Fields](#org55082fb)
3.  [DELETE  `/users/current`](#org0cb4bbb)
    1.  [Required Fields](#orgacb4cda)

User routes are located at `/api/v1/users/`.

> ℹ️ ****Info:**** User routes require authentication.
> See more in [Authentication](../auth.md).


<a id="getbyid"></a>

# GET  `/users/:id`

Retrieve information about a user by their ID.


<a id="orgf6eb3ff"></a>

## Required Fields


<a id="orgfb5505c"></a>

### `id` **required**

The ID of the user being retrieved.

Type: string


<a id="getcurrent"></a>

# GET  `/users/current`

Retrieve information about the current user using `req.userId`.


<a id="org55082fb"></a>

## Required Fields

No fields are required.


<a id="org0cb4bbb"></a>

# DELETE  `/users/current`

Delete the current user using `req.userId`.


<a id="orgacb4cda"></a>

## Required Fields

No fields are required.

