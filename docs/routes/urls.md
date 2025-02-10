
# Table of Contents

1.  [URL Routes](#org88f8b10)
    1.  [POST  `/urls/`](#addurl)
        1.  [Required Fields](#org6f46897)
    2.  [GET  `/urls/:id`](#geturl)
        1.  [Required Fields](#org51b33e9)
    3.  [DELETE  `/urls/:id`](#deleteurl)
        1.  [Required Fields](#org69e2a13)
    4.  [GET  `/urls/`](#geturls)
        1.  [Required Fields](#orgee1b646)
    5.  [GET  `/urls/:id/summary`](#getsummarybyid)
        1.  [Required Fields](#org647bf52)
    6.  [GET  `/url/summary`](#getsummary)
        1.  [Required Fields](#org72ef70b)



<a id="org88f8b10"></a>

# URL Routes

URL routes are located at `/api/v1/urls/`.

> ℹ️ ****Info:**** URL routes require authentication.
> See more in [Authentication](../auth.md).


<a id="addurl"></a>

## POST  `/urls/`

Add a new URL.


<a id="org6f46897"></a>

### Required Fields

1.  `originalUrl` **required**

    The URL to be shortened.
    
    Type: string


<a id="geturl"></a>

## GET  `/urls/:id`

Retrieve a URL by its ID.


<a id="org51b33e9"></a>

### Required Fields

1.  `id` **required**

    The ID of the URL being retrieved.
    
    Type: string


<a id="deleteurl"></a>

## DELETE  `/urls/:id`

Delete a URL by its ID.


<a id="org69e2a13"></a>

### Required Fields

1.  `id` **required**

    The ID of the URL being deleted.
    
    Type: string


<a id="geturls"></a>

## GET  `/urls/`

Retrieve all URLs associated with a user (`req.userId`).


<a id="orgee1b646"></a>

### Required Fields

No fields are required.


<a id="getsummarybyid"></a>

## GET  `/urls/:id/summary`

Retrieve statistics for a URL by its ID, such as total clicks, clicks by country, etc.


<a id="org647bf52"></a>

### Required Fields

1.  `id` **required**

    The ID of the URL for which the summary is being retrieved.
    
    Type: string


<a id="getsummary"></a>

## GET  `/url/summary`

Retrieve statistics about all urls the current user owns, such as total clicks, clicks by country, etc.


<a id="org72ef70b"></a>

### Required Fields

No fields are required.

