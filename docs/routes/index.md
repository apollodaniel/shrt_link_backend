
# Table of Contents

1.  [Main](#org9fa64d9)
    1.  [GET  `/:id`](#org5b57cbe)
2.  [User](#org3ef2ad3)
    1.  [GET  `/users/:id`](#org27c9d67)
    2.  [GET  `/users/current`](#orge76ea5a)
    3.  [DELETE  `/users/current`](#org5eeef40)
3.  [Auth](#org15017d4)
    1.  [POST  `/auth/login`](#orgb617ed0)
    2.  [POST  `/auth/register`](#org7c03919)
    3.  [POST  `/auth/logout`](#org55fe628)
4.  [Url](#org582f034)
    1.  [POST  `/urls/`](#org11fde7b)
    2.  [GET  `/urls/:id`](#org92d3a71)
    3.  [DELETE  `/urls/:id`](#orgefb50e0)
    4.  [GET  `/urls/`](#org62a9253)
    5.  [GET  `/urls/:id/summary`](#org682a592)



<a id="org9fa64d9"></a>

# [Main](main.md)


<a id="org5b57cbe"></a>

## GET  `/:id`

Acess a url by its id ( a 7 char code )


<a id="org3ef2ad3"></a>

# [User](users.md)


<a id="org27c9d67"></a>

## GET  `/users/:id`

Get info about a user by it&rsquo;s id


<a id="orge76ea5a"></a>

## GET  `/users/current`

Get info about current user using req.userId


<a id="org5eeef40"></a>

## DELETE  `/users/current`

Deletes the current user using req.userId


<a id="org15017d4"></a>

# [Auth](auth.md)


<a id="orgb617ed0"></a>

## POST  `/auth/login`

Login a user by it&rsquo;s credentials ( email and password )


<a id="org7c03919"></a>

## POST  `/auth/register`

Register a new user


<a id="org55fe628"></a>

## POST  `/auth/logout`

Logout current user by req.userId


<a id="org582f034"></a>

# [Url](urls.md)


<a id="org11fde7b"></a>

## POST  `/urls/`

Add a new url


<a id="org92d3a71"></a>

## GET  `/urls/:id`

Get url by it&rsquo;s id


<a id="orgefb50e0"></a>

## DELETE  `/urls/:id`

Delete a url by it&rsquo;s id


<a id="org62a9253"></a>

## GET  `/urls/`

Get all urls from a user (req.userId)


<a id="org682a592"></a>

## GET  `/urls/:id/summary`

Get url statistics by it&rsquo;s id, like total clicks, clicks by country, etc.

