import auth0 from "auth0-js";

class Auth {
  //Create instance of auth0.WebAuth with Auth0 values + configurations
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: "dev-oc1e9m8w.auth0.com",
      audience: "https://dev-oc1e9m8w.auth0.com/userinfo",
      clientID: "BN7hhV8FuU8yJD24aHyicbVQiiXP31Bl",
      redirectUri: "http://localhost:3000/callback",
      responseType: "id_token",
      scope: "openid profile"
    });

    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  //Returns profile of authenticated user
  getProfile() {
    return this.profile;
  }

  //Returns ID token generated by Auth0 for current user
  // This is used while issuing reqests to POST endpoints
  getIdToken() {
    return this.idToken;
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  //Initialized sign in. Sends user to Auth0 sign in page
  signIn() {
    this.auth0.authorize();
  }

  //App will call this right after user is redirected from Auth0
  //Reads hash segment of URL to fetch user details and ID token
  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.idToken = authResult.idToken;
        this.profile = authResult.idTokenPayload;
        this.expiresAt = authResult.idTokenPayload.exp * 1000;
        resolve();
      });
    });
  }

  //Signs out by setting values to null
  signOut() {
    this.idToken = null;
    this.profile = null;
    this.expiresAt = null;
  }
}

// Creates 1 instance of Auth class. Only 1 in the app.
const auth0Client = new Auth();

export default auth0Client;
