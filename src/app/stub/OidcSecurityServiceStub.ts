import { AuthenticatedResult, AuthOptions } from "angular-auth-oidc-client";
import { Observable, of } from "rxjs";


export class OidcSecurityServiceStub {
  getToken() {
    return 'some_token_eVbnasdQ324';
  }

  checkAuth(url: string) {
    return of(url);
  }

  authorize(authOptions?: AuthOptions) {

    return authOptions?.urlHandler?('http://localhost') : null;
  }

  isAuthenticated$() : Observable<AuthenticatedResult> {
    const authenticatedResult: AuthenticatedResult = {
      isAuthenticated: true,
      allConfigsAuthenticated: [
        {
          configId: "string",
          isAuthenticated: true
        }
      ]
    };
    return of(authenticatedResult);
  }
}
