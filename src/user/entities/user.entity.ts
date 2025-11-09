import {
  BeforeInsert,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Store } from 'src/store/entities/store.entity';

export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @OneToMany(() => Store, (store) => store.user)
  stores: Store[];
}
