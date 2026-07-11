## What is ORM?
ORM (Object‑Relational Mapping) is a technique that maps C# classes to database tables.

### Example:
Product class → Products table
Category class → Categories table

### Benefits:
Productivity: Write C# instead of raw SQL.
Maintainability: Centralized models, easier schema changes.
Abstraction: Developers focus on business logic, not SQL queries.

## EF Core vs EF Framework
| Feature | EF Core | EF Framework (EF6) |
| --- | --- | --- |
| Platform | Cross‑platform (Windows, Linux, macOS) | Windows‑only |
| Performance | Lightweight, faster | Heavier |
| Features | LINQ, async queries, compiled queries | Mature but less flexible |
| Future | Actively developed | Legacy |

## EF Core 8.0 Features
- JSON column mapping → Store structured JSON in SQL columns.
- Compiled models → Faster startup and query execution.
- Interceptors → Hook into EF operations for logging/security.
- Bulk operations → Improved handling of large data sets.
