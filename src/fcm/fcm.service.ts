import { Injectable } from "@nestjs/common";
import { CreateFcmInput } from "./dto/create-fcm.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Fcm } from "./entities/fcm.entity";
import { User } from "users/entities/user.entity";

@Injectable()
export class FcmService {
  constructor(@InjectRepository(Fcm) private fcmRepository: Repository<Fcm>) {}
  async create(createFcmInput: CreateFcmInput, user: User) {
    const isExist = await this.fcmRepository.findOne({
      where: { token: createFcmInput.token },
    });
    const isUserExist = user.id === createFcmInput.user_id;

    if (isExist || !isUserExist) {
      throw isExist
        ? new Error("This fcm already exist")
        : new Error("User not found");
    }
    const existingForUser = await this.fcmRepository.findOne({
      where: {
        user_id: createFcmInput.user_id,
        token: createFcmInput.token,
      },
    });
    if (existingForUser) {
      throw new Error("Token already exists for this user");
    }
    const newFcm = await this.fcmRepository.create({
      ...createFcmInput,
    });
    return await this.fcmRepository.save(newFcm);
  }

  async registerToken(user: User, input: CreateFcmInput) {
    const existing = await this.fcmRepository.findOne({
      where: { token: input.token, user_id: user.id },
    });
    if (existing) return existing;
    const fcm = this.fcmRepository.create({ ...input });
    return this.fcmRepository.save(fcm);
  }

  async getUserTokens(userId: string) {
    return await this.fcmRepository.find({
      where: {
        user_id: userId,
      },
    });
  }
  async update(id: string) {
    const fcm = await this.fcmRepository.findOne({ where: { id: id } });
    if (!fcm) {
      throw new Error("Fcm not found");
    }
    fcm.isActive = !fcm.isActive;
    await this.fcmRepository.save(fcm);
    return fcm;
  }
  async removeToken(token: string) {
    return await this.fcmRepository.delete({ token });
  }
}
