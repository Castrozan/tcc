import { Research } from 'domain/entities/researchs/Research';
import { ResearchImage } from 'domain/entities/researchs/ResearchImage';

export interface IResearchRepository {
    create(research: Partial<Research & { images?: Partial<ResearchImage>[] }>): Promise<Research>;
    findById(id: number): Promise<Research | null>;
    findAll(): Promise<Research[]>;
    update(research: Partial<Research & { images?: Partial<ResearchImage>[] }>): Promise<Research>;
    delete(id: number): Promise<void>;
}
