# **Chapter 4 Authentication and Authorization**

**Authentication**:  you are who you claim to be

**Authorization**: which resources you have access to 

One-way Cryptographic hash functions make it mathetically difficult to derive the input value from the output value.

Password-> Hash -> garbled hexidecimal -> user table

Salting- adds random non-obvious words to passwords, helps keep easy to guess passwords secure.

We salt the password and then hash it. Rending rainbow tables (tables of common passwords) unusable.

HTTPs ensures paswords are not sent as plaintext over the wire.

JSON Web Tokens



There is no way I know of to arbitrarily invalidate a token without involving a database one way or another.

Be careful with Approach 2 if your service can be accessed on several devices. Consider the following scenario...

        User signs in with iPad, Token 1 issued and stored.
        User signs in on website. Token 2 issued. User logs out.
        User tries to use iPad, Token 1 was issued before user logged out from website, Token 1 now considered invalid.

You might want to look at the idea of refresh tokens although these require database storage too.

Also see here for a good SO discussion regarding a similar problem, particular IanB's solution which would save some db calls.

Proposed solution Personally, this is how I'd approach it...user authenticates, issued with access token with a short expiry (say 15 mins) and a refresh token valid either for a much longer period or indefinitely. Store a record of this refresh token in a db.

Whenever the user is 'active', issue a new auth token each time (valid for 15 mins each time). If the user is not active for over 15 minutes and then makes a request (so uses an expired jwt), check the validity of the refresh token. If it's valid (including db check) then issue a new auth token.

If a user 'logs out' either on a device or through a website then destroy both access refresh tokens client side and importantly revoke the validity of the refresh token used. If a user changes their password on any device, then revoke all their refresh tokens forcing them to log in again as soon as their access token expires. This does leave a 'window of uncertainty' but that's unavoidable without hitting a db every time.

Using this approach also opens up the possibility of users being able to 'revoke' access to specific devices if required as seen with many major web apps.



Honestly, it sounds like you and your sources both don't really understand what JWTs are. For example anyone comparing JWTs to cookies doesn't understand what a JWT is, because you can (and often do) store a JWT in a cookie.

The tl;dr for JWTs is that they are just a way to perform user authentication with the backend without the backend having to make a database query with every web hit/api call. That's all. That's what they're designed to do, and they work great for it.

If the cost of the DB call isn't a concern to you or your team, then you can use a traditional session just fine. cookie-session is one way to do this with express.js, the traditional node.js webserver piece.

The "reason" most node.js "creators" talk mostly about JWTs and not other things like sessions is a mystery though, you're right. My guess is that sessions just aren't "sexy."

 You have a few options for managing complex permission sets. Your choices are:

    trying to embed them in a cookie or JWT (I.e. the quasi-stateless option). In this case you’re not having to look them up every request from a central source. However space is limited and a user that has thousands of roles across a multitude of micro service use cases in a large distributed system cannot embed permissions in cookie or JWT.

    using a central source. Some kind of repository is required to look the permissions based on the user or the user role, but you’re going to need to do it for every request and you’re probably going to want to cache it, and that leads to complexity.

    using a sidecar. This kind of approach is available in container environments such as k8s via DAPR, CERBOS, Orleans. Think Service Fabrik. This very similar to a cache, but you’ve moved the distribution and management of that distributed cache to the container platform Framework.




Think about this... If a user's permissions are revoked, any permissions kept in the token will live (and can't be revoked) for as long as that token is valid. Not the way I'd do it..

Keep them in a database.

The backend for frontend(BFF) pattern is emerging as a best practice to solve the issues you're dealing with and it'll provide some nice security guarantees if implemented properly. When you possess a user JWT, you would initiate a server side session and issue a same site cookie to identify the user. All JWT management is done server side to prevent leakage of sensitive data. If you want to sandbox you can add an XSRF token to provide some nice security guarantees.

 The question of JWT (or any signed token) vs any sort of session tracking system is a tradeoff between latency and processing during the request authorization phase.

    If you use JWT (or, again, any similar signed token approach), you must validate the token everywhere you use it. That means you have to share your private key everywhere you validate your token (and share updates whenever you rotate that key), and you must decrypt that token on the server processing the request.

    If you use sessions, you must validate the session by finding it in a central database everywhere you use it. That means you must wait for the database to call for your session data to complete before the request can be validated and depending on your scale that may necessitate expensive shared memory systems (redis/whatever) to get at the data faster.

The first is additional CPU processing to avoid the latency when calling the database. The second is allowing the latency calling the database to avoid additional CPU processing. 



I am just gonna leave this here because I found this information quite hard to come by. I know it doesn't directly address the question.

