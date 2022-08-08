import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss'],
})
export class ConnexionComponent implements OnInit {
  connexionForm!: FormGroup;
  suscription: Subscription = new Subscription();
  loading$!: Observable<boolean>;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loading$ = this.authService.loading$;
  }
  private initForm() {
    this.connexionForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      mdp: [null, [Validators.required]],
    });
  }
  public onChoiceAction(): void {
    if (this.authService._loading$.value == false) {
      this.onSubmitForm();
    } else {
      this.authService.setLoadingStatus();
      this.suscription.unsubscribe();
    }
  }
  public onSubmitForm() {
    this.authService.setLoadingStatus();
    this.suscription.add(
      this.authService
        .signIn(this.connexionForm.value)
        .pipe(
          tap((saved) => {
            this.authService.setLoadingStatus();
            this.router.navigateByUrl('/liste');
          })
        )
        .subscribe()
    );
  }
  private resetForm(): void {
    this.connexionForm.reset();
  }
}
