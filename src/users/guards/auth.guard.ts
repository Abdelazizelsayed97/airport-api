import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { CanActivate } from "@nestjs/common/interfaces/features/can-activate.interface";
import { Observable } from "rxjs/internal/Observable";
@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        ctx: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = ctx.switchToHttp().getRequest();
        const header = request.headers.authorization;
        const token = header.splitLast(" ");
        if (!token) {
        throw new UnauthorizedException();
        } else {
            try {   
                // verify token
                // const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // request.user = decoded;
                return true;
            }catch (error) {
                throw new UnauthorizedException();
            }
    }
    }

}