Sessions are good for managing authorization and as an added extra, unlike JWT, provide the ability to revoke the token or cookies priveledges at any given time. It's also easy to find session management frameworks that also provide some OpenID or OAuth functionality however sessions require more maintenance.

JWTs are light and very easy to consume within your app and as of recently are my go-to choice.

If you are going to go with some form of token:

Tokens are perfectly fine to be stored within mobile device storage as IOS and Android both provide decent secure storage out of the box (this may not be something that concerns you).

If you are planning to run your app via web browser the question of where to store your token arises. Session storage? Cookies?

Most of the answers on this are outdated so let me give it a shot. In 2021 they introduced SameSite Lax/Strict into cookies. Using the same site, HTTP only, and secure options on your cookie. Will provide safety from XSS AND CSRF attacks.

 You should almost always use sessions, because sessions can be revoked, JWTs (or any other type of stateless auth) cannot.

As for scaling, pretty much most systems will not reach the point where the session lookup is the biggest bottleneck in the system. 

You’re comparing apples and oranges, when you likely need both. JWT’s should not be used in the way most of you are implying and are the industry standard for easily authenticating and authorizing user claims in a secure format. Sessions, cookies, and other similar temporary storage are for exactly that - temporary build up of user information, interactions, and other data that either you want to persist temporarily to reduce calls or for building up to persist to a db later on. 



Session for any app that needs real security.

JWT doesn't have invalidation mechanism, so you cannot implement many security measures both automated (e.g. heuristic-based lockouts like fail2ban for anti-SPAM/DoS/scraping) and feature-based (e.g. logout another session). Short-lived JWTs require client to refresh, which adds complexity. For long-lived JWTs, attacker can stash up JWTs for later.


## **Cookies**

When designing web applications, (especially the traditional HTML kind), you will at one point have to figure out how to log a user in and keep them logged in between requests.

The core mechanism we use for this are cookies. Cookies are small strings sent by a server to a client. After a client receives this string, it will repeat this in subsequent requests. We could store a ‘user id’ in a cookie, and for any future requests we’ll know what user_id the client was.But this is very insecure. The information lives in the browser, which means users can change USER_ID and be identified as a different user.



First off, some general facts.

A cookie is stored in the browser and then sent back to the target server with every request to that server.

A cookie can either contain actual state data (such as backgroundColor=blue) or it can just contain a token that only means something to the server.

Whoever sets a cookie decides how long they want it to last before it "expires". If the server sets the cookie (as cookies can also be set from within Javascript in the web page), then the server decides how long they want the cookie to last.

A server session consists of the server creating a unique token and putting that in a cookie that it sets for that browser. In parallel, it also creates a session object that is stored on the server and it creates a means of associating the token with a particular session object such that when a request comes in and it has a particular token in it, the server can find the corresponding session object.

Note, sessions don't have to use cookies. They can also put a session id in the URL itself and that is occasionally used, but isn't very popular for a variety of reasons.

    How does browse and / or server know that the user has already logged in and does not need to log in again?

A server can consider a browser to be already logged in if it finds an appropriate cookie in the incoming request and if it finds an associated session object in the server-side session store and if that session object is both logged in and not expired.

    If the Session stays inside the cookie why is this difference?

Usually, when using server-side sessions, all that's in the cookie is a unique token - not any of the actual session data.

    Where is the cookie stored? In our browser?

Yes, it's stored on your hard drive by the browser and then sent as an http header along with every request to the server that the cookie is associated with.



This is an implementation detail of the website, so this can't be directly answered.

The session cookie may be created server side and associated with the saved session, but it still has to be saved client side so that the client browser can remind the server which session to use (and verify it).

From the browser's perspective, there is no difference between a session cookie and any other cookie. It's just a cookie. So there's no technical reason why all the cookies can't coexist as long as there are no name collisions.

From the web server's perspective, if the non-session cookies had a purpose, that purpose is likely still there when there is a session, so deleting them to use the session in its place would probably just make the code more complex. But this doesn't say if they will or won't do that.

So, another way to ask the question would be "Are the authors of the website going to be lazy and not bother deleting redundant cookies, or are they going to be fancy and merge them into the session and clean things up?"

Also consider the session cookie and the other cookies may all have different lifetimes, so it might not make sense to merge them anyway.



JWTs were never designed for handling sessions. They are a way of exchanging integrity-protected messages between services. Have a look at this article: http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/ which explains why using JWTs for handling sessions is not a good idea.

You can also read about the BFF pattern: https://curity.io/resources/learn/the-bff-pattern/ where you use a lightweight backend component for handling tokens, and still deal only with sessions in the frontend. Because it's a light component it's easy to scale it - e.g. it can be a lambda function.

