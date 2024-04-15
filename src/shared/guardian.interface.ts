export interface Guardian {
  address: string;
  name: string;
  email: string;
  phone: number;
  isNewGuardian: boolean;
  isMarkedForDeletion: boolean;
}

export interface DbGuardian {
  safeguarded: string;
  guardian: string;
  name: string;
  email: string;
  phone: string;
}
