import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor() { }

  comfirm(): Promise<any> {
    return Swal.fire({
      title: 'Are you sure you want to delete this record?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  }


  comfirmAssignToMe(): Promise<any> {
    return Swal.fire({
      title: 'Are you sure you want to assign these student to your profile',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    });
  }
}

