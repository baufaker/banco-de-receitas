import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiURL + '/users/';

// usa-se o providedIn: root para não precisar chamar o posts.service no app.module como provider.
@Injectable({providedIn: 'root'})
export class AuthService {

  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: string;
  private userRole: string;
  private userRoleListener = new Subject<string>();

  // injetando HttpClient na classe
  constructor(private http: HttpClient, private router: Router) {}

  // getToken só vai ser usado no interceptor para inserir o token no header dos requests.
  // Os outros componentes, na interface, só precisam saber se o usuário está logado ou não.
  // Para isso, criaremos o Subject para componentes interessados poderem assinar (subscribe)
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  // Retorna um boolean para falar se o usuário está autenticado ou não
  // outras partes do código chamarão este método para receber o listener
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserRoleListener() {
    return this.userRoleListener.asObservable();
  }

  getUserId(){
    return this.userId;
  }

  createUser(email: string, password: string){
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post(BACKEND_URL + 'signup', authData)
      .subscribe(response => {
        console.log(response);
        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['/auth/login']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string){
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post<{ token: string, expiresIn: number, userId: string, userRole: string }>(BACKEND_URL + 'login', authData)
      .subscribe(response => {
        console.log('resposta login: ', response);
        this.token = response.token;

        if (this.token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          // console.log(expiresInDuration);
          this.authStatusListener.next(true);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.userRole = response.userRole;
          this.userRoleListener.next(this.userRole);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + (expiresInDuration*1000));
          console.log(expirationDate);
          this.saveAuthData(this.token, expirationDate, response.userId, response.userRole);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  // função que autentica o usuário automaticamente a cada reinicialização do serviço (recarregamento da página). Se tivermos o token guardado em localStorage, já usamos isso para reautenticar o usuário e atualizar os listeners e o getIsAuth
  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    // se o token ainda não tiver expirado
    if(expiresIn > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.userRole = authInformation.userRole;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn);
      this.userRoleListener.next(this.userRole);
      this.authStatusListener.next(true);
    }
  }

  getUserRole() {
    return this.userRole;
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(() => {
      console.log('loging out');
      this.logout();
    }, duration * 10000);
  }

  // função criada para manter a autenticação (manter o token) apesar da tela recarregar
  // antes, estávamos salvando o token apenas na variável private token do serviço.
  // quando a tela recarrega, reinicia-se o código do serviço e todas as variáveis voltam pro seu valor inicial
  private saveAuthData(token: string, expirationDate: Date, userId: string, userRole: string){
    localStorage.setItem('token', token);
    // boa prática persistir o expiration date como data e não somente como um valor em segundos
    // porque, no autoAuthUser, vamos ver se o token ainda estar valendo checando se a data de expiração
    // está no futuro
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', userRole);
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    if(!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      userRole: userRole
    }
  }
}
