import axios from 'axios';
import type { Guardian } from './guardian.interface';

const API_URL = import.meta.env.VITE_API_URL;

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

export function getSafeguarded() {
  return axios.get(API_URL + '/guardians/safeguarded', {
    headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
  });
}

export function getGuardians() {
  return axios.get(API_URL + '/guardians', {
    headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
  });
}

export function login(messages: { signature: string, message: string }) {
  return axios.post(API_URL + '/auth/login', messages);
}