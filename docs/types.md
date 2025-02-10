
# Table of Contents

1.  [Custom Request](#custom-request)
2.  [Custom Types](#custom-types)
    1.  [Auth Types ( `src/modules/auth/auth.types.ts` )](#org3af2f5e)

This project includes some custom type implementations that extend certain libraries, such as Express&rsquo; Request object, and custom types for general purposes.


<a id="custom-request"></a>

# Custom Request

We use a &ldquo;custom&rdquo; request interface for Express. It is an extension of the original Request interface, adding a `userId` field to simplify the process of accessing the user ID in authenticated routes.

Note that this can cause errors if used in routes that do not validate authentication with **ValidationController.validateWithAuth**.

It is declared in `types/index.d.ts`:

    import 'express';
    
    declare global {
    	namespace Express {
    		interface Request {
    			userId?: string;
    		}
    	}
    }


<a id="custom-types"></a>

# Custom Types

The custom types are located in `src/modules/<module>/<module>.types.ts` and define types specific to individual modules. Here&rsquo;s an example:


<a id="org3af2f5e"></a>

## Auth Types ( `src/modules/auth/auth.types.ts` )

    export interface AuthCredentials {
    	email: string;
    	password: string;
    }

