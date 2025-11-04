import { Module } from '@nestjs/common';
import { FlightMangementModule } from './flight_mangement/flight_mangement.module';
import { UsersModule } from './users/users.module';
import { BookModule } from './book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { FightStaffModule } from './fight_staff/fight_staff.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphqlResponseInspector } from './users/inspectors/users.response.inspector';
import { AirLinesModule } from 'air_line/air_line.module';
import { EmployeeModule } from 'employee/employee.module';
import { RoleModule } from './role/role.module';
import { ConfigModule } from '@nestlib/config';
import { CreateSuperAdminSeeder } from './super.admin.seeder';
import { User } from './users/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { createGraphQLContextCarringUserData } from './common/graphql-context';
import { UsersServices } from './users/users.service';
import { PermissionsGuard } from 'permissions/guard/permissions.guard';
import { NotifcationModule } from './notifcation/notifcation.module';
import { FirebaseModule } from './firebase/firebase.module';
import { FcmModule } from './fcm/fcm.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: String(process.env.DB_USERNAME),
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      autoLoadEntities: true,
      // /drop schema for db mmodifications
      // dropSchema: true,
      applicationName: 'air-plane-api',
      synchronize: true,
      subscribers: [join(__dirname, '**', '*.subscriber.{ts,js}')],
      cache: true,
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [UsersModule],
      useFactory: (jwtService: JwtService, usersService: UsersServices) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        fieldResolverEnhancers: ['guards'],
        sortSchema: true,
        graphiql: true,
        playground: true,
        context: ({ req, res }) =>
          createGraphQLContextCarringUserData(
            { req, res },
            jwtService,
            usersService,
          ),
        subscriptions: {
          'graphql-ws': true,
          'subscriptions-transport-ws': {
            onConnect: (connectionParams) => {
              console.log(connectionParams.Authorization);
              return { Authorization: connectionParams.Authorization };
            },
          },
        },
      }),
      inject: [JwtService, UsersServices],
    }),
    ConfigModule.forRoot({
      files: ['.env'],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d', algorithm: 'HS256' },
    }),
    FlightMangementModule,
    UsersModule,
    BookModule,
    EmployeeModule,
    AirLinesModule,
    FightStaffModule,
    AuthModule,
    RoleModule,
    TypeOrmModule.forFeature([User, Role]),
    NotifcationModule,
    FirebaseModule,
    FcmModule,
    EmailModule,
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: GraphqlResponseInspector,
    // },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    CreateSuperAdminSeeder,
  ],
})
export class AppModule {}
