import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
    
    signup(){
        return 'I have signed up';
    }
    login(){
        return 'I have logged in';
    }
}