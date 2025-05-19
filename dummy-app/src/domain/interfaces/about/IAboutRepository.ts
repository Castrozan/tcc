import { About } from 'domain/entities/about/About';
import { AboutImage } from 'domain/entities/about/AboutImage';

export interface IAboutRepository {
    create(about: Partial<About & { images?: Partial<AboutImage>[] }>): Promise<About>;
    findById(id: number): Promise<About | null>;
    findAll(): Promise<About[]>;
    update(about: Partial<About & { images?: Partial<AboutImage>[] }>): Promise<About>;
    delete(id: number): Promise<void>;
}
