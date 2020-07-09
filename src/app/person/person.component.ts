import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PersonsService } from "../shared/persons.service";
import { finalize } from 'rxjs/operators';



@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})


export class PersonComponent implements OnInit {

  /*Form control for image*/
  public archivoForm = new FormGroup({
    archivo: new FormControl(null, Validators.required),
  });

  public fileMessage = 'there is no file selected';
  public imageData = new FormData();
  public imageName = '';
  public publicURL = '';
  public percentage = 0;
  public ended = false;

  constructor(public personService: PersonsService) { }

  ngOnInit(): void {
  }


  /*Reset form Values*/
  setValues() {
    this.personService.form.setValue({
      Name: '',
      Email: '',
      Avatar: '',
      DateOfBirth: '',
      Country: ''
    });

  }


  loadImage(event, id) {

    /*Read file from image picker*/
    if (event.target.files.length > 0) {
      var reader = new FileReader();
      reader.onload = function(e) {
        const imgUrl: string = e.target.result as string;
        $('#avatar' + id).attr('src', imgUrl); /*Update image on display*/
      }
      reader.readAsDataURL(event.target.files[0]);

      for (let i = 0; i < event.target.files.length; i++) {
        this.fileMessage = `File Ready: ${event.target.files[i].name}`;
        this.imageName = event.target.files[i].name;
        this.imageData.delete('image');
        this.imageData.append('image', event.target.files[i], event.target.files[i].name)
      }
    } else {
      this.fileMessage = 'no file has been selected';
    }
  }

  /*Upload image to cloudStorage*/
  public uploadImage() {

    let data = this.personService.form.value;
    if (data.Name === "" || data.Email === "" || data.DateOfBirth === "" || data.Country === "") {
      alert("please fill all the fields");
    } else {

      let file = this.imageData.get('image');
      let reference = this.personService.cloudStorageReference(this.imageName);
      let progress = this.personService.uploadCloudStorage(this.imageName, file);
      progress.snapshotChanges().pipe(
        finalize(() => {
          let downloadURL = reference.getDownloadURL()
          downloadURL.subscribe(url => (this.publicURL = url, this.onSubmit(url)));
        })
      )
        .subscribe();

      /*update the percentage*/
      progress.percentageChanges().subscribe((percentage) => {
        this.percentage = Math.round(percentage);
        if (this.percentage == 100) {
          this.ended = true;
        }
      });
    }
  }


  /*Send to Firebase*/
  onSubmit(url) {
    this.personService.form.value.Avatar = url;
    let data = this.personService.form.value;
    this.personService.createPerson(data)
      .then(res => {
      });
  }
}
