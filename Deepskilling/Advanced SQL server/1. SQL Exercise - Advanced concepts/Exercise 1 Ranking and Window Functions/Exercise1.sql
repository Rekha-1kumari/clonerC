CREATE TABLE Products (
    ProductID INT,
    ProductName VARCHAR(100),
    Category VARCHAR(50),
    Price DECIMAL(10,2)
);

SELECT *
FROM (
    SELECT ProductID,
           ProductName,
           Category,
           Price,
           ROW_NUMBER() OVER (
               PARTITION BY Category
               ORDER BY Price DESC
           ) AS RowNum
    FROM Products
) AS RankedProducts
WHERE RowNum <= 3;

SELECT *
FROM (
    SELECT ProductID,
           ProductName,
           Category,
           Price,
           RANK() OVER (
               PARTITION BY Category
               ORDER BY Price DESC
           ) AS RankNum
    FROM Products
) AS RankedProducts
WHERE RankNum <= 3;

SELECT *
FROM (
    SELECT ProductID,
           ProductName,
           Category,
           Price,
           DENSE_RANK() OVER (
               PARTITION BY Category
               ORDER BY Price DESC
           ) AS DenseRankNum
    FROM Products
) AS RankedProducts
WHERE DenseRankNum <= 3;
