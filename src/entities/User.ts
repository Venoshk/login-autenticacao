import { Entity, ObjectId,  ObjectIdColumn, Column } from "typeorm";

@Entity('users')
export class User {
    @ObjectIdColumn()
    _id:ObjectId

    @Column({type: 'text'})
    name:string


    @Column({type: 'text', unique: true})
    email:string

    @Column({type: 'text'})
    password: string
}