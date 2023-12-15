import { Entity } from "typeorm";
import { Column } from "typeorm/decorator/columns/Column";
import { PrimaryGeneratedColumn } from "typeorm/decorator/columns/PrimaryGeneratedColumn";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: '50' })
  public login: string;

  @Column({ type: 'varchar', length: '50' })
  public username: string;

  @Column({ type: 'varchar', length: '50' })
  public password: string;

  @Column({ type: 'text' })
  public avatarPath: string;

  @Column({ type: 'boolean' })
  public isOnline: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  public lastOnlineAt: Date;
}