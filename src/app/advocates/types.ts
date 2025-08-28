export type Advocate = {
    id: string | number;
    firstName: string;
    lastName: string;
    city: string;
    degree: string;
    specialties: string[];
    yearsOfExperience: number | string;
    phoneNumber: string;
  };
  
  export type AdvocatesResponse = {
    items: Advocate[];
    total: number;
  };
  