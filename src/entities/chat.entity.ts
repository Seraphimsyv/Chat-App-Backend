import { ChatVariant } from "src/common/enum";
import { Column } from "typeorm/decorator/columns/Column";
import { PrimaryGeneratedColumn } from "typeorm/decorator/columns/PrimaryGeneratedColumn";
import { Entity } from "typeorm/decorator/entity/Entity";
import { ManyToOne } from "typeorm/decorator/relations/ManyToOne";
import { ManyToMany } from 'typeorm/decorator/relations/ManyToMany';
import { OneToOne } from 'typeorm/decorator/relations/OneToOne';
import { OneToMany } from "typeorm/decorator/relations/OneToMany";
import { User } from "./user.entity";



@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'enum', enum: ChatVariant })
  public type: ChatVariant;

  @Column({ type: 'varchar', length: '30', nullable: true })
  public title: string;

  @Column({ type: 'text', nullable: true })
  public icon: string;

  @ManyToOne(() => User)
  public creator: User;

  @ManyToMany(() => User, { nullable: true })
  public members: User[];

  @ManyToOne(() => User, { nullable: true })
  public receiver: User;

  @OneToMany(() => Message, (message) => message.chat)
  public messages: Message[];

  @OneToMany(() => UnreadedMessage, (unreaded) => unreaded.chat)
  public unreadeds: UnreadedMessage[];
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  public chat: Chat;

  @ManyToOne(() => User)
  public author: User;

  @Column({ type: 'text' })
  public text: string;

  @Column({ type: 'boolean' })
  public edited: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  public updatedAt: Date;
}

@Entity()
export class UnreadedMessage {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Chat, (chat) => chat.unreadeds)
  public chat: Chat;

  @ManyToOne(() => Message)
  public message: Message;

  @ManyToOne(() => User)
  public receiver: User;
}