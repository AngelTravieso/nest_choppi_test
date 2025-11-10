import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) { }

    /**
     * Endpoint para ejecutar el "seeding" (poblado) de la base de datos.
     * Limpia la BD y crea datos de prueba.
     */
    @Post()
    @HttpCode(HttpStatus.OK)
    executeSeed() {
        return this.seedService.executeSeed();
    }
}