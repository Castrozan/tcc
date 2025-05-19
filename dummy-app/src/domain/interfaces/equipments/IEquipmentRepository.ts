import { Equipment } from '../../entities/equipments/Equipment';

export interface IEquipmentRepository {
    create(article: Partial<Equipment>): Promise<Equipment>;
    findById(id: number): Promise<Equipment | null>;
    findAll(): Promise<Equipment[]>;
    update(article: Partial<Equipment>): Promise<Equipment>;
    delete(id: number): Promise<void>;
}
