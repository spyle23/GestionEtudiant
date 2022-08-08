import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, tap} from 'rxjs';
import { confirmEqual } from '../../Validators/inscription.validator';
import { AuthService } from "../../service/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {

  inscriptionForm!:FormGroup;
  emailForm!:FormGroup;
  infoPersoForm!:FormGroup;

  nomCtrl!:FormControl;
  prenomCtrl!:FormControl;
  emailCtrl!:FormControl;
  emailConfirmationCtrl!:FormControl;
  pseudoCtrl!:FormControl;
  mdpCtrl!:FormControl;
  mdpConfirmationCtrl!:FormControl;

  controlConfirmationEmail$!: Observable<any>;
  controlConfirmationInfoPerso$!:Observable<any>;
  loading$!:Observable<boolean>;

  constructor( private fb: FormBuilder, private authService: AuthService, private router: Router ) { }

  ngOnInit(): void {
    this.initForm();
    this.initObservable();
  }
  private resetForm(): void{
    this.inscriptionForm.reset();
  }

  onSubmit(): void{
    this.authService.setLoadingStatus();
    this.authService.singUp(this.inscriptionForm.value).pipe(
      tap((saved) => {
        this.authService.setLoadingStatus();
        if (saved) {
          this.resetForm();
          this.router.navigateByUrl('/');
        } else {
          console.error('enregistrement échoué');
        }
      })
    ).subscribe();
    console.log(this.inscriptionForm.value);
  }

  private initObservable(): void{
    this.loading$ = this.authService.loading$;
    this.controlConfirmationEmail$ = this.emailForm.statusChanges.pipe(
      map((value)=> value==='INVALID' && this.emailCtrl.value && this.emailConfirmationCtrl.value && this.emailForm.hasError('equal'))
    );
    this.controlConfirmationInfoPerso$ = this.infoPersoForm.statusChanges.pipe(
      map((value)=> value === 'INVALID' && this.mdpCtrl.value && this.mdpConfirmationCtrl.value && this.infoPersoForm.hasError('equal'))
    );
  }

  private initForm(): void{
    console.log('miditra ato ve');
    this.nomCtrl = this.fb.control('',[Validators.required]);
    this.prenomCtrl = this.fb.control('', [Validators.required]);


    this.emailCtrl = this.fb.control('', [Validators.required, Validators.email]);
    this.emailConfirmationCtrl = this.fb.control('', [Validators.required, Validators.email]);
    this.emailForm = this.fb.group({
      email: this.emailCtrl,
      confirmEmail: this.emailConfirmationCtrl
    },{
      validators: [confirmEqual('email', 'confirmEmail')],
      updateOn:'blur'
    });

    this.pseudoCtrl = this.fb.control('',[Validators.required]);
    this.mdpCtrl = this.fb.control('', [Validators.required]);
    this.mdpConfirmationCtrl = this.fb.control('', [Validators.required]);

    this.infoPersoForm = this.fb.group({
      pseudo: this.pseudoCtrl,
      mdp:this.mdpCtrl,
      confirmMdp: this.mdpConfirmationCtrl
    },{
      validators: [confirmEqual('mdp', 'confirmMdp')],
      updateOn:'blur'
    });

    this.inscriptionForm = this.fb.group({
      nom: this.nomCtrl,
      prenom: this.prenomCtrl,
      mail: this.emailForm,
      infoPerso: this.infoPersoForm
    })
  }

}
