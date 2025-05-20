import { fromHono } from 'chanfana';
import { Hono } from 'hono';
import { config } from 'dotenv';
import {
    CreateEquipmentController,
    DeleteEquipmentController,
    FindAllEquipmentController,
    FindByIdEquipmentController,
    UpdateEquipmentController
} from 'presentation/controllers/equipments';

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

// equipment
openapi.get('/public/equipment', FindAllEquipmentController);
openapi.get('/public/equipment/:id', FindByIdEquipmentController);
openapi.put('/equipment', UpdateEquipmentController);
openapi.post('/equipment', CreateEquipmentController);
openapi.delete('/equipment/:id', DeleteEquipmentController);

export default app;
