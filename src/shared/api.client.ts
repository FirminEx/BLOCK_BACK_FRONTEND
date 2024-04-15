import axios from 'axios';
import type { Guardian } from './guardian.interface';

const API_URL = 'http://localhost:9000';

export function saveGuardian({ address, name, phone, email }: Guardian) {
  return axios
    .post(
      API_URL + '/guardians',
      { guardian: address, name, phone, email },
      { headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` } }
    )
    .catch(() => {
      throw new Error('error');
    });
}

export function deleteGuardian({ address }: Guardian) {
  return axios
    .delete(API_URL + '/guardians', {
      data: { deleteAddress: address },
      headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
    })
    .catch(() => {
      throw new Error('error');
    });
}

export function deleteSafeguarded(address: string) {
   return axios
     .delete(API_URL + '/guardians/safeguarded', {
       data: { deleteAddress: address },
       headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
     })
     .catch(() => {
       throw new Error('error');
     });
}
