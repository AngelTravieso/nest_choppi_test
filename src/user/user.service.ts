import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export type User = any;

@Injectable()
export class UserService {
    private readonly users = [
        {
            userId: 1,
            email: 'test@example.com',
            password: '$2b$10$f.BjustgG2T68N5LMr8bIu12JErVNcFwY7iYm/R.JgPezcK5uUoRa',

        }
    ];

    async findOne(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }

}
