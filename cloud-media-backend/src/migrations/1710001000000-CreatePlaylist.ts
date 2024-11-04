import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePlaylist1710001000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
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
        await queryRunner.dropTable("playlist_branches");
        await queryRunner.dropTable("playlist_media");
        await queryRunner.dropTable("playlists");
    }
}