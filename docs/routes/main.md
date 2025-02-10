
# Table of Contents

1.  [GET  `/:id`](#org6725d56)
2.  [Required fields](#orgeb3c653)
    1.  [id](#org97db1f6)

Main routes are the routes that run on project root `/`


<a id="org6725d56"></a>

# GET  `/:id`

Acess a url by its id ( a 7 char code )

When acessing this route the endpoint get some information from the client,
like User-Agent, Ip Adress and save the statistics for url summary.

In case of error when getting ip adress geo-location or getting user-agent, the statistic is **NOT** saved on database.

The response may redirect user to the requested url.


<a id="orgeb3c653"></a>

# Required fields


<a id="org97db1f6"></a>

## id

A 7 char long Id that represents the shortned url
Location: request params

