export class Inscription{
  nom!:string;
  prenom!:string;
  mail!:{
   email:string;
    emailConfirmation:string;
  };
  infoPerso!:{
    pseudo: string;
    mdp: string;
    mdpConfirmation: string;
  }
}
