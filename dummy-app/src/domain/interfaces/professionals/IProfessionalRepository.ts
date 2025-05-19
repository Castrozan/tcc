import { Professional } from '../../entities/professionals/Professional';

export interface IProfessionalRepository {
    create(article: Partial<Professional>): Promise<Professional>;
    findById(id: number): Promise<Professional | null>;
    findAll(): Promise<Professional[]>;
    update(article: Partial<Professional>): Promise<Professional>;
    delete(id: number): Promise<void>;
}
