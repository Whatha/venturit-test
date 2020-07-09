
/* Angular Default Imports */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/* The components */
import { PersonComponent } from './person/person.component';
import { PersonListComponent } from './person-list/person-list.component';

/* The Services */
import { PersonsService } from "./shared/persons.service";

/* Angular Forms */
import { ReactiveFormsModule } from "@angular/forms";

/* Firebase environment connection */
import { environment } from "src/environments/environment";

/* Firebase imports*/
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from '@angular/fire/storage';

/*Pipe*/
import { Pipe, PipeTransform } from '@angular/core';
import { AgePipe } from './age.pipe';


import { AppComponent } from './app.component';

/* bootstrap & jquery */
import * as bootstrap from "bootstrap";
import * as $ from 'jquery';

@NgModule({
  declarations: [
    AppComponent,
    PersonComponent,
    PersonListComponent,
    AgePipe
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule
  ],
  providers: [PersonsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
