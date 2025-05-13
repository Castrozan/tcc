import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database.js';

export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password_hash: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export interface UserInstance
    extends Model<UserAttributes, UserCreationAttributes>,
        UserAttributes {}

export const UserModel = sequelize.define<UserInstance>(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'users',
        timestamps: true
    }
);

// For backwards compatibility - user interfaces used in controllers, services, etc.
export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
}

export class User {
    id: number;
    name: string;
    email: string;
    password_hash: string;

    constructor(user: User) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.password_hash = user.password_hash;
    }
}

export class UserCreateRequest {
    name: string;
    email: string;
    password: string;

    constructor(user: UserCreateRequest) {
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
    }
}
