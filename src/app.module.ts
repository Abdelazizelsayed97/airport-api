import { Module } from '@nestjs/common';
import { FlightMangementModule } from './flight_mangement/flight_mangement.module';
import { UsersModule } from './users/users.module';
import { BookModule } from './book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { EmployeesModule } from './employees/employees.module';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { FightStaffModule } from './fight_staff/fight_staff.module';
import { AirLinesModule } from './air_lines/air_lines.module';
import { AuthModule } from './auth/auth.module';
import { configDotenv } from 'dotenv';

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
      // dropSchema: true,
      synchronize: true,
      subscribers: [join(__dirname, '**', '*.subscriber.{ts,js}')],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      graphiql: true,
      context: ({ req, res }) => ({ req, res }),
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
    JwtModule.registerAsync({
      global: true,
      imports: [UsersModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    }),
    FlightMangementModule,
    UsersModule,
    BookModule,
    EmployeesModule,
    AirLinesModule,
    FightStaffModule,
    AuthModule,
  ],
})
export class AppModule {
  constructor() {}
}
