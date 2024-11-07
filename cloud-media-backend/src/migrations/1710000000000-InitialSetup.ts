import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class InitialSetup1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // UUID desteği için uzantı ekleyin
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // users tablosunu oluşturun
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                { name: "name", type: "varchar" },
                { name: "email", type: "varchar", isUnique: true },
                { name: "password", type: "varchar" },
                { name: "role", type: "varchar", default: "'user'" },
                { name: "is_active", type: "boolean", default: true },
                { name: "created_at", type: "timestamp", default: "now()" },
                { name: "updated_at", type: "timestamp", default: "now()" }
            ]
        }));

        // branch_groups tablosunu oluşturun
        await queryRunner.createTable(new Table({
            name: "branch_groups",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                { name: "name", type: "varchar", isUnique: true },
                { name: "description", type: "varchar", isNullable: true },
                { name: "created_at", type: "timestamp", default: "now()" },
                { name: "updated_at", type: "timestamp", default: "now()" }
            ]
        }));

        // branches tablosunu oluşturun
        await queryRunner.createTable(new Table({
            name: "branches",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                { name: "name", type: "varchar" },
                { name: "location", type: "varchar" },
                { name: "settings", type: "jsonb", isNullable: true },
                { name: "is_active", type: "boolean", default: true },
                { name: "userId", type: "uuid" },
                { name: "groupId", type: "uuid", isNullable: true },
                { name: "created_at", type: "timestamp", default: "now()" },
                { name: "updated_at", type: "timestamp", default: "now()" }
            ]
        }));

        // devices tablosunu oluşturun
        await queryRunner.createTable(new Table({
            name: "devices",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                { name: "name", type: "varchar" },
                { name: "token", type: "varchar", isUnique: true },
                { name: "branch_id", type: "uuid" },
                { name: "status", type: "jsonb", isNullable: true },
                { name: "is_active", type: "boolean", default: true },
                { name: "created_at", type: "timestamp", default: "now()" },
                { name: "updated_at", type: "timestamp", default: "now()" }
            ]
        }));

        // media tablosunu oluşturun
        await queryRunner.createTable(new Table({
            name: "media",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                { name: "name", type: "varchar" },
                { name: "type", type: "varchar" },
                { name: "path", type: "varchar" },
                { name: "size", type: "bigint" },
                { name: "metadata", type: "jsonb", isNullable: true },
                { name: "is_active", type: "boolean", default: true },
                { name: "created_at", type: "timestamp", default: "now()" },
                { name: "updated_at", type: "timestamp", default: "now()" }
            ]
        }));

        // playlists tablosunu oluşturun
        await queryRunner.createTable(new Table({
            name: "playlists",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                { name: "name", type: "varchar" },
                { name: "settings", type: "jsonb", default: `'{"shuffle": false, "repeat": false, "volume": 100, "schedule": {"enabled": false, "startTime": "09:00", "endTime": "18:00", "days": ["mon","tue","wed","thu","fri"]}}'` },
                { name: "is_active", type: "boolean", default: true },
                { name: "created_at", type: "timestamp", default: "now()" },
                { name: "updated_at", type: "timestamp", default: "now()" }
            ]
        }));

        // playlist_media bağlantı tablosu
        await queryRunner.createTable(new Table({
            name: "playlist_media",
            columns: [
                { name: "playlist_id", type: "uuid" },
                { name: "media_id", type: "uuid" },
                { name: "order", type: "int" },
                { name: "created_at", type: "timestamp", default: "now()" }
            ]
        }));

        // playlist_branches bağlantı tablosu
        await queryRunner.createTable(new Table({
            name: "playlist_branches",
            columns: [
                { name: "playlist_id", type: "uuid" },
                { name: "branch_id", type: "uuid" },
                { name: "created_at", type: "timestamp", default: "now()" }
            ]
        }));

        // Yabancı anahtarları ekleyin
        await queryRunner.createForeignKey("branches", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("branches", new TableForeignKey({
            columnNames: ["groupId"],
            referencedColumnNames: ["id"],
            referencedTableName: "branch_groups",
            onDelete: "SET NULL"
        }));

        await queryRunner.createForeignKey("devices", new TableForeignKey({
            columnNames: ["branch_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "branches",
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
        // Tabloları kaldırma işlemini ters sırayla yaparak yabancı anahtar kısıtlamalarından kaçının
        await queryRunner.dropTable("playlist_branches");
        await queryRunner.dropTable("playlist_media");
        await queryRunner.dropTable("playlists");
        await queryRunner.dropTable("devices");
        await queryRunner.dropTable("media");
        await queryRunner.dropTable("branches");
        await queryRunner.dropTable("branch_groups");
        await queryRunner.dropTable("users");
    }
}
