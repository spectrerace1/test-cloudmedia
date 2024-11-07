import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class InitialSetup1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create extension for UUID support if not exists
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create users table
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()"
                },
                {
                    name: "name",
                    type: "varchar"
                },
                {
                    name: "email",
                    type: "varchar",
                    isUnique: true
                },
                {
                    name: "password",
                    type: "varchar"
                },
                {
                    name: "role",
                    type: "varchar",
                    default: "'user'"
                },
                {
                    name: "is_active",
                    type: "boolean",
                    default: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }), true);

        // Create branches table
        await queryRunner.createTable(new Table({
            name: "branches",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()"
                },
                {
                    name: "name",
                    type: "varchar"
                },
                {
                    name: "location",
                    type: "varchar"
                },
                {
                    name: "settings",
                    type: "jsonb",
                    isNullable: true
                },
                {
                    name: "is_active",
                    type: "boolean",
                    default: true
                },
                {
                    name: "userId",
                    type: "uuid",
                    isNullable: false // Her branch'in bir kullanıcıya ait olmasını zorunlu kılar
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }), true);

        // Create devices table
        await queryRunner.createTable(new Table({
            name: "devices",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()"
                },
                {
                    name: "name",
                    type: "varchar"
                },
                {
                    name: "token",
                    type: "varchar",
                    isUnique: true
                },
                {
                    name: "branch_id",
                    type: "uuid"
                },
                {
                    name: "status",
                    type: "jsonb",
                    isNullable: true
                },
                {
                    name: "is_active",
                    type: "boolean",
                    default: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }), true);

        // Create media table
        await queryRunner.createTable(new Table({
            name: "media",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()"
                },
                {
                    name: "name",
                    type: "varchar"
                },
                {
                    name: "type",
                    type: "varchar"
                },
                {
                    name: "path",
                    type: "varchar"
                },
                {
                    name: "size",
                    type: "bigint"
                },
                {
                    name: "metadata",
                    type: "jsonb",
                    isNullable: true
                },
                {
                    name: "is_active",
                    type: "boolean",
                    default: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }), true);

        // Create playlists table
        await queryRunner.createTable(new Table({
            name: "playlists",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()"
                },
                {
                    name: "name",
                    type: "varchar"
                },
                {
                    name: "settings",
                    type: "jsonb",
                    default: `'{"shuffle": false, "repeat": false, "volume": 100, "schedule": {"enabled": false, "startTime": "09:00", "endTime": "18:00", "days": ["mon","tue","wed","thu","fri"]}}'`
                },
                {
                    name: "is_active",
                    type: "boolean",
                    default: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }), true);

        // Create playlist_media junction table
        await queryRunner.createTable(new Table({
            name: "playlist_media",
            columns: [
                {
                    name: "playlist_id",
                    type: "uuid"
                },
                {
                    name: "media_id",
                    type: "uuid"
                },
                {
                    name: "order",
                    type: "int"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }), true);

        // Create playlist_branches junction table
        await queryRunner.createTable(new Table({
            name: "playlist_branches",
            columns: [
                {
                    name: "playlist_id",
                    type: "uuid"
                },
                {
                    name: "branch_id",
                    type: "uuid"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }), true);

        // Add foreign keys
        await queryRunner.createForeignKey("devices", new TableForeignKey({
            columnNames: ["branch_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "branches",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("branches", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("playlist_media", new TableForeignKey({
            columnNames: ["playlist_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "playlists",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("playlist_media", new TableForeignKey({
            columnNames: ["media_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "media",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("playlist_branches", new TableForeignKey({
            columnNames: ["playlist_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "playlists",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("playlist_branches", new TableForeignKey({
            columnNames: ["branch_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "branches",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order to handle foreign key constraints
        await queryRunner.dropTable("playlist_branches");
        await queryRunner.dropTable("playlist_media");
        await queryRunner.dropTable("playlists");
        await queryRunner.dropTable("devices");
        await queryRunner.dropTable("media");
        await queryRunner.dropTable("branches");
        await queryRunner.dropTable("users");
    }
}