So in my opinion, there are no real good use cases where you genuinely prefer JWT-based session over cookie-based session, but (as any strong opinion), this may trigger a discussion ;



JWT was born to provide secured access to APIs from mobile apps. Software developers started using them for web browser based clients as well but they are not suited due to security concerns. You will find many articles on this topic. For web application, it is best to store token at server side, link it with a new session, return the session after login to the web browser and store it in the session cookie.



It's about horses for courses.

Sometimes your user agent isn't a browser and authentication via cookies is not appropriate.

Sending a username and password in every request means that it's easier for the credentials to get intercepted and reused by a malicious actor.

Bearer tokens like JWTs encode information about the caller so that you can make authorization decisions about the identity that they represent, are easy to verify, and are (usually) short-lived so they will only work for a limited time if they are intercepted and stolen.

Finally, using JWTs makes it much easier to delegate authentication to an external identify provider written by people who know much more about authentication and security than you or I do.






## **Sessions**

The traditional way to solve this is what’s known as a ‘session’. I don’t know what the earliest usage of sessions is, but it’s in every web framework, and has been since web frameworks are a thing.

Often, sessions and cookies are described as 2 different things, but they’re really not. A session needs a cookie to work.

Instead of a predictable user id, we’re sending the client a completely random session id that is impossibly hard to guess. The ID has no further meaning, and doesn’t decode to anything. This is sometimes called an opaque token.

When a client repeats this session id back to the server, the server will look up the id in (for example) a database, which links it back to the user id. When a user wants to log out, the session id is removed from the data storage, which means the cookie is no longer associated with a user.

Where is the session data stored?

Languages like PHP have a storage system for this built in, and will by default store data in the local filesystem. In the Node.js ecosystem, by default this data will be in ‘memory’ and disappear after the server restarts.

These approaches make sense on developer machines, or when sites were hosted on long-lived bare-metal servers, but these days a deploy typically means a completely fresh ‘system’, so this information needs to be stored in a place that outlives the server. An easy choice is a database, but it’s common for sites to use systems like Redis and Memcached, which works for tiny sites, but still works at massive scales.

JWT itself is a standard for encrypting/signing JSON objects and it’s used a LOT for authentication. Instead of an opaque token in a cookie, we actually embed the user_id again, but we include a signature. The signature can only be generated by the server, and it’s calculated using a ‘secret’ and the actual data in the cookie.

This means that if the data is tampered with (the user_id was changed), the signature no longer matches.

So why is this useful? The best answer I have for this, is that it’s not needed to have a system for session data, like Redis or a database. All the information is contained in the JWT, it means your infrastructure is in theory simpler. You’re potentially making fewer calls to a data-store on a per-request basis.

Drawbacks

There are major drawbacks to using JWT.

First, it’s a complicated standard and users are prone to get the settings wrong. If the settings are wrong, in the worst case it could mean that anyone can generate valid JWTs and impersonate anyone else. This is not a beginners-level problem either, last year Auth0 had a bug in one of their products that had this very problem.

Auth0 is(or was? they just got acquired) a major vendor for security products, and ironically sponsor the jwt.io website. If they’re not safe, what chance does the general (developer) public have?

However, this issue is part of a larger reason why many security experts dislike JWT: it has a ton of features and a very large scope, which gives it a large surface area for potential mistakes, by either library authors or users of those libraries. (alternative stateless tokens to JWT exists, and some of them do solve this.)

A second issue is ‘logging out’. With traditional sessions, you can just remove the session token from your session storage, which is effectively enough to ‘invalidate’ the session.

With JWT and other stateless token this is not possible. We can’t remove the token, because it’s self-contained and there’s no central authority that can invalidate them.

This is typically solved in three ways:

    The tokens are made very short lived. For example, 5 minutes. Before the 5 minutes are over, we generate a new one. (often using a separate refresh token).
    Maintain a system that has a list of recently expired tokens.
    There is no server-driven log out, and the assumption is that the client can delete their own tokens.

Good systems will typically use the first two. An important thing to point out is, in order to support logout, you’ll likely still need a centralized storage mechanism (for refresh tokens, revocation lists or both), which is the very thing that JWT were supposed to ‘solve’.

    Sidenote: some people like JWT because it’s fewer systems to hit per request, but that contradicts with being able to revoke tokens before they expire.

    My favourite solution to this is keep a global list of JWTs that have been revoked before they expired (and remove the tokens after expiry). Instead of letting webservers hit a server to get this list, push the list to each server using a pub/sub mechanism.

    Revoking tokens is important for security, but rare. Realistically this list is small and easily fits into memory. This largely solves the logout issue.

