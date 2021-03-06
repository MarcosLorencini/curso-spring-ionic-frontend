import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";
import { JwtHelper } from 'angular2-jwt';
import { CartService } from "./domain/cart.service";


@Injectable()
export class AuthService {
    //enviar email e senha para o backend

    //para extrair o email do localStorage
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        public http: HttpClient, 
        public storage: StorageService,
        public cartService: CartService) {

    }

    authenticate(creds : CredenciaisDTO) {
       return this.http.post(`${API_CONFIG.baseUrl}/login`, 
        creds,
        {
            //pegar o header da resposta
            observe: 'response',
            //retorna uma texto não json, pq o endpoint de login retorna de corpo vazio email e senha vazio
            responseType: 'text'
        })

    }

    //aproveitar o usuário logado na tela inicial
    //o token é icluído automaticamente na requisição pelo interceptor
    refreshToken() {
        return this.http.post(`${API_CONFIG.baseUrl}/auth/refresh_token`, 
         {},
         {
             //pegar o header da resposta
             observe: 'response',
             //retorna um texto não json, para o framework não dar erro de parse, achando que é json, tem que colocar o 'text' 
             responseType: 'text'
         })
 
     }
    //login realizado com sucesso
    //receber como argumento o better token no cabeçalho da responsta
    successfulLogin(authorizationValue: string) {
        //tirar a palavra better, pega somente o token
        let tok = authorizationValue.substring(7);
        let user : LocalUser = {
            token: tok,
            //extrai o email do localStorafe
            email: this.jwtHelper.decodeToken(tok).sub
        };
        //armazenar o user no localStore
        this.storage.setLocalUser(user);
        //impa o carrinho quando alguém faz o login
        this.cartService.createOrCleanCart();
    }

    //remover o usuario no localstorege
    logout() {
        this.storage.setLocalUser(null);
    }

}