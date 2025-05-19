import { IEquipmentRepository } from 'domain/interfaces/equipments/IEquipmentRepository';
import { SQLiteEquipmentRepository } from './SQLiteEquipmentRepository';

const EquipmentRepository: IEquipmentRepository = new SQLiteEquipmentRepository();

export default EquipmentRepository;
