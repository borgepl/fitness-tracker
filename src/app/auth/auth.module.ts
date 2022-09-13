import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { provideAuth, getAuth, connectAuthEmulator } from "@angular/fire/auth";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { environment } from "src/environments/environment";
import { MaterialModule } from "../material.module";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

@NgModule({
  declarations: [ SignupComponent, LoginComponent ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
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
