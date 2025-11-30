import { FlightMangementModule } from "./flight_mangement/flight_mangement.module";
import { UserModule } from "./users/users.module";
import { BookingModule } from "./booking/booking.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { join } from "path";
import { FightStaffModule } from "./fight_staff/fight_staff.module";
import { AuthModule } from "./auth/auth.module";
import { AirLinesModule } from "air_line/air_line.module";
import { EmployeeModule } from "employee/employee.module";
import { RoleModule } from "./role/role.module";
import { User } from "./users/entities/user.entity";
import { Role } from "./role/entities/role.entity";
import { UserService } from "./users/users.service";
import { NotifcationModule } from "./notifcation/notifcation.module";
import { FcmModule } from "./fcm/fcm.module";
import { EmailModule } from "./email/email.module";
import { QueueModule } from "@app/queue/queue.module";
import { UserInspectorMiddleware } from "@core/common/user-inspector-middleware";
import { ConfigModule } from "@nestjs/config";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UploadFileModule } from "./upload-file/upload-file.module";
import { GeneralResponse } from "@app/g.response/general.response";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      username: String(process.env.DB_USERNAME),
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      autoLoadEntities: true,
      // /drop schema for db mmodifications
      // dropSchema: true,
      applicationName: "air-plane-api",
      synchronize: true,
      subscribers: [join(__dirname, "**", "*.subscriber.{ts,js}")],
      cache: true,
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [UserModule],
      useFactory: (jwtService: JwtService, userService: UserService) => ({
        autoSchemaFile: join(process.cwd(), "src/schema.gql"),
        fieldResolverEnhancers: ["guards"],
        sortSchema: true,
        playground: true,
        csrfPrevention: false,
        installSubscriptionHandlers: true,
        uploads: false,
        subscriptions: {
          "graphql-ws": true,
          "subscriptions-transport-ws": {
            onConnect: async (connectionParams) => {
              const token = connectionParams.Authorization?.replace(
                "Bearer ",
                ""
              );
              if (token) {
                try {
                  const payload = await jwtService.verifyAsync(token, {
                    secret: process.env.JWT_SECRET,
                  });

                  const user = await userService.findOne(payload.id);
                  return { user };
                } catch (error) {
                  throw new Error("Invalid token");
                }
              }
              return {};
            },
          },
        },
      }),
      inject: [JwtService, UserService],
    }),
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d", algorithm: "HS256" },
    }),

    FlightMangementModule,
    UserModule,
    BookingModule,
    EmployeeModule,
    AirLinesModule,
    FightStaffModule,
    AuthModule,
    RoleModule,
    TypeOrmModule.forFeature([User, Role]),
    NotifcationModule,
    FcmModule,
    EmailModule,
    QueueModule,
    UploadFileModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GeneralResponse,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserInspectorMiddleware).forRoutes("*");
  }
}
