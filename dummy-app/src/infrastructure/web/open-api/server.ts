import { fromHono } from 'chanfana';
import { Hono } from 'hono';
import { config } from 'dotenv';
import {
    CreateAboutController,
    DeleteAboutController,
    FindAllAboutController,
    UpdateAboutController
} from 'presentation/controllers/about';
import {
    CreateArticleController,
    DeleteArticleController,
    FindAllArticleController,
    FindByIdArticleController,
    UpdateArticleController
} from 'presentation/controllers/articles';
import {
    CreateEquipmentController,
    DeleteEquipmentController,
    FindAllEquipmentController,
    FindByIdEquipmentController,
    UpdateEquipmentController
} from 'presentation/controllers/equipments';
import {
    CreateProfessionalController,
    DeleteProfessionalController,
    FindAllProfessionalController,
    FindByIdProfessionalController,
    UpdateProfessionalController
} from 'presentation/controllers/professionals';
import {
    CreateResearchController,
    DeleteResearchController,
    FindAllResearchController,
    FindByIdResearchController,
    UpdateResearchController
} from 'presentation/controllers/researchs';

const app = new Hono();
const openapi = fromHono(app, {
    docs_url: '/',
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ]
    }
});

openapi.registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer'
});

config();

// about
openapi.get('/public/about', FindAllAboutController);
openapi.put('/about', UpdateAboutController);
openapi.post('/about', CreateAboutController);
openapi.delete('/about/:id', DeleteAboutController);

// article
openapi.get('/public/article', FindAllArticleController);
openapi.get('/public/article/:id', FindByIdArticleController);
openapi.put('/article', UpdateArticleController);
openapi.post('/article', CreateArticleController);
openapi.delete('/article/:id', DeleteArticleController);

// equipment
openapi.get('/public/equipment', FindAllEquipmentController);
openapi.get('/public/equipment/:id', FindByIdEquipmentController);
openapi.put('/equipment', UpdateEquipmentController);
openapi.post('/equipment', CreateEquipmentController);
openapi.delete('/equipment/:id', DeleteEquipmentController);

// research
openapi.get('/public/research', FindAllResearchController);
openapi.get('/public/research/:id', FindByIdResearchController);
openapi.put('/research', UpdateResearchController);
openapi.post('/research', CreateResearchController);
openapi.delete('/research/:id', DeleteResearchController);

// professional
openapi.get('/public/professional', FindAllProfessionalController);
openapi.get('/public/professional/:id', FindByIdProfessionalController);
openapi.put('/professional', UpdateProfessionalController);
openapi.post('/professional', CreateProfessionalController);
openapi.delete('/professional/:id', DeleteProfessionalController);

export default app;
