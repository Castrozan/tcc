import { createClient } from '@supabase/supabase-js';
import { Research } from 'domain/entities/researchs/Research';
import { ResearchImage } from 'domain/entities/researchs/ResearchImage';
import { Professional } from 'domain/entities/professionals/Professional';
import { IResearchRepository } from 'domain/interfaces/researchs/IResearchRepository';
import config from '../../../../config/index.js';

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Database entity types
interface DbResearch {
    id: number;
    title: string;
    description: string;
    bodyText: string;
    secondText: string;
    createdAt: string;
    updatedAt: string;
    professionalId: number | null;
}

interface DbResearchImage {
    id: number;
    researchId: number;
    url: string;
    title: string;
    description: string;
}

interface DbProfessional {
    id: number;
    name: string;
    role: string;
    bio: string | null;
    imageUrl: string | null;
    createdAt: string;
    hierarchy: number;
}

export class ResearchRepository implements IResearchRepository {
    async findById(id: number): Promise<Research | null> {
        const { data, error } = await supabase.from('Research').select('*').eq('id', id).single();

        if (error) {
            console.error(error);
            return null;
        }

        const { data: images, error: errorImages } = await supabase
            .from('ResearchImage')
            .select('*')
            .eq('researchId', id);

        if (errorImages) {
            console.error(errorImages);
            return null;
        }

        const { data: professionals, error: errorProfessionals } = await supabase
            .from('Professional')
            .select('*')
            .in('id', data.professionalId);

        if (errorProfessionals) {
            console.error(errorProfessionals);
            return null;
        }

        return data
            ? new Research(
                  data.id,
                  data.title,
                  data.description,
                  data.bodyText,
                  data.secondText,
                  new Date(data.createdAt),
                  new Date(data.updatedAt),
                  data.professionalId,
                  images
                      ? images.map(
                            (image: DbResearchImage) =>
                                new ResearchImage(
                                    image.id,
                                    image.researchId,
                                    image.url,
                                    image.title,
                                    image.description
                                )
                        )
                      : null,
                  professionals
                      ? professionals
                            .filter(
                                (professional: DbProfessional) =>
                                    professional.id === data.professionalId
                            )
                            .map(
                                (professional: DbProfessional) =>
                                    new Professional(
                                        professional.id,
                                        professional.name,
                                        professional.role,
                                        professional.bio,
                                        professional.imageUrl,
                                        new Date(professional.createdAt),
                                        professional.hierarchy
                                    )
                            )[0]
                      : null
              )
            : null;
    }

    async findAll(): Promise<Research[]> {
        const { data: researchs, error } = await supabase.from('Research').select('*');

        if (error) {
            console.error(error);
            return [];
        }

        const researchIds = researchs.map((research) => research.id);

        const { data: images, error: errorImages } = await supabase
            .from('ResearchImage')
            .select('*')
            .in('researchId', researchIds);

        if (errorImages) {
            console.error(errorImages);
            return [];
        }

        const professionalIds = researchs
            .map((research) => research.professionalId)
            .filter((professionalId) => professionalId !== null);

        const { data: professionals, error: errorProfessionals } = await supabase
            .from('Professional')
            .select('*')
            .in('id', professionalIds);

        if (errorProfessionals) {
            console.error('ErrorProfessionals: ', errorProfessionals);
            return null;
        }

        return researchs.map(
            (research: DbResearch) =>
                new Research(
                    research.id,
                    research.title,
                    research.description,
                    research.bodyText,
                    research.secondText,
                    new Date(research.createdAt),
                    new Date(research.updatedAt),
                    research.professionalId,
                    images
                        ? images
                              .filter((image: DbResearchImage) => image.researchId === research.id)
                              .map(
                                  (image: DbResearchImage) =>
                                      new ResearchImage(
                                          image.id,
                                          image.researchId,
                                          image.url,
                                          image.title,
                                          image.description
                                      )
                              )
                        : null,
                    professionals
                        ? professionals
                              .filter(
                                  (professional: DbProfessional) =>
                                      professional.id === research.professionalId
                              )
                              .map(
                                  (professional: DbProfessional) =>
                                      new Professional(
                                          professional.id,
                                          professional.name,
                                          professional.role,
                                          professional.bio,
                                          professional.imageUrl,
                                          new Date(professional.createdAt),
                                          professional.hierarchy
                                      )
                              )[0]
                        : null
                )
        );
    }

