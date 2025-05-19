import { IProfessionalRepository } from 'domain/interfaces/professionals/IProfessionalRepository';
import { SQLiteProfessionalRepository } from './SQLiteProfessionalRepository';

const ProfessionalRepository: IProfessionalRepository = new SQLiteProfessionalRepository();

export default ProfessionalRepository;
