# JWT (JSON Web Token)

`accessToken` is a **JWT (JSON Web Token)**.  
It looks like a long string with three parts separated by dots:

```
aaaaaa.bbbbbb.cccccc
```

🔹 Inside the token (in the payload) there is **user information**. In our code, that’s:

```
{ username: foundUser.username }
```

In addition, the token contains:

- an expiration time (`expiresIn: '30s'`),

- a signature (signed with the secret key `ACCESS_TOKEN_SECRET`), so it cannot be tampered with.

---

📌 On the client side (React, Vue, etc.):

- after a successful login, the client receives this token from the server (`res.json({ accessToken })`).

- it stores the token (often in `localStorage`, `sessionStorage`, or in memory).

- for subsequent requests to the API, it includes the token in the header:

```
Authorization: Bearer <accessToken>
```

That way, the server immediately knows _“Oh, this is John, his token is valid”_ and grants access to protected resources.
