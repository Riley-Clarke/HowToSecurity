import React from 'react';
import { Link } from "react-router-dom";
import './Modules.css';

const AuthTokens = () => {
  return (
    <div className="module-container">
      <h1 className="module-header">What are JWT?</h1>
      <p className="module-body">JSON Web Tokens (JWT) are a method of sending data and information 
        between parties, which is often chosen due to it being able to be signed and the fact that the 
        JSON format is easy to parse and standardized. JWT are meant to be compact and are not 
        used for sending large messages or pieces of information.
      </p>
    
      <p className="module-body">JWT's are made up of 3 pieces:
        <ul>
            <li>Header - identifies what type of algorithm being used to create the signature as 
                well as the type of token being sent, which for this case will always be 'JWT'.</li>
            <li>
                Payload - the payload contains a set of "claims" which are just the important information within 
                the JWT. This will include things such as the user that the token is authorizing, their role, 
                and any other important information along with it. It will also likely include other standard information 
                such as the issuer, the time of expiration, the subject, the time issued at, etc. 
            </li>
            <li>
                Signature - the token's signature is what confirms that the information in the JWT is reliable and 
                unchanged. The signature shows that the token comes from who it says it does, and that the data is correct 
                and has not been tampered with or unintentionally changed. The signature is made by hashing together the header, 
                payload, and a secret using the algorithm specified in the header.
            </li>
        </ul> 
      </p>

      <h1 className='module-header'>Example of a JWT</h1>
      <p className='module-body'>
        Below is an example of a JWT token generated on <a href="https://www.jwt.io">JWT.io</a>. The three pieces of the JWT are 
        separated by a ".", and are all encoded in Base64. Below that is the data that is encoded in the JWT, with a secret 
        of "Secret-HowToSecurity-String-For-JWT". You can visit the website to try decoding the JWT and ensuring that the 
        signature is correct!
      
      </p>
      <p className='module-code'>
        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTc3NjE5NTgzOH0._tr3U92k3_uDu71C47YqMo1Fwmiqp2pnJ90Wd-MIXZY
      </p>
      <p className='module-body'>Header:</p>
      <p className='module-code'>
        &#123;<br/>
        "alg": "HS256",<br/>
        "typ": "JWT"<br/>
        &#125;
      </p>
      <p className='module-body'>Payload:</p>
      <p className='module-code'>
        &#123;<br/>
        "sub": "1234567890",<br/>
        "name": "John Doe",<br/>
        "admin": true,<br/>
        "iat": 1516239022<br/>
        &#125;
      </p>
      <p className='module-body'>Signature:</p>
      <p className='module-code'>
        HMAC-SHA256(Header+ "." +Payload, secret);
      </p>

      <h1 className='module-header'>Authentication vs. Authorization</h1>
      <p className="module-body">
        It may be unclear to some the difference between authentication and authorization. Authentication is verifying that 
        information is correct and that a user is who they say that they are. For example, you are authenticated when 
        you login with a username and password. Authorization is the process of ensuring that the user is able to access 
        what they intend to access, such as checking that the user is accessing their bank account instead of another account.
      </p>

      <h1 className='module-header'>Use of JWT</h1>
      <p className='module-body'>
        The most common use case for JWT is for the authorization of a user, usually for accessing data that is not available 
        to a general level. This can include account specific details/screens, access to specific API, etc. This occurs after a user 
        logs in and is given a token that authorizes them for their necessary level of access. It is important that these tokens 
        have an expiry date to avoid things such as unauthorized access of information if their role is changed. For example, 
        if an admin is downgraded to be a regular user, but their token has not expired, they may still be able to access admin-only 
        content.
      </p>

      <h1 className='module-header'>Access and Refresh Tokens</h1>
      <p className='module-body'>
        Due to the short-lived nature of JWT tokens, it is often the case that tokens will need to be re-issued to users. The JWT 
        token that allows users to be authorized as who they are can be called the "access" token, as it gives them the ability 
        to access the content they are looking for. When a user is authenticated, we will also store a "refresh" token that is 
        associated with the user. When the user provides their refresh token, we can check it against the token being stored to 
        ensure that they are who they say they are, and give them the new temporary access token. This allows for the same ease 
        of access without leaving tokens as valid for extended periods of time to avoid authorization issues. These refresh tokens 
        will still need to be refreshed and rotated after every use to ensure that these tokens cannot be stolen and used to 
        authorize and act as someone that you are not.
      </p>

      <h1 className='module-header'>Security of JWT</h1>
      <p className='module-body'>
        It is also important to note that <b>JWT are NOT encrypted by default.</b> This means that you should not be storing 
        sensitive data in the JWT, as users are able to access it plainly as it is only encoded using Base64. The information in 
        these tokens is also freely able to be changed, which is why having the signature is crucial. While you may be able 
        to change the token, this will cause the signature to become incorrect and will not allow unauthorized access.
      </p>

      <h1 className='module-header'>Should you implement JWT yourself?</h1>
      <p className='module-body'>While JWT may seem like quite the simple task in practice, it can become 
        complex once you actually begin to implement it. Ensuring that you are including the right information, correctly 
        validating tokens, and rotating tokens in a safe manner is crucial to the security of your system. There are 
        multiple providers who have off-the-shelf packages for things like this such as Auth0, Clerk, and Okta. Whether or not 
        you should implement these yourself is dependent upon how much time you are willing to commit to do it safely and securely.
      </p>

      <h2 className="module-header">Try it in the sandbox</h2>
      <p className="module-body">
        Use the sandbox to issue a server-signed token, decode it, tamper with claims, and see what the server actually
        verifies (signature, exp, iss, aud).
      </p>
      <p className="module-body">
        <Link to="/sandbox/jwt" style={{ color: "#203446", textDecoration: "none", fontWeight: 700 }}>
          → Open the JWT / Auth Tokens Sandbox
        </Link>
      </p>

      <h2 className="module-header">Further reading (reputable references)</h2>
      <p className="module-body">
        To learn more about JWT, take a look at these in-depth resources:
      </p>
      <ul className="module-body" style={{ marginTop: 0 }}>
        <li>
          JWT.io (Includes hands-on JWT creation and encoding/decoding!):{" "}
          <a href="https://www.jwt.io/introduction" target="_blank" rel="noreferrer">
            jwt.io
          </a>
        </li>
        <li>
          Ariel Weinberger's Video Explanation:{" "}
          <a href="https://youtu.be/Y2H3DXDeS3Q?si=mwwZy8l37y4yDxXm" target="_blank" rel="noreferrer">
            Video
          </a>
        </li>
        <li>
          Auth0's Token Documentation:{" "}
          <a href="https://auth0.com/docs/secure/tokens" target="_blank" rel="noreferrer">
            Auth0.com
          </a>
        </li>
      </ul>
    </div>
  );
};

AuthTokens.metadata = {
  title: 'JWT Authorization Tokens',
  description: 'Learn how JWT can be used for user authorization and remembering users between sessions.',
  difficulty: 'Intermediate',
  estimatedTime: '30 minutes',
  tags: ['JWT', 'JavaScript', 'Security', 'Authentication', 'Authorization'],
  prerequisites: ['JavaScript Fundamentals'],
  learningObjectives: [
    'Understand JWT\'s uses and vulnerabilities',
    'Learn how to safely implement JWT'
  ]
};

export default AuthTokens;