
export interface User {
    id: number;
    profile: {
      name: string;
      tags: string[];
    };
  }
  

  export function userMutator(user: User): string {
    // This function intends to mutate the object
    user.profile.name = "Mutated Name"; 
    user.profile.tags.push("active");
    
    return user.profile.name;
  }