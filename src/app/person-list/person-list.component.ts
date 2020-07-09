import { Component, OnInit } from '@angular/core';
import { PersonsService } from "../shared/persons.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})

export class PersonListComponent implements OnInit {


  public persons = [];
  public archivoForm = new FormGroup({
    archivo: new FormControl(null, Validators.required),
  });

  public fileMessage = 'there is no file selected';
  public imageData = new FormData();
  public imageName = '';
  public publicURL = '';
  public percentage = 0;
  public ended = false;

  constructor(private personService: PersonsService) { }

  ngOnInit(): void {
    this.getPersons();
  }

  /*Set values to the form*/
  setValues(data) {
    this.personService.form.setValue({
      Name: data.Name,
      Email: data.Email,
      Avatar: data.Avatar,
      DateOfBirth: data.DateOfBirth,
      Country: data.Country
    });

  }

  /*Load image*/
  loadImage(event, id) {
    if (event.target.files.length > 0) {
      var reader = new FileReader();
      reader.onload = function(e) {
        const imgUrl: string = e.target.result as string;
        $('#avatar' + id.id).attr('src', imgUrl);
      }
      reader.readAsDataURL(event.target.files[0]);

      for (let i = 0; i < event.target.files.length; i++) {
        this.fileMessage = `file ready: ${event.target.files[i].name}`;
        this.imageName = event.target.files[i].name;
        this.imageData.delete('image');
        this.imageData.append('image', event.target.files[i], event.target.files[i].name)
      }
    } else {
      this.fileMessage = 'No hay un archivo seleccionado';
    }
  }

  /*Get persons*/
  getPersons = () => {
    this.personService.getPersons().subscribe((personSnapshot) => {
      this.persons = [];
      personSnapshot.forEach((personData: any) => {
        this.persons.push({
          id: personData.payload.doc.id,
          data: personData.payload.doc.data()
        });
      })
    });
  }



  /*Update data*/
  update(url, data) {
    if(url!="null"){
      this.personService.form.value.Avatar = url;
    }
    this.personService.loadImage(data.id, this.personService.form.value);
    this.dismissModal(data.id);
  }


  /*Upload image to cloudStorage*/
  public uploadImage(data) {
    let file = this.imageData.get('image');
      if(file==null){
        this.update('null', data)
      }else{
      let reference = this.personService.cloudStorageReference(this.imageName);
      let progress = this.personService.uploadCloudStorage(this.imageName, file);
      progress.snapshotChanges().pipe(
        finalize(() => {
          let downloadURL = reference.getDownloadURL()
          downloadURL.subscribe(url => (this.publicURL = url, this.update(url, data)));
        })
      )
        .subscribe();

      /*change the percentage*/
      progress.percentageChanges().subscribe((percentage) => {
        this.percentage = Math.round(percentage);
        if (this.percentage == 100) {
          this.ended = true;
        }
      });
    }
  }

  /*Delete person*/
  deletePerson = data => this.personService.deletePerson(data);

  /*Dismiss modal when over*/
  dismissModal(id) {
    $('#' + id).modal('hide');
  }

}
