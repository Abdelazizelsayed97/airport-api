import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserBasedRole } from "src/enums/user.roles";

export class RolesGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user.role === UserBasedRole.admin) {
            return true;
        }
        throw new Error("Method not implemented.");
    }
}