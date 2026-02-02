#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('❌ Error: Please provide a module name');
  console.log('Usage: npm run isam:generate <module-name>');
  console.log('Example: npm run isam:generate products');
  process.exit(1);
}

const pascalCase = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
const kebabCase = moduleName.toLowerCase();
const camelCase = moduleName.charAt(0).toLowerCase() + moduleName.slice(1);
const upperCase = moduleName.toUpperCase();

const basePath = path.join(process.cwd(), 'src', 'modules', kebabCase);

const dirs = [
  basePath,
  path.join(basePath, 'controllers'),
  path.join(basePath, 'services'),
  path.join(basePath, 'entities'),
  path.join(basePath, 'dto'),
  path.join(basePath, 'permissions'),
  path.join(basePath, 'repositories'),
  path.join(basePath, 'middlewares'),
];

console.log(`\n🔥 Isam Generator\n`);
console.log(`💫 Isam is generating module: ${moduleName}\n`);

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const templates = {
  module: `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${pascalCase}Controller } from './controllers/${kebabCase}.controller';
import { ${pascalCase}Service } from './services/${kebabCase}.service';
import { ${pascalCase}Repository } from './repositories/${kebabCase}.repository';
import { ${pascalCase} } from './entities/${kebabCase}.entity';

/**
 * ${pascalCase} Module
 * Handles ${kebabCase} related functionality and business logic
 */
@Module({
  imports: [TypeOrmModule.forFeature([${pascalCase}])],
  controllers: [${pascalCase}Controller],
  providers: [${pascalCase}Service, ${pascalCase}Repository],
  exports: [${pascalCase}Service, ${pascalCase}Repository],
})
export class ${pascalCase}Module {}
`,

  controller: `import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ${pascalCase}Service } from '../services/${kebabCase}.service';
import { Create${pascalCase}Dto } from '../dto/create-${kebabCase}.dto';
import { Update${pascalCase}Dto } from '../dto/update-${kebabCase}.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

/**
 * ${pascalCase} Controller
 * Handles HTTP requests for ${kebabCase} management operations
 */
@ApiTags('${kebabCase}')
@Controller('${kebabCase}')
export class ${pascalCase}Controller {
  constructor(private readonly ${camelCase}Service: ${pascalCase}Service) {}

  /**
   * Create new ${kebabCase}
   * Creates a new ${kebabCase} record with provided data
   */
  @ApiOperation({ summary: 'Create new ${kebabCase}' })
  @ApiBearerAuth()
  @Post()
  create(@Body() create${pascalCase}Dto: Create${pascalCase}Dto) {
    return this.${camelCase}Service.create(create${pascalCase}Dto);
  }

  /**
   * Get all ${kebabCase} records
   * Returns paginated list of all ${kebabCase} entries
   */
  @ApiOperation({ summary: 'Get all ${kebabCase}' })
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.${camelCase}Service.findAll();
  }

  /**
   * Get ${kebabCase} by ID
   * Returns specific ${kebabCase} details by unique identifier
   */
  @ApiOperation({ summary: 'Get ${kebabCase} by ID' })
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.${camelCase}Service.findOne(id);
  }

  /**
   * Update ${kebabCase} information
   * Updates existing ${kebabCase} with provided data
   */
  @ApiOperation({ summary: 'Update ${kebabCase}' })
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() update${pascalCase}Dto: Update${pascalCase}Dto) {
    return this.${camelCase}Service.update(id, update${pascalCase}Dto);
  }

  /**
   * Delete ${kebabCase} record
   * Permanently removes ${kebabCase} from database
   */
  @ApiOperation({ summary: 'Delete ${kebabCase}' })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.${camelCase}Service.remove(id);
  }
}
`,

  service: `import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ${pascalCase}Repository } from '../repositories/${kebabCase}.repository';
import { Create${pascalCase}Dto } from '../dto/create-${kebabCase}.dto';
import { Update${pascalCase}Dto } from '../dto/update-${kebabCase}.dto';
import { ${pascalCase} } from '../entities/${kebabCase}.entity';

/**
 * ${pascalCase} Service
 * Handles ${kebabCase} business logic and database operations
 */
@Injectable()
export class ${pascalCase}Service {
  constructor(
    private readonly ${camelCase}Repository: ${pascalCase}Repository,
  ) {}

  /**
   * Create new ${kebabCase} record
   * Validates uniqueness and creates new entry
   */
  async create(create${pascalCase}Dto: Create${pascalCase}Dto): Promise<${pascalCase}> {
    if (create${pascalCase}Dto.name) {
      const existing = await this.${camelCase}Repository.findByName(create${pascalCase}Dto.name);
      if (existing) {
        throw new ConflictException('${pascalCase} with this name already exists');
      }
    }

    return this.${camelCase}Repository.create(create${pascalCase}Dto);
  }

  /**
   * Get all ${kebabCase} records
   * Returns complete list of ${kebabCase} entries
   */
  async findAll(): Promise<${pascalCase}[]> {
    return this.${camelCase}Repository.findAll();
  }

  /**
   * Find ${kebabCase} by unique ID
   * Returns ${kebabCase} details or throws not found exception
   */
  async findOne(id: string): Promise<${pascalCase}> {
    const ${camelCase} = await this.${camelCase}Repository.findById(id);
    if (!${camelCase}) {
      throw new NotFoundException('${pascalCase} not found');
    }
    return ${camelCase};
  }

  /**
   * Update ${kebabCase} information
   * Validates uniqueness and updates existing record
   */
  async update(id: string, update${pascalCase}Dto: Update${pascalCase}Dto): Promise<${pascalCase}> {
    const ${camelCase} = await this.findOne(id);
    
    if (update${pascalCase}Dto.name && update${pascalCase}Dto.name !== ${camelCase}.name) {
      const existing = await this.${camelCase}Repository.findByName(update${pascalCase}Dto.name);
      if (existing) {
        throw new ConflictException('${pascalCase} with this name already exists');
      }
    }

    return this.${camelCase}Repository.update(id, update${pascalCase}Dto);
  }

  /**
   * Delete ${kebabCase} record
   * Permanently removes ${kebabCase} from database
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.${camelCase}Repository.remove(id);
  }
}
`,

  entity: `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * ${pascalCase} Entity
 * Database model for ${kebabCase} table
 */
@Entity('${kebabCase}')
export class ${pascalCase} {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
`,

  createDto: `import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Create ${pascalCase} DTO
 * Data transfer object for creating new ${kebabCase}
 */
export class Create${pascalCase}Dto {
  @ApiProperty({ description: '${pascalCase} name', example: 'Sample ${pascalCase}' })
  @IsString()
  name: string;

  @ApiProperty({ description: '${pascalCase} description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Active status', default: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
`,

  updateDto: `import { PartialType } from '@nestjs/mapped-types';
import { Create${pascalCase}Dto } from './create-${kebabCase}.dto';

/**
 * Update ${pascalCase} DTO
 * Data transfer object for updating existing ${kebabCase}
 */
export class Update${pascalCase}Dto extends PartialType(Create${pascalCase}Dto) {}
`,

  permissions: `/**
 * ${pascalCase} Permissions
 * Defines all available permissions for ${kebabCase} module
 */
export enum ${pascalCase}Permissions {
  // Basic CRUD permissions
  CREATE_${upperCase} = 'create:${kebabCase}',
  READ_${upperCase} = 'read:${kebabCase}',
  UPDATE_${upperCase} = 'update:${kebabCase}',
  DELETE_${upperCase} = 'delete:${kebabCase}',
  
  // Advanced permissions
  MANAGE_${upperCase} = 'manage:${kebabCase}',
  VIEW_ALL_${upperCase} = 'view-all:${kebabCase}',
}

/**
 * Get all ${kebabCase} permissions
 * Returns array of all available permissions
 */
export function get${pascalCase}Permissions(): string[] {
  return Object.values(${pascalCase}Permissions);
}

/**
 * Check if user has ${kebabCase} permission
 * Returns true if user has specific or manage permission
 */
export function has${pascalCase}Permission(userPermissions: string[], permission: ${pascalCase}Permissions): boolean {
  return userPermissions.includes(permission) || userPermissions.includes(${pascalCase}Permissions.MANAGE_${upperCase});
}
`,

  repository: `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${pascalCase} } from '../entities/${kebabCase}.entity';

/**
 * ${pascalCase} Repository
 * Handles database operations for ${pascalCase} entity
 */
@Injectable()
export class ${pascalCase}Repository {
  constructor(
    @InjectRepository(${pascalCase})
    private readonly repository: Repository<${pascalCase}>,
  ) {}

  /**
   * Create new ${kebabCase} record
   * Saves new entity to database
   */
  async create(data: Partial<${pascalCase}>): Promise<${pascalCase}> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  /**
   * Get all ${kebabCase} records
   * Returns all entities from database
   */
  async findAll(): Promise<${pascalCase}[]> {
    return this.repository.find();
  }

  /**
   * Find ${kebabCase} by unique ID
   * Returns entity or null if not found
   */
  async findById(id: string): Promise<${pascalCase} | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Update ${kebabCase} record
   * Updates entity and returns updated record
   */
  async update(id: string, data: Partial<${pascalCase}>): Promise<${pascalCase}> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  /**
   * Delete ${kebabCase} record
   * Permanently removes entity from database
   */
  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Find ${kebabCase} by name
   * Returns entity with matching name or null
   */
  async findByName(name: string): Promise<${pascalCase} | null> {
    return this.repository.findOne({ where: { name } });
  }
}
`,

  middleware: `import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * ${pascalCase} Audit Middleware
 * Logs all ${kebabCase} related operations for audit purposes
 */
@Injectable()
export class ${pascalCase}AuditMiddleware implements NestMiddleware {
  private readonly logger = new Logger(${pascalCase}AuditMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const userId = (req as any).user?.id || 'anonymous';

    // Log the request
    this.logger.log(
      \`${pascalCase} Action: \${method} \${originalUrl} - User: \${userId} - IP: \${ip} - UserAgent: \${userAgent}\`,
    );

    // Log response when finished
    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        \`${pascalCase} Response: \${method} \${originalUrl} - Status: \${statusCode} - User: \${userId}\`,
      );
    });

    next();
  }
}
`,
};

