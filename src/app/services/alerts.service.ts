import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor() { }

  messageWithImage(title: string, text: string, imageUrl: string, confirmButton: boolean, timer: number) {
    Swal.fire({
      title: title,
      text: text,
      imageUrl: imageUrl,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
      background: '#e4f6ff',
      showConfirmButton: confirmButton,
      confirmButtonColor: '#56B38F',
      timer: timer,
    })
  }

  messagePosition(title: string, text: string, position: any, timer: number) {
    Swal.fire({
      position: position,
      icon: 'success',
      title: title,
      showConfirmButton: false,
      confirmButtonColor: '#56B38F',
      timer: timer,
    })
  }

  confirmMessage(text: string) {
    return Swal.fire({
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#56B38F',
      cancelButtonColor: '#d33',
      confirmButtonText:'Yes, delete!',
      cancelButtonText: 'Cancel'
    })
  }

  successMessage(text: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: text,
      confirmButtonColor: '#56B38F',
    })
  }

  errorMessage(text: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: text,
      confirmButtonColor: '#56B38F',
    })
  }

}
