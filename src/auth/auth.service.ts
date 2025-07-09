import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService, 
    private readonly jwtService: JwtService
  ) {}
  
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const {password, ...rest} = user; // Destructure to avoid returning the password
      return rest;
    }
    return null;
  }

  async login(user: any){
    const payload = { email: user.email, sub: user.id, role: user.role };
    return { 
      access_token: this.jwtService.sign(payload),
    };
  }

   async logout(res: Response) {
    res.clearCookie('access_token'); // If using cookies
    return { message: 'Logged out successfully' };
  }

}
