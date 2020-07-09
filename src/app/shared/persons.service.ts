/*Service to control CRUD*/

import { Injectable } from '@angular/core';

/*Form control for Forms*/
import { Validators,FormControl, FormGroup } from "@angular/forms";

/*Firebase imports*/
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {

  /* Form with the database needs*/
  form = new FormGroup({
    Name: new FormControl(''),
    Email: new FormControl(''),
    Avatar: new FormControl(''),
    DateOfBirth: new FormControl(''),
    Country: new FormControl('')
  })

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  /* Create method*/
  createPerson(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("persons")
        .add(data)
        .then(res => { this.dismissModal("staticBackdrop"); }, err => reject(err));
    });
  }

  /*Read method*/
  getPersons() {
    return this.firestore.collection("persons").snapshotChanges();
  }

  /*Update method*/
  loadImage(id: string, data: any) {
    this.firestore.collection("persons").doc(id).set(data).then(function() {
      console.log("Document successfully updated!");
    }).catch(function(error) {
      console.error("Error updating document: ", error);
    });
  }

  /*Method to set values on the form*/
  setValues(data: any) {
    this.form.setValue({
      Name: data.Name,
      Email: data.Email,
      Avatar: '',
      DateOfBirth: data.DateOfBirth,
      Country: data.Country
    });
  }

  /*Delete person*/
  deletePerson(data) {
    this.firestore.collection("persons").doc(data).delete().then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  }

  /*Upload photo to storage*/
  public uploadCloudStorage(imageName: string, datos: any) {
    return this.storage.upload(imageName, datos);
  }

  /*Get storage reference*/
  public cloudStorageReference(imageName: string) {
    return this.storage.ref(imageName);
  }

  /*Dismiss modal*/
  dismissModal(id){
    $('#'+id).modal('hide');
  }
}
