import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    // PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async(configService: ConfigService) => ({
        secret:configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60s' }, // Adjust the expiration time as needed
      }),
    }),
  ],
        providers: [AuthService, JwtStrategy],
        controllers: [AuthController],
        exports: [AuthService],
})
export class AuthModule {}