    async create(
        research: Partial<Research & { images?: Partial<ResearchImage>[] }>
    ): Promise<Research> {
        const { data: savedResearch, error } = await supabase
            .from('Research')
            .insert([
                {
                    title: research.title,
                    description: research.description,
                    bodyText: research.bodyText,
                    secondText: research.secondText,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    professionalId: research.professionalId
                }
            ])
            .select()
            .single();

        if (error !== null) {
            console.error(error);
            throw new Error('Failed to create research');
        }

        if (research.images) {
            const {
                data: savedImages,
                error: errorImages
            }: { data: DbResearchImage[] | null; error: unknown } = await supabase
                .from('ResearchImage')
                .insert(
                    research.images.map((image) => ({
                        researchId: savedResearch.id,
                        url: image.url,
                        title: image.title,
                        description: image.description
                    }))
                )
                .select();

            if (!savedImages || errorImages !== null) {
                console.error(errorImages);
                throw new Error('Failed to create research images');
            }

            return new Research(
                savedResearch.id,
                savedResearch.title,
                savedResearch.description,
                savedResearch.bodyText,
                savedResearch.secondText,
                new Date(savedResearch.createdAt),
                new Date(savedResearch.updatedAt),
                savedResearch.professionalId,
                (Array.isArray(savedImages) ? savedImages : []).map(
                    (image: DbResearchImage) =>
                        new ResearchImage(
                            image.id,
                            image.researchId,
                            image.url,
                            image.title,
                            image.description
                        )
                ),
                null
            );
        }

        return new Research(
            savedResearch.id,
            savedResearch.title,
            savedResearch.description,
            savedResearch.bodyText,
            savedResearch.secondText,
            new Date(savedResearch.createdAt),
            new Date(savedResearch.updatedAt),
            savedResearch.professionalId,
            null,
            null
        );
    }
    async update(
        research: Partial<Research & { images?: Partial<ResearchImage>[] }>
    ): Promise<Research> {
        if (research.id === null) {
            throw new Error('Research id is required');
        }

        const updateData: Partial<DbResearch> = {
            title: research.title,
            description: research.description,
            bodyText: research.bodyText,
            secondText: research.secondText,
            updatedAt: new Date().toISOString()
        };

        if (research.professionalId !== undefined) {
            updateData.professionalId = research.professionalId;
        }

        const { data: updatedResearch, error } = await supabase
            .from('Research')
            .update(updateData)
            .eq('id', research.id)
            .select()
            .single();

        if (error !== null) {
            console.error(error);
            throw new Error('Failed to update research');
        }

        if (research.images) {
            // Delete existing images
            const { error: deleteError } = await supabase
                .from('ResearchImage')
                .delete()
                .eq('researchId', research.id);

            if (deleteError) {
                console.error(deleteError);
                throw new Error('Failed to delete existing research images');
            }

            // Insert new images
            const {
                data: savedImages,
                error: errorImages
            }: { data: DbResearchImage[] | null; error: unknown } = await supabase
                .from('ResearchImage')
                .insert(
                    research.images.map((image) => ({
                        researchId: research.id,
                        url: image.url,
                        title: image.title,
                        description: image.description
                    }))
                )
                .select();
            if (!savedImages || errorImages !== null) {
                console.error(errorImages);
                throw new Error('Failed to update research images');
            }

            return new Research(
                updatedResearch.id,
                updatedResearch.title,
                updatedResearch.description,
                updatedResearch.bodyText,
                updatedResearch.secondText,
                new Date(updatedResearch.createdAt),
                new Date(updatedResearch.updatedAt),
                updatedResearch.professionalId,
                (Array.isArray(savedImages) ? savedImages : []).map(
                    (image: DbResearchImage) =>
                        new ResearchImage(
                            image.id,
                            image.researchId,
                            image.url,
                            image.title,
                            image.description
                        )
                ),
                null
            );
        }

        return new Research(
            updatedResearch.id,
            updatedResearch.title,
            updatedResearch.description,
            updatedResearch.bodyText,
            updatedResearch.secondText,
            new Date(updatedResearch.createdAt),
            new Date(updatedResearch.updatedAt),
            updatedResearch.professionalId,
            null,
            null
        );
    }

    async delete(id: number): Promise<void> {
        const { error: errorImages } = await supabase
            .from('ResearchImage')
            .delete()
            .eq('researchId', id);

        if (errorImages) {
            console.error(errorImages);
            throw new Error('Failed to delete research images');
        }

        const { error } = await supabase.from('Research').delete().eq('id', id);
        if (error) {
            console.error(error);
            throw new Error('Failed to delete research');
        }
    }
}
