import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { FlightMangementModule } from "./flight_mangement/flight_mangement.module";
import { UserModule } from "./users/users.module";
import { BookModule } from "./book/book.module";
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
import { CreateSuperAdminSeeder } from "./super.admin.seeder";
import { User } from "./users/entities/user.entity";
import { Role } from "./role/entities/role.entity";
import { UserService } from "./users/users.service";
import { NotifcationModule } from "./notifcation/notifcation.module";
import { FcmModule } from "./fcm/fcm.module";
import { EmailModule } from "./email/email.module";
import { QueueModule } from "@app/queue/queue.module";
import { UserInspectorMiddleware } from "common/user-inspector-middleware";
import { ConfigModule } from "@nestjs/config";
import { NodemailerModule } from "./nodemailer/nodemailer.module";
import { DataLoaderModule } from "./app/dataloader/dataloader.module";

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
      useFactory: () => ({
        autoSchemaFile: join(process.cwd(), "src/schema.gql"),
        fieldResolverEnhancers: ["guards"],
        sortSchema: true,
        // graphiql: true,
        playground: true,
        installSubscriptionHandlers: true,
        // context: ({ req, res }) =>
        //   createGraphQLContextInspector({ req, res }, jwtService, usersService),
        subscriptions: {
          "graphql-ws": true,
          "subscriptions-transport-ws": {
            onConnect: (connectionParams) => {
              console.log(connectionParams.Authorization);
              return { Authorization: connectionParams.Authorization };
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
    DataLoaderModule,
    FlightMangementModule,
    UserModule,
    BookModule,
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
    NodemailerModule,
  ],
  providers: [CreateSuperAdminSeeder],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserInspectorMiddleware).forRoutes("*");
  }
}