A last issue with JWT is that they are relatively big, and when used in cookies it adds a lot of per-request overhead.

All in all, that’s a lot of drawbacks just to avoid a central session store. It’s not my opinion that JWT are universally a bad idea or without benefits, but there is a lot to consider.

One thing that’s surprised me when reading tech blogs, is that there is a lot of chatter around JWT. Especially on Medium and subreddits like /r/node I see intros to JWT on an extremely regular basis.

I realize that that doesn’t mean that ‘JWTs are more popular than session tokens’, for the same reason that GraphQL isn’t more popular than REST, or NoSQL than relational databases: it’s just not that interesting to write about the technology that’s been tried and tested for a decade or more (See: Appeal to novelty). In addition, subject experts that write about new solutions are likely going to have different problems & scale than the majority of their own readers.

However, these new technologies create a lot more buzz than their simpler counterparts, and if enough people keep talking about the hot thing, eventually this can translate to actual adoption, despite it being a sub-optimal choice for the majority of simple use-cases.

This is similar to many newer developers learning how to build SPAs with React before server-rendered HTML. Experienced devs would likely feel that server-rendered HTML should probably be your default choice, and building an SPA when needed, but this is not what new developers are typically taught.

Adopting complex systems before the simple option is considered is something I see happening more, but it surprised me for JWT.

As an exercise, I looked up the top most popular (by votes) posts on /r/node that mention JWT. I was going to go over the first 100, but got bored after the top 12.

From these 12 articles and Github repos:

    1 mentions using a revocation list, 3 mention refesh tokens. The remaining articles and github repositories simply have no means of logging out.
    1 article mentions that it might be better to use a standard session storage instead.
    1 article uses both a standard session storage and JWT, making JWT unneeded.
    1 github repository ships with pre-generated private keys. (yup)
    Most of posts use expiry times of weeks or months and 3 posts never expire their JWTs.

Except 1, the quality of these highly upvoted posts was extremely low, the authors were likely not qualified to write about this and can potentially cause real-world harm.

All this at least confirmed my bias that JWT for security tokens is hard to get right.

On JWT and scale

Going through tons of Reddit posts and comments also got me a more refined idea of why people think JWTs are better. The top reason everywhere is: “It’s more scalable”, but it’s not obvious at what scale people think they’ll start to have issues. I believe the point where issues start to appear is likely much higher than is assumed.

Most of us aren’t Facebook, but even at ‘millions of active sessions’, a distributed key->value store is unlikely going to buckle.

Statistically, most of us are building applications that won’t make a Raspberry Pi break a sweat.
Conclusion

Using JWTs for tokens add some neat properties and make it possible in some cases for your services to be stateless, which can be desirable property in some architectures.

Adopting them comes with drawbacks. You either forego revocation, or you need to have infrastructure in place that be way more complex than simply adopting a session store and opaque tokens.

My point in all this is not to discourage the use of JWT in general, but be deliberate and careful when you do. Be aware of both the security and functionality trade-offs and pitfalls. Keep it out of your ‘boilerplates’ and templates, and don’t make it the default choice.



I work at Auth0 and I was involved in the design of the refresh token feature.

It all depends on the type of application and here is our recommended approach.
Web applications

A good pattern is to refresh the token before it expires.

Set the token expiration to one week and refresh the token every time the user opens the web application and every one hour. If a user doesn't open the application for more than a week, they will have to login again and this is acceptable web application UX.

To refresh the token, your API needs a new endpoint that receives a valid, not expired JWT and returns the same signed JWT with the new expiration field. Then the web application will store the token somewhere.
Mobile/Native applications

Most native applications do login once and only once.

The idea is that the refresh token never expires and it can be exchanged always for a valid JWT.

The problem with a token that never expires is that never means never. What do you do if you lose your phone? So, it needs to be identifiable by the user somehow and the application needs to provide a way to revoke access. We decided to use the device's name, e.g. "maryo's iPad". Then the user can go to the application and revoke access to "maryo's iPad".

Another approach is to revoke the refresh token on specific events. An interesting event is changing the password.

We believe that JWT is not useful for these use cases, so we use a random generated string and we store it on our side.


 84

