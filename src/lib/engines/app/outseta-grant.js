import * as Bake from "@dashkite/bake";

// const DAVID2 = {
//   "nbf": 1737966877,
//   "exp": 1738571677,
//   "iss": "https://gobo.outseta.com",
//   "client_id": "gobo.outseta.com.resource-owner",
//   "scope": [
//       "openid",
//       "outseta",
//       "profile"
//   ],
//   "sub": "NmdqLzgQ",
//   "auth_time": 1737966877,
//   "idp": "idsrv",
//   "email": "real.david.harper+test01@gmail.com",
//   "email_verified": true,
//   "family_name": "Test",
//   "given_name": "David",
//   "name": "David Test",
//   "nameid": "NmdqLzgQ",
//   "outseta:accountUid": "VmAkK809",
//   "outseta:isPrimary": "1",
//   "outseta:subscriptionUid": "vWywxqkQ",
//   "outseta:planUid": "496Gr7WX",
//   "outseta:addOnUids": [],
//   "amr": [
//       "password"
//   ],
//   "aud": "gobo.outseta.com",
//   "iat": 1737966877
// }


class OutsetaGrant {
  ADMIN_PLANS = [
    "496Gr7WX"
  ];

  GENERAL_PLANS = [
    "BWz5El9E"
  ];

  constructor({ token }) {
    this.token = token;
    this.valid = false;
    this.claims = {};
    this.roles = new Set();
  }

  static make({ token }) {
    const grant = new OutsetaGrant({ token });
    grant.validate();
    if ( grant.isValid() ) {
      grant.resolveRoles();
    }
    return grant;
  }

  validate() {
    try {
      this._validate();
    } catch ( error ) {
      console.warn( error );
      this.valid = false;
    }
  }

  // TODO: This only decodes. Should we formally validate the signature?
  decodeClaims() {
    const encoded = this.token?.split(".")?.[1];
    if ( encoded == null ) {
      throw new Error( "invalid Outseta token" );
    }
    const decoded = Bake.convert({ from: "base64", to: "utf8" }, encoded );
    return JSON.parse( decoded );
  }

  // This checks that we have the neccessary claims to use this instance normally.
  _validate() {
    this.claims = this.decodeClaims();

    this.plan = this.claims[ "outseta:planUid" ];
    if ( !this.plan ) {
      throw new Error( "no Outseta plan specified among claims" );
    }
    
    this.addons = this.claims[ "outseta:addOnUids" ] ?? [];
    
    if ( !this.claims.exp ) {
      throw new Error( "no expiration field among claims" );
    }
    this.expires = new Date( this.claims.exp * 1000 );
    
    if ( this.claims.email_verified == null ) {
      throw new Error( "no email_verified field among claims");
    }
    this.verifiedEmail = this.claims.email_verified;
    
    this.valid = true;
  }

  isValid() {
    return this.valid;
  }

  // TODO: This will get more sophsiticated in the future.
  resolveRoles() {
    if (this.ADMIN_PLANS.includes( this.plan )) {
      this.roles.add( "admin" );
      this.roles.add( "general" );
    }
    if (this.GENERAL_PLANS.includes( this.plan )) {
      this.roles.add( "general" );
    }
  }

  isExpired() {
    const now = new Date();
    if ( this.isValid() && now < this.expires ) {
      return false;
    } else {
      return true;
    }
  }

  hasVerifiedEmail() {
    return this.verifiedEmail;
  }
}

export {
  OutsetaGrant
}