const files = [
  { path: path.join(basePath, `${kebabCase}.module.ts`), content: templates.module },
  { path: path.join(basePath, 'controllers', `${kebabCase}.controller.ts`), content: templates.controller },
  { path: path.join(basePath, 'services', `${kebabCase}.service.ts`), content: templates.service },
  { path: path.join(basePath, 'entities', `${kebabCase}.entity.ts`), content: templates.entity },
  { path: path.join(basePath, 'dto', `create-${kebabCase}.dto.ts`), content: templates.createDto },
  { path: path.join(basePath, 'dto', `update-${kebabCase}.dto.ts`), content: templates.updateDto },
  { path: path.join(basePath, 'permissions', `${kebabCase}.permissions.ts`), content: templates.permissions },
  { path: path.join(basePath, 'repositories', `${kebabCase}.repository.ts`), content: templates.repository },
  { path: path.join(basePath, 'middlewares', `${kebabCase}-audit.middleware.ts`), content: templates.middleware },
];

files.forEach(file => {
  fs.writeFileSync(file.path, file.content);
});

console.log(`✅ Module "${moduleName}" generated successfully by Isam Generator!\n`);
console.log(`📁 Location: src/modules/${kebabCase}/\n`);
console.log(`📋 Generated structure:`);
console.log(`   ├── controllers/${kebabCase}.controller.ts`);
console.log(`   ├── services/${kebabCase}.service.ts`);
console.log(`   ├── dto/create-${kebabCase}.dto.ts`);
console.log(`   ├── dto/update-${kebabCase}.dto.ts`);
console.log(`   ├── entities/${kebabCase}.entity.ts`);
console.log(`   ├── permissions/${kebabCase}.permissions.ts`);
console.log(`   ├── repositories/${kebabCase}.repository.ts`);
console.log(`   ├── middlewares/${kebabCase}-audit.middleware.ts`);
console.log(`   └── ${kebabCase}.module.ts`);
console.log(`\n🎉 Happy coding with Isam Generator!`);
console.log(`\n📝 Next steps:`);
console.log(` 1. Add ${pascalCase}Module to app.module.ts imports`);
console.log(` 2. Update the entity with your fields`);
console.log(` 3. Update the DTOs with validation rules`);
console.log(` 4. Implement the service methods`);
console.log(` 5. Assign permissions to user roles\n`);