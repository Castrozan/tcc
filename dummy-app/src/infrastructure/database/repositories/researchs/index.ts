import { IResearchRepository } from 'domain/interfaces/researchs/IResearchRepository';
import { SQLiteResearchRepository } from './SQLiteResearchRepository';

const ResearchRepository: IResearchRepository = new SQLiteResearchRepository();

export default ResearchRepository;