In the case where you handle the auth yourself (i.e don't use a provider like Auth0), the following may work:

    Issue JWT token with relatively short expiry, say 15min.
    Application checks token expiry date before any transaction requiring a token (token contains expiry date). If token has expired, then it first asks API to 'refresh' the token (this is done transparently to the UX).
    API gets token refresh request, but first checks user database to see if a 'reauth' flag has been set against that user profile (token can contain user id). If the flag is present, then the token refresh is denied, otherwise a new token is issued.
    Repeat.

The 'reauth' flag in the database backend would be set when, for example, the user has reset their password. The flag gets removed when the user logs in next time.

In addition, let's say you have a policy whereby a user must login at least once every 72hrs. In that case, your API token refresh logic would also check the user's last login date from the user database and deny/allow the token refresh on that basis.



Below are the steps to do revoke your JWT access token:

1) When you do login, send 2 tokens (Access token, Refresh token) in response to client .
2) Access token will have less expiry time and Refresh will have long expiry time .
3) Client (Front end) will store refresh token in his local storage and access token in cookies.
4) Client will use access token for calling apis. But when it expires, pick the refresh token from local storage and call auth server api to get the new token.
5) Your auth server will have an api exposed which will accept refresh token and checks for its validity and return a new access token.
6) Once refresh token is expired, User will be logged out.

Please let me know if you need more details , I can share the code (Java + Spring boot) as well.


This has problems with multiple devices. Essentially if you log out on one device, it logs out everywhere. Right? – 
Sam Washburn
Apr 28, 2018 at 6:08
5
Hey, that may not be a "problem" depending on your requirements, but you're right; this doesn't support per-device session management. – 



Today, lots of people opt for doing session management with JWTs without being aware of what they are giving up for the sake of perceived simplicity. My answer elaborates on the 2nd part of the questions:

    What is the real benefit then? Why not have only one token (not JWT) and keep the expiration on the server?

    Are there other options? Is using JWT not suited for this scenario?

JWTs are capable of supporting basic session management with some limitations. Being self-describing tokens, they don't require any state on the server-side. This makes them appealing. For instance, if the service doesn't have a persistence layer, it doesn't need to bring one in just for session management.

However, statelessness is also the leading cause of their shortcomings. Since they are only issued once with fixed content and expiration, you can't do things you would like to with a typical session management setup.

Namely, you can't invalidate them on-demand. This means you can't implement a secure logout as there is no way to expire already issued tokens. You also can't implement idle timeout for the same reason. One solution is to keep a blacklist, but that introduces state.

I wrote a post explaining these drawbacks in more detail. To be clear, you can work around these by adding more complexity (sliding sessions, refresh tokens, etc.)

As for other options, if your clients only interact with your service via a browser, I strongly recommend using a cookie-based session management solution. I also compiled a list authentication methods currently widely used on the web.


thanks for the excellent-simple authentication guide linked / and for authoring it :) Would using a combo of JWT+Cookies (save the accessToken to a cookie) be a good solution? – 
George Katsanos
Jul 2, 2020 at 19:42
1
Saving the JWT to a cookie would work well. It would give your cookie value integrity protection, but you still need some way to blacklist tokens on-demand, if you need to support more advanced scenarios like idle timeout. I would opt for a simple session-id in a cookie. 



Good question- and there is wealth of information in the question itself.

The article Refresh Tokens: When to Use Them and How They Interact with JWTs gives a good idea for this scenario. Some points are:-

    Refresh tokens carry the information necessary to get a new access token.
    Refresh tokens can also expire but are rather long-lived.
    Refresh tokens are usually subject to strict storage requirements to ensure they are not leaked.
    They can also be blacklisted by the authorization server.





Here's what worked for me, without needing to generate new token on every api call. The approach is to use a timer at the client and force logout after token expires.

Use two tokens:

    Access token (for making API calls)
    Refresh token (for renewing Access token)

Steps to implement JWT that prolong

    If the session is timed for 1 hour duration then set Access Token expiry to 1 Hr and refresh token expiry to 2 Hr.
    Maintain 1 Hr timer on each api call and if the time exceeds 1Hr, then send the refresh token in the Auth header. The backend figures out the type of token (AT/RT) and it will check for its expiry and accordingly generate new token.
    If the client timer exceeds 1 hour since the last call, the client will call the logout api which will remove these tokens from the whitelist category or add them to blacklist whichever methods suits you.(I chose whitelist because clean up is not required).
    If it is a access token, server will simply serve the request and if the token is a refresh token, the backend will generate new access token and refresh token and send these two in the response headers.

Note :

Step 2 can be done differently, once the timer exceeds 1 Hr threshold, identify the diff between the last api call and current time ,if it exceeds 1 Hr then force logout, else at the 59th minute send the last api call time and generate new tokens with expiry time (last call time + 1 hr). In this case you don't need any refresh token.

And for whitelisting or blacklisting tokens, you may use redis(instead of db), for lookup.
