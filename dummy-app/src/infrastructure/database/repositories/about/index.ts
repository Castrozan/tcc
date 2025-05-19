import { IAboutRepository } from 'domain/interfaces/about/IAboutRepository';
import { SQLiteAboutRepository } from './SQLiteAboutRepository';

const AboutRepository: IAboutRepository = new SQLiteAboutRepository();

export default AboutRepository;
