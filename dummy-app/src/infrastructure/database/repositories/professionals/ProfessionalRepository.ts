import { createClient } from '@supabase/supabase-js';
import { Professional } from 'domain/entities/professionals/Professional';
import { IProfessionalRepository } from 'domain/interfaces/professionals/IProfessionalRepository';
import config from '../../../../config/index.js';

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Database entity types
interface DbProfessional {
    id: number;
    name: string;
    role: string;
    bio: string | null;
    imageUrl: string | null;
    createdAt: string;
    hierarchy: number;
}

export class ProfessionalRepository implements IProfessionalRepository {
    async findById(id: number): Promise<Professional | null> {
        const { data, error } = await supabase
            .from('Professional')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
            return null;
        }

        return data
            ? new Professional(
                  data.id,
                  data.name,
                  data.role,
                  data.bio,
                  data.imageUrl,
                  new Date(data.createdAt),
                  data.hierarchy
              )
            : null;
    }

    async findAll(): Promise<Professional[]> {
        const { data, error } = await supabase.from('Professional').select('*');

        if (error) {
            console.error(error);
            return [];
        }

        return data.map(
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
        );
    }

    async create(professional: Partial<Professional>): Promise<Professional> {
        const { data, error } = await supabase
            .from('Professional')
            .insert([
                {
                    name: professional.name,
                    role: professional.role,
                    bio: professional.bio,
                    imageUrl: professional.imageUrl,
                    createdAt: new Date(),
                    hierarchy: professional.hierarchy
                }
            ])
            .select()
            .single();

        if (error !== null) {
            console.error(error);
            throw new Error('Failed to create professional');
        }

        return new Professional(
            data.id,
            data.name,
            data.role,
            data.bio,
            data.imageUrl,
            new Date(data.createdAt),
            data.hierarchy
        );
    }

    async update(professional: Partial<Professional>): Promise<Professional> {
        if (!professional.id) {
            throw new Error('Professional ID is required for update');
        }

        const { data, error } = await supabase
            .from('Professional')
            .update({
                name: professional.name,
                role: professional.role,
                bio: professional.bio,
                imageUrl: professional.imageUrl,
                hierarchy: professional.hierarchy
            })
            .eq('id', professional.id)
            .select()
            .single();

        if (error) {
            console.error(error);
            throw new Error('Failed to update professional');
        }

        return new Professional(
            data.id,
            data.name,
            data.role,
            data.bio,
            data.imageUrl,
            new Date(data.createdAt),
            data.hierarchy
        );
    }

    async delete(id: number): Promise<void> {
        const { error } = await supabase.from('Professional').delete().eq('id', id);
        if (error) {
            console.error(error);
            throw new Error('Failed to delete professional');
        }
    }
}
