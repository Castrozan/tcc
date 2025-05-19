import { createClient } from '@supabase/supabase-js';
import { About } from 'domain/entities/about/About';
import { AboutImage } from 'domain/entities/about/AboutImage';
import { IAboutRepository } from 'domain/interfaces/about/IAboutRepository';
import config from '../../../../config/index.js';

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Database entity types
interface DbAbout {
    id: number;
    bodyText: string;
    secondText: string;
    createdAt: string;
}

interface DbAboutImage {
    id: number;
    aboutId: number;
    url: string;
    title: string;
    description: string;
}

export class AboutRepository implements IAboutRepository {
    async findById(id: number): Promise<About | null> {
        const { data: abouts, error } = await supabase
            .from('About')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
            return null;
        }

        if (error) {
            console.error(error);
            return null;
        }

        const { data: images, error: errorImages } = await supabase
            .from('AboutImage')
            .select('*')
            .eq('aboutId', id);

        if (errorImages) {
            console.error(errorImages);
            return null;
        }

        return abouts
            ? new About(
                  abouts.id,
                  abouts.bodyText,
                  abouts.secondText,
                  new Date(abouts.createdAt),
                  images
                      ? images.map(
                            (image: DbAboutImage) =>
                                new AboutImage(
                                    image.id,
                                    image.aboutId,
                                    image.url,
                                    image.title,
                                    image.description
                                )
                        )
                      : null
              )
            : null;
    }

    async findAll(): Promise<About[]> {
        const { data: abouts, error } = await supabase.from('About').select('*');

        if (error) {
            console.error(error);
            return [];
        }

        const aboutIds = abouts.map((about) => about.id);

        const { data: images, error: errorImages } = await supabase
            .from('AboutImage')
            .select('*')
            .in('aboutId', aboutIds);

        if (errorImages && errorImages !== null) {
            console.error(errorImages);
            return [];
        }

        return abouts.map(
            (about: DbAbout) =>
                new About(
                    about.id,
                    about.bodyText,
                    about.secondText,
                    new Date(about.createdAt),
                    images
                        ? images
                              .filter((image: DbAboutImage) => image.aboutId === about.id)
                              .map(
                                  (image: DbAboutImage) =>
                                      new AboutImage(
                                          image.id,
                                          image.aboutId,
                                          image.url,
                                          image.title,
                                          image.description
                                      )
                              )
                        : null
                )
        );
    }

    async create(about: Partial<About & { images?: Partial<AboutImage>[] }>): Promise<About> {
        const { data: savedAbout, error } = await supabase
            .from('About')
            .insert([
                {
                    bodyText: about.bodyText,
                    secondText: about.secondText,
                    createdAt: new Date()
                }
            ])
            .select()
            .single();

        if (error !== null) {
            console.error(error);
            throw new Error('Failed to create about');
        }

        if (about.images) {
            const {
                data: savedImages,
                error: errorImages
            }: { data: DbAboutImage[] | null; error: unknown } = await supabase
                .from('AboutImage')
                .insert(
                    about.images.map((image) => ({
                        aboutId: savedAbout.id,
                        url: image.url,
                        title: image.title,
                        description: image.description
                    }))
                )
                .select();

            if (!savedImages || errorImages !== null) {
                console.error(errorImages);
                throw new Error('Failed to create about images');
            }

            return new About(
                savedAbout.id,
                savedAbout.bodyText,
                savedAbout.secondText,
                new Date(savedAbout.createdAt),
                (Array.isArray(savedImages) ? savedImages : []).map(
                    (image: DbAboutImage) =>
                        new AboutImage(
                            image.id,
                            image.aboutId,
                            image.url,
                            image.title,
                            image.description
                        )
                )
            );
        }

        return new About(
            savedAbout.id,
            savedAbout.bodyText,
            savedAbout.secondText,
            new Date(savedAbout.createdAt),
            null
        );
    }

    async update(about: Partial<About & { images?: Partial<AboutImage>[] }>): Promise<About> {
        const { data: updatedAbout, error } = await supabase
            .from('About')
            .update({
                bodyText: about.bodyText,
                secondText: about.secondText,
                createdAt: new Date()
            })
            .eq('id', about.id)
            .select()
            .single<About>();

        if (error !== null) {
            console.error(error);
            throw new Error('Failed to update about');
        }

        if (about.images) {
            const { data: existingImages, error: fetchError } = await supabase
                .from('AboutImage')
                .select('id')
                .eq('aboutId', about.id);

            if (fetchError) {
                console.error(fetchError);
                throw new Error('Failed to fetch existing about images');
            }

            const existingImageIds = existingImages.map((image: DbAboutImage) => image.id);

            const newImageIds = about.images ? about.images.map((image) => image.id) : [];

            const savedImages: AboutImage[] = [];
            for (const image of about.images) {
                if (image.id && existingImageIds.includes(image.id)) {
                    const { data: updatedImage, error: updateError } = await supabase
                        .from('AboutImage')
                        .update({
                            url: image.url,
                            title: image.title,
                            description: image.description
                        })
                        .eq('id', image.id)
                        .select()
                        .single();

                    if (updateError) {
                        console.error(updateError);
                        throw new Error('Failed to update about image');
                    }

                    savedImages.push(updatedImage);
                } else {
                    const {
                        data: insertedImage,
                        error: errorImages
                    }: { data: DbAboutImage[] | null; error: unknown } = await supabase
                        .from('AboutImage')
                        .insert({
                            aboutId: about.id,
                            url: image.url,
                            title: image.title,
                            description: image.description
                        })
                        .select();

                    if (!savedImages && errorImages !== null) {
                        console.error(errorImages);
                        throw new Error('Failed to insert new about images');
                    }
                    savedImages.push(insertedImage[0]);
                }
            }

            // Delete removed images
            const imagesToDelete = existingImageIds.filter((id) => !newImageIds.includes(id));

            if (imagesToDelete.length > 0) {
                const { error: deleteError } = await supabase
                    .from('AboutImage')
                    .delete()
                    .in('id', imagesToDelete);

                if (deleteError) {
                    console.error(deleteError);
                    throw new Error('Failed to delete removed about images');
                }
            }

            return new About(
                updatedAbout.id,
                updatedAbout.bodyText,
                updatedAbout.secondText,
                new Date(updatedAbout.createdAt),
                (Array.isArray(savedImages) ? savedImages : []).map(
                    (image: DbAboutImage) =>
                        new AboutImage(
                            image.id,
                            image.aboutId,
                            image.url,
                            image.title,
                            image.description
                        )
                )
            );
        }

        return new About(
            updatedAbout.id,
            updatedAbout.bodyText,
            updatedAbout.secondText,
            new Date(updatedAbout.createdAt),
            null
        );
    }

    async delete(id: number): Promise<void> {
        const { data: aboutExists, error: fetchError } = await supabase
            .from('About')
            .select('id')
            .eq('id', id)
            .single();

        if (fetchError || !aboutExists) {
            console.error(fetchError);
            throw new Error('About does not exist');
        }

        const { data: about, error: deleteError } = await supabase
            .from('About')
            .select('id')
            .eq('id', id)
            .single();

        if (deleteError || !about) {
            console.error(deleteError);
            throw new Error('About does not exist');
        }

        const { error: errorImages } = await supabase.from('AboutImage').delete().eq('aboutId', id);

        if (errorImages) {
            console.error(errorImages);
            throw new Error('Failed to delete about images');
        }

        const { error: errorAbout } = await supabase.from('About').delete().eq('id', id);

        if (errorAbout) {
            console.error(errorAbout);
            throw new Error('Failed to delete about');
        }
    }
}
