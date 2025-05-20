import { fromHono } from 'chanfana';
import { Hono } from 'hono';
import { config } from 'dotenv';
import {
    CreateProfessionalController,
    DeleteProfessionalController,
    FindAllProfessionalController,
    FindByIdProfessionalController,
    UpdateProfessionalController
} from 'presentation/controllers/professionals';

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

// professional
openapi.get('/public/professional', FindAllProfessionalController);
openapi.get('/public/professional/:id', FindByIdProfessionalController);
openapi.put('/professional', UpdateProfessionalController);
openapi.post('/professional', CreateProfessionalController);
openapi.delete('/professional/:id', DeleteProfessionalController);

export default app;
