import { NgModule } from "@angular/core";
import { provideAuth, getAuth, connectAuthEmulator } from "@angular/fire/auth";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { ReactiveFormsModule } from "@angular/forms";
import { environment } from "src/environments/environment";
import { SharedModule } from "../shared/shared.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";


@NgModule({
  declarations: [ SignupComponent, LoginComponent ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    //provideAuth(() => getAuth()),
     provideAuth(() => {
       const auth = getAuth();
       if (environment.useEmulators) {
         connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
       }
       return auth;
     }),
  ],
  exports: []
})
export class AuthModule {}
