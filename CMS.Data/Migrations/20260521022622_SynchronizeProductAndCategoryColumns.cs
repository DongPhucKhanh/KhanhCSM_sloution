using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CMS.Data.Migrations
{
    /// <inheritdoc />
    public partial class SynchronizeProductAndCategoryColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_CategoryProductId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "CategoriesProducts");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "CategoriesProducts");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "CategoriesProducts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "CategoriesProducts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryProductId",
                table: "Products",
                column: "CategoryProductId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CategoriesProducts_CategoryId",
                table: "CategoriesProducts",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_CategoriesProducts_Categories_CategoryId",
                table: "CategoriesProducts",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CategoriesProducts_Categories_CategoryId",
                table: "CategoriesProducts");

            migrationBuilder.DropIndex(
                name: "IX_Products_CategoryProductId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_CategoriesProducts_CategoryId",
                table: "CategoriesProducts");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "CategoriesProducts");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "CategoriesProducts");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "CategoriesProducts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "CategoriesProducts",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryProductId",
                table: "Products",
                column: "CategoryProductId");
        }
    }
}
