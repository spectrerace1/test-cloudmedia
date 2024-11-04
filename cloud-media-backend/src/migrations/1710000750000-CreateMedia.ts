import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMedia1710000750000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("media");
    }
}