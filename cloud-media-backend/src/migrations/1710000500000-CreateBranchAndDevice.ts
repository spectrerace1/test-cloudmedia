import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateBranchAndDevice1710000500000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
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

        // Add foreign key
        await queryRunner.createForeignKey("devices", new TableForeignKey({
            columnNames: ["branch_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "branches",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("devices");
        await queryRunner.dropTable("branches");
    }
}