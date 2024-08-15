# **Chapter 4 - Authentication and Authorization**


## **Objectives**

* **Implement Authentication using both sessions and tokens, you should be able to detail every step in the process and some of the major security risks and mitigation steps available** 

* **Setup reset password and email verification functionality, take security methods to protect against DDOS and brute force attacks**

* **Create a complementary web and mobile client to interface with the server's authentication setup**

* **Implement the ability to revoke/blacklist a bad session or token and walk through the process of invalidating the access of bad actor**

* **Implement roles-based permissions and implement a route on the client application that requires elevated privileges to access**


### **<ins>Introduction</ins>**

<span style="font-sze:1.2em;">**Authentication**:</span>
 the process of verifying that some entity is what it claims to be (401 unauthorized)

Authentication can be based on one or more of the following:

* Something the user knows (password, PIN, pattern, etc.)
* Something the user has (SIM card, one-time password generator, or hardware token)
* A biometric property of the user (fingerprint, retina, voice)

<span style="font-sze:1.2em;">**Authorization**:the process of determining to which resources you have access (403 forbidden)</span>

<span style="font-size:1.2em;">A RESTful request is by definition stateless, i.e. each request must contain all of the information necessary to be understood by the server, rather than be dependent upon the server remembering prior requests. The server does not remember anything about the requester between requests.  

**Each request from client to server must contain all of the information necessary to understand the request, and cannot take advantage of any stored context on the server. Session state is therefore kept entirely on the client**

In practice there are many occasions where information about the requester needs to be persisted between requests and much debate and opinion exists regarding implementing this statefulness securely and effectively.</span>

Traditional web applications use remote sessions. In this approach, the application state is kept entirely on the server. 

The remote session style is a variant of client-server that attempts to minimize the complexity, or maximize the reuse, of the client components rather than the server component. Each client initiates a session on the server and then invokes a series of services on the server, finally exiting the session. Application state is kept entirely on the server.The advantages of the remote session style are that it is easier to centrally maintain the interface at the server, reducing concerns about inconsistencies in deployed clients when functionality is extended, and improves efficiency if the interactions make use of extended session context on the server. The disadvantages are that it reduces scalability of the server, due to the stored application state, and reduces visibility of interactions, since a monitor would have to know the complete state of the server

The stateless constraint induces the properties of visibility, reliability, and scalability: Visibility is improved because a monitoring system does not have to look beyond a single request datum in order to determine the full nature of the request. Reliability is improved because it eases the task of recovering from partial failures. Scalability is improved because not having to store state between requests allows the server component to quickly free resources, and further simplifies implementation because the server doesn't have to manage resource usage across requests.


### **<ins>Authentication</ins>**


**Maintaining State Between Requests**

If the client requests protected resources that require authentication, every request must contain all necessary data to be properly authenticated/authorized. And authentication data should belong to the standard HTTP Authorization header.

   The Authorization header field allows a user agent to authenticate itself with an origin server -- usually, but not necessarily, after receiving a 401 (Unauthorized) response. Its value consists of credentials containing the authentication information of the user agent for the realm of the resource being requested.

**The name of this HTTP header is unfortunate because it carries authentication instead of authorization data.**

For authentication, you could use the Basic HTTP Authentication scheme, which transmits credentials as username and password pairs, encoded using Base64:

Authorization: Basic <credentials>

If you don't want to send the username and password in each request, the username and password could be exchanged for a token (such as JWT) that is sent in each request. JWT can contain the username, an expiration date and any other metadata that may be relevant for your application:

Authorization: Bearer <token>


#### **<ins>Cookies</ins>**

A Cookie is a simple string of text that is sent/set by the server and stored within the client's browser storage. It is then sent back to the server by the client on each subsequent request. They were originally created to allow users to store items for potential purchase in a 'virtual' shopping cart.

There are two major types of cookies. Session and Persistent. Cookies are session cookies if they do not specify the Expires or Max-Age attribute. Cookies can be used for authentication, cookies can also be used to track visits from users, including the products they viewed, helping them suggest other products that may be of interest. <ins>First-Party cookies</ins> come from directly from the website you are visiting. <ins>Third-Party cookies</ins> are generated by different websites than the one the user is currently surfing usually because they are linked to ads on the page.

Any cookie that does not have an expiration set is considered a session cookie by the browser and deleted when the browser quits. As a result, even though the old session file may remain on the server, it is no longer accessible once the associated cookie is no longer being sent back by the browser.

*A cookie is stored in the browser and then sent back to the target server with every request to that server.*


**Common options for setting cookies:**


*Improper use of HTTP cookies can render an application to several session management vulnerabilities. Some flags can be set for each cookie to prevent these kinds of attacks. httpOnly, Secure and SameSite flags are very important for session cookies. httpOnly flag prevents the cookie from being accessed by client-side JavaScript. This is an effective counter-measure for XSS attacks. Secure flag lets the cookie to be sent only if the communication is over HTTPS. SameSite flag can prevent cookies from being sent in cross-site requests that helps protect against Cross-Site Request Forgery (CSRF) attacks. Apart from these, there are other flags like domain, path and expires. Setting these flags appropriately is encouraged, but they are mostly related to cookie scope not the cookie security.*

* **httpOnly:** (boolean) determines whether cookies are accessible through javascript. (i.e. whether you can access the cookie and its content via the Document.cookie property). Setting this flag to true protects against **<ins>XSS</ins>** attacks.

* **Max-Age:**(number) number of seconds until the cookie expires (zero or negative number mean the cookie expires immediately).

* **Partioned:**keeps cookies in a partioned storage area, this is being required by some browsers, basically its restricting third-party cookies from tracking user info thats not relevant to them.

* **Path:** Indicates the path that must exist in the requested URL for the browser to send the Cookie header.

* **SameSite:**(strict, lax, none) Controls whether or not a cookie is sent with cross-site requests, providing some protection against **<ins>CSRF</ins>** cross-site request forgery attacks 

* **Secure:** Indicates that the cookie is sent to the server only when a request is made with the **https**: scheme (except on localhost), and therefore, is more resistant to **<ins>man-in-the-middle</ins>** attacks.

Cookies are not totally secure even when security mesaures are taken and they are of limited size so putting sensitive information within them is not ideal. A more common way to use them is the allow the cookie to store a reference to some sort of session id, which can 
then be looked up server-side. The session id is not sensitive and the sensitive information is retained by the server. Whoever sets a cookie decides how long they want it to last before it "expires".

(Supposedly adding a max-age to cookies will prevent ios apps from deleting them before the set expiry date)


Note: localStorage should never be used for storing any sensitive data; if you absolutely must use something other than cookies, use at least only sessionStorage instead, which is only available to that window/tab until the window is closed. A single XSS vulnerability can be used to steal all the information from data inside localStorage, also it persists when you close the tab. Cookies are stored encrypted on the client computer, unlike data in local storage.



#### **<ins>Sessions</ins>**

Unlike a typical cookie, which stores data within client-side storage, a session is used to store relevant client information server-side. Only a small non-sensitive bit of information (e.g. session id or opaque token i.e.  a random unique string of characters issued by the authorization server) is stored on the client, and that id is sent back to the server on every subsequent request and is used to identify the given session and retrieve information often from a session object. Session information doesn't need to be stored in a DB, but rather it needs to be persisted between requests (i.e. you can use an in-memory data store like a redis caching layer). Each user is identified by a session ID. This is an example of an opaque token (no third party can extract data out of the session and only the issuer or server can map back to relevant data). Stored in server-memory (filesystem), cache (redis), or DB. 

Note, **sessions don't have to use cookies**. They can also put a session id in the URL itself and that is occasionally used, but isn't very popular for a variety of reasons. 

**Sessions are more traditional and have a lot of advocates among older developers who view them as more straightforward to implement and more controllable. Since sessions are not self-contained they can be revoked quickly and granularly, which is not possible with traditionally used JWTs.**

As far as authenticating a user with a normal username and password in your app, and having a session ID passed with each request; in  general best practice can be summed up as:

-At least 128 bits (16 bytes, 22 printable Base64 characters) long.
-Generated with a cryptographically secure PRNG.
-Does not represent anything except the session ID (don't include the username).
-Before authenticating, switch to TLS. Never use an authenticated session in non-TLS.
-Cookies may not apply to you, unless you're using a browser, but if they do apply, must have the Secure, SameSite, and HttpOnly attributes with properly configured (and not too permissive) domain and path attributes.
-Recycled on privilege level change (login, logout, changing password).
-Idle timeouts and maximum timeouts.
-Since you are writing a mobile app, you have some more assurances that many web developers don't have. You do not have to rely on cookies for storing your session IDs, so you can get away with having two tokens; a short term session token for your API access, perhaps valid for a few hours, and the other (a "refresh token") to request your short term tokens. This refresh token should be much higher entropy than a session token. In any case, 256 bit tokens will protect against brute force attempts until the heat death of the universe.

You can also use this refresh token as a shared secret, rather than a simple ID like the session ID is. When negotiating a new session ID, you would send some random bytes to the client. They will append these bytes to their refresh token, and calculate a hash based on that, and send the result back. You then compare what they sent back with what your server expects (after doing the same hashing of the refresh token and your nonce **nonces protect against replay attacks**). This proves that the client has the correct refresh token, without sending the refresh token over the network.

With this system, an attacker who performed a successful Man-in-the-Middle attack can only hijack a session for as long as you haven't recycled your session IDs, and users will not need to re-authenticate constantly, for as long as the refresh tokens are valid.

**<ins>Session-based Workflows</ins>**

* **<ins>Login Workflow</ins>**

* **<ins>Refresh Auth Workflow</ins>**

* **<ins>Logout Workflow</ins>**

* **<ins>Revocation Considerations</ins>**





#### **<ins>JSON Web Tokens</ins>**

JWTs are base64 encoded. They have 3 parts: header, body, signature

A signed JWT can easily be converted back to plain text without a key. The signature only provides a way to verify that the token was issued by someone who knows the secret. Don't put sensitive information within the token.


JWTs are a compact and self-contained way for securely transmitting information between parties as a JSON object.  While the information contained within the JWT payload can be encrypted, the real value of the token is the ability to verify the integrity of the token via its digital signature. In other words you can know whether or not your server is in fact the one which issued and signed the token. The server does not have to store any session data in memory. One of the criticisms of JWTs is that they are not easily expirable/revokable,presenting a security concern. As they are self-contained and inherently encapsulate their validity or not, the token is valid until it expires. The way this limitation is mitigated is by having a short and long expiry token and by keeping token records in the database whose validity can be revoked and always cross-checking the jwt against the token record in the database (although critics will say this undermines one of the major value adds of jwts, which is that you can avoid a DB lookup because the of self-contained nature of the token). 

**The Big JWT Drawback**

JWTs can't be invalidated on-demand. so you cannot implement many security measures both automated (e.g. heuristic-based lockouts like fail2ban for anti-SPAM/DoS/scraping) and feature-based (e.g. logout another session). Short-lived JWTs require client to refresh, which adds complexity. This means you can't implement a secure logout as there is no way to expire already issued tokens. You also can't implement idle timeout for the same reason. One solution is to keep a blacklist, but that introduces state. If your clients only interact with your service via a browser, I strongly recommend using a cookie-based session management solution. I also compiled a list authentication methods currently widely used on the web.For the authentication service, in order to invalidate tokens, I like to use an in-memory cache layer (redis in my case) as a JWT blacklist/ban-list in front, depending on some criterias: (I know it breaks the RESTful philosophy, but the stored documents are really short-lived, as I blacklist for their remaining time-to-live -ttl claim-)For long-lived JWTs, attacker can stash up JWTs for later.
A second issue is ‘logging out’. With traditional sessions, you can just remove the session token from your session storage, which is effectively enough to ‘invalidate’ the session.
    -The tokens are made very short lived. For example, 5 minutes. Before the 5 minutes are over, we generate a new one. (often using a separate refresh token).
    -Maintain a system that has a list of recently expired tokens.
    -There is no server-driven log out, and the assumption is that the client can delete their own tokens.
Good systems will typically use the first two. An important thing to point out is, in order to support logout, you’ll likely still need a centralized storage mechanism (for refresh tokens, revocation lists or both), which is the very thing that JWT were supposed to ‘solve’.

Thus we effectively sessionize our refresh token JWT by creating a refresh token record, which serves as the actual source of truth as to the tokens validity, because we are always checking that record to determine whether our token is good regardless of whether the token is successfully validated or not. You could also have somesort of blocklist of bad tokens 

 You either forego revocation, or you need to have infrastructure in place that be way more complex than simply adopting a session store and opaque tokens.

Supporters will say that revoking tokens is important for security, but rare. Realistically this list is small and easily fits into memory. This largely solves the logout issue.

A last issue with JWT is that they are relatively big, and when used in cookies it adds a lot of per-request overhead.

And for whitelisting or blacklisting tokens, you may use redis(instead of db), for lookup.

JWTs are in end like passwords. It's best to treat them like temporary password + some arbitrary metadata.

The real use of JWTs is when you want third parties to be able to sign their own API requests, that your API will accept using the very same machinery by which it accepts your first-party-client API requests. If you use JWT, you can just pass the third party a private JWT signing key to use, add the corresponding public key to your validation set for JWT decode on your backend, and everything "just works."At some point, if your user base grows, the database becomes a bottleneck and you'll need to reduce the amount of database requests.One way of doing that is removing session requests and authenticating via JWT.
This is especially handy in a distributed system. 

 JWTs are handy for decoupling services, however they really shouldn't be the default and I'd recommend starting with server-side sessions. Then JWTs would be used if that is not enough and or if the architecture gets complex enough to warrant separating services from the same session database. Sites that do not need security/admin/etc functionalities should use simple cookies for state. Sites that need more complex login/admin/etc functionalities should use server-side sessions. Sites that need complex, decoupled architectures should consider using JWTs, albeit even then I'd recommend some sort of a central authentication server and ping-ponging between that and the services relying on auth.



For authentication purposes never trust anything you did not issue and cannot verify.  JWT allows you to verify that the token was generated by you. You can then trust (to the best of your knowledge) the data in the token. It’s still prone to being stolen, intercepted, etc. you cannot solve all the security problems yourself. You can’t manage the token after it leaves your server.

It may not be required to send the expired access token alongside a refresh token but I like to do it. Usually the request layer is already configured to do it automatically so it’s additional overhead/work (not talking about performance here) to remember this one request needs it removed. It then one additional verification you can perform and if you store the tokens apart in some way then it’s not as easy to nab an access token and the refresh token (but always still possible). Does it solve a lot of issues? Probably not. But it doesn’t hurt anything.

Refresh tokens let the user get a new access token. In a naive implementation (without rotation) I could use one refresh token and get as many access tokens as I want from it until it expires. That’s good but also bad. Which is where rotation comes into play. Each time a refresh token is submitted you issue a new one guaranteeing that any token is good only once. This means any compromised access token/refresh token combination is only valid until they both expire or the refresh token is used. If a token is replayed you can act on the potential that a user has had their session compromised.


Issuing a new refresh token on each use and invalidate all credentials / log out the user when detecting refresh token reuse (what else could you do?) is a good idea, the latter is even in the standard.


**General Token Based Authentication Workflow:**

1. Upon a successful login two jwt tokens are generated, a short-lived access token and longer-lived refresh token, they are then returned in the response. 
2. The access token is stored in memory on both web and mobile apps (we use rxjs in react and react native apps) and the refresh token is stored in secure storage on the device for mobile apps (mmkv) and in an http-only cookie on web apps (but what about cookies that will stored on mobile apps?--even though cookies can be set on mobile devices, ios tends to destroy cookies before the time the developer sets (this is potentially resolved by setting a maxAge on the cookie)). We continue to set the longer-lived refresh token, in non-volitile storage for our mobile apps using mmkv, the token is then grabbed from the req.body rather than the req.cookie.
3. When the user attempts to access to a protected route, the access token accompanies the request in the request headers as a bearer token.
4. The request then hits the auth middleware where the jwt is extracted from the header, its verified against the server held secret to determine if the token  was indeed issued by the server and is still valid the token payload is decoded and if a valid user is found in the database with appropriate permissions to access a given resource, that user id is added to the request object for use during the request life cycle. 
5.When the access token is about to expires a timer expire on the client side, triggering a call to the server with the refresh token in contained in a cookie or in the request body, if the refresh token is valid and the refresh token's database record is still valid, a new access and refresh token are issued. 
When user logs out:


**<ins>Token-based Workflows</ins>**

* **<ins>Login Workflow</ins>**

* **<ins>Refresh Auth Workflow</ins>**

* **<ins>Logout Workflow</ins>**

* **<ins>Revocation Considerations</ins>**


#### **<ins>OAuth</ins>**

Oauth is an authorization system, not an authentication system.

(Open Authorization) is an open standard for access delegation commonly used as a way to grant websites or applications limited access to a user's information without exposing passwords. It enables third-party services to exchange tokens for access to specific resources, usually through an authorization server. If you have server side rendering, the Authorization Code Grant should be your go to, but at bare minimum, you SHOULD use the state parameter.  Typically, an access token provided by a third party (Google, Discord, Facebook, Twitter), should ideally not be exposed to your frontend. So usually what would happen is this:

You redirect a user to a third party OAuth2 provider. They login. This sends a redirect where part of the URL contains a code. Your backend then uses this code to retrieve an access token (in the case where the redirect was to a frontend SPA, this posts the code to your backend).

Your backend then uses that access token to request the users third-party profile, and any other information as per the specified scopes. You then use this information to identify that user within YOUR system, and you then provide them authentication inside of your system / application based on that information.  OAuth is intended to provide secure access to a resource by a third party. For example, there are applications that allow you to schedule posts to various social media platforms, such as Facebook and Twitter. These applications will store your posts then, at the scheduled time, make a post to that system on your behalf, without having your credentials.

Another common use is, if you are a third party, such as an information scraping tool that is set up to look like a "What color pocket lint matches your auras" poll, such apps will be given some identifying information about you, such as your name and user ID (and possibly a LOT more, if you don't check the permissions carefully.) These provide a round-about identification system, that can sometimes stand in place of authorization, if you trust the OAuth provider. That is, there is no way to prevent this OAuth provider from lying to you about the identification; an admin for the provider could claim to be one of your users and you would have no way to know for certain, if you use their OAuth service as authentication.

If you want to identify users of your mobile app, you could have a "Sign in with [social media platform]" option using OAuth. This can decrease some of the friction of signing in, compared to using a username and password. Just keep in mind that, in this case, you're not the one authenticating your users.




### **<ins>AUTHORIZATION</ins>**


Authorization concerns which resources to which a given user has access. Some options for maintaining user permissions include:


* Embed them in a cookie or JWT (essentially stateless). You avoid having to look them up every request from a central source. However space is limited and a user that has thousands of roles across a multitude of micro service use cases in a large distributed system cannot embed permissions in cookie or JWT. Keep in mind htat any permissions kept on a token cannot be revoked for as long as that token is valid.

* Use a central source. Some kind of repository is required to look the permissions based on the user or the user role, but you’re going to need to do it for every request and you’re probably going to want to cache it, and that leads to complexity.

* Use a sidecar. This kind of approach is available in container environments such as k8s via DAPR, CERBOS, Orleans. Think Service Fabrik. This very similar to a cache, but you’ve moved the distribution and management of that distributed cache to the container platform Framework.




### **<ins>CORS</ins>**

 CORS defines a way for client web applications that are loaded in one domain to interact with resources in a different domain. This is useful because complex applications often reference third-party APIs and resources in their client-side code. Imagine the site alice.com has some data that the site bob.com wants to access. This type of request traditionally wouldn’t be allowed under the browser’s same origin policy. However, by supporting CORS requests, alice.com can add a few special response headers that allows bob.com to access the data .When internet technologies were still new, cross-site request forgery (CSRF) issues happened. For example, the victim logged into their bank's application. Then they were tricked into loading an external website on a new browser tab. The external website then used the victim's cookie credentials and relayed data to the bank application while pretending to be the victim. Unauthorized users then had unintended access to the bank application.

To prevent such CSRF issues, all browsers now implement the **same-origin policy.**

**Today, browsers enforce that clients can only send requests to a resource with the same origin as the client's URL. The protocol, port, and hostname of the client's URL should all match the server it requests.**

Consider the origin comparison for the below URLs with the client URL http://store.aws.com/dir/page.html.

http://store.aws.com/dir2/new.html -> same origin -> only path differs

https://store.aws.com/page.html -> different origin -> different protocol

http://store.aws.com:81/dir/page.html -> different origin -> different port

http://news.aws.com/dir/page.html -> different origin -> different host



Your browser sends an HTTP request to the application server and receives data as an HTTP response. In this scenario, the **current browser** URL is called the **current origin** and the **third-party URL to your server is the cross-origin**


* Client Application - current origin

* Server - cross origin

When you make a cross-origin request, this is the request-response process:

   1. The browser adds an origin header, this header contains the origin of the request, which is the domain, protocol, and port of the page making the request. When the browser sends a request to a server, it includes this Origin header. 
   2.  The server checks the current origin header. The server can then decide whether to allow or deny the request. If the request is allowed, the server includes the Access-Control-Allow-Origin header in the response. This header specifies the origin that is allowed to access the resources.
   3.  If the request is denied, the server includes the Access-Control-Allow-Origin header with a value of "*", which indicates that no origin is allowed to access the resources.



Access-Control-Allow-Origin - this is a reponse header that indicates whether a server's response can be shared with a requesting client.
Access-Control-Allow-Origin: *
Access-Control-Allow-Origin: <origin>

Consider a site called https://news.example.com that wants to access resources from an API at partner-api.com. Developers at https://partner-api.com first configure the cross-origin resource sharing (CORS) headers on their server by adding new.example.com to the allowed origins list. They do this by adding the below line to their server configuration file. Access-Control-Allow-Origin: https://news.example.com

Once CORS access is configured, news.example.com can request resources from partner-api.com. For every request, partner-api.com will respond with Access-Control-Allow-Credentials : "true." The browser then knows the communication is authorized and permits cross-origin access.


**What is a cors preflight request?**


A simple request is one that uses methods such as GET, HEAD, or POST. These methods are considered safe because they are not capable of causing a change in state on the server.A pre-flighted request is one that uses a method such as PUT or DELETE. These methods can cause a change in state on the server, so the browser sends a request to the server to check if the request is allowed. The server then responds with the appropriate headers, and if the response is successful, the browser sends the actual request.

In HTTP, request methods are the data operations the client wants the server to perform. Common HTTP methods include GET, POST, PUT, and DELETE. 

The CORS mechanism works by adding HTTP headers to cross-origin HTTP requests and responses. These headers indicate whether the request or response is allowed to access the resources.



In a regular cross-origin resource sharing (CORS) interaction, the browser sends the request and access control headers at the same time. These are usually GET data requests and are considered low-risk.

However, some HTTP requests are considered complex and require server confirmation before the actual request is sent. The preapproval process is called preflight request.
Cross-origin requests are complex if they use any of the following:
    Methods other than GET, POST, or HEAD
    Headers other than Accept-Language, Accept, or Content-Language
    Content-Type headers other than multipart/form-data, application/x-www-form-urlencoded, or text/plain

    How preflight requests work

Browsers create preflight requests if they are needed. It's an OPTIONS request like the following one.

OPTIONS /data HTTP/1.1

Origin: https://example.com

Access-Control-Request-Method: DELETE

The browser sends the preflight request before the actual request message. The server must respond to the preflight request with information about the cross-origin requests the server’s willing to accept from the client URL. The server response headers must include the following:

    Access-Control-Allow-Methods
    Access-Control-Allow-Headers
    Access-Control-Allow-Origin

An example server response is given below.

HTTP/1.1 200 OK

Access-Control-Allow-Headers: Content-Type

Access-Control-Allow-Origin: https://news.example.com

Access-Control-Allow-Methods: GET, DELETE, HEAD, OPTIONS

The preflight response sometimes includes an additional Access-Control-Max-Age header. This metric specifies the duration (in seconds) for the browser to cache preflight results in the browser. Caching allows the browser to send several complex requests between preflight requests. It doesn’t have to send another preflight request until the time specified by max-age elapses.


**Cors Best Practices**

* Define Access Lists- avoid wildcards * 
* Avoid null origin

Some browsers send the value null in the request header for certain scenarios like file requests or requests from the local host. However, you shouldn’t include the null value in your access list. It also introduces security risks as unauthorized requests containing null headers may get access.









### **<ins>JavaScript Dates</ins>**

<ins>Timezones: Two timezones matter in JS:</ins>

* The Local Timezone your computer is in
* UTC (GMT) 

**By default all but one date method in JS gives date/time in local time. You only get UTC if you specify UTC**

<ins>Creating a Date in JS:</ins>

Create a date with new Date() used four ways

**With date string**
new Date('1987-07-09')
always formate date-strings with ISO 8601 (which is accepted world wide) `YYYY-MM-DDTHH:mm:ss.sssZ`, 

Here’s what the values mean:

    YYYY: 4-digit year
    MM: 2-digit month (where January is 01 and December is 12)
    DD: 2-digit date (0 to 31)
    -: Date delimiters
    T: Indicates the start of time
    HH: 24-digit hour (0 to 23)
    mm: Minutes (0 to 59)
    ss: Seconds (0 to 59)
    sss: Milliseconds (0 to 999)
    :: Time delimiters
    Z: If Z is present, date will be set to UTC. If Z is not present, it’ll be Local Time. (This only applies if time is provided.)

Hours, minutes, seconds, and milliseconds are optional. 

Problem with using date-strings is that if you live in an area BEHIND GMT you'll get a date that's a day behind your intended date, that's because if you create a date with date-string without a time, you get a date set in UTC

If you want to create a date in Local Time with the date-string method, you need to include the time. When you include time, you need to write the HH and mm at a minimum
new Date('2019-06-11T00:00') The whole Local Time vs. UTC thing with date-strings can be a possible source of error that’s hard to catch. So, I recommend you don’t create dates with date strings.

**With arguments**

You can pass in up to seven arguments. Y, M, D, H, Min, Seconds, and Milliseconds
new Date(2019, 5, 11, 5, 23, 59)

remember that months are zero-indexed
Dates created with arguments are in local time.

**With Timestamps**

In JavaScript, a timestamp is the amount of milliseconds elapsed since 1 January 1970 (1 January 1970 is also known as Unix epoch time). From my experience, you rarely use timestamps to create dates. You only use timestamps to compare between different dates (more on this later). new Date(1560211200000)

**With no arguments**

new Date()
If you create a date without any arguments, you get a date set to the current time (in Local Time).


<ins>Summary about creating dates</ins>

* You can create date with new Date().
* There are four possible syntaxes: With a date string. With arguments. With timestamp. With no arguments
* Never create a date with the date string method.
* It’s best to create dates with the arguments method.
* Remember (and accept) that month is zero-indexed in JavaScript.

<ins>Date Formatting in JS</ins>

No easy way unlike with other languages. Often rely on libraries.    
The native Date object comes with seven formatting methods. Each of these seven methods give you a specific value (and they’re quite useless).

    const date = new Date(2019, 0, 23, 17, 23, 42)

    toString gives you Wed Jan 23 2019 17:23:42 GMT+0800 (Singapore Standard Time)

    toDateString gives you Wed Jan 23 2019

    toLocaleString gives you 23/01/2019, 17:23:42

    toLocaleDateString gives you 23/01/2019

    toGMTString gives you Wed, 23 Jan 2019 09:23:42 GMT

    toUTCString gives you Wed, 23 Jan 2019 09:23:42 GMT

    toISOString gives you 2019-01-23T09:23:42.079Z

    Let’s say you want something like Thu, 23 January 2019. To create this value, you need to know (and use) the date methods that comes with the Date object.

To get dates, you can use these four methods:

    getFullYear: Gets 4-digit year according to local time
    getMonth: Gets month of the year (0-11) according to local time. Month is zero-indexed.
    getDate: Gets day of the month (1-31) according to local time.
    getDay: Gets day of the week (0-6) according to local time. Day of the week begins with Sunday (0) and ends with Saturday (6).


This is used to get you month names:

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const monthIndex = d.getMonth()
const monthName = months[monthIndex]
console.log(monthName) // January

const monthName = months[d.getMonth()]
console.log(monthName) // January

const days = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
]
const dayName = days[d.getDay()] // Thu

const formatted = `${dayName}, ${date} ${monthName} ${year}`
console.log(formatted) // Thu, 23 January 2019
    If you ever need to create a custom-formatted time, you can use the following methods:

    getHours: Gets hours (0-23) according to local time.
    getMinutes: Gets minutes (0-59) according to local time.
    getSeconds: Gets seconds (0-59) according to local time.
    getMilliseconds: Gets milliseconds (0-999) according to local time.

Next, let’s talk about comparing dates.

If you want to know whether a date comes before or after another date, you can compare them directly with >, <, >= and <=.

const earlier = new Date(2019, 0, 26)
const later = new Date(2019, 0, 27)

console.log(earlier < later) // true

It’s more difficult if you want to check if two dates fall exactly at the same time. You can’t compared them with == or ===.

const isSameTime = (a, b) => {
  return a.getTime() === b.getTime()
}

const a = new Date(2019, 0, 26)
const b = new Date(2019, 0, 26)
console.log(isSameTime(a, b))

If you want to check whether two dates fall on the same day, you can check their getFullYear, getMonth and getDate values.

const isSameDay = (a, b) => {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate()=== b.getDate()
}

const a = new Date(2019, 0, 26, 10) // 26 Jan 2019, 10am
const b = new Date(2019, 0, 26, 12) // 26 Jan 2019, 12pm
console.log(isSameDay(a, b)) // true

Getting a date from another date

There are two possible scenarios where you want to get a date from another date.

    Set a specific date/time value from another date.
    Add/subtract a delta from another date.

Setting a specific date/time

You can use these methods to set a date/time from another date:

    setFullYear: Set 4-digit year in Local Time.
    setMonth: Set month of the year in Local Time.
    setDate: Set day of the month in Local Time.
    setHours: Set hours in Local Time.
    setMinutes: Set minutes in Local Time.
    setSeconds: Set seconds in Local Time.
    setMilliseconds: Set milliseconds in Local Time.

For example, if you want to set a date to the 15th of the month, you can use setDate(15).

Adding/Subtracting delta from another date

A delta is a change. By adding/subtracting delta from another date, I mean this: You want to get a date that’s X from another date. It can be X year, X month, X day, etc.

To get a delta, you need to know the current date’s value. You can get it using these methods:

    getFullYear: Gets 4-digit year according to local time
    getMonth: Gets month of the year (0-11) according to local time.
    getDate: Gets day of the month (1-31) according to local time.
    getHours: Gets hours (0-23) according to local time.
    getMinutes: Gets minutes (0-59) according to local time.
    getSeconds: Gets seconds (0-59) according to local time.
    getMilliseconds: Gets milliseconds (0-999) according to local time.

There are two general approaches to add/subtract a delta. The first approach is more popular on Stack Overflow. It’s concise, but harder to grasp. The second approach is more verbose, but easier to understand.

Let’s go through both approaches.

Say you want to get a date that’s three days from today. For this example, let’s also assume today is 28 March 2019. (It’s easier to explain when we’re working with a fixed date).

const today = new Date(2019, 2, 28)
First, we create a new Date object (so we don’t mutate the original date)
const finalDate = new Date(today)
Next, we need to know the value we want to change. Since we’re changing days, we can get the day with getDate.
const currentDate = today.getDate()
We want a date that’s three days from today. We’ll use add the delta (3) to the current date.
finalDate.setDate(currentDate + 3)
const today = new Date(2019, 2, 28)
const finalDate = new Date(today)
finalDate.setDate(today.getDate() + 3)

console.log(finalDate) // 31 March 2019

Here, we use getFullYear, getMonth, getDate and other getter methods until we hit the type of value we want to change. Then, we use create the final date with new Date.

const today = new Date(2019, 2, 28)

// Getting required values
const year = today.getFullYear()
const month = today.getMonth()
const day = today.getDate()

// Creating a new Date (with the delta)
const finalDate = new Date(year, month, day + 3)

console.log(finalDate) // 31 March 2019

If you provide Date with a value that’s outside of its acceptable range, JavaScript recalculates the date for you automatically.

Here’s an example. Let’s say we set date to 33rd March 2019. (There’s no 33rd March on the calendar). In this case, JavaScript adjusts 33rd March to 2nd April automatically.
new Date(2019, 2, 33)
This means you don’t need to worry about calculating minutes, hours, days, months, etc. when creating a delta. JavaScript handles it for you automatically.
new Date(2019, 2, 30 + 3)

Javascript has many Date issues:

    It doesn’t support Dates but only Datetimes (all date objects are unix timestamps).
    It doesn’t support time zones other than the user’s local time and UTC.
    The parser’s behaviour is inconsistent from one platform to another.
    The Date object is mutable.
    The behaviour of daylight saving time is unpredictable.
    No support for non-Gregorian calendars.
    No date arithmetic like add or subtract time.








**A Unix timestamp specifies the number of seconds. A JSON Web Token uses the number of seconds. JavaScript Date uses the number of milliseconds.**














###  **<ins>Other Points of Note</ins>** 

**Sign-In Form Best Practices**

-Don't make users input info twice (it increases abandonment rates) just make them confirm their email

-Allow users the option to see their unobscured password.

-Give mobile users the appropriate keyboard for their input (e.g. type="email)

-Help browsers store data correctly to help avoid users having to repetitively input their details, increasing abandonment rates. 

    a. The autocomplete, name, id, and type attributes help browsers understand the role of inputs in order to store data that can later be used for autofill.

    b. To allow data to be stored for autofill, modern browsers also require inputs to have a stable name or id value (not randomly generated on each    page load or site deployment), and to be in a <form> with a submit button.

    c. Use autocomplete="new-password" and id="new-password" for the password input in a sign-up form, or the new password in a change-password form.

    d. Use autocomplete="current-password" and id="current-password" for the password input in a sign-in form, or the input for the user's old password in a change-password form. This tells the browser that you want it to use the current password that it has stored for the site.Add the required attribute to both email and password fields. Modern browsers automatically prompt and set focus for missing data. 


**Common Attack Methods**

**cross-site scripting attacks (XSS)**: This is when an attacker injects malicious client-side code. The user's browser cannot detect the malicious script is untrustworthy, and so gives it access to any cookies, session tokens, or other sensitive site-specific information, or lets the malicious script rewrite the HTML content.XSS does not target the application directly. Instead, XSS targets the users of a web application. This sensitive information is often sent to the bad-actors' server. Prevent it by separating untrusted data from active browser content. 

**man-in-the-middle attacks (MitM)**: A manipulator-in-the-middle attack (MitM) intercepts a communication between two systems. ex. a Wi-Fi router can be compromised. Https encryption on public wifi networks and certificate warnings help prevent this attack

**cross-site request forgery (CSRF)**: This is when an attacker impersonates a trusted user and sends a site unwanted commands.In a CSRF attack, an innocent end user is tricked by an attacker into submitting a web request that they did not intend. This may cause actions to be performed on the website that can include inadvertent client or server data leakage, change of session state, or manipulation of an end user's account. In a CSRF attack, the attacker's goal is to cause an innocent victim to unknowingly submit a maliciously crafted web request to a website that the victim has privileged access to. This web request can be crafted to include URL parameters, cookies and other data that appear normal to the web server processing the request.



**When a user changes their password**
If a user changes their password on any device, then revoke all their refresh tokens forcing them to log in again as soon as their access token expires. This does leave a 'window of uncertainty' but that's unavoidable without hitting a db every time.
Rate Limiting, password retry attempts

**Strict Mode**
JavaScript has a number of unsafe and dangerous legacy features that should not be used. In order to remove these features, ES5 included a strict mode for developers. With this mode, errors that were silent previously are thrown. It also helps JavaScript engines perform optimizations. With strict mode, previously accepted bad syntax causes real errors. Because of these improvements, you should always use strict mode in your application. In order to enable strict mode, you just need to write "use strict"; on top of your code. The following code will generate a ReferenceError: Can't find variable: y on the console, which will not be displayed unless strict mode is used:

**params** "A secure param" shouldn't be part of a URL unless it's some edge case like a fast-expiring data point such as a token exchange in an oAuth flow. Other than something like this, don't do it. URLs get logged to system logs and files on disk, they get cached, get proxied, shared by users, available to JavaScript on a page, and a bunch of other security concerns you don't want to start inventing ways to deal with.



**<ins>Password Security Considerations</ins>**

**Hashing:** One-way Cryptographic hash functions make it mathematically difficult to derive the **input** value from the **output** value.

Password-> Hash -> garbled hexidecimal -> user table

**Salting:** adds random non-obvious words to passwords, helps keep easy to guess passwords secure.

We salt the password and then hash it. Rendering rainbow tables (tables of common passwords) unusable.

**HTTPs** ensures paswords are not sent as plaintext over the wire.

.env variables are always set as strings



### **<ins> Auth WorkFlows</ins>**



**<ins>Registration</ins>**





**<ins>Login</ins>**


**<ins>Logout</ins>**


**<ins>Password Reset</ins